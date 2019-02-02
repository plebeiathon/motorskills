// Require the serialport node module
const serialport = require('serialport');
const fs = require('fs');

const connect = require('connect');
const serveStatic = require('serve-static');
connect().use(serveStatic('./index.html')).listen(8080, function () {
  console.log('Server running on 8080...');
});

// Open the port
const port = new serialport("/dev/cu.HC-06-DevB", {
  baudRate: 9600 // remember to check baudrate
});

// Queue
function Queue() {
  this.data = [];
}

Queue.prototype.add = function(record) {
  this.data.unshift(record);
}

Queue.prototype.remove = function() {
  this.data.pop();
}

Queue.prototype.last = function() {
  return this.data[0];
}
Queue.prototype.first = function() {
  return this.data[this.data.length - 1];
}
Queue.prototype.size = function() {
  return this.data.length;
}

// Read the port data
port.on("open", function () {
  console.log('open\n');
  port.on('data', function (data) {
    const q = new Queue();
    let result = [];
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i];
      q.add(data[i]);
    }

    let image = [];
    //if (q.size >= 10) {
      for (let x = 0; x < 10; x++) {
        image[x] = q.first();
        q.remove();
      }
    //}


    console.log("image: ", image, "\n");
    // image.length = 0;
    // console.log("image: ", image, "\n");

    // console.log('\033[2J'); // clear console
    console.log(result, ":len:", data.length);
    file = fs.createWriteStream('./test.txt');
    // file.write(Buffer.from(JSON.stringify(q)));

    function end() {
      file.end();
      console.log("Stream closed.")
      return 0;
    }

    const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const test = async () => {
      await sleep(5000);
      file.end();
    }

    test();
  });
});