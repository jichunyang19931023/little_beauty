import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Blogs from '@/components/personal/Blogs'
import NewBlog from '@/components/personal/NewBlog'
import BlogPage from '@/components/personal/BlogPage'
import Personal from '@/components/personal/Personal'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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
      name: 'Blogs',
      component: Blogs
    },
    {
      path: '/newBlog',
      name: 'NewBlog',
      component: NewBlog
    },
    {
      path: '/BlogPage',
      name: 'BlogPage',
      component: BlogPage
    },
    {
      path: '/Personal',
      name: 'Personal',
      component: Personal
    }
  ]
})
