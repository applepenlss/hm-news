<template>
  <div>
    <my-header>登录</my-header>
    <my-logo></my-logo>
    <!-- 目的：让组件my-input的作用和input框一样 -->
    <my-input
      type="text"
      placeholder="请输入用户名"
      v-model="username"
      :rule="/^1\d{4,10}$/"
      message="用户名格式不对"
      ref="username"
    ></my-input>
    <my-input
      type="password"
      placeholder="请输入密码"
      v-model="password"
      :rule="/^\d{3,12}$/"
      message="用户密码格式错误"
      ref="password"
    ></my-input>
    <my-button @click="login">登录</my-button>
    <div class="goRegister">
      没有账户去
      <router-link to="/register">注册</router-link>？
    </div>
  </div>
</template>

<script>
// 引入axios
// import axios from 'axios'
export default {
  methods: {
    login() {
      // 校验是否通过如果通过才发送请求
      if (
        !this.$refs.username.validate(this.username) ||
        !this.$refs.password.validate(this.password)
      ) {
        return
      }
      // 发送请求
      this.$axios({
        method: 'POST',
        url: '/login',
        data: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        console.log(res.data)
        // 判断是否登录成功
        if (res.data.statusCode === 200) {
          this.$toast('登录成功')
          // 跳转到个人中心
          this.$router.push('/user')
        } else {
          this.$toast('登录失败')
        }
      })
    }
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  created() {
    // 获取地址栏的参数
    console.log(this.$route)
    this.username = this.$route.params.username
    this.password = this.$route.params.password
  }
}
</script>

<style lang="less" scoped>
.goRegister {
  padding: 20px;
  text-align: right;
  font-size: 16px;
  a {
    color: orange;
  }
}
</style>
