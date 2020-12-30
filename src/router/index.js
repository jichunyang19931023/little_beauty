import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Blogs from '@/components/personal/Blogs'
import NewBlog from '@/components/personal/NewBlog'
import BlogPage from '@/components/personal/BlogPage'
import Personal from '@/components/personal/Personal'
import ArticleList from '@/components/ArticleList'
import MovieList from '@/components/MovieList'
import MoviePage from '@/components/MoviePage'

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
      path: '/blogPage',
      name: 'BlogPage',
      component: BlogPage
    },
    {
      path: '/personal',
      name: 'Personal',
      component: Personal
    },
    {
      path: '/articleList',
      name: 'ArticleList',
      component: ArticleList
    },
    {
      path: '/movieList',
      name: 'MovieList',
      component: MovieList
    },
    {
      path: '/moviePage',
      name: 'MoviePage',
      component: MoviePage
    }
  ]
})
