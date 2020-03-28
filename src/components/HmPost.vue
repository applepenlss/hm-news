<template>
  <div class="hm-post" @click="$router.push(`/post_details/${post.id}`)">
    <!-- 视频样式 -->
    <div class="video-post" v-if="post.type !==1">
      <div class="title">{{post.title}}</div>
      <div class="video">
        <img :src="getUrl(post.cover[0].url)" alt />
        <div class="play">
          <span class="iconfont iconshipin"></span>
        </div>
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>
    <!-- 单图样式 -->
    <div class="single-img-post" v-else-if="post.cover.length < 3">
      <div class="left">
        <div class="title">{{post.title}}</div>
        <div class="bottom">
          <span>{{post.user.nickname}}</span>
          <span>{{post.comment_length}}跟帖</span>
        </div>
      </div>
      <img :src="getUrl(post.cover[0].url)" alt />
    </div>
    <!-- 多图样式 -->
    <div class="multiple-img-post" v-else>
      <div class="left">
        <div class="title">{{post.title}}</div>
      </div>
      <div class="imgs">
        <img :src="getUrl(post.cover[0].url)" alt />
        <img :src="getUrl(post.cover[1].url)" alt />
        <img :src="getUrl(post.cover[2].url)" alt />
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 接收父组件传输的数据
  props: {
    post: Object
  },
  methods: {
    // 修复url地址
    getUrl(url) {
      if (url.startsWith('http')) {
        return url
      } else {
        // 如果不以http开头，拼接上基础路径
        return this.$axios.defaults.baseURL + url
      }
    }
  }
}
</script>

<style lang="less" scoped>
.single-img-post {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  justify-content: space-between;
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 15px;
    }
    span {
      font-size: 12px;
      color: #807c7c;
      margin-right: 10px;
    }
  }
  img {
    width: 120px;
    height: 75px;
    // 防止图片失真，将object-fit属性，值可以是cover和contain但是会有留白，cover是将多余的裁剪到  和background-size一样
    object-fit: cover;
  }
}
.bottom {
  span {
    font-size: 12px;
    color: #807c7c;
    margin-right: 10px;
  }
}
.title {
  font-size: 15px;
}
.multiple-img-post {
  border-bottom: 1px solid #ccc;
  padding: 10px;

  .imgs {
    display: flex;
    justify-content: space-between;
    img {
      padding: 5px 0;
      width: 112px;
      height: 74px;
      object-fit: cover;
      display: block;
    }
  }
}
.video-post {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .video {
    padding: 10px 0;
    position: relative;
    img {
      width: 340px;
      height: 170px;
      object-fit: cover;
      display: block;
    }
    .play {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: rgba(125, 121, 121, 0.5);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      line-height: 50px;
      .iconfont {
        font-size: 32px;
        color: #fff;
      }
    }
  }
}
</style>