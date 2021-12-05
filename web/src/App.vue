<template>
  <div>
    <mi-skeleton v-show="viewLoading"/>

    <router-view v-slot="{ Component }">
      <!-- <transition v-show="!$store.state.viewLoading" :name="transitionName" @after-leave="afterLeave"> -->
      <!-- <transition v-show="!$store.state.viewLoading" :name="$store.state.transitionName" @after-leave="afterLeave"> -->
      <transition v-show="!viewLoading" :name="transitionName" @after-leave="afterLeave">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
  <!-- <page-footer/> -->
</template>

<script>
// import PageFooter from '@/components/PageFooter.vue'
// import bus from '@/util/bus.js'
import MiSkeleton from '@/components/MiSkeleton.vue'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    // PageFooter,
    MiSkeleton
  },
  // data() {
  //   return {
  //     transitionName: 'page-left'
  //   }
  // },
  computed: mapState(['viewLoading', 'transitionName']),

  watch: {
    '$route'(to, from) {
      /**
       * When page refresh, no transitionName
       * When page refresh, the 'route from' is null
       */
      if(from.meta.index) {
        // this.transitionName = ''
        // this.$store.commit('setTransitionName', '')
        this.setTransitionName('')
        return
      }
      if(to.meta.index && from.meta.index) {
        // this.transitionName = to.meta.index > from.meta.index ? 'page-right' : 'page-left'
        let transitionName = to.meta.index > from.meta.index ? 'page-right' : 'page-left'
        // this.$store.commit('setTransitionName', transitionName)
        this.setTransitionName(transitionName)
      }
    }
  },
  created() {
    // console.log(this.$store)
    // bus.on('transitionName', (val) => {
    //   this.transitionName = val
    // })
    this.getUserInfo()
    this.getCartCount()
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    ...mapActions({
      getUserInfo: 'getUserInfo',
      getCartCount: 'cart/getCount'
    }),
    afterLeave() {
      // this.transitionName = 'page-left'
      this.setTransitionName('page-left')
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
