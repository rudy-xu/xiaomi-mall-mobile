<template>
  <footer class="app-shell-footer app-bottom-navigator-wrapper">
    <!-- <div v-if="!loading" class="fill-height box-flex align-center"> -->
    <div class="fill-height box-flex align-center">
      <!-- <a
        v-for="(nav, index) in footerNavList"
        :key="nav.id"
        class="flex"
        :class="index === curIndex ? 'on' : ''"
        @click="curIndex = index"
      >
        <i class="iconfont" :class="index === curIndex ? nav.iconon : nav.icon" />
        <span>{{nav.name}}</span>
      </a> -->
      <router-link
        v-for="nav in footerNavList"
        :key="nav.id"
        class="flex"
        active-class="on"
        :to="{name: nav.link}"
      >
        <i
          class="iconfont"
          :class="nav.link == $route.name ? nav.iconon : nav.icon"
        />
        <span>{{nav.name}}</span>
        <em v-if="nav.link == 'cart' && count" class="bubble">{{count}}</em>
      </router-link>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
// import bus from '@/util/bus.js'

const footerNavList = [
  {
    name: '首页',
    icon: 'icon-home',
    iconon: 'icon-home_1',
    link: 'home'
  },
  {
    name: '分类',
    icon: 'icon-fenlei',
    iconon: 'icon-2',
    link: 'category'
  },
  {
    name: '购物车',
    icon: 'icon-shopping_cart',
    iconon: 'icon-shopping-cart',
    link: 'cart'
  },
  {
    name: '我的',
    icon: 'icon-people1',
    iconon: 'icon-peoplefill',
    link: 'user'
  }
]
export default {
  data() {
    return {
      curIndex: 0,
      footerNavList
      // loading: true
    }
  },
  computed: mapState({
    count: state => state.cart.count
  }),
  created() {
    /**
     * vue2.x
     */
    // bus.$on('loading', (val) => {
    //   this.loading = val
    // })

    /**
     * vue3.x
     */
    // local invoke
    // bus.on('loading', (val) => {
    //   this.loading = val
    // })

    // global invoke
    // this.$bus.on('loading', val => {
    //   this.loading = val
    // })
  }
}
</script>

<style lang="scss" scoped>
.app-shell-footer {
  position: fixed;
  z-index: 9999;
  bottom: 0;
  left: 0;
  right: 0;
}

.app-bottom-navigator-wrapper {
  height: 52px;
  background: #fff;
  box-shadow: 0 3px 14px 2px rgba(0,0,0,.12);
}

.fill-height {
  height: 100%;
}

.box-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.flex {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #999;

  span {
    font-size: 12px;
  }
}

.on {
  color: #ff6700;
}

.bubble {
  position: absolute;
  min-width: 14px;
  line-height: 14px;
  height: 14px;
  box-sizing: border-box;
  padding: 0 3px;
  font-size: 10px;
  overflow: hidden;
  text-align: center;
  border-radius: 10px;
  background: #ed4d41;
  color: #fff;
  top: 0;
  left: 50%;
  transform: translate3d(50px,10%,0);
  font-style: normal;
}
</style>
