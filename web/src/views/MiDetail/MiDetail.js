import { getProductView } from '@/api/category'
import Swiper from 'swiper/swiper-bundle'
import 'swiper/swiper-bundle.css'
import DOMPurify from 'dompurify'
import MiComment from '@/components/MiComment'
import MiRecommend from '@/components/MiRecommend.vue'
import MiSku from '@/components/MiSku.vue'
import MiPop from '@/components/MiPop.vue'
import MiAddressAll from '@/components/MiAddressAll.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import { estDelivery } from '@/api/address'

export default {
  components: {
    MiComment,
    MiRecommend,
    MiSku,
    MiPop,
    MiAddressAll,
    showRegions: false
  },
  data() {
    return {
      productData: null,
      galleryView: null,
      detailSwiper: null,
      titleView: null,
      selectedGood: null,
      canJoinActs: null,
      showMask: false,
      showSKU: false,
      commentView: null,
      descTabsView: null,
      descTabsViewIndex: 0,
      id: '',
      showAddressPop: false,
      deliveryData: null,
      showRegions: false
    }
  },
  watch: {
    isLogin(val) {
      this.getShippingAddress()
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'isLogin',
      addressDefault: 'address/default'
    }),

    ...mapState({
      addressList: state => state.address.list,
      count: state => state.cart.count
    })
  },
  created() {
    this.id = this.$route.params.id
    this.$NProgress.done()
    this.fetchProductData()
    this.getShippingAddress()
  },
  // withdraw
  destoryed() {
    if(Array.isArray(this.detailSwiper)) {
      this.detailSwiper.forEach(item => {
        item.destory()
      })
    } else {
      this.detailSwiper.destory()
    }
    this.$NProgress.remove()
  },
  methods: {
    ...mapActions({
      getAddressList: 'address/getList'
    }),
    getShippingAddress() {
      if(this.isLogin) {
        this.getAddressList(() => {
          if(this.addressDefault) {
            estDelivery({
              address_id: this.addressDefault.address_id
            }).then(res => {
              this.deliveryData = res.data
            })
          }
        })
      } else {
        if(navigator.geolocation) {
          // whether support position
          navigator.geolocation.getCurrentPosition((position) => {
            estDelivery({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }).then(res => {
              this.deliveryData = res.data
            })
          })
        }
      }
    },
    selectAddress(item) {
      estDelivery({
        address_id: item.address_id
      }).then(res => {
        this.deliveryData = res.data
        this.showAddressPop = false
      })
    },
    async fetchProductData() {
      await getProductView({
        commodity_id: this.$route.params.id
      }).then(res => {
        if(res.code === 200) {
          this.$store.commit('setViewLoading', false)
          const viewContent = res.data.view_content
          const descTabsView = viewContent.descTabsView.descTabsView

          descTabsView.forEach(item => {
            const tabContent = item.tabContent
            if(tabContent.length > 3) {
              item.showTabContent = tabContent.slice(0, 3)
              item.moreTabContent = tabContent.slice(3)
            } else {
              item.showTabContent = tabContent
            }
            item.showMore = false
          })

          this.descTabsView = descTabsView
          this.galleryView = viewContent.galleryView.galleryView
          this.titleView = viewContent.titleView.titleView
          this.titleViewProductDesc = DOMPurify.sanitize(this.titleView.product_desc)
          this.canJoinActs = this.titleView.canJoinActs[0]
          this.commentView = viewContent.commentView.commentView
          this.productData = res.data

          this.$nextTick(() => {
            this.detailSwiper = new Swiper('.swiper-container', {
              pagination: {
                el: '.swiper-pagination'
              },
              loop: true,
              lazy: {
                loadPrevNext: true
              }
            })
          })
        }
      })
    },
    goback() {
      this.$router.go(-1)
    },
    closeSku() {
      this.showMask = false
      this.showSKU = false
    },
    selectSKU(val) {
      this.selectedGood = val
    },
    changeRegion(region) {
      let { province_id, city_id, district_id, area_id } = region
      estDelivery({
        province_id,
        city_id,
        district_id,
        area_id
      }).then(res => {
        this.deliveryData = res.data
      })
    }
  }
}
