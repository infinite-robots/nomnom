const _ = require('lodash');
const axios = require("axios");
const { IncomingWebhook } = require('@slack/client');
const settings = require('./settings');
const yelpConfig = {
  headers: {'Authorization': 'Bearer ' + settings.yelpBearerToken }
};
const webhook = new IncomingWebhook(settings.slackIncomingWebhookUrl);

class Room {
  constructor(id, app, io, owner, searchLocation, searchRadius) {
    this._server = app;
    this._id = id;
    this._socketIO = io;
    this._owner = owner;
    this._users = [];
    this._started = false;
    this._nomnoms = [];
    this.users = [];

    webhook.send(`New Room created by ${owner}, location='${searchLocation}' with ID: ${id}`, () => {});

    this.setupNoms(searchLocation, searchRadius);

    const ioRoom = io.of(`/rooms/${id}/meta`);
    this._ioRoom = ioRoom;

    ioRoom.on('connection', socket => {
      socket.emit('users', this._users);
      socket.emit('admin', this._owner);
      if (this._started) {
        socket.emit('start');
      }

      socket.on('join', (user) => {
        if (!this._users.includes(user)) {
          this._users.push(user);
          console.log(`${user} joined`);
          ioRoom.emit('users', this._users);
        }
      });
    });

    app.post(`/rooms/${id}/start`, (req, res) => {
      if (!req.body.user) {
        throw new Error('No user specified');
      }

      this._started = true;
      webhook.send(`Room ${id} is starting with ${this._nomnoms.length} options, ${this._users.length} users: ${this._users.join(', ')}`, () => {});

      if (req.body.user === this._owner) {
        ioRoom.emit('start');
      }
    });

    app.post(`/rooms/${id}/noms`, (req, res) => {
      if (!req.body.user) {
        throw new Error('No user specified');
      }

      res.send(this.getCandidates(req.body.user));
    });

    app.post(`/rooms/${id}/vote`, (req, res) => {
      if (!req.body.user || !req.body.id) {
        throw new Error('No user or id specified');
      }

      this.voteForNom(req.body.user, req.body.id, req.body.yum);
      this.checkForWinner();

      res.send('ok!');
    });
  }

  voteForNom(user, id, up) {
    this._nomnoms = _.map(this._nomnoms, nom => {
      if (nom.id !== id) {
        return nom
      } else {
        if (!up) {
          return _.assign({}, nom, {veto: true})
        } else {
          nom.votes.push(user);
          return nom;
        }
      }
    });
  }

  getCandidates(user) {
    return _.sampleSize(_.filter(this._nomnoms, (nom) => nom.veto === false && !_.includes(nom.votes, user)), 5);
  }

  checkForWinner() {
    const winner = _.filter(this._nomnoms, (nom) => !nom.veto && nom.votes.length === this._users.length);
    if (winner.length > 0) {
      this.declareWinner(winner[0]);
    }
  }

  declareWinner(winner) {
    this._ioRoom.emit('winner', winner);
    webhook.send(`Room ${this._id} has finished. Winner: \`\`\`${JSON.stringify(winner)}\`\`\``, () => {});
  }

  setupNoms(searchLocation, searchRadius) {
    const meters = 1609 * searchRadius;
    axios.get(`https://api.yelp.com/v3/businesses/search?term=restaurants&location=${searchLocation}&radius=${meters}&limit=50`, yelpConfig).then(resp => {
      const newNoms = resp.data.businesses.map(biz => { 
          return {veto: false, votes: [], ...biz}
      });
      this._nomnoms = [...this._nomnoms, ...newNoms];
      console.log('noms set',this._nomnoms, this._nomnoms.length);
    }).catch(e => {
      console.error(e);
    });
    axios.get(`https://api.yelp.com/v3/businesses/search?term=restaurants&location=${searchLocation}&radius=${meters}&limit=50&offset=50`, yelpConfig).then(resp => {
      const newNoms = resp.data.businesses.map(biz => { 
          return {veto: false, votes: [], ...biz}
      });
      this._nomnoms = [...this._nomnoms, ...newNoms];
      console.log('noms set', this._nomnoms, this._nomnoms.length);
    }).catch(e => {
      console.error(e);
    });
  }
}

module.exports = Room;
