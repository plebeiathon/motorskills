// Require the serialport node module
const serialport = require('serialport');
const connect = require('connect');
const serveStatic = require('serve-static');

connect().listen(8080, function () {
  console.log('Server running on 8080...');
});

// Open the port

// *************************
//       BaudRate for Bluetooth 9600
// *************************

const port = new serialport("/dev/cu.HC-06-DevB", {
  baudRate: 9600 // remember to check baudrate
});

// AMP sensor voltage and ground need to be same as microcontrollers

// Queue
function Queue() {
  this.data = [];
}

Queue.prototype.enqueue = function(record) {
  this.data.unshift(record);
}

Queue.prototype.dequeue = function() {
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
    //const q = new Queue();
    let result = [];
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i];
      //q.enqueue(data[i]);
    }

    let image = [];
    //console.log("q: ", q, "\n", "size: ", q.size(), "\n");
    // if (q.size() >= 10) {
    //   for (let x = 0; x < 10; x++) {
    //     image[x] = q.first();
    //     q.dequeue();
    //   }
    // }


    //console.log("image: ", image, "\n");
    // image.length = 0;
    // console.log("image: ", image, "\n");

    // console.log('\033[2J'); // clear console
    console.log(result, ":len:", data.length);

    function end() {
      console.log("Stream closed.")
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