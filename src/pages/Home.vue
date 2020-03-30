<template>
  <div>
    <div class="header">
      <span class="iconfont iconnew"></span>
      <div class="search" @click="$router.push('/search')">
        <span class="iconfont iconsearch"></span>
        <span>搜索新闻</span>
      </div>
      <span class="iconfont iconwode" @click="$router.push('/user')"></span>
    </div>
    <!-- tab栏 -->
    <van-tabs v-model="active" sticky swipeable animated>
      <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <!-- 使用van-list组件包裹文章 -->
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            :offset="50"
          >
            <my-post
              v-for="post in postList"
              :key="post.id"
              :post="post"
            ></my-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      // 指定选中的那个tab
      active: 0,
      // 用于存放所有的tab栏数据
      tabList: [],
      // 用于存放文章的数据
      postList: [],
      // 当前页
      pageIndex: 1,
      // 每页的条数
      pageSize: 5,
      // 控制List组件的加载状态
      loading: false,
      // 控制是否还有更多数据
      finished: false,
      refreshing: false
    }
  },
  async created() {
    // 从本地获取栏目数据
    const tabList = JSON.parse(localStorage.getItem('activeTabs'))
    if (tabList) {
      this.tabList = tabList
      this.getPostList(this.tabList[this.active].id)
      return
    }
    // 发送请求，获取所有的tab数据
    const res = await this.$axios.get('/category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      // 获取到时所有的分类数据
      this.tabList = data
      // console.log(this.tabList)
      this.getPostList(this.tabList[this.active].id)
    }
  },
  methods: {
    // 用于获取文章数据
    // 参数id: 分类的id
    async getPostList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data

      // 如果页码还是1，并且postList还有数据
      if (this.pageIndex === 1 && this.postList.length > 0) {
        this.postList = []
      }

      if (statusCode === 200) {
        // this.postList = data
        // 数据不能替换，只能追加
        this.postList = [...this.postList, ...data]

        // 数据加载完成，把loading改成false
        this.loading = false
        // 让refreshing变成false
        this.refreshing = false
        // 判断还有没有更多的数据
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad() {
      // 上拉加载会执行的函数
      const id = this.tabList[this.active].id
      setTimeout(() => {
        this.pageIndex++
        this.getPostList(id)
      }, 1000)
    },
    onRefresh() {
      console.log('要刷新页面了')
      this.pageIndex = 1
      this.postList = []
      this.loading = true
      this.finished = false
      setTimeout(() => {
        const id = this.tabList[this.active].id
        this.getPostList(id)
      }, 1000)
    }
  },
  // 监听active的变化，在active变化的时候，重新获取文章的数据
  watch: {
    active(value) {
      // 切换栏目的时候，需要初始化所有的状态
      this.postList = []
      this.pageIndex = 1
      this.finished = false

      // loading不应该是false，应该是true，这样才可以保证切换的时候不去触发onload事件
      this.loading = true

      setTimeout(() => {
        const id = this.tabList[value].id
        this.getPostList(id)
      }, 1000)
      // this.onLoad()
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: 50px;
  line-height: 50px;
  background-color: red;
  justify-content: space-between;
  color: #fff;
  .iconnew,
  .iconwode {
    width: 50px;
    height: 50px;
  }
  .iconnew {
    font-size: 50px;
    margin-left: 5px;
  }
  .iconwode {
    font-size: 20px;
    text-align: center;
  }
  .search {
    text-align: center;
    flex: 1;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
    border-radius: 15px;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.5);
  }
}
// 覆盖tab样式
// 深度作用器
/deep/ .van-tabs__nav {
  background-color: #f5f2f2;
}
</style>
