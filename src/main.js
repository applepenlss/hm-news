import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router/index.js'
// 导入公共样式
import './style/base.css'
// 导入字体图标
import './style/iconfont.less'
import 'lib-flexible'
// 导入全局组件
import MyHeader from './components/HmHeader.vue'
import MyLogo from './components/HmLogo.vue'
import MyButton from './components/HmButton.vue'
Vue.component('MyHeader', MyHeader)
Vue.component('MyLogo', MyLogo)
Vue.component('MyButton', MyButton)

Vue.config.productionTip = false

new Vue({
  // 将路由和vue实例关联起来
  router,
  render: h => h(App)
}).$mount('#app')
