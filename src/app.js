const Express = require("express");
const Server = require("http").Server;
require("express-async-errors");
const bodyParser = require("body-parser");

const SocketIO = require("socket.io");
const fs = require("fs");

const Room = require("./Room");

const app = new Express();
const server = new Server(app);
const io = new SocketIO(server);
io.set('origins', 'localhost:8080');

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

app.post(`/makeroom`, (req, res) => {
  if (!req.body.user) {
    throw new Error('No user specified');
  }

  const roomId = _.sampleSize(chars, 5).join('');
  console.log('making room', roomId);

  new Room(roomId, app, io, req.body.user);

  res.send({roomId: roomId});
});

server.listen(8088);