<template>
  <div class="hm-navbar" @click="exitFn">
    <span class="left">{{ title }}</span>
    <span class="center">{{ content }}</span>
    <span class="iconfont iconjiantou1 right"></span>
  </div>
</template>

<script>
export default {
  props: ['title', 'content'],
  methods: {
    exitFn() {
      // 给组件是注册点击事件，组件自己是不能触发的，只有通过DOM元素去触发组件的事件，本质上就是子传父
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
.hm-navbar {
  margin-left: 20px;
  padding-top: 20px;
  display: flex;
  border-bottom: 1px solid #ccc;
  font-size: 15px;
  .left {
    flex: 3;
  }
  .center {
    flex: 1;
    color: grey;
    text-align: right;
  }
  .right {
    width: 30px;
    height: 30px;
    padding-top: 2px;
  }
}
</style>
