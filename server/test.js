const gm = require('gm');
var fs = require('fs');
const {
  Storage
} = require('@google-cloud/storage');

// Authenticating on a per-API-basis. You don't need to do this if you auth on a
// global basis (see Authentication section above).

var storage = new Storage({
  projectId: 'slo-hacks',
  keyFilename: '../secrets/keyfile.json'
});

var image = [];
let time = (new Date).getTime();

for (var i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        image[j] = Math.random() * 255 + 1;
    }

    gm(1, 1, 'rgb(' + image[0] + ',' + image[0] + ',' + image[0] + ')')
      .write('images/Outputs/output' + time + '.png', function (err) {});

    for (let j = 1; j < image.length; j++) {
      gm(1, 1, 'rgb(' + image[j] + ',' + image[j] + ',' + image[j] + ')')
        .write('images/pixel' + j + '.png', function (err) {});
      gm('images/Outputs/output' + i + '.png').append('images/pixel' + i + '.png', true)
        .write('images/Outputs/output' + i + '.png', function (err) {});
    }
}

// Reference an existing bucket.
var BUCKET_NAME = 'greyscale';
var bucket = storage.bucket(BUCKET_NAME);            
var localReadStream = fs.createReadStream('./images/Outputs/output' + time + '.png');
var remoteWriteStream = bucket.file('output' + time + '.png').createWriteStream();
localReadStream.pipe(remoteWriteStream)
  .on('error', function(err) {})
  .on('finish', function() {
    // The file upload is complete.
    console.log('File has been successfully saved in Google Cloud Storage');
  });

