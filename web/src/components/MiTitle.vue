<template>
  <header class="app-header-wrapper app-shell-header">
    <div class="app-header-left" @click="goback">
      <div class="app-header-item">
        <i class="iconfont icon-back" style="font-size: 40px;"/>
      </div>
    </div>
    <div class="app-header-middle">
      <div class="app-header-title">{{title}}</div>
    </div>
    <div class="app-header-right">
      <div class="app-header-item" @click="$router.push('user')">
        <i class="iconfont icon-Search" v-if="showSearchIcon" />
      </div>
    </div>
  </header>
</template>

<script>
// import bus from '@/util/bus.js'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    showSearchIcon: {
      type: Boolean,
      default: true
    }
  }
  // methods: {
  //   goback() {
  //     this.$router.go(-1)
  //     bus.emit('transitionName', 'page-right')
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.app-shell-header {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
}

.app-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background: #f2f2f2;
  color: #666;
  padding: 0;

  .app-header-title {
    width: 100%;
    font-size: 18px;
  }

  .app-header-item {
    display: block;
    width: 32px;
    margin: 0 10px;
  }
}

.loading {
  box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.12);
}

.iconfont {
  font-size: 24px;
}
</style>
