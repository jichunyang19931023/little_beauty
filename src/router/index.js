import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Blog from '@/components/personal/Blog'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login/:isLogin',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/blogList',
      name: 'Blog',
      component: Blog
    }
  ]
})
