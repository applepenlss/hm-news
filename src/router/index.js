// 配置路由信息
import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入login，register组件
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import User from '../pages/User.vue'

// 告诉vue使用vue-router插件
Vue.use(VueRouter)

// 创建路由实例
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register },
    { path: '/user', component: User }
  ]
})

// 导出
export default router
