import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Header from '@/components/header'
import Navbar from '@/components/navbar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',

    },
    {
      path: '/header',
      name: 'Header',
      component: Header
    },
  ]
})
