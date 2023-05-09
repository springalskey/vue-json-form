import Vue from 'vue';
import Router from 'vue-router';

import AppHome from '../pages/AppHome';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'AppHome',
      component: AppHome
    },
    {
      path: '/form-demo1',
      name: 'FormDemo1',
      meta: {
        title: 'form demo1'
      },
      component: () => import('../pages/form-demo1')
    },
    {
      path: '/form-demo3',
      name: 'FormDemo3',
      meta: {
        title: 'form demo3'
      },
      component: () => import('../pages/form-demo3')
    },
    {
      path: '/form-demo4',
      name: 'FormDemo4',
      meta: {
        title: 'form demo4'
      },
      component: () => import('../pages/form-demo4-async-valid')
    },
    {
      path: '/form-demo5',
      name: 'FormDemo5',
      meta: {
        title: 'form demo5'
      },
      component: () => import('../pages/form-demo5')
    },
    {
      path: '/form-demo6',
      name: 'FormDemo6',
      meta: {
        title: 'form demo6'
      },
      component: () => import('../pages/form-demo6')
    },
    {
      path: '/form-demo7',
      name: 'FormDemo7',
      meta: {
        title: 'form demo7'
      },
      component: () => import('../pages/form-demo7')
    }
  ]
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Vue Start';
  next();
});

export default router;
