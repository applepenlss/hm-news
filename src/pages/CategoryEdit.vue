<template>
  <div class="category">
    <div class="header">
      <span class="iconfont iconjiantou2" @click="$router.go(-1)"></span>
      <p>栏目管理</p>
    </div>
    <div class="content">
      <div class="del">
        <p>点击删除以下频道</p>
        <div class="list clearfix">
          <div
            class="item"
            v-for="item in activeList"
            :key="item.id"
            @click="del(item.id)"
          >{{item.name}}</div>
        </div>
      </div>
      <div class="add">
        <p>点击添加以下频道</p>
        <div class="list clearfix" v-if="activeListadd.length">
          <div
            class="item"
            v-for="item in activeListadd "
            :key="item.id"
            @click="add(item.id)"
          >{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放要删除关注的栏目
      activeList: [],
      // 存放要要添加的栏目
      activeListadd: []
    }
  },
  async created() {
    // 登录的时候默认的情况下是全部都是关注的
    // this.activeTabs()
    // 从本地存储中拿数据
    const activeList = JSON.parse(localStorage.getItem('activeTabs'))
    const activeListadd = JSON.parse(localStorage.getItem('deactiveTabs'))

    // 如果没有数据，将发送请求,有数据将不发送请求，直接在本地存储中获得
    if (activeList && activeListadd) {
      this.activeList = activeList
      this.activeListadd = activeListadd
      return
    }
    const res = await this.$axios('/category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.activeList = data
      console.log(this.activeList)
    }
  },
  methods: {
    // 演移出的栏目
    del(id) {
      // 最低要保留三个栏目
      if (this.activeList.length <= 3) {
        this.$toast('最少保留3个栏目')
        return
      }
      // console.log('要移出的id', id)
      // 通过id找到对应的下标
      const index = this.activeList.findIndex(item => item.id === id)
      // 将该该下标下的数据，添加到要添加的栏目中
      this.activeListadd.push(this.activeList[index])
      // 将删除栏目的数据删除掉
      this.activeList.splice(index, 1)
    },
    // 添加栏目
    add(id) {
      const index = this.activeListadd.findIndex(item => item.id === id)
      // 将该该下标下的数据，添加到要添加的栏目中
      this.activeList.push(this.activeListadd[index])
      // 将删除栏目的数据删除掉
      this.activeListadd.splice(index, 1)
    }
  },
  watch: {
    // 监听栏目的变化
    activeList: {
      deep: true,
      handler(value) {
        localStorage.setItem('activeTabs', JSON.stringify(this.activeList))
        localStorage.setItem('deactiveTabs', JSON.stringify(this.activeListadd))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.category {
  .header {
    display: flex;
    height: 20px;
    line-height: 20px;
    border-bottom: 1px solid #ccc;
    padding: 10px;

    span {
      font-size: 20px;
    }
    p {
      flex: 1;
      font-size: 18px;
      font-weight: 700px;
      text-align: center;
    }
  }
  .del,
  .add {
    padding: 10px;
    width: 100%;
    p {
      font-size: 12px;
      color: #939294;
      margin-bottom: 10px;
    }
    .list {
      width: 100%;
      .item {
        padding: 5px;
        float: left;
        width: 25%;
        margin: 5px;
        border: 1px solid #ccc;
        text-align: center;
        font-size: 16px;
      }
    }
  }
}
</style>