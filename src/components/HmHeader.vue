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
  font-size: 16px;
  border-bottom: 1px solid #ccc;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  width: 100%;
  z-index: 999;
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
