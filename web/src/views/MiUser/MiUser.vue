<template>
  <div class="app-shell app-shell-bottom-navigation">
    <div class="app-view-wrapper">
      <div class="content app-view app-view-with-footer">
        <header class="hd">
          <div class="user ui-flex align-center">
            <div class="img">
              <img
                v-if="isLogin"
                :src="userInfo.icon ? userInfo.icon : '@/assets/images/user-default.png'"
                lazy="loaded"
              />
              <img
                v-else
                src="@/assets/images/user-avatar.png"
                lazy="loaded"
              />
            </div>
            <div v-if="isLogin" class="name">
              <p>{{userInfo.userName}}</p>
              <div class="account">{{userInfo.user_id}}</div>
            </div>
            <div v-else>
              <router-link
                class="name"
                tag="div"
                :to="{name: 'login'}"
              >
                登录/注册
              </router-link>
            </div>
          </div>
        </header>

        <div class="b1 ui-flex align-center justify-space-between">
          <div class="cite">我的订单</div>
          <div class="span ui-flex align-center">
            <router-link :to="{name: 'orderList'}" class="">全部订单</router-link>
          </div>
        </div>

        <ul class="b2 ui-flex align-center justify-space-between">
          <li class="dfk">
            <router-link :to="{name: 'orderList', query: {type: 7}}">
              <div class="icon"></div>
              <span>待付款</span>
              <em>1</em>
            </router-link>
          </li>
          <li class="dah">
            <router-link :to="{name: 'orderList', query: {type: 8}}">
              <div class="icon"></div>
              <span>待收货</span>
            </router-link>
          </li>
          <li class="thx">
            <a href="/legacy/#/aftersale/list">
              <div class="icon"></div>
              <span>退换修</span>
            </a>
          </li>
        </ul>
        <div class="ui-line"></div>
        <ul class="items">
          <li class="i-member">
            <a href="/mpointsmall">
              <cite>会员中心</cite>
            </a>
          </li>
          <li class="i-wallet">
            <a href="/user/coupon">
              <cite>我的优惠</cite>
            </a>
          </li>
        </ul>
        <div class="ui-line"></div>
        <ul class="items">
          <li class="i-service">
            <a href="/services">
              <cite>服务中心</cite>
            </a>
          </li>
          <li class="i-mihome">
            <a href="/mihome/citys">
              <cite>小米之家</cite>
            </a>
          </li>
        </ul>
        <div class="ui-line"></div>
        <ul class="items">
          <li class="i-fcode">
            <a href="/fcode">
              <cite>F码通道</cite>
            </a>
          </li>
        </ul>
        <div class="ui-line"></div>
        <ul class="items">
          <li class="i-setting">
            <router-link :to="{name: 'set'}">
              <cite>设置</cite>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <page-footer />
  </div>
</template>

<script>
// import PageFooter from '@/components/PageFooter.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  // components: { PageFooter },
  computed: {
    ...mapGetters(['isLogin']),
    ...mapState(['userInfo'])
  },
  created() {
    this.$NProgress.done()
    this.$store.commit('setViewLoading', false)
  }
}
</script>

<style lang="scss" scoped>
.content {
  background: #f5f5f5;

  .hd {
    background: url(../../assets/images/user-bg.png) center 0 #f37d0f;
    background-size: auto 100%;
    padding: 16px 0;

    .img {
      margin: 0 8px 0 16px;
      width: 48px;
      height: 48px;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 100%;
      border: 3px solid hsla(0,0%,100%,.4);
      text-align: center;

      img {
        width: auto;
        height: 100%;
        margin: 0 auto;
      }
    }

    .name {
      color: #fff;
      font-size: 12px;
      text-align: left;
    }

    .account {
      color: hsla(0,0%,100%,.6);
    }
  }
}

.b1 {
  background-color: #fff;
  height: 40px;
  border-bottom: 1px solid rgba(0,0,0,.15);
  color: rgba(0,0,0,.54);
  position: relative;
  padding-right: 28px;

  .cite {
    font-size: 14px;
    padding: 0 0 0 16px;
    color: rgba(0,0,0,.87);
  }

  .span, a {
    font-size: 12px;
    color: rgba(0,0,0,.87);
  }
}

.b1:after {
  content: "";
  position: absolute;
  right: 16px;
  top: 50%;
  width: 8px;
  height: 8px;
  border-left: 1px solid currentColor;
  border-top: 1px solid currentColor;
  transform: translate3d(0,-50%,0) rotate(135deg);
}

.b2 {
  padding: 0 40px;
  background-color: #fff;

  li {
    display: flex;
    align-content: space-between;
    position: relative;
    padding: 20px 0;

    .icon {
      width: 24px;
      height: 24px;
      margin: 0 auto 8px;
      background: url(../../assets/images/user-order1.png) no-repeat center 0;
      background-size: 100% auto;
    }

    .dah .icon {
      background-image: url(../../assets/images/user-order2.png);
    }

    .thx .icon {
      background-image: url(../../assets/images/user-order3.png);
    }

    span {
      color: rgba(0,0,0,.87);
      font-size: 12px;
    }

    em {
      position: absolute;
      min-width: 14px;
      line-height: 14px;
      height: 14px;
      box-sizing: border-box;
      padding: 0 3px;
      font-size: 12px;
      overflow: hidden;
      text-align: center;
      border-radius: 100%;
      background: #ed4d41;
      color: #fff;
      top: 50%;
      left: 50%;
      right: auto;
      transform: translate3d(50%,-200%,0);
      font-style: normal;
    }
  }
}

.ui-line {
  height: 10px;
  background: #f5f5f5;
  overflow: hidden;
  clear: both;
}

.items {
  background: #fff;

  li {
    position: relative;
    color: rgba(0,0,0,.54);
    background: url(../../assets/images/user-member.png) no-repeat 16px;
    background-size: 24px auto;
    line-height: 0;

    &.i-wallet {
      background-image: url(../../assets/images/user-wallet.png);
    }

    &.i-fcode {
      background-image: url(../../assets/images/user-fcode.png);
    }

    &.i-mihome {
      background-image: url(../../assets/images/user-mihome.png);
    }

    &.i-service {
      background-image: url(../../assets/images/user-service.png);
    }

    &.i-setting {
      background-image: url(../../assets/images/user-setting.png);
    }

    > a {
      display: block;
      padding-right: 28px;
      margin-left: 56px;
      border-bottom: 1px solid rgba(0,0,0,.15);
      height: 52px;
      line-height: 52px;
      // display: box;
      display: flex;
      box-align: center;
      box-pack: justify;
      text-align: left;
      color: currentColor;

      cite {
        font-size: 16px;
        font-style: normal;
        color: rgba(0,0,0,.87);
      }
    }

    &:after {
      content: "";
      position: absolute;
      right: 16px;
      top: 50%;
      width: 10px;
      height: 10px;
      border-left: 1px solid currentColor;
      border-top: 1px solid currentColor;
      transform: translate3d(0,-50%,0) rotate(135deg);
    }

    &:last-child>a {
      border-bottom-color: #fff;
    }
  }
}
</style>
