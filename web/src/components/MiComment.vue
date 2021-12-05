<template>
  <div class="comment-box">
    <div class="item">
      <div class="comment-header layout align-center">
        <div class="avatar-img-box">
          <img
            :src="comment.user_avatar"
            lazy="loaded"
          >
        </div>

        <div class="user-info flex">
          <p class="name">{{comment.user_name}}</p>
          <p class="comment-date">{{comment.add_time}}</p>
        </div>

        <div class="like">
          <span>超爱</span>
        </div>
      </div>

      <div class="comment-content">
        <div class="text">{{comment.comment_content}}</div>
        <div class="photos p6">
          <img
            v-for="(img, index) in comment.comment_images"
            :key="index"
            class="lazy"
            :src="img"
            lazy="loaded"
          >
        </div>
      </div>

      <div class="comment-reply">
        <div class="comment-reply-item official">
          <div class="text">
            <div class="avatar"></div>
            <span>官方回复：</span>
              {{comment.reply_content}}
          </div>
        </div>

        <div
          v-for="reply in comment.user_replys"
          :key="reply.reply_id"
          class="comment-reply-item"
        >
          <div class="text">
            <div class="avatar">
              <img :src="reply.user_avatar" lazy="loaded">
            </div>
            <span>{{reply.user_name}}: </span>
            {{reply.reply_content}}
          </div>
        </div>
        <!-- <div class="more border-top-1px">查看全部8条评论</div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-box {
  background: #fff;
  text-align: left;

  .item {
    padding: 12px 16px 16px;

    .comment-header {
      .avatar-img-box {
        border-radius: 100%;
        overflow: hidden;
        margin-right: 12px;
        width: 40px;
        height: 40px;

        .img {
          width: 100%;
        }
      }

      .name {
        font-size: 13px;
      }

      .comment-date {
        margin-top: 2.5px;
        color: rgba(0,0,0,.54);
        font-size: 11px;
      }

      .like {
        width: 25px;
        height: 18px;
        line-height: 18px;
        padding-left: 25px;

        background: transparent url(../assets/images/logo.png) no-repeat 0;
        background-size: auto 100%;

        color: #ff6700;
        font-size: 11px;
      }
    }

    .comment-content {
      .text {
        padding: 16px 0;
        line-height: 20px;
        font-size: 13px;
      }

      .photos {
        margin-bottom: 6px;

        img {
          width: 83px;
          height: 83px;
          margin: 0 4px 4px 0;
        }
      }
    }

    .comment-reply {
      padding: 8px;
      background: #f6f6f6;

      .comment-reply-item.official .avatar {
        background: transparent url(../assets/images/miLogo.png) no-repeat 50%;
        background-size: cover;
      }

      .comment-reply-item.official span {
        color: #ff6700;
      }

      .comment-reply-item {
        overflow: hidden;
        padding: 2.5px 0;

        .text {
          font-size: 11px;
          line-height: 19px;
        }

        .avatar {
          float: left;
          width: 16px;
          height: 16px;
          overflow: hidden;
          border-radius: 100%;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
