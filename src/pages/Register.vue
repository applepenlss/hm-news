<template>
  <div>
    <my-header>注册</my-header>
    <my-logo></my-logo>
    <my-input
      type="text"
      placeholder="请输入用户名"
      v-model="username"
      :rule="/^1\d{4,10}$/"
      message="用户名输入格式错误"
      ref="username"
    ></my-input>
    <my-input
      type="text"
      placeholder="请输入昵称"
      v-model="nickname"
      message="昵称请输入3到5个字符"
      :rule="/^[\u4E00-\u9FA5]{3,5}$/"
      ref="nickname"
    ></my-input>
    <my-input
      type="password"
      placeholder="请输入密码"
      v-model="password"
      message="密码输入正确格式"
      :rule="/^\d{3,12}$/"
      ref="password"
    ></my-input>
    <my-button @click="register">注册</my-button>
    <div class="goLogin">
      有账户，去
      <router-link to="/login">登录</router-link>?
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    register() {
      // 校验正则是否通过，通过才发送请求
      if (
        !this.$refs.username.validate(this.username) ||
        !this.$refs.password.validate(this.password) ||
        !this.$refs.nickname.validate(this.nickname)
      ) {
        return
      }
      // console.log('hfhssf')
      // 发送请求
      this.$axios({
        method: 'POST',
        url: '/register',
        data: {
          username: this.username,
          password: this.password,
          nickname: this.nickname
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.statusCode === 200) {
          // 注册成功
          // 跳转到登录页
          this.$toast.success(res.data.message)
          // 需求：注册成功将用户名和密码传到登录页
          // 可以通过路由传参数 可以是query缺点是在地址栏可以看到
          // 方式二：通过params去传参数，但是需要命名路由，同时不能写path了，要name去传参数
          this.$router.push({
            // path: '/login',
            // query: { username: this.username, password: this.password }
            name: 'login',
            params: { username: this.username, password: this.password }
          })
        } else {
          this.$toast.fail(res.data.message)
        }
      })
    }
  },
  data() {
    return {
      username: '',
      password: '',
      nickname: ''
    }
  }
}
</script>

<style lang ='less' scoped>
.goLogin {
  padding: 20px;
  text-align: right;
  font-size: 16px;
  a {
    color: orange;
  }
}
</style>
