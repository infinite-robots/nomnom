const { IncomingWebhook } = require('@slack/client');
const _ = require('lodash');
// do something with this later.
// const webhook = new IncomingWebhook('');

class Room {
  constructor(id, app, io) {
    this._server = app;
    this._id = id;
    this._socketIO = io;
    this._nomnoms = [
      { id: 1, name: 'Boss Lady Pizza', category: 'pizza', priceRange: 'medium', veto: false, votes: [] },
      { id: 2, name: 'Bobs Burgers', category: 'burgers', priceRange: 'low', veto: false, votes: [] },
      { id: 3, name: 'Subway', category: 'sandwiches', priceRange: 'low', veto: false, votes: [] },
      { id: 4, name: 'Sushi Zushi', category: 'sushi', priceRange: 'medium', veto: false, votes: [] },
      { id: 5, name: 'Panda Express', category: 'chinese', priceRange: 'low', veto: false, votes: [] },
      { id: 6, name: 'Chopstix', category: 'chinese', priceRange: 'low', veto: false, votes: [] },
      { id: 7, name: 'Smokey Mos', category: 'bbq', priceRange: 'medium', veto: false, votes: [] },
      { id: 8, name: 'McDonalds', category: 'fastfood', priceRange: 'low', veto: false, votes: [] },
      { id: 9, name: 'Chipotle', category: 'mexican', priceRange: 'low', veto: false, votes: [] },
      { id: 10, name: 'Illegal Petes', category: 'mexican', priceRange: 'low', veto: false, votes: [] },
      { id: 11, name: 'Best Steakhouse Ever', category: 'steak', priceRange: 'high', veto: false, votes: [] },
      { id: 12, name: 'Random Diner', category: 'american', priceRange: 'medium', veto: false, votes: [] },
      { id: 13, name: 'In-n-out', category: 'burgers', priceRange: 'low', veto: false, votes: [] },
      { id: 14, name: 'Thai Express', category: 'thai', priceRange: 'medium', veto: false, votes: [] },
      { id: 15, name: 'Dominos', category: 'Pizza', priceRange: 'low', veto: false, votes: [] },
      { id: 16, name: 'Chilis', category: 'american', priceRange: 'medium', veto: false, votes: [] },
      { id: 17, name: 'Brazilian Steakhouse', category: 'brazilian', priceRange: 'high', veto: false, votes: [] },
      { id: 18, name: 'Burger King', category: 'fastfood', priceRange: 'low', veto: false, votes: [] },
      { id: 19, name: 'Aldacos', category: 'mexican', priceRange: 'medium', veto: false, votes: [] },
      { id: 20, name: 'IHOP', category: 'breakfast/american', priceRange: 'low', veto: false, votes: [] },
    ];
    this.users = [];

    const ioRoom = io.of(`/rooms/${id}/meta`);
    this._ioRoom = ioRoom;

    ioRoom.on('connection', socket => {
      socket.emit('nom', this.getCandidates());
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
    const winner = _.filter(this._nomnoms, (nom) => !nom.veto && nom.votes.length === 3);
    if (winner.length > 0) {
      this.declareWinner(winner[0]);
    }
  }

  declareWinner(winner) {
    this._ioRoom.emit('winner', winner);
  }
}

module.exports = Room;
