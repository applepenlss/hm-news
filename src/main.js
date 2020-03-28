import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router/index.js'
// 导入公共样式
import './style/base.css'
// 导入字体图标
import './style/iconfont.less'
import 'lib-flexible'

// ---------------注册全局组件------------------
import MyHeader from './components/HmHeader.vue'
import MyLogo from './components/HmLogo.vue'
import MyButton from './components/HmButton.vue'
import MyInput from './components/HmInput.vue'
import MyNavbar from './components/HmNavbar.vue'
import MyPost from './components/HmPost.vue'
import MyComment from './components/HmComment.vue'
import axios from 'axios'

Vue.component('MyHeader', MyHeader)
Vue.component('MyLogo', MyLogo)
Vue.component('MyButton', MyButton)
Vue.component('MyInput', MyInput)
Vue.component('MyNavbar', MyNavbar)
Vue.component('MyPost', MyPost)
Vue.component('MyComment', MyComment)

// 解决NavigationDuplicated报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// axios的优化
// axios和vue没有关系，强行让axios和Vue有关系
// 把axios绑定到了vue的原型上，所有的vue实例（组件）都可以通过 this.axios访问到axios
// 给axios配置默认的基础路径
// axios在发请求的时候，把url的路径自动拼接上baseURL
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

// 使用vant
// import Vant from 'vant'
// import 'vant/lib/index.css'
// // 使用vant插件
// Vue.use(Vant)
// 按需加载的方式
import {
  Toast,
  Dialog,
  Field,
  RadioGroup,
  Radio,
  Uploader,
  Button,
  List,
  PullRefresh,
  Tab,
  Tabs
} from 'vant'
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Field)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Uploader)
Vue.use(Button)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(Tab)
Vue.use(Tabs)

// 配置axios的响应拦截器，，，，所有的axios的响应会先经过响应拦截器
// 可以在响应拦截器中对响应做一些通用的处理
axios.interceptors.response.use(res => {
  // console.log('拦截了', res)
  const { statusCode, message } = res.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // 跳转到登录页
    router.push('/login')
    // 删除过期的token信息
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    Toast.fail(message)
  }
  return res
})

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // console.log(config)
    // 统一的给请求头加token
    if (localStorage.getItem('token')) {
      config.headers.Authorization = localStorage.getItem('token')
    }

    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 过滤器
import moment from 'moment'
import VueRouter from 'vue-router'
Vue.filter('data', (input, str = 'YYYY-MM-DD') => {
  return moment(input).format(str)
})
// 当小时大于24时显示具体的时间，小于24小时将直接显示1个小时内
Vue.filter('data2', input => {
  const d = new Date(input)
  const now = new Date()
  const hour = ((now - d) / 1000 / 60 / 60) | 0
  if (hour < 1) {
    return hour / 60 + '分钟前'
  } else if (hour > 24) {
    return moment(input).format('YYYY-YY-DD HH:mm:ss')
  }
  return hour
})

Vue.config.productionTip = false

new Vue({
  // 将路由和vue实例关联起来
  router,
  render: h => h(App)
}).$mount('#app')
