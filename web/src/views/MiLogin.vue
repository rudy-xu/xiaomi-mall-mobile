<template>
  <div class="layout">
    <div class="header-title">
      <em class="mi-logo" />
      <h4 class="header-title-text">小米账号登录</h4>
    </div>

    <div>
      <!-- Input Box -->
      <form>
        <div>
            <label class="login-user">
              <div v-show="isSmsLogin" class="country-list">
                <div class="country-code-select">
                    <span  class="country-code" style="margin-right: 20px;">
                      <span class="country-code-value">+86</span>
                      <i class="icon-arrow-down"></i>
                    </span>
                </div>
              </div>
              <input class="item-acount" autocomplete="off" type="text" :placeholder="placeholderTxt" v-model="username" @input="handleInputUsername" />
            </label>
        </div>

        <div>
          <label v-show="!isSmsLogin" class="pwd-panel">
            <input class="item-account" autocomplete="off" :type="pwdType" placeholder="密码" v-model.trim="pwd" @input="handleInputUsername"/>
            <i class="iconfont pwd-eye" :class="{'icon-eye':!isOpen, 'icon-EyeShow-1':isOpen}" @click="toggleOpen"/>
          </label>
        </div>

        <div v-show="isSmsLogin" class="pwd-panel">
          <!-- <label class="pwd-panel"> -->
            <input class="item-account" autocomplete="off" type="number" placeholder="短信验证" v-model.trim="code" @input="handleInputUsername"/>
            <a href="javascript:;" class="sms-code" :style="codeMsgStyle" @click="getCode">{{codeMsg}}</a>
          <!-- </label> -->
        </div>

        <!-- Error Info -->
        <div v-show="errMsg" class="err-tip">
          <em class="icon_error iconfont icon-error" />
          <span>{{errMsg}}</span>
        </div>
      </form>
      <div class="btns-bg">
        <button class="btn-adpt" :class="{'is-loading': isLoading}" @click="submit">
          <i v-show="isLoading" class="iconfont  icon-loading" style="font-size: 20px;" />
          {{mainBtn}}
        </button>
      </div>

      <div class="other-panel">
        <a href="javascript:;" class="btn-adpt btn-gray" @click="changeBtn">{{subBtn}}</a>
        <div class="reverse">
          <div class="n-links-area">
            <a class="outer-link">立即注册</a>
            <span>|</span>
            <a class="outer-link">忘记密码？</a>
          </div>
        </div>
      </div>

      <!-- Other login way -->
      <div class="other-login-type">
        <fieldset class="oth-type-tit">
          <legend align="center" class="oth-type-txt">其他登陆方式</legend>
        </fieldset>
        <div class="oth-type-links">
          <a class="icon_type" data-type="qq"  title="QQ登录" target="_blank"><i class="iconfont icon-qq btn-qq"></i></a>
          <a class="icon_type" data-type="weibo"  title="微博登录" target="_blank"><i class="iconfont icon-weibo btn-weibo"></i></a>
          <a class="icon_type" data-type="alipay"  title="支付宝登录" target="_blank"><i class="iconfont icon-zhifubao btn-alipay"></i></a>
          <a class="icon_type" data-type="weixin"  title="微信登录" target="_blank"><i class="iconfont icon-weixin btn-weixin"></i></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'blueimp-md5'
import { getCode, login } from '@/api/login'
import { fetchUserInfo } from '@/api/user'

