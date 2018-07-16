import Vue from 'vue'
import Router from 'vue-router'

const coffeeUpload = r => require.ensure([], () => r(require('../pages/coffeeUpload')), 'coffeeUpload')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'coffeeUpload',
      component: coffeeUpload
    }
  ]
})
