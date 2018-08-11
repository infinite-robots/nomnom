<template>
  <div class="room">
    <h2>nom id: {{ roomId }}</h2>
    <h3>created by {{ admin }}</h3>
    <p>
      {{ users.length }} users in room: {{ users.join(', ') }}
    </p>
    <div v-if="!start">
      <p v-if="user !== admin">Waiting for {{ admin }} to start...</p>
      <p v-else><button @click="startNomming">Start</button></p>
    </div>
    <div v-if="start && !winner" class="noms">
      <div class="nom" v-if="nomnoms.length > 0">
        <p>Name: {{ nomnoms[0].name }}</p>
        <p>Category: {{ nomnoms[0].category }}</p>
        <p>Price: {{ nomnoms[0].priceRange }}</p>
        <p>
          <button class="nah" @click="voteNah">Nah.</button>
          <button class="yum" @click="voteYum">Yum!</button>
        </p>
      </div>
    </div>
    <div v-if="outOfNoms && !winner">
      <p>No more options left... maybe try being a little less picky next time</p>
    </div>
    <div v-if="winner" class="winner">
      <h1>WINNER!</h1>
      <p>Here's your NomNom</p>
      <h2>{{ winningNom.name }}</h2>
    </div>
  </div>
</template>

<script>
import SocketIO from 'socket.io-client';
import { getNick } from '../services/auth';
import { getNomsForUser, startGame, nomVote } from '../services/nomService';


export default {
  name: 'Room',
  data() {
    return {
      start: false,
      winner: false,
      winningNom: null,
      outOfNoms: false,
      admin: '',
      roomId: null,
      socket: null,
      user: null,
      users: [],
      nomnoms: [],
    };
  },
  mounted() {
    this.roomId = this.$route.params.id;
    this.user = getNick();
    this.establishSocket();
  },
  methods: {
    establishSocket() {
      const socket = SocketIO(`http://localhost:8088/rooms/${this.roomId}/meta`,
        { origins: 'http://localhost:*/* http://127.0.0.1:*/*' });
      this.socket = socket;
      socket.on('connect', () => {
        socket.emit('join', this.user);
      });
      socket.on('users', (users) => {
        console.log('users', users);
        this.users = users;
      });
      socket.on('admin', (admin) => {
        this.admin = admin;
      });
      socket.on('start', () => {
        this.start = true;
        this.getNoms();
      });
      socket.on('winner', (winner) => {
        this.winner = true;
        this.winningNom = winner;
      });
    },
    startNomming() {
      startGame(this.roomId).then(() => {});
    },
    getNoms() {
      getNomsForUser(this.roomId).then((resp) => {
        if (resp.data.length > 0) {
          this.nomnoms = this.nomnoms.concat(resp.data);
        } else {
          this.outOfNoms = true;
        }
      });
    },
    voteNah() {
      this.voteNom(this.nomnoms[0].id, false);
    },
    voteYum() {
      this.voteNom(this.nomnoms[0].id, true);
    },
    voteNom(id, yum) {
      nomVote(this.roomId, id, yum).then(() => {
        this.nomnoms.splice(0, 1);
        if (this.nomnoms.length < 1) {
          this.getNoms();
        }
      });
    },
  },
};
</script>

<style scoped>
.nom {
  border: 2px solid #ccc;
  border-radius: 5px;
}
.winner {
  background: #FCAA3A;
  color: #FFF;
  padding: 2rem;
}
</style>
