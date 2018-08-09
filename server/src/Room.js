const axios = require('axios');
const { IncomingWebhook } = require('@slack/client');
// do something with this later.
// const webhook = new IncomingWebhook('');

class Room {
  constructor(id, app, io) {
    this._server = app;
    this._id = id;
    this._socketIO = io;

    const ioRoom = io.of(`/rooms/${id}/meta`);
    this._ioRoom = ioRoom;

    ioRoom.on('connection', socket => {
      socket.emit('nom', 'nomnomnom');
    });

    app.get(`/rooms/${id}/test`, (req, res) => {
      res.send('hello');
    });
  }
}

module.exports = Room;
