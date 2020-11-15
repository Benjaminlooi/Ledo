import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import vuetify from './plugins/vuetify'
import Default from '@/layouts/Default.vue'
import NoSidebar from '@/layouts/Empty.vue'

var VueCookie = require('vue-cookie')
Vue.use(VueCookie)

Vue.component('default-layout', Default)
Vue.component('no-sidebar-layout', NoSidebar)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
