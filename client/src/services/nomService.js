import axios from 'axios';
import { getNick } from './auth';

const apiRoot = 'http://localhost:8088';

export function makeRoom() {
  return axios.post(`${apiRoot}/makeroom`, { user: getNick() });
}

export function getNomsForUser(roomId) {
  return axios.post(`${apiRoot}/rooms/${roomId}/noms`, {
    user: getNick(),
  });
}

export function startGame(roomId) {
  return axios.post(`${apiRoot}/rooms/${roomId}/start`, {
    user: getNick(),
  });
}

export function nomVote(roomId, nomId, yum) {
  return axios.post(`${apiRoot}/rooms/${roomId}/vote`, {
    user: getNick(),
    id: nomId,
    yum,
  });
}
