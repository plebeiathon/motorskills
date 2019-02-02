const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app); // eslint-disable-line
const path = require('path');

require('./gradientGen.js');
var im = require('imagemagick');

const SERVER_PORT = 3000;

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(express.static(path.join('../client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({
    message: 'resource not found',
  });
});

im.convert(['kittens.jpg', '-resize', '25x120', 'kittens-small.jpg'], 
function(err, stdout){
  if (err) throw err;
  console.log('stdout:', stdout);
});


http.listen(process.env.PORT || SERVER_PORT, () => {
  console.log(`Server started on the http://localhost:${SERVER_PORT}`);
});
