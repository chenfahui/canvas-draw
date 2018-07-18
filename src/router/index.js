import Vue from 'vue'
import Router from 'vue-router'

const home = r => require.ensure([], () => r(require('../pages/home')), 'home')
const coffeeUpload = r => require.ensure([], () => r(require('../pages/coffeeUpload')), 'coffeeUpload')
const handWriting = r => require.ensure([], () => r(require('../pages/handWriting')), 'handWriting')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta: {
        title: 'home'
      }
    },
    {
      path: '/coffeeUpload',
      name: 'coffeeUpload',
      component: coffeeUpload,
      meta: {
        title: 'coffeeUpload'
      }
    },
    {
      path: '/handWriting',
      name: 'handWriting',
      component: handWriting,
      meta: {
        title: 'handWriting'
      }
    }
  ]
})
