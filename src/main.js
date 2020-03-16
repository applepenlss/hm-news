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
import axios from 'axios'

Vue.component('MyHeader', MyHeader)
Vue.component('MyLogo', MyLogo)
Vue.component('MyButton', MyButton)
Vue.component('MyInput', MyInput)

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
import { Button, Field, Toast } from 'vant'
Vue.use(Toast)

Vue.config.productionTip = false

new Vue({
  // 将路由和vue实例关联起来
  router,
  render: h => h(App)
}).$mount('#app')
