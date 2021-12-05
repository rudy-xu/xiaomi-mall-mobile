<template>
  <div class="app-shell">
    <div class="app-view-wrapper">
      <div class="app-view">
        <header class="header">
          <div class="app-header-wrapper">
            <div class="app-header-left">
              <div class="app-header-item">
                <img src="@/assets/images/miLogo.png" alt="No Images"/>
              </div>
            </div>
            <div class="app-header-middle">
              <div class="app-header-title">
                <i class="iconfont icon-Search" />
                &nbsp;&nbsp;<span>搜索商品名称</span>
              </div>
            </div>
            <div class="app-header-right">
              <div class="app-header-item" @click="$router.push('user')">
                <i class="iconfont icon-people" />
              </div>
            </div>
          </div>

          <div class="nav swiper-container">
            <div v-if="navList&&navList.length" class="swiper-wrapper">
              <div
                v-for="(navItem, index) in navList"
                :key="navItem.pageId"
                class="nav-item swiper-slide"
                @click="handleChangeIndex(index)"
              >
                <span :class="{'nav-active': curIndex == index}">{{navItem.name}}</span>
              </div>
            </div>
          </div>
        </header>

        <transition-group class="page-wrap" tag="div" :name="transitionName">
          <div
            v-for="(nav, index) in navList"
            :key="nav.pageId"
            v-show="index === curIndex"
            class="bodys"
          >
            {{nav.name}}
          </div>
        </transition-group>
      </div>
    </div>
    <page-footer/>
  </div>
</template>

<script>
import { getNavList, getTabPageById } from '@/api/home'
import Swiper from 'swiper/swiper-bundle'
import 'swiper/swiper-bundle.css'
// import bus from '@/util/bus.js'
// import PageFooter from '@/components/PageFooter.vue'

export default {
  // components: {
  //   // use mixin to introduce
  //   PageFooter
  // },
  data() {
    return {
      navList: [],
      curIndex: 0,
      slidesPerView: 6,
      swiper: null,
      transitionName: ''
    }
  },
  created() {
    this.getNavList()
  },
  // withdraw
  destoryed() {
    if(Array.isArray(this.swiper)) {
      this.swiper.forEach(item => {
        item.destory()
      })
    } else {
      this.swiper.destory()
    }
    this.$NProgress.remove()
  },
  methods: {
    getNavList() {
      getNavList().then(res => {
        if(res.status === 200) {
          // bus.emit('loading', false)

          res.data.forEach(item => {
            item.hasData = false
          })

          this.navList = res.data
          this.getTabPageById()
          // this.swiper = new Swiper('.swiper-container', {
          //   slidesPerView: this.slidesPerView,
          //   freeMode: true
          // })

          this.$nextTick(() => {
            this.swiper = new Swiper('.swiper-container', {
              slidesPerView: this.slidesPerView,
              freeMode: true
            })
          })
        }
      })
    },
    handleChangeIndex(index) {
      document.querySelector('.page-wrap').scrollTo(0, 0)
      this.transitionName = index > this.curIndex ? 'page-left' : 'page-right'
      this.curIndex = index
      let toIndex = 0
      if(index > this.slidesPerView / 2) {
        toIndex = index - this.slidesPerView / 2
      }
      this.swiper.slideTo(toIndex, 500, false)
      !this.navList[this.curIndex].hasData && this.getTabPageById()
    },
    getTabPageById() {
      getTabPageById({ pageId: this.navList[this.curIndex].pageId }).then(res => {
        // if(res.status === 200) {
        this.navList[this.curIndex].hasData = true
        this.$NProgress.done()
        // }

        // trigger the mutation
        this.$store.commit('setViewLoading', false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// .app-view {
//   position: absolute;
//   z-index: 999;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   /* height: 100%; */
//   // overflow-x: hidden;
//   // overflow-y: auto;
//   will-change: transform;
//   background: #fff;
//   color: #3c3c3c;
//   padding-bottom: 52px;
// }

.header {
  position: fixed;
  top: -1px;
  left: 0;
  right: 0;
  z-index: 99;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2);
  background: #f2f2f2;

  // .app-header-wrapper, .app-header-wrapper>div {
  //   display: flex;
  //   align-items: center;
  // }

  .app-header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    background: #f2f2f2;
    color: #666;
    padding: 0;

    .app-header-middle {
      flex: 1;

      .app-header-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border: 1px solid #e5e5e5;
        text-align: left;
        // width: 100%;
        color: rgba(0,0,0,.3);
        background-color: #fff;
        border-radius: 4px;
        height: 32px;
        padding-left: 12px;
      }
    }

    .app-header-item {
      display: block;
      width: 32px;
      margin: 0 10px;

      img {
        width: 90%;
      }
    }
  }

  .nav {
    // overflow-x: auto;
    overflow-x: hidden;
    background: #f2f2f2;
    font-size: 14px;
    white-space: nowrap;
    z-index: 2;

    .nav-item {
      display: inline-block;
      padding: 0 14px;
      width: auto !important;

      span {
        display: inline-block;
        line-height: 32px;
        border-bottom: 2px solid rgba(237, 91, 0, 0);
        color: rgb(116, 116, 116);
        border-color: rgb(242, 242, 242);
      }

      .nav-active {
        color: rgb(237,91,0);
        border-color: rgb(237,91,0);
      }
    }
  }
}

.page-wrap {
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .bodys {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    // background: rgba(237, 91, 0, 0.1);
    background: $theme_color;
    height: 670px;
    line-height: 670px;
    font-size: 50px;
  }
}

// .page-left-enter,
// .page-right-leave-to {
//   transform: translateX(100%);
// }
// .page-left-enter-active,
// .page-left-leave-active,
// .page-right-enter-active,
// .page-right-leave-active {
//   transition: all .5s;
// }

// .page-left-enter-to,
// .page-right-leave,
// .page-left-leave,
// .page-right-enter-to {
//   transform: translateX(0);
// }

// .page-left-leave-to,
// .page-right-enter {
//   transform: translateX(-100%);
// }
</style>
