import Vue from 'vue'
import App from './App'
import 'babel-polyfill'

import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import http from '@/api/http'
import regExp from '@/api/regExp'
import codeLength from '@/api/codeLength'
import VueClipboard from 'vue-clipboard2'
import '@/api/loginPush'
import 'babel-polyfill'

import 'element-ui/lib/theme-chalk/index.css'
import '@/style/css/common.scss'
import '@/style/css/public.scss'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.prototype.$http = http
Vue.prototype.$regExp = regExp
Vue.prototype.$codeLength = codeLength

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

