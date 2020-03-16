<template>
  <div class="hm-input">
    <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="handelFn"
      :class="{success : status === 'success',erro: status==='error'}"
    />
    <div class="tips" v-show="status =='error'">{{message}}</div>
  </div>
</template>

<script>
export default {
  // props接受父组件传递的值
  props: {
    type: {
      // 校验类型
      type: String,
      // 必填项
      required: true
    },
    placeholder: {
      type: String,
      // 默认项
      default: '请输入。。。。'
    },
    value: String,
    // 传入正则表达式
    rule: RegExp,
    message: String
  },
  data() {
    return {
      // 用来记录表单的校验状态
      status: ''
    }
  },
  methods: {
    handelFn(e) {
      // 把input组件的值传递给父组件
      // console.log('hhh')
      let value = e.target.value
      this.$emit('input', value)
      // console.log(value, this.rule)
      this.validate(value)
    },
    validate(value) {
      // 添加表单校验
      if (this.rule) {
        // 判断是否符合传入的规则
        if (this.rule.test(value)) {
          this.status = 'success'
          return true
        } else {
          this.status = 'error'
          return false
        }
        // console.log(this.status)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.hm-input {
  line-height: 60px;
  height: 60px;
  margin: 0 20px;
  input {
    width: 100%;
    height: 30px;
    line-height: 30px;
    outline: none;
    border: none;
    border-bottom: 1px solid #ccc;
    font-size: 16px;
    &.success {
      border-color: green;
    }
    &.erro {
      border-color: red;
    }
  }
  .tips {
    color: red;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    margin-top: -10px;
  }
}
</style>
