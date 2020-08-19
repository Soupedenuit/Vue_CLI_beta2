import Vue from 'vue';
import App from './App.vue';
import {router} from './router/router';
import store from './store/index.js';
import vuetify from './plugins/vuetify';
import auth from './firebase_config';
import {getInitialState} from '@/initialState.js';

Vue.config.productionTip = true;

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('renameListText', function (value) {
  if (value.indexOf('\n') >= 0) {
    return tag.text
  } else return value
})

vm_beta2 = new Vue({
  router,
  store,
  vuetify,
  mounted() {
    console.log(this.$vuetify.application)
  },
  render: h => h(App)
}).$mount('#app');

const initialState = getInitialState(vm_beta2.$store.state)

Vue.prototype.$initialState = initialState;

// globally accessible $eventHub:
// Vue.prototype.$eventHub = new Vue();
