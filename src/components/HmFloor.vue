<template>
  <div class="wrapper">
    <hm-floor :count="count-1" v-if="comment.parent" :comment="comment.parent" @reply="reply"></hm-floor>
    <div class="hm-floor" :class="{bt : !comment.parent}">
      <div class="top">
        <div class="left">{{count}}楼 {{comment.user.nickname}}</div>
        <div class="center">{{comment.create_date | data2}}</div>
        <div class="right" @click="reply(comment.id,comment.user.nickname)">回复</div>
      </div>
      <div class="bottom">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: Object,
    count: Number
  },
  // 在组件中自己调用自己，需要加一个name属性
  // 递归函数就是函数自己调用自己，但是一定要有判断的条件，不然会一直的循环下去，将会死循环
  name: 'hm-floor',
  methods: {
    reply(id, nickname) {
      // 触发父组件hm-comment组件的reply事件同时将参数传过去
      this.$emit('reply', id, nickname)
    }
  }
}
</script>

<style lang="less" scoped>
.hm-floor {
  padding: 10px;
  border: 1px solid #ccc;
  border-top: none;
  &.bt {
    border-top: 1px solid #ccc;
  }
  .top {
    display: flex;
    .left {
      font-size: 14px;
    }
    .center {
      margin-top: 2px;
      margin-left: 10px;
      flex: 1;
      font-size: 10px;
      color: #b1abab;
    }
    .right {
      color: #807d7d;
      font-size: 12px;
    }
  }
  .bottom {
    font-size: 14px;
    padding-top: 10px;
  }
}
</style>