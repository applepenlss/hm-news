<template>
  <div class="postDetails" :class="isShow ? 'pd50' : 'pd150'">
    <div class="header">
      <div class="left">
        <span class="iconfont iconjiantou2" @click="$router.back()"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <div class="followed" v-if="details.has_follow" @click="unfollowFn(details.user.id)">已关注</div>
        <div class="follow" v-else @click="follow(details.user.id)">关注</div>
      </div>
    </div>
    <div class="title">
      <h3>{{details.title}}</h3>
    </div>
    <div class="userInfo">
      <span>{{details.user.nickname}}</span>
      <span>{{details.create_date | data}}</span>
    </div>
    <!-- 文章内容 -->
    <div class="content" v-html="details.content" v-if="details.type === 1"></div>
    <!-- 文章视频 -->
    <video :src="details.content" v-else autoplay loop controls muted></video>
    <div class="btns">
      <div class="like" @click="like(details.id)" :class="{liked :details.has_like}">
        <span class="iconfont icondianzan"></span>
        <span>{{details.like_length}}</span>
      </div>
      <div class="share">
        <span class="iconfont iconweixin"></span>
        <span>微信</span>
      </div>
    </div>
    <!-- 精彩跟帖 -->
    <div class="comment-list">
      <p>精彩跟帖</p>
      <my-comment v-for="item in comments" :key="item.id" :comment="item" @reply="reply"></my-comment>
    </div>
    <div class="footer">
      <div class="input" v-if="isShow">
        <input type="text" placeholder="写跟帖" @focus="handelFocus" />
        <span class="iconfont iconpinglun-">
          <span>{{details.comment_length}}</span>
        </span>
        <span
          class="iconfont iconshoucang"
          @click="star(details.id)"
          :class="{stared:details.has_star}"
        ></span>
        <span class="iconfont iconfenxiang"></span>
      </div>
      <div class="textarea" v-else>
        <textarea
          ref="textarea"
          @blur="handelBlur"
          :placeholder="'回复:'+replyNickname"
          v-model.trim="review"
        ></textarea>
        <span @click="send">发送</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      details: {
        user: {}
      },
      isShow: true,
      // 存放评论
      comments: [],
      //
      review: '',
      // 回复id
      replayId: '',
      // 回复谁的跟帖
      replyNickname: ''
    }
  },
  created() {
    this.getDetails()
    this.getComments()
  },
  methods: {
    // 获取文章信息
    async getDetails() {
      // 获取文章的详细信息
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.details = data
      }
    },
    // 获取评论列表
    async getComments() {
      const id = this.$route.params.id
      const res = await this.$axios(`/post_comment/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.comments = data
        console.log(this.comments)
      }
    },
    // 取消关注
    async unfollowFn(id) {
      // 取消关注的时候不需要判断是否已经登录状态，因为没有登录的全是为未关注的状态
      const res = await this.$axios(`/user_unfollow/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast(message)
        // 渲染页面
        this.getDetails()
      }
      //
    },
    // 关注用户
    async follow(id) {
      // 关注用户的时候要判断是否登录的状态，如果没有登录去登陆
      if (!localStorage.getItem('token')) {
        this.$toast('需要登录')
        // 现在需要去登录过后还会回来原来的这个页面，所以需要传参数
        this.$router.push({ name: 'login', params: { back: true } })
        return
      }
      const res = await this.$axios.get(`/user_follows/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        // 关注成功
        this.$toast.success(message)
        // 渲染页面
        this.getDetails()
      }
    },
    // 点赞文章
    async like(id) {
      // 点赞需要判断用户是否登录,虽然可以不判断但是这样会减少发送一次请求
      if (!localStorage.getItem('token')) {
        this.$toast('需要登录')
        // 跳转到首页,登录成功后回到现在的文章界面需要带参数
        this.$router.push({ name: 'login', params: { back: ture } })
        return
      }
      const res = await this.$axios(`/post_like/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // 渲染页面
        this.getDetails()
      }
    },
    async handelFocus() {
      // 获取焦点的时候让input隐藏
      this.isShow = false
      // 需要文本域获取焦点即可
      // 注意当数据发生改变的时候DOM结构还没有发生改变，需要等DOM结构发生改变的时候再操作DOM
      // this.$nextTick(() => {
      //   this.$refs.textarea.focus()
      // })
      await this.$nextTick
      this.$refs.textarea.focus()
    },
    // textare失去焦点
    handelBlur() {
      if (!this.review) {
        this.isShow = true
      }
    },
    // 收藏
    async star(id) {
      // 需要判断是否登录
      if (!localStorage.getItem('token')) {
        this.$toast('需要登录')
        // 跳转到首页,登录成功后回到现在的文章界面需要带参数
        this.$router.push({ name: 'login', params: { back: ture } })
        return
      }
      const res = await this.$axios.get(`/post_star/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast(message)
        // 渲染页面
        this.getDetails()
      }
    },
    // 点击回复
    async reply(id, nickname) {
      // 让输入文本框显示
      this.isShow = false
      // 父组件需要将子组件的id存储起来，发送请求的时候需要用
      this.replayId = id
      // 获取焦点文本域
      await this.$nextTick
      this.$refs.textarea.focus()
      // 显示回复的跟帖昵称
      this.replyNickname = nickname
    },
    // 点击发送按钮
    async send() {
      const id = this.$route.params.id
      const res = await this.$axios({
        method: 'POST',
        url: `/post_comment/${id}`,
        data: {
          content: this.review,
          parent_id: this.replayId
        }
      })
      console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast(message)

        // 让文本框消失
        this.isShow = true
        // 清空文章id
        this.replayId = ''
        // 清空文本框
        this.review = ''
        // 清空回复的作者
        this.replyNickname = ''
        // 渲染页面
        this.getComments()
        this.getDetails()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.postDetails {
  padding-bottom: 150px;
}
.pd50 {
  padding-bottom: 40px;
}
.pd150px {
  padding-bottom: 60px;
}
.header {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  position: fixed;
  top: -1px;
  left: 0;
  width: 100%;
  background-color: #fff;
  .iconjiantou2 {
    padding: 0 20px;
    font-size: 20px;
  }
  .center {
    height: 50px;
    line-height: 50px;
    padding-left: 5px;
    flex: 1;
    .iconfont {
      font-size: 60px;
    }
  }
  .followed {
    margin-right: 20px;
    border: 1px solid #ccc;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    padding: 0 15px;
  }
  .follow {
    margin-right: 20px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ff0000;
    background-color: #ff0000;
    color: #fff;
    border-radius: 15px;
    padding: 0 15px;
    font-size: 12px;
  }
}
.title {
  padding: 10px 20px;
  font-size: 14px;
  padding-top: 70px;
}
/deep/ video {
  padding: 10px 0;
  width: 100%;
}
.userInfo {
  padding: 0px 20px;
  font-size: 12px;
  color: #a4a2a2;
  span {
    margin-right: 10px;
  }
}
.content {
  padding: 10px 20px;
  font-size: 14px;
  /deep/ img {
    width: 100%;
  }
}
.btns {
  display: flex;
  padding: 10px 20px;
  justify-content: space-around;
  .like,
  .share {
    border: 1px solid #000;
    text-align: center;
    width: 80px;
    height: 35px;
    line-height: 35px;
    border-radius: 15px;
    span {
      margin-right: 5px;
    }
  }
  .iconweixin {
    color: #86b53d;
  }
  .liked {
    color: red;
  }
}
.comment-list {
  margin-top: 20px;
  padding: 20px;
  border-top: 1px solid #ccc;
  p {
    text-align: center;
    font-size: 18px;
    font-weight: 700px;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  .input {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-top: 1px solid #ccc;
    input {
      width: 160px;
      height: 30px;
      line-height: 30px;
      background-color: #ccc;
      padding-left: 10px;
      outline: none;
      border: none;
      border-radius: 10px;
    }
    .iconpinglun- {
      position: relative;
      span {
        position: absolute;
        top: -4px;
        left: 10px;
        width: 30px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        font-size: 10px;
        background-color: red;
        color: #fff;
        border-radius: 5px;
      }
    }
  }
  .textarea {
    border-top: 1px solid #ccc;
    display: flex;
    height: 100px;
    display: flex;
    align-items: flex-end;
    padding: 0 20px 10px;
    textarea {
      width: 280px;
      height: 80px;
      background-color: #ccc;
      border: none;
      outline: none;
      border-radius: 10px;
      padding-left: 10px;
      padding-top: 10px;
      color: #6f6868;
      font-size: 12px;
    }
    span {
      margin-left: 10px;
      width: 50px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      background-color: red;
      border-radius: 10px;
    }
  }
  .stared {
    color: red;
  }
}
</style>