export default {
  data() {
    return {
      isSmsLogin: true,
      codeMsg: '获取验证码',
      isOpen: false,
      timer: null,
      countdown: 60,
      errMsg: '',
      username: '',
      pwd: '',
      code: '',
      isLoading: false
    }
  },
  computed: {
    mainBtn() {
      return this.isSmsLogin ? '立即登录/注册' : '登录'
    },
    subBtn() {
      return this.isSmsLogin ? '用户名密码登录' : '手机短信登录/注册'
    },
    placeholderTxt() {
      return this.isSmsLogin ? '手机号码' : '邮箱/手机号码/小米ID'
    },
    pwdType() {
      return this.isOpen ? 'text' : 'password'
    },
    codeMsgStyle() {
      return this.countdown === 60 ? {
        color: '#2ea5e5',
        cursor: 'pointer'
      } : {
        color: '#999',
        cursor: 'default'
      }
    }
  },
  created() {
    this.$NProgress.done()
    this.$store.commit('setViewLoading', false)
  },
  methods: {
    changeBtn() {
      this.isSmsLogin = !this.isSmsLogin
      this.errMsg = ''
    },
    toggleOpen() {
      this.isOpen = !this.isOpen
    },
    getCode() {
      if(!this.username) {
        this.errMsg = '请输入手机号'
        return
      }

      if(!this.checkMobile(this.username)) {
        this.errMsg = '手机号格式不正确'
        return
      }

      if(this.countdown !== 60) {
        return
      }

      getCode({ username: this.username }).then(res => {
        console.log(res)
        const status = res.data.status
        if(status === 200) {
          this.timer = setInterval(() => {
            --this.countdown
            this.codeMsg = `重新发送 (${this.countdown})`
            if(this.countdown === 0) {
              clearInterval(this.timer)
              this.timer = null
              this.countdown = 60
              this.codeMsg = '获取验证码'
            }
          }, 1000)
        }
      })
    },
    submit() {
      // Validation
      if(this.isSmsLogin) {
        if(!this.username) {
          this.errMsg = '请输入手机号'
          return
        }

        if(!this.checkMobile(this.username)) {
          this.errMsg = '手机号格式不正确'
          return
        }

        if(!this.code) {
          this.errMsg = '请输入手机验证码'
          return
        }
      } else {
        if(!this.username) {
          this.errMsg = '请输入账号'
          return
        }

        if(!this.pwd) {
          this.errMsg = '请输入密码'
          return
        }
      }

      // Throttling treatment
      if(this.isLoading) return

      const data = {
        username: this.username
      }

      if(this.isSmsLogin) {
        data.code = this.code
      } else {
        data.pwd = md5(this.pwd)
      }

      this.isLoading = true
      login(data).then(res => {
        if(res.status === 200) {
          // Jump to home page
          fetchUserInfo().then(res => {
            if(res.status === 200) {
              this.$store.commit('setUserInfo', res.data.user)
              let path = this.$route.query.redirect || '/user'
              this.$router.push(path)
            }
          })
        } else {
          this.errMsg = res.data.message
        }

        setTimeout(() => {
          console.log('delay 5s')
          this.isLoading = false
        }, 5000)
      }).catch(err => {
        console.log(err)
        this.isLoading = false
      })
    },
    handleInputUsername() {
      if(this.username) {
        this.errMsg = ''
      } else if(this.isSmsLogin) {
        this.errMsg = '请输入手机号'
      } else {
        this.errMsg = '请输入账号'
      }
    },
    checkMobile(phoneNumber) {
      const mobileReg = /^(1[3-8][0-9])+\d{8}$/
      return mobileReg.test(phoneNumber)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
    // position: relative;
    display: block;
    padding: 0 28px;
    box-sizing: border-box;
}

.header-title {
    padding: 30px 0 10px;
    text-align: center;

    .mi-logo {
        width: 48px;
        height: 48px;
        margin: 0 auto 15px;
        display: block;
        background-image: url(../assets/images/miLogo.png);
    }

    .header-title-text {
        font-size: 16px;
        font-weight: normal;
    }
}

.login-user, .pwd-panel {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d3d3d3;

    .country-list {
        padding: 1px 0px 1px 0;
        // margin-right: 8px;
        color: #4a4a4a;
        display: block;
        overflow: hidden;

        .country-code-select {
            position: relative;
            animation: fade-in ease-in-out .5s;
            @keyframes fade-in {
              0% {
                left: -100%;
              }
              100% {
                left: 0;
              }
            }
            .country-code {
                display: flex;
                align-items: center;

                .country-code-value {
                    margin-right: 2px;
                    color: #9b9b9b;
                    font-size: 16px;
                }
                .icon-arrow-down {
                    display: block;
                    width: 6px;
                    height: 6px;
                    border-width: 1px;
                    border-style: solid;
                    border-color: transparent transparent #9b9b9b #9b9b9b;
                    -webkit-transform: rotate(-135deg);
                    transform: rotate(-135deg);
                }
            }
        }
    }
    .item-acount {
        padding: 16px 0;
    }
}

.pwd-panel {
    justify-content: space-between
}

.pwd-eye {
  color: #ff6700;
}

.sms_code {
    color: #2ea5e5;
    font-size: 14px;
}

.err-tip {
    margin-bottom: 5px;
    padding-top: 14px;
    color: #F66;
    text-align: left;
    font-size: 14px;

    .icon_error {
        font-size: 16px;
        margin-right: 5px;
        color: #ff6700;
    }
}

.btns-bg {
    padding-top: 24px;
}

.btn-adpt {
    width: 100%;
    padding: 12px 0;
    margin-bottom: 14px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    border-radius: 6px;
    border: transparent;
    background-color: #ff6700;
    display: block;
    cursor: pointer;
}

.btn-gray {
    background: #fff;
    margin-top: 10px;
    border: 1px solid #d3d3d3;
    color: #000;
}

.icon-loading {
  display: inline-block;
  animation: rotating 2s linear infinite
}

@keyframes rotating {
  0% {
    transform: rotate(0deg)
  }

  100% {
    transform: rotate(1turn);
  }
}

.is-loading {
  position: relative;
  pointer-events: none;
}

.is-loading::before {
  pointer-events: none;
  content: "";
  position: absolute;
  left: -1px;
  top: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: inherit;
  background-color: hsla(0,0%,100%,.35);
}
.n-links-area {
    color: #646464;
}

.outer-link {
    padding: 0 9px;
    color: #646464;
}

.other-login-type {
    padding: 40px;
}

.oth-type-tit {
    border-top: 1px solid #f2f2f2;
    padding-top: 10px;
    .oth-type-txt {
        font-size: 12px;
        color: #b0b0b0;
        width: 80px;
    }
}

.icon_type {
    width: 30px;
    height: 30px;
    margin: 0 10px;
    display: inline-block;
    // border-radius: 50%;
}

.btn-qq {
    color: #72c7db;
    font-size: 30px;
}

.btn-weibo {
    color: #ed9090;
    font-size: 30px;
}

.btn-alipay {
    color: #6bb6ea;
    font-size: 30px;
}

.btn-weixin {
    color: #00be00;
    font-size: 30px;
}
</style>
