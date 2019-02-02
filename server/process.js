// Require the serialport node module
const serialport = require('serialport');
const connect = require('connect');
const gm = require('gm');
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
  keyFilename: 'MotorSkills-69838978ed50.json'
});

var BUCKET_NAME = 'greyscale';
var myBucket = storage.bucket(BUCKET_NAME);

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

// Read the port data
port.on('open', function () {
  console.log('open\n');
  port.on('data', function (data) {
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i];
      q.enqueue(data[i]);
    }

    console.log('q: ', q, '\n', 'size: ', q.size(), '\n');
    if (q.size() >= 10) {
      for (let x = 0; x < 10; x++) {
        image[x] = q.first();
        q.dequeue();
      }

      let time = (new Date).getTime();
      gm(1, 1, 'rgb(' + image[0] + ',' + image[0] + ',' + image[0] + ')')
        .write('images/Outputs/output' + time + '.png', function (err) {});

      for (let j = 1; j < image.length; j++) {
        gm(1, 1, 'rgb(' + image[j] + ',' + image[j] + ',' + image[j] + ')')
          .write('images/pixel' + j + '.png', function (err) {});
        gm('images/Outputs/output' + j + '.png').append('images/pixel' + j + '.png', true)
          .write('images/Outputs/output' + j + '.png', function (err) {});
      }

      const file = myBucket.file('motor' + (new Date).getTime() + '.png');
      file.exists()
        .then(exists => {
          if (exists) {
            // file exists in bucket
            console.log('File already exists in bucket on Google Cloud Storage');
          }
        })
        .catch(err => {
          return err
        })


      // upload file to bucket
      let localFileLocation = './images/Outputs/output' + time + '.png';
      myBucket.upload(localFileLocation, {
          public: true
        })
        .then(file => {
          // file saved
          console.log('File has been successfully saved in Google Cloud Storage');
        })

      // get public url for file
      var getPublicThumbnailUrlForItem = fileName => {
        return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`
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