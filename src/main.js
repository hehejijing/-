import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import Component from '@/components'
Vue.use(Component) // 注册自己的插件

import store from './store'
import router from './router'
import * as directives from '@/directives'

// 全局自定义指令
Object.keys(directives).forEach(ele => {
  Vue.directive(ele, directives[ele])
})

import Print from 'vue-print-nb'
Vue.use(Print)

import myMixin from '@/mixin/checkPermission'

import * as filters from '@/filters'
Object.keys(filters).forEach(ele => {
  Vue.filter(ele, filters[ele])
})

import '@/icons' // icon
import '@/permission' // permission control

import i18n from '@/lang'
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(ElementUI)
Vue.mixin(myMixin)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
