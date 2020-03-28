<template>
  <div class="mg-top">
    <my-header>我的关注</my-header>
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt />
        </div>
        <div class="center">
          <div class="title">{{ item.nickname }}</div>
          <div class="time">{{ item.create_date | data }}</div>
        </div>
        <div class="right" @click="unfollowFn(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
    this.followsInfo()
  },
  methods: {
    async followsInfo() {
      // 发送请求
      const res = await this.$axios({
        url: `/user_follows`,
        method: 'get'
      })
      // console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.list = data
        // console.log(this.list)
      }
    },
    // 取消关注
    async unfollowFn(id) {
      try {
        // 弹出信息框
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '确定取消关注吗？'
        })
        // on confirm
        // 发送请求
        const res = await this.$axios({
          url: `/user_unfollow/${id}`,
          method: 'GET'
        })
        // console.log(res.data)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast(message)
          // 重新渲染页面
          this.followsInfo()
        }
      } catch (err) {
        this.$toast('取消关注')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  display: flex;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  img {
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }
  .center {
    flex: 1;
    padding: 5px 10px;
    .title {
      font-size: 14px;
      margin-bottom: 5px;
    }
    .time {
      color: #a2a297;
      font-size: 12px;
    }
  }
  .right {
    width: 60px;
    height: 30px;
    line-height: 30px;
    margin-top: 12px;
    background-color: #ccc;
    color: #fff;
    text-align: center;
    border-radius: 15px;
  }
}
</style>
