// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import locale from 'iview/dist/locale/zh-CN'
import VueResource from 'vue-resource'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import common from './assets/util.js'  

Vue.use(iView, { locale })
Vue.use(VueResource)
Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.use(common);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
