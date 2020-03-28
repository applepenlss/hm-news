<template>
  <div class="mg-top">
    <my-header>我的收藏</my-header>
    <my-post v-for="post in list" :key="post.id" :post="post "></my-post>
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
    this.starInfo()
  },
  methods: {
    // 发送请求获取list列表
    async starInfo() {
      const res = await this.$axios.get('/user_star')
      // console.log(res.data)
      const { statusCode, data } = res.data
      // 给每个数据添加comment_length属性
      data.forEach(item => (item.comment_length = item.comments.length))
      this.list = data
      console.log(this.list)
    }
  }
}
</script>

<style lang="less" scoped>
</style>