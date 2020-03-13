<template>
  <div class="hm-header">
    <span class="iconfont iconjiantou2 left" @click="$router.go(-1)"></span>
    <span class="center">
      <slot></slot>
    </span>
    <span class="right"></span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.hm-header {
  display: flex;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
  .left,
  .right {
    width: 40px;
    height: 40px;
  }
  .center {
    flex: 1;
    font-weight: 700;
  }
}
</style>
