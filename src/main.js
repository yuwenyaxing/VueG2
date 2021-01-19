// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import element from 'element-ui'
import 'font-awesome/css/font-awesome.css'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/index.css'
import '../static/css/index20201218.css'
import * as api from '@/api.js'
import animated from 'animate.css'
// import VueVideoPlayer from 'vue-video-player'
// import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
// import 'videojs-flash'
Vue.config.productionTip = false
// Vue.use(VueVideoPlayer)
Vue.use(element)
Vue.use(animated)
Vue.prototype.axios = axios
axios.defaults.baseURL = api.SERVER_URI
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
