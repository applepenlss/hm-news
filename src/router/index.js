// 配置路由信息
import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入login，register组件
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import User from '../pages/User.vue'
import Edit from '../pages/Edit.vue'
import MyFollows from '../pages/MyFollows.vue'
import MyComment from '../pages/MyComment.vue'
import MyStar from '../pages/MyStar.vue'
import Home from '../pages/Home.vue'
import PostDetails from '../pages/PostDetails.vue'
import CategoryEdit from '../pages/CategoryEdit.vue'
import Search from '../pages/Search.vue'
// 告诉vue使用vue-router插件
Vue.use(VueRouter)

// 创建路由实例
const router = new VueRouter({
  routes: [
    { path: '/', component: Home, name: 'home' },
    // 命名路由，在parmas传参的时候会用到，给路由添加一个名字
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register },
    { path: '/user', component: User },
    { path: '/edit', component: Edit, name: 'edit' },
    { path: '/user_follows', component: MyFollows, name: 'user_follows' },
    { path: '/user_comment', component: MyComment, name: 'user_comment' },
    { path: '/user_star', component: MyStar, name: 'user_star' },
    {
      path: '/post_details/:id',
      component: PostDetails,
      name: 'post_details'
    },
    {
      path: '/category_edit',
      component: CategoryEdit
    },
    {
      path: '/search',
      component: Search
    }
  ]
})

// 导航守卫： “导航” 路由发生改变的时候触发该事件
// 注册一个全局前置守卫
// 需要授权的路径，需要登录才能够访问
const authUrl = [
  '/user',
  '/edit',
  '/user_follows',
  '/user_comment',
  '/user_star'
]
router.beforeEach((to, from, next) => {
  // from 当前正要离开的路由
  // to 即将进入的路由
  // next 是否放行 相当于中间件
  // 我们只需要判断去哪里，不需要判断从哪里来

  if (authUrl.includes(to.path)) {
    // 查看是否有token有行
    if (localStorage.getItem('token')) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    // 放行
    next()
  }
})

// 导出
export default router
