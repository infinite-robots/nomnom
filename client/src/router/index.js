import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Room from '@/components/Room';
import Start from '@/components/Start';
import { requireNick } from '../services/auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/start',
      name: 'start',
      component: Start,
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter: requireNick,
    },
    {
      path: '/nom/:id',
      name: 'Room',
      component: Room,
      beforeEnter: requireNick,
    },
  ],
});
