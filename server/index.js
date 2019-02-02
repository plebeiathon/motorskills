const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app); // eslint-disable-line
const path = require('path');

require('./gradientGen.js');
var fs = require('fs')
  , gm = require('gm');

const SERVER_PORT = 3000;

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(express.static(path.join('../client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + 'index.html'));
  gm(200, 400, "#ddff99f3")
    .drawText(10, 50, "from scratch")
    .write("/brandNewImg.jpg", function (err) {
    });
  console.log("Test");
});

app.use((req, res) => {
  res.status(404).json({
    message: 'resource not found',
  });
});


http.listen(process.env.PORT || SERVER_PORT, () => {
  console.log(`Server started on the http://localhost:${SERVER_PORT}`);
});
