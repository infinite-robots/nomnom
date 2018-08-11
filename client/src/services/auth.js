export function isNickSet() {
  const nick = localStorage.getItem('nom_nick');
  return !!nick;
}

export function setNick(nick) {
  localStorage.setItem('nom_nick', nick);
}

export function getNick() {
  return localStorage.getItem('nom_nick');
}

export function requireNick(to, from, next) {
  if (!isNickSet()) {
    next({
      path: '/start',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
}
