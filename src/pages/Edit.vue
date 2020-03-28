<template>
  <div class="mg-top">
    <my-header>编辑中心</my-header>
    <div class="hm-photo">
      <img alt :src="$axios.defaults.baseURL + info.head_img" />
      <!-- 文件删除完毕后会触发after-read回调函数 ，获取到对应的file对象-->
      <van-uploader :after-read="afterRead" :before-read="beforeRead" class="uploader" />
    </div>
    <my-navbar title="昵称" :content="info.nickname" @click="showNickname"></my-navbar>
    <my-navbar title="密码" :content="info.password | password" @click="showPassword"></my-navbar>
    <my-navbar title="性别" :content="info.gender === 1 ? '男' : '女'" @click="showGender"></my-navbar>
    <!-- 修改昵称弹出框 -->
    <van-dialog v-model="show" title="修改昵称" show-cancel-button @confirm="editNickname">
      <van-field placeholder="请输入昵称" v-model="nickname" />
    </van-dialog>
    <!-- 密码弹出框 -->
    <van-dialog v-model="show1" title="修改昵称" show-cancel-button @confirm="editPassword">
      <van-field placeholder="请输入昵称" v-model="password" />
    </van-dialog>
    <!-- 性别弹出框 -->
    <van-dialog v-model="show2" title="修改昵称" show-cancel-button @confirm="editGender">
      <van-radio-group v-model="gender" direction="horizontal">
        <van-radio :name="1">男</van-radio>
        <van-radio :name="0">女</van-radio>
      </van-radio-group>
    </van-dialog>

    <div class="cropper-mask" v-show="showMask">
      <vueCropper
        ref="cropper"
        :img="img"
        :autoCrop="true"
        :autoCropWidth="150"
        :autoCropHeight="150"
        :fixed="true"
        centerBox
      ></vueCropper>
      <van-button type="primary" @click="cropper" class="cropper">裁剪</van-button>
      <van-button type="info" @click="cancle" class="cancle">取消</van-button>
    </div>
  </div>
</template>

<script>
// 导入vue-cropper 剪切图片
import { VueCropper } from 'vue-cropper'
export default {
  data() {
    return {
      // 存储信息
      info: {},
      show: false,
      nickname: '',
      show1: false,
      password: '',
      show2: false,
      gender: 0,
      showMask: false,
      img: ''
    }
  },
  // 局部注册头像裁剪插件
  components: {
    VueCropper
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 渲染页面封装方法
    async getInfo() {
      // 发送请求,获取个人信息
      const user_id = localStorage.getItem('user_id')
      const res = await this.$axios({
        method: 'GET',
        url: `/user/${user_id}`
        // `headers` 是即将被发送的自定义请求头
      })
      // console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.info = data
        // console.log(this.info)
      }
    },
    // 封装修改用户的函数
    async editUser(data) {
      // 发送请求
      const res = await this.$axios({
        url: `/user_update/${localStorage.getItem('user_id')}`,
        method: 'post',

        data
      })
      // console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        // 重新渲染
        this.getInfo()
        this.$toast.success(message)
      }
    },
    // 显示昵称
    showNickname() {
      // 显示编辑框
      this.show = true
      this.nickname = this.info.nickname
    },
    // 修改昵称
    editNickname() {
      this.editUser({ nickname: this.nickname })
    },
    // 显示密码
    showPassword() {
      this.show1 = true
      this.password = this.info.password
    },
    // 修改密码
    editPassword() {
      this.editUser({
        password: this.password
      })
    },
    // 显示性别
    showGender() {
      this.show2 = true
      this.gender = this.info.gender
    },
    // 修改性别
    editGender() {
      this.editUser({
        gender: this.gender
      })
    },
    // 图片上传完毕后会触发该函数
    afterRead(file) {
      // 读取完文件后需要裁剪图片
      // 显示遮罩层
      this.showMask = true
      // 设置上传的这个文件就是需要裁剪的图片
      this.img = file.content
      // 此时可以自行将文件上传至服务器
      // 需要ajax异步上传图片
      // console.log(file)
    },
    // 图片上传前校验，通过传入beforeRead函数可以在上传前进行校验，返回true表示校验通过，返回false表示校验失败。支持返回Promise进行异步校验
    // 返回布尔值
    // 图片裁剪了，就不需要判断了
    beforeRead(file) {
      // console.log(file)
      // if (file.type !== 'image/jpeg') {
      //   this.$toast('请上传 jpg 格式图片')
      //   return false
      // }
      // if (file.size / 1024 > 200) {
      //   this.$toast('文件小于200k')
      //   return false
      // }
      return true
    },
    // 取消裁剪
    cancle() {
      // 遮罩层隐藏
      this.showMask = false
      // 取消图片
      this.img = ''
    },
    // 裁剪图片
    cropper() {
      // 获取截图的blob数据
      this.$refs.cropper.getCropBlob(async data => {
        // data是图片的base64编码
        console.log(data)

        // 发送编辑图片请求
        // 使用formdata异步上传图片
        const fd = new FormData()
        fd.append('file', data)
        const res = await this.$axios({
          url: '/upload',
          method: 'post',
          data: fd
        })
        // console.log(res.data)
        const { statusCode, data: dataNew } = res.data
        if (statusCode === 200) {
          // 文件上传成功，后台返回了图片的地址data.url
          // 注意：文件上传都是后台返回数据，下面的执行需要发送请求去修改用户信息
          // 隐藏遮罩层
          this.showMask = false
          this.img = ''
          this.editUser({
            head_img: dataNew.url
          })
        }
      })
    }
  },
  // 过滤器
  filters: {
    password(input) {
      if (input) {
        return input.replace(/./g, '*')
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.mg-top {
  margin-top: 40px;
}
.hm-photo {
  text-align: center;
  padding: 50px;
  position: relative;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }
  .van-field__value {
    border: 1px solid #ccc;
  }
  .uploader {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
  }
}
.van-radio-group--horizontal {
  padding-top: 20px;
  padding-left: 110px;
}
.cropper-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  .cancle,
  .cropper {
    position: absolute;
    bottom: 20px;
  }
  .cancle {
    left: 50px;
  }
  .cropper {
    right: 50px;
  }
}
</style>
