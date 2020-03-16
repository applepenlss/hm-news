<template>
  <div class="hm-button" @click="fn">
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    fn() {
      // 给DOM注册的事件，可以通过DOM元素注册点击事件，就可以触发
      // 如果给组件去注册事件，通过DOM是无法触发，而是需要this.$emit触发
      this.$emit("click");
    }
  }
};
</script>

<style lang="less" scoped>
.hm-button {
  height: 45px;
  line-height: 45px;
  margin: 20px;
  background-color: #cc3300;
  text-align: center;
  font-size: 18px;
  color: #fff;
  border-radius: 25px;
}
</style>
