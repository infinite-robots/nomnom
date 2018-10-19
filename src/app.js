const Express = require("express");
const Server = require("http").Server;
require("express-async-errors");
const bodyParser = require("body-parser");

const SocketIO = require("socket.io");
const fs = require("fs");

const Room = require("./Room");

const app = new Express();
const server = new Server(app);
const originSocketIO = {
  origins: [
    "http://www.nomnom.site:80",
    "http://nomnom.site:80",
    "http://localhost:8080",
    "https://localhost:8443"
  ]
};

//Plain SocketIO
const io = new SocketIO(server, originSocketIO);

const settings = require('./settings');

// Certificate for SSL can be generated free of charge --> https://greenlock.domains/
const privateKey = fs.readFileSync(settings.key, 'utf8');
const certificate = fs.readFileSync(settings.cert, 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate
};
// Secure HTTPS
const httpsserver = require('https').createServer(credentials, app);
// Secure SocketIO
const iossl = new SocketIO(httpsserver, originSocketIO);

// JSON.parse(fs.readFileSync("env.json"));

const _ = require('lodash');
const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
  's', 't','u','v','w','y','x','z','1','2','3','4','5','6','7','8','9'];

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post(`/makeroom`, (req, res) => {
  if (!req.body.user) {
    throw new Error('No user specified');
  }

  if (!req.body.searchLocation || !req.body.searchRadius) {
    throw new Error('missing search location or search radius');
  }

  const roomId = _.sampleSize(chars, 5).join('');
  console.log('making room', roomId);

  // Plain SocketIO
  // uncomment to use plain SocketIO
  //new Room(roomId, app, io, req.body.user, req.body.searchLocation, req.body.searchRadius);

  // Secure SocketIO
  // comment to use plain SocketIO
  new Room(roomId, app, iossl, req.body.user, req.body.searchLocation, req.body.searchRadius);

  res.send({roomId: roomId});
});

// Plain HTTP
server.listen(8088);

// Secure HTTPS
httpsserver.listen(8443);