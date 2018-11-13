import Vue from 'vue'
import Vuex from 'vuex'
import pairs from './modules/pairs'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    pairs
  },
  state: {
    balance: {}
  },
  mutations: {
    updateGetBalance (state, list) {
      state.balance = list
    }
  }
})

export default store
