<template>
  <div class="mg-top">
    <my-header>个人中心</my-header>
    <div class="header">
      <div class="left">
        <img :src="$axios.defaults.baseURL + info.head_img" alt @click="$router.push('/edit')" />
      </div>
      <div class="center">
        <span v-if="info.gender === 1" class="iconfont iconxingbienan man"></span>
        <span v-else class="iconfont iconxingbienv woman"></span>
        <span>{{ info.nickname }}</span>
        <div>{{ info.create_date | data }}</div>
      </div>
      <div class="right">
        <span class="iconfont iconjiantou1"></span>
      </div>
    </div>
    <div class="mian">
      <my-navbar title="我的关注" content="关注的用户" @click="$router.push('/user_follows')"></my-navbar>
      <my-navbar title="我的跟帖" content="跟帖/回复" @click="$router.push('/user_comment')"></my-navbar>
      <my-navbar title="我的收藏" content="视频/文章" @click="$router.push('/user_star')"></my-navbar>
      <my-navbar title="设置" content @click="$router.push('/edit')"></my-navbar>
      <my-navbar title="首页" content @click="$router.push('/')"></my-navbar>
      <my-navbar title="退出" content @click="exitFn"></my-navbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放个人信息
      info: {}
    }
  },
  async created() {
    let user_id = localStorage.getItem('user_id')
    let token = localStorage.getItem('token')
    // 发送请求，获取数据渲染页面
    const res = await this.$axios({
      url: `/user/${user_id}`,
      methods: 'get'
      // 发送请求的时候需要设置请求头
      // headers: {
      //   Authorization: token
      // }
    })
    // console.log(res.data)
    const { statusCode, data } = res.data
    // 判断成功
    if (statusCode === 200) {
      this.info = data
      // console.log(this.info)
    }
  },
  methods: {
    async exitFn() {
      // 具体的执行步骤，移除token，user_id即可，跳转到登录页
      // 用于确认和取消
      try {
        await this.$dialog.confirm({
          title: '温馨提示!',
          message: '确认要退出吗'
        })
        // 确认
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        this.$router.push('/login')
        this.$toast.success('已退出')
      } catch {
        this.$toast('取消操作')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  padding-top: 30px;
  display: flex;
  border-bottom: 2px solid #ccc;
  .left {
    img {
      margin-left: 20px;
      width: 60px;
      height: 60px;
      border-radius: 30px;
    }
  }
  .center {
    flex: 1;
    padding: 15px;
    font-size: 12px;
    span {
      line-height: 20px;
      height: 20px;
      margin-bottom: 5px;
    }
    div {
      color: grey;
    }
    .man {
      color: blue;
    }
    .woman {
      color: pink;
    }
  }
  .right {
    width: 60px;
    height: 60px;
    float: right;
    text-align: center;
    padding: 20px;
  }
}
</style>
