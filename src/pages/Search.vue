<template>
  <div class="search">
    <div class="header">
      <span class="iconfont iconjiantou2 left" @click="back"></span>
      <input
        type="text"
        placeholder="请输入关键字"
        v-model.trim="keyword"
        @input="search_recommend"
      />
      <span class="iconfont iconsearch"></span>
      <span class="right" @click="search">搜索</span>
    </div>

    <!-- 搜索推荐 -->
    <div class="recommend" v-if="commendList.length > 0">
      <div
        class="item one-txt-cut"
        v-for="item in commendList"
        :key="item.id"
        @click="recommend(item.title)"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="postList" v-if="postList.length > 0">
      <my-post v-for="post in postList" :key="post.id" :post="post"></my-post>
    </div>

    <div class="content" v-else>
      <div class="history">
        <p>历史记录</p>
        <div class="history-list clearfix">
          <div
            class="history-key"
            v-for="item in history"
            :key="item"
            @click="search_history(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="hot-search">
        <p>热门搜索</p>
        <div class="history-list clearfix">
          <div
            class="history-key"
            v-for="item in hotList"
            :key="item"
            @click="hot_search(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入防抖
export default {
  data() {
    return {
      // 搜索关键字
      keyword: '',
      // 搜索的文章详情
      postList: [],
      // 历史记录
      history: [],
      // 热门搜索
      hotList: [],
      // 搜索推荐
      commendList: []
    }
  },
  created() {
    // 获取搜索记录
    this.history = JSON.parse(localStorage.getItem('history'))
    this.hotList = ['一次性口罩', '溜冰鞋']
  },
  methods: {
    // 点击搜索功能
    async search() {
      // 搜索时，关闭推荐
      this.commendList = []
      // 把搜索的keyword保存到历史记录中
      // 判断历史记录中是否有这个历史记录,如果有，直接先删除掉
      this.history = this.history.filter(item => item !== this.keyword)
      this.history.unshift(this.keyword)
      localStorage.setItem('history', JSON.stringify(this.history))
      console.log('搜索')
      // 发送ajax请求，获取搜索结果
      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword,
          pageIndex: 1,
          pageSize: 6
        }
      })
      console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.postList = data
      }
    },
    // 点击搜索记录进行搜索
    search_history(keyword) {
      this.keyword = keyword
      this.search()
    },
    // 搜索推荐,显示列表
    async search_recommend() {
      if (!this.keyword) {
        return
      }
      const res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commendList = data
        console.log(this.commendList)
      }
    },
    // 点击推荐列表
    recommend(value) {
      this.keyword = value
      this.search()
    },
    // 热门搜索
    hot_search(value) {
      this.keyword = value
      this.search()
    },
    // 点击返回按钮
    back() {
      if (this.keyword) {
        this.keyword = ''
      } else {
        this.$router.go(-1)
      }
    }
  },
  watch: {
    // 监听keyword的值
    keyword(value) {
      if (!value) {
        // 如果没有输入内容，搜索结果清空
        this.postList = []
        console.log('我监听到keyword的变化')
        // 清空推荐
        this.commendList = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .header {
    padding: 10px;
    display: flex;
    line-height: 30px;
    height: 30px;
    border-bottom: 1px solid #ccc;
    .left {
      font-size: 20px;
      text-align: center;
      padding-right: 10px;
    }
    input {
      flex: 1;
      padding-left: 30px;
      outline: none;
      border: 1px solid #ccc;
      font-size: 16px;
      border-radius: 20px;
    }
    .iconsearch {
      position: absolute;
      left: 53px;
      top: 12px;
    }
    .right {
      padding-left: 10px;
      font-size: 16px;
      text-align: right;
    }
  }
  .content {
    padding: 10px;
    .history,
    .hot-search {
      p {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 10px;
      }
      .history-list {
        .history-key {
          border: 1px solid #ccc;
          padding: 5px;
          float: left;
          text-align: center;
          margin-left: 5px;
          margin-right: 10px;
          margin-top: 10px;
          font-size: 14px;
        }
      }
    }
    .hot-search {
      p {
        margin-top: 20px;
      }
    }
  }
  .recommend {
    position: absolute;
    z-index: 999;
    background-color: #fff;
    width: 100%;
    .item {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
