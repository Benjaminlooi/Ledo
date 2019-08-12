import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    user: null
    // isLoggedIn: false,
    // user: null
  },
  mutations: {
    setAccessToken(state, payload) {
      state.token = payload
    },
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {

  }
})
