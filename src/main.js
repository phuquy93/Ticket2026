import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import './styles/element-variables.scss'

import Element from 'element-ui'
import enLang from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

// import jtw from "../jwt.js"
// jtw.myToken();

import App from './App'
import router from './router'
import store from './store'

import './icons'
import './permission'

import VuePictureSwipe from 'vue-picture-swipe'
Vue.component('vue-picture-swipe', VuePictureSwipe)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium',
  locale: enLang
})

import VueApexCharts from 'vue-apexcharts';

Vue.use(VueApexCharts);

// Moment
import VueMoment from 'vue-moment'
import Moment from 'moment-timezone'
require('moment/locale/vi')

// Print
import Print from 'vue-print-nb'
Vue.use(Print)

Vue.use(VueMoment, {
  moment: Moment.tz.setDefault(Moment.tz.guess())
})

import money from 'v-money'

Vue.use(money, { precision: 4 })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
