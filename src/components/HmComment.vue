<template>
  <div class="myComment">
    <div class="title">
      <div class="left">
        <img :src="$axios.defaults.baseURL + comment.user.head_img" alt />
      </div>
      <div class="center">
        <span>{{comment.user.nickname}}</span>
        <p>{{comment.create_date | data2}}</p>
      </div>
      <div class="right" @click="reply(comment.id,comment.user.nickname)">回复</div>
    </div>
    <!-- 盖楼 -->
    <hm-floor
      :count="getCount(0,comment)"
      v-if="comment.parent"
      :comment="comment.parent"
      @reply="reply"
    ></hm-floor>
    <div class="bottom">{{comment.content}}</div>
  </div>
</template>

<script>
import HmFloor from './HmFloor'
export default {
  props: {
    comment: {}
  },
  components: {
    HmFloor
  },
  created() {
    // console.log(this.comment)
  },
  methods: {
    // 用来获取总共有多少楼层，使用到递归函数
    getCount(num, obj) {
      if (obj.parent) {
        return this.getCount(num + 1, obj.parent)
      } else {
        return num
      }
    },
    // 点击回复，触发父组件的事件，同时传参数过去
    reply(id, nickname) {
      this.$emit('reply', id, nickname)
    }
  }
}
</script>

<style lang="less" scoped>
.myComment {
  border-bottom: 1px solid #ccc;
  .title {
    padding: 10px 0;
    display: flex;
    .left {
      img {
        width: 50px;
        border-radius: 25px;
      }
    }
    .center {
      flex: 1;
      padding: 5px 10px;
      span {
        font-size: 12px;
      }
      p {
        color: #777070;
        margin-top: 10px;
      }
    }
    .right {
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: right;
      font-size: 12px;
      color: #a0a1a1;
    }
  }
  .bottom {
    font-size: 16px;
    padding: 10px 10px 10px;
  }
}
</style>