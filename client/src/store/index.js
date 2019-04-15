import Vue from 'vue'
import Vuex from 'vuex'
import { state, actions, mutations } from './root'
import * as getters from './getters'
// import modules
import item from './modules/item'
import promote from './modules/promote'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {
    item,
    promote
  },
  strict: true
})
