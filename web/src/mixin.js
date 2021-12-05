// import bus from '@/util/bus.js'
import PageFooter from '@/components/PageFooter.vue'
import MiTitle from '@/components/MiTitle.vue'

const mixins = {
  components: {
    PageFooter,
    MiTitle
  },
  methods: {
    goback() {
      this.$router.go(-1)
      // bus.emit('transitionName', 'page-right')
      this.$store.commit('transitionName', 'page-right')
    }
  }
}

export default mixins
