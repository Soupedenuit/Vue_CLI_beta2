import Vue from 'vue';
import Vuex from 'vuex';
import users from './modules/users.js'
// import * as users from './modules/users.js'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users
  },
  state: {
    canvasPositionX: [window.innerWidth + 'px'],
    blog_article: '<p>default value of blog_article in <em>Vuex Store</em></p>' ,
    displayNone: false, //used in App.vue
    articleUpdateStatus1: '',
    articleUpdateStatus2: '',
    routerLinks: {
      login: false,
      home: false,
      blog_entry: false,
      blog_view: false,
      canvas: false,
      video1: false,
      signin: false,
      pdf1: false
    }
  },
  getters: {
    getCanvasPosition: function(state) {
      return state.canvasPositionX.slice(-1)
    }
  },
  mutations: {
    UPDATE_CANVAS_POSITION(state, payload) {
      state.canvasPositionX.push(payload);
    },
    POST_WINDOW_WIDTH(state, payload) {
      state.canvasPositionX.push(payload);
    },
    RESET_CANVAS_POSITIONS(state) {
      state.canvasPositionX.splice(1)
    },
    POPULATE_BLOG_ARTICLE(state, payload) {
      if (payload === "logout") {
        state.blog_article = '<p>default value of blog_article in <em>Vuex Store</em></p>';
      } else {
        state.blog_article = `${payload}`;
      }
    },
    POPULATE_ARTICLE_UPDATE_STATUS(state, payload) {
      let text;
      if (payload.latest) {
        text = `Last updated: ${payload.timestamp}`;
        state.articleUpdateStatus1 = text;
      } else state.articleUpdateStatus2 = payload.message; 
    },
    DISPLAY_NONE(state, payload) {
      payload ? 
      state.displayNone = true : 
      state.displayNone = false
    },
    DISABLE_ROUTER_LINK(state, payload) {
      state.routerLinks[payload.name] = payload.status;
    }
  },
  actions: {
    updateCanvasPosition({commit}, payload) {
      commit('UPDATE_CANVAS_POSITION', payload)
    },
    postWindowWidth({commit}, payload) {
      commit('POST_WINDOW_WIDTH', payload)
    },
    resetCanvasPositions({commit}) {
      commit('RESET_CANVAS_POSITIONS')
    },
    populateBlogArticle({commit}, payload) {
      commit('POPULATE_BLOG_ARTICLE', payload)
    },
    populateArticleUpdateStatus({commit}, payload) {
      commit('POPULATE_ARTICLE_UPDATE_STATUS', payload)
    },
    displayNone({commit}, payload) {
      commit('DISPLAY_NONE', payload)
    },
    disableRouterLink({commit}, payload) {
      commit('DISABLE_ROUTER_LINK', payload)
    }
  }
});