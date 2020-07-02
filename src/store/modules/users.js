import {resetInitialState} from '@/initialState.js';

export default {
  // namespaced: true,
  state: {
    user: {
      name: 'no user (signed out)',
      email: '',
      uid: ''
    }
  },
  mutations: {
    UPDATE_USER(state, payload) {
      state.user.name = payload.name;
      state.user.email = payload.email;
      state.user.uid = payload.uid;
    },
    RESET_STATE(state, payload) {
      // Object.assign(state, payload)
      resetInitialState(state, payload)
    }
  },
  actions: {
    updateUser({commit}, payload) {
      console.log('updateUser called')
      commit('UPDATE_USER', payload)
    },
    resetState({commit}, payload) {
      commit('RESET_STATE', payload)
    }
  }

}