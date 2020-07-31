import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home_view.vue';
import VuetifyLogIn from '../views/VuetifyLogIn_view.vue';
import {auth} from '@/firebase_config';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: VuetifyLogIn,
    props: true,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/signin',
    name: 'signin',
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/SignIn_view.vue')
  },
  {
    path: '/canvas',
    name: 'canvas',
    props: true,
    component: () =>
      import('../views/Canvas_view.vue')
  },
  {
    path: '/video1',
    name: 'video1',
    props: true,
    component: () =>
      import('../views/Video1_view.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/blog_entry',
    name: 'blog_entry',
    props: true,
    component: () =>
      import('../views/BlogEntry_view.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/blog_view',
    name: 'blog_view',
    props: true,
    component: () =>
      import('../views/BlogView_view.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/chess',
    name: 'chess',
    props: true,
    component: () =>
      import('../views/Chess_view.vue'),
    meta: { requiresAuth: false }
  }
];

// disable router-links if requiresAuth
// this will be used in VuetifyLogin.vue on login/logout
function toggleRouterLinks(loginStatus) {
  let status;
  loginStatus === 'loggedIn' ? status = false : status = true;
  routes.forEach(function(route) {
    if (route.meta && route.meta.requiresAuth) {
      if (route.meta.requiresAuth === true) {
        store.dispatch('disableRouterLink', {name: route.name, status: status})
        console.log(`set ${route.name} to ${status}`)
      }
    }
  }) 
}

toggleRouterLinks()

const router = new VueRouter({
  mode: 'history',
  routes
});

// router.beforeEach((to, from, next) => {
//   let currentUser = auth.currentUser;
//   let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   console.log('requiresAuth: ', requiresAuth);
//   if (requiresAuth && !currentUser) {
//     next({name: 'login1'});  //or next('/login1')
//   } 
//   else next();
// })

function hidePositionDisplay(action) {
  action === 'hide' ? 
  store.dispatch('displayNone', true) :
  store.dispatch('displayNone', false)
}

/////////////////////////////////////
router.beforeEach((to, from, next) => {
  let currentUser = auth.currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  console.log('requiresAuth: ', requiresAuth);
  if ((to.name === 'blog_entry') || (to.name === 'blog_view') || (to.name === 'chess')) {
    hidePositionDisplay('hide')
  } 
  if ((to.name !== 'blog_entry') && (to.name !== 'blog_view') && (to.name !== 'chess')) {
    hidePositionDisplay()
  } 
  if (requiresAuth && !currentUser) {
    next({name: 'login'});  //or next('/login')
  } 
  else next();
})

export {router, toggleRouterLinks};