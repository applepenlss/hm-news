<template>
  <div class="mg-top">
    <my-header>我的跟帖</my-header>
    <div class="list">
      <!-- 
        onload 事件会在滚动到底部的时候触发，
        :immediate-check="false" 关闭页面一加载就触发onload事件
        :offset 滚动条与底部距离小于 offset 时触发load事件
        loading 用于指定加载的状态，如果loading为true，不会触发load事件，只有load为false才会触发load事件
          当滚动到底部的时候，会自动的将loading的值改为true，所以需要将数据加载完成的时候将值改为false

      -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="50"
          @load="onLoad"
          :immediate-check="false"
        >
          <div class="item" v-for="item in list" :key="item.id">
            <div class="time">{{ item.create_date | data('YYYY-MM-DD HH:MM') }}</div>
            <!-- 父评论的内容 -->
            <div class="parent-comment" v-if="item.parent">
              <div class="parent-name">回复： {{ item.parent.user.nickname }}</div>
              <div class="parent-content">{{ item.parent.content }}</div>
            </div>
            <div class="comment">{{ item.content }}</div>
            <div class="link">
              <div class="title one-txt-cut">原文：{{ item.post.title }}</div>
              <span class="iconfont iconjiantou1"></span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 10,
      refreshing: false
    }
  },
  created() {
    this.commentInfo()
  },
  methods: {
    // 更新页面
    commentInfo() {
      this.$axios({
        url: '/user_comments',
        method: 'get',
        // params 是即将与请求一起发送的URL参数  通过get发送的请求要是有数据需要params传参， post发送请求是data传参数
        params: {
          // 当前页数
          pageIndex: this.pageIndex,
          // 每页多少条数据
          pageSize: this.pageSize
        }
      }).then(res => {
        console.log(res.data)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          // 因为涉及到分页，但是不能简单的把响应的data给list数据给覆盖了，而是应该追加
          this.list = [...this.list, ...data]
          // 数据加载完成，将loading设置成false，不然无法触发下一次的加载
          this.loading = false
          // 判断是否有更多的数据数据，加载完成将finished设置成true即可
          if (data.length < this.pageSize) {
            this.finished = true
          }
        }
      })
    },
    onLoad() {
      // onload 会自动的将loading的值设置成true
      console.log('我触底了，需要加载数据')

      // 加载下一页的数据
      this.pageIndex++
      // 发送请求
      this.commentInfo()
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  padding: 20px;
  border-bottom: 1px solid #ccc;
  .time {
    font-size: 14px;
    color: #888894;
  }
  .comment {
    font-size: 15px;
    padding: 5px 0;
  }
  .link {
    display: flex;
    .title {
      flex: 1;
      padding: 5px 0;
      font-size: 13px;
      color: #888894;
    }
    span {
      margin-top: 2px;
      padding: 5px 0;
    }
  }
  .parent-comment {
    margin: 5px 0;
    padding: 5px;
    background-color: #d4d0d0;
    color: #7b7878;
    font-size: 13px;
    border-radius: 5px;
    .parent-name,
    .parent-content {
      padding: 5px 0;
    }
  }
}
</style>
