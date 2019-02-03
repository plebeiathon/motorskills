const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app); // eslint-disable-line
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fs = require('fs');

// fs.readFile('motor.json', bar)

function bar(err, data) {
  /* If an error exists, show it, otherwise show the file */
  for (let i = 0; i < JSON.parse(data).length; i++) {
    err ? Function("error", "throw error")(err) : console.log(JSON.parse(data)[i].greyscale);
  }
};

const SERVER_PORT = 3000;

// MetaData
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(express.static(path.join('../client/')));

// Endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + 'index.html'));
});

// 404 error handling
app.use((req, res) => {
  res.status(404).json({
    message: 'resource not found',
  });
});

// Parallel Clustering
if (cluster.isMaster) { // Check if Cluster is a Master
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.listen(process.env.PORT || SERVER_PORT, () => {
    console.log(`Server started on the http://localhost:${SERVER_PORT}`);
  });

  console.log(`Worker ${process.pid} started`);
}