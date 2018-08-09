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


app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

new Room(1, app, io);

server.listen(8088);