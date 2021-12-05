import { cartList } from '@/mock/cart.js'
// import MiSearch from '@/components/MiTitle.vue'
import MiPop from '@/components/MiPop.vue'
import MiRecommend from '@/components/MiRecommend.vue'
import {
  getCartList,
  selectGoods,
  selectServices,
  editCart,
  // addGoods,
  deleteGoods
} from '@/api/cart'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    // MiSearch,
    MiPop,
    MiRecommend
  },
  data() {
    return {
      cartList: null,
      serviceInfoList: null, // Currently. service list dose not be selected
      showServiceInfo: false,
      serviceSelectMessage: '请选择服务类型',
      serviceSelectCashArr: [],
      serviceSelectCashItem: null, // Current, selected service object in popup
      totalNumber: 0,
      totalPrice: 0
    }
  },
  watch: {
    cartList: {
      deep: true,
      handler(val) {
        let all = 0
        let num = 0
        let price = 0
        val.forEach(list => {
          if(list.sel_status) {
            num += list.num
            if(list.price) {
              price += list.num * list.price
            }
          }
          all += list.num
        })

        this.totalNumber = num
        this.totalPrice = price
        this.setCartCount(all)
      }
    }
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  beforeRouteEnter(to, from, next) {
    if(from.name) {
      getCartList().then(res => {
        next(vm => vm.setCartList(res))
      })
    } else {
      next(vm => vm.fetchCartList())
    }
  },
  methods: {
    ...mapMutations({
      setCartCount: 'cart/setCount'
    }),
    fetchCartList() {
      getCartList().then(res => {
        this.setCartList(res)
      })
    },
    setCartList(res) {
      this.$NProgress.done()
      this.$store.commit('setViewLoading', false)
      /**
       * get data from remote
       */
      // this.cartList = res.data.items

      /**
       * get data from mock
       */
      let items = JSON.parse(JSON.stringify(cartList)).data.items

      /**
       * Deal serivce
       * default service, services which need to select
       */
      // the selected service of selected goods
      // like: after have selected some goods, it will select some necessary service by default
      let serviceSelect = []
      items.forEach(item => {
        if(item.service_info) {
          // put items -> service_info -> service_info in this variable
          // meanwhile keep the service_info is common service
          // or the service_info does not belong to special goods
          // so that page is going to render
          item.serviceList = []
          item.service_info.forEach(service => {
            service.service_info.forEach(info => {
              if(!info.sel_status) {
                item.serviceList.push(info)
              } else if(item.sel_status) {
                serviceSelect.push({
                  ...info,
                  parent_goodsId: item.goodsId
                  // after this, it represent service or gift when parent_goodsId === goodsId
                })
              }
            })
          })
        }
      })

      // put 'serviceSelect' behind the related goods
      serviceSelect.forEach(info => {
        let index = items.findIndex(item => {
          // it represent service or gift when parent_goodsId === goodsId
          return item.goodsId === info.parent_goodsId
        })
        items.splice(index + 1, 0, {
          goodsId: info.service_goods_id,
          image_url: info.service_image_url,
          num: info.num,
          buy_limit: items[index].num,
          price: info.service_price,
          product_name: info.service_short_name,
          sel_status: 1,
          parent_goodsId: info.parent_goodsId, // represent this service is default service belong to some goods
          isService: true
        })
      })

      /**
       * Deal gifts
       */
      // the seelcted gifts of selected gooods
      let giftSelect = []
      items.forEach(item => {
        if(item.sel_status && item.gift) {
          item.gift.forEach(gift => {
            giftSelect.push({
              ...gift,
              parent_goodsId: item.goodsId
            })
          })
        }
      })
      // put 'giftSelect' behind related goods
      giftSelect.forEach(gift => {
        let index = items.findIndex(item => {
          return item.goodsId == gift.parent_goodsId
        })
        items.splice(index + 1, 0, {
          buy_limit: items[index].num,
          goodsId: gift.actId,
          image_url: gift.image_url,
          num: items[index].num,
          product_name: gift.product_name,
          sel_status: 1,
          parent_goodsId: gift.parent_goodsId,
          isGift: true
        })
      })
      // this.cartList = []
      this.cartList = items
      console.log(items)
    },
    cartSelect(item, index) {
      let sel_status = item.sel_status ? 0 : 1
      selectGoods({
        goodsId: item.goodsId,
        select_status: sel_status
      }).then(res => {
        if(res.status === 200) {
          item.sel_status = sel_status
          if(!item.sel_status) {
            // Cancel selected goods
            // If having services and gift, delete it
            let subIndex = this.cartList.findIndex(list => {
              return list.parent_goodsId === item.goodsId
            })
            while(subIndex > -1) {
              this.cartList.splice(subIndex, 1)
              subIndex = this.cartList.findIndex(list => {
                return list.parent_goodsId === item.goodsId
              })
            }
            // set all selected status as 0
            // meanwhile put it into optional service list
            item.service_info.forEach(list => {
              list.service_info.forEach(info => {
                if(info.sel_status) {
                  info.sel_status = 0
                  item.serviceList.push(info)
                }
              })
            })
          } else {
            // Selected status
            if(item.gift && item.gift.length) {
              // transform gift to goods if having gift
              item.gift.forEach(gift => {
                this.cartList.splice(index + 1, 0, {
                  buy_limit: item.num,
                  goodsId: gift.actId,
                  image_url: gift.image_url,
                  num: item.num,
                  product_name: gift.product_name,
                  sel_status: 1,
                  parent_goodsId: item.goodsId,
                  isGift: true
                })
              })
            }
          }
        }
      })
    },
    cartEdit(item, num) {
      if(num < 0 && item.num === 1) return
      if(num > 0 && item.num == item.buy_limit) return

      let consumption = num > 0 ? 2 : 1
      editCart({
        goodsId: item.goodsId,
        consumption
      }).then(res => {
        if(res && res.status === 200) {
          item.num += num
          // deal related quantity of gift and service
          this.cartList.forEach(list => {
            if(list.parent_goodsId === item.goodsId) {
              // deal service quantity
              list.buy_limit = item.num
              if(list.isGift) {
                // deal gift quantity
                list.num = item.num
              }
            }
          })
        }
      })
    },
    toCartSelService(item) {
      this.showServiceInfo = true
      let arr = []
      item.service_info.forEach((list, index) => {
        let curList = JSON.parse(JSON.stringify(list))
        curList.service_info = []
        list.service_info.forEach(service => {
          if(!service.sel_status) {
            curList.service_info.push(service)
          }
        })
        arr.push(curList)
      })
      this.serviceInfoList = arr
      this.serviceSelectCashItem = item
    },
    selectService(list, service) {
      if(service.sel_status) {
        service.sel_status = 0
      } else {
        list.service_info.forEach(info => {
          info.sel_status = 0
        })
        service.sel_status = 1
      }
      let arr = []
      this.serviceInfoList.forEach(list => {
        list.service_info.forEach(service => {
          if(service.sel_status) {
            arr.push(service)
          }
        })
      })
      this.serviceSelectMessage = arr.length ? `已选择${arr.length}项服务` : '请选择服务类型'
      this.serviceSelectCashArr = arr
    },
    serviceSelectSubmit() {
      let cashItem = this.serviceSelectCashItem
      selectServices({
        parent_goodsId: cashItem.parent_goodsId,
        service_goods_id: cashItem.goodsId,
        sel_status: 1
      }).then(res => {
        if(res.status === 200) {
          let arr = this.serviceSelectCashArr
          if(arr.length) {
            arr.forEach(list => {
              // delete the selected service from optional service list
              let serviceListIndex = cashItem.serviceList.findIndex(service => {
                return service.service_goods_id === list.service_goods_id
              })
              cashItem.serviceList.splice(serviceListIndex, 1)

              // for original service list, change the select status
              cashItem.service_info.forEach(info => {
                info.service_info.forEach(service => {
                  if(service.service_goods_id === list.service_goods_id) {
                    service.sel_status = 1
                  }
                })
              })

              // transform selected service to goods
              let index = this.cartList.findIndex(item => {
                return item.goodsId === cashItem.goodsId
              })
              this.cartList.splice(index + 1, 0, {
                buy_limit: cashItem.num,
                goodsId: list.service_goods_id,
                image_url: list.service_image_url,
                num: list.num,
                price: list.service_price,
                product_name: list.service_short_name,
                sel_status: 1,
                parent_goodsId: cashItem.goodsId,
                isService: true
              })
            })
          }
          this.showServiceInfo = false
        }
      })
    },
    cartDelete(item, index) {
      deleteGoods({
        goodsId: item.goodsId
      }).then(res => {
        // put service into related goods list
        this.cartList.splice(index, 1)
        if(item.parent_goodsId) {
          let curGood = this.cartList.find(list => {
            return list.goodsId === item.parent_goodsId
          })
          curGood.service_info.forEach(info => {
            info.service_info.forEach(service => {
              if(service.service_goods_id === item.goodsId) {
                service.sel_status = 0
                curGood.serviceList.push(service)
              }
            })
          })
        } else {
          // delete all service and gift belong to this goods
          let subIndex = this.cartList.findIndex(list => {
            return list.parent_goodsId === item.goodsId
          })
          while(subIndex > -1) {
            this.cartList.splice(subIndex, 1)
            subIndex = this.cartList.findIndex(list => {
              return list.parent_goodsId === item.goodsId
            })
          }
        }
      })
    }
  }
}
