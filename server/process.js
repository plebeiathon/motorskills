// Require the serialport node module
const serialport = require('serialport');
const connect = require('connect');
const gm = require('gm');
const fs = require('fs');
const util = require('util');
const {
  Storage
} = require('@google-cloud/storage');

connect().listen(8080, function () {
  console.log('Server running on 8080...');
});

// Open the port

// *************************
//?  BaudRate for Bluetooth 9600
// *************************

const port = new serialport('/dev/cu.HC-06-DevB', {
  baudRate: 9600 // remember to check baudrate
});

var storage = new Storage({
  projectId: 'slo-hacks',
  keyFilename: '../secrets/keyfile.json'
});

var BUCKET_NAME = 'slo-hacks-vcm';
var bucket = storage.bucket(BUCKET_NAME);

//! AMP sensor voltage and ground need to be same as microcontrollers

// Queue
function Queue() {
  this.data = [];
}

Queue.prototype.enqueue = function (record) {
  this.data.unshift(record);
}

Queue.prototype.dequeue = function () {
  this.data.pop();
}

Queue.prototype.last = function () {
  return this.data[0];
}
Queue.prototype.first = function () {
  return this.data[this.data.length - 1];
}
Queue.prototype.size = function () {
  return this.data.length;
}

let count = true;
let image = [];
const q = new Queue();
let result = [];
let motor = [];


// Read the port data
port.on('open', function () {
  console.log('open\n');
  port.on('data', function (data) {
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i];
      q.enqueue(data[i]);
      fs.appendFile('graph.txt', `${data[i]},`, 'utf8', (err) => {
        if (err) throw err;
        console.log('The graph point was appended to the txt file!');
      });
    }

    console.log('q: ', q, '\n', 'size: ', q.size(), '\n');
    if (q.size() >= 10) {
      let amount = 0;
      for (let y = 0; y < 10; y++) {
        if (q.data[y] == 0) {
          amount++;
        } 
      }
      if (amount == 10) {
        for (let x = 0; x < 10; x++) {
          q.dequeue();
        }
      } else {
        for (let x = 0; x < 10; x++) {
          image[x] = q.first();
          q.dequeue();
        }

        let time = (new Date).getTime();
        gm(1, 1, `rgb(${image[0]}, ${image[0]}, ${image[0]})`)
          .write(`images/Outputs/output-${time}.png`, function (err) {});

        for (let j = 1; j < image.length; j++) {
          gm(1, 1, `rgb(${image[j]}, ${image[j]}, ${image[j]})`)
            .write(`images/pixel${j}.png`, function (err) {});
          gm(`images/Outputs/output-${time}.png`).append(`images/pixel${j}.png`, true).write(`images/Outputs/output-${time}.png`, function (err) {});
        }

        fs.appendFile('motor.csv', `gs://slo-hacks-vcm/output-${time}.png\n`, 'utf8', (err) => {
          if (err) throw err;
          console.log('The image was appended to the csv file!');
        });

        const file = bucket.file(`output-${time}.png`);
        file.exists()
          .then(exists => {
            if (exists) {
              // file exists in bucket
              console.log('File already exists in bucket on Google Cloud Storage');
            }
          })
          .catch(err => {
            return err
          });


        // upload file to bucket
        const localFileLocation = `images/Outputs/output-${time}.png`;
        bucket.upload(localFileLocation, {
            public: true
          })
          .then(file => {
            // file saved
            console.log('File has been successfully saved in Google Cloud Storage');
          });

        // get public url for file
        const getPublicThumbnailUrlForItem = fileName => {
          return `https://storage.googleapis.com/${BUCKET_NAME}/img/${fileName}`;
        }

        motor.push({
          'date': time,
          'image': `images/Outputs/output-${time}.png`
        });

        fs.writeFileSync('motor.json', JSON.stringify(motor), 'utf8', (err) => {
          if (err) throw err;
          console.log('The image was appended to the json file!');
        });
      }
    }

    console.log('image: ', image, '\n');
    image.length = 0;
    // console.log('image: ', image, '\n');

    // console.log('\033[2J'); // clear console
    console.log(count, ' :result: ', result, ':len:', data.length);
    if (count == 0) {
      count++;
    } else {
      count--;
    }

    function end() {
      console.log('Stream closed.')
      return 0;
    }

    const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const test = async () => {
      await sleep(5000);
    }

    test();
  });
});

// require('./empty');