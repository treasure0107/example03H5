// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import cookie from 'js-cookie'
import VueI18n from 'vue-i18n'
import 'signalr'
import 'lib-flexible'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false

Vue.use(Mint)
Vue.use(VueI18n)

// Vue原型设置
Vue.prototype.$_cookie = cookie // cookie插件

//主题
store.state.pairs.theme = localStorage.getItem('theme')

// i18n设置
const i18n = new VueI18n({
  locale: 'zh-CN', // 本地语言
  fallbackLocale: 'zh-CN' // 回退语言
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})