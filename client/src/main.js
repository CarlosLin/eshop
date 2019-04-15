import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import moment from 'vue-moment'
import router from './router'
import store from './store'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(moment)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
