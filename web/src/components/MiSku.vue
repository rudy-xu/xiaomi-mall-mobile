<template>
  <transition name="sku">
    <div class="pop" v-show="showSKU">
      <div class="close" @click="closeSku">
        <i class="iconfont icon-icon-close" />
      </div>

      <div
        v-if="selectedGood"
        class="pro-info layout row align-center justify-space-around"
      >
        <div class="product-img">
          <img :src="selectedGood.img_url" />
        </div>

        <div class="product-desc flex layout column justify-start">
          <div class="cur-price">
            <div class="price">
              &nbsp;{{selectedGood.price}}
            </div>
            <div class="name">{{selectedGood.name}}</div>
          </div>
        </div>
      </div>

      <div class="max5">
        <!-- version and color -->
        <div>
          <div
            v-for="option in buyOption"
            :key="option.prop_cfg_id"
            class="border-top-1px mt2x"
            :class="{'no_price':!option.hasPrice}"
          >
            <div class="option-title pt32">
              {{option.name}}
              <span style="display: none;">请选择：{{option.name}}</span>
            </div>

            <div class="options-group align-center justify-start layout wrap">
              <div
                v-for="(item, index) in option.list"
                :key="item.prop_value_id"
                :class="{'on':item.isOn, 'line':option.hasPrice,'justify-space-between':option.hasPrice}"
                class="option-item border-1px align-center justify-center ui-flex"
                @click="chooseItem(option,index)"
              >
                <p>{{item.name}}</p>
                <p v-if="option.hasPrice">{{item.price}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- purchase quantity -->
        <div
          v-if="selectedGood"
          class="border-top-1px pd32 layout align-center justify-space-between"
        >
          <div class="option-title">购买数量</div>
          <div class="xm-input-number">
            <div class="input-sub"
              :class="{'active': selectedGood.buyNumber > 1}"
              @click="decrease"
            >
              <i class="iconfont icon-reduce3"></i>
            </div>

            <div class="input-num">
              <span>{{selectedGood.buyNumber}}</span>
            </div>

            <div class="input-add"
              :class="{'active': selectedGood.buyNumber < selectedGood.buy_limit}"
              @click="increase"
            >
              <i class="iconfont icon-add"></i>
            </div>
          </div>
        </div>

        <!-- assurance service -->
        <div>
          <div
            v-for="(bargin,index) in serviceBargins"
            :key="index"
            class="border-top-1px pd32"
          >
            <div class="option-title">
              {{bargin.type_name}}
              <a :href="bargin.service_url" class="service-url">
                <i class="iconfont icon-question"></i>
              </a>
              <span>{{bargin.selectedServiceDesc}}</span>
            </div>

            <div
              v-for="(info,infoIndex) in bargin.service_info"
              :key="info.phone_accidentIns_sku"
              class="options-group"
            >
              <div class="ui-flex align-center justify-start">
                <div :class="{'on':info.selected}" class="option-item border-1px w49">
                  <p>{{info.service_short_name}}  {{info.service_price}}元</p>
                </div>
              </div>

              <div class="options-agree">
                <div
                  :class="{'checked':info.selected}"
                  class="choose"
                  @click="changeService(bargin,info,infoIndex)"
                >
                  <i
                    class="iconfont"
                    :class="info.selected ? 'icon-roundcheckfill' : 'icon-round'"
                  />
                </div>

                <span>我已阅读 &nbsp;</span>

                <a
                  v-for="(accidentIns,index) in info.phone_accidentIns"
                  :key="index"
                  href="accidentIns.url"
                  class="org"
                >
                  {{accidentIns.desc}} |
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="btn-bottom" @click="addToCart">
        <div class="action-box">
          <a data-log_code="" class="btn buy-btn">加入购物车</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { default_goods_id, buy_option, goods_info } from '@/mock/sku.js'
import { mapMutations } from 'vuex'

export default {
  props: {
    showSKU: {
      type: Boolean,
      default: false,
      require: true
    },
    productData: {
      require: true
    }
  },
  data() {
    return {
      goodsInfo: null,
      selectedGood: null,
      serviceBargins: null,
      buyOption: null
    }
  },
  watch: {
    // productData: {
    //   deep: true,
    //   handler(val) {
    //     this.init()
    //   }
    // }
    selectedGood: {
      deep: true,
      handler(val) {
        this.$emit('selectSKU', val)
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapMutations({
      addCartCount: 'cart/addCount'
    }),
    init() {
      /** http */
      // let productData = JSON.parse(JSON.stringify(this.productData))
      // let tempGoodsInfo = productData.goods_info
      // const tempDefaultGoodsId = productData.default_goods_id
      // let tempBuyOption = productData.buy_option

      /** Mock */
      let tempGoodsInfo = goods_info
      const tempDefaultGoodsId = default_goods_id
      let tempBuyOption = buy_option

      /**
       * add some property to original data
       *  default purchase quantity 1
       *  whether selecting service
       *  convert buy_limit to an integer
       */
      tempGoodsInfo.forEach(item => {
        item.buyNumber = 1
        item.buy_limit = parseInt(item.buy_limit)
        item.service_bargins.forEach(list => {
          list.service_info.forEach(info => {
            info.selected = false
          })
        })
      })
      this.goodsInfo = tempGoodsInfo

      // selected good
      this.selectedGood = this.goodsInfo.find(item => {
        return item.goods_id == tempDefaultGoodsId
      })

      // add selectedServiceDesc property to service_bargins data
      this.selectedGood.service_bargins.forEach(item => {
        item.selectedServiceDesc = ''
      })

      this.serviceBargins = this.selectedGood.service_bargins
      this.selectedSKU = JSON.parse(JSON.stringify(this.selectedGood.prop_list))

      /**
       * Deal the situation of selecting or not
       */
      // add property in buyOption list to show selected style
      tempBuyOption.forEach(item => {
        // use hasPrice property to diff the version and color
        item.hasPrice = item.list[0].price !== ''
        item.list.forEach(list => {
          // add isOn property to realize whether selected
          list.isOn = false
        })
      })

      // active default selected style
      this.selectedGood.prop_list.forEach(item => {
        const curOption = tempBuyOption.find(option => {
          // cfg --- configuration
          return option.prop_cfg_id === item.prop_cfg_id
        })

        const curIndex = curOption.list.findIndex(list => {
          return list.prop_value_id === item.prop_value_id
        })

        curOption.list[curIndex].isOn = true
      })

      this.buyOption = tempBuyOption
    },
    chooseItem(option, index) {
      let curIndex = 0
      option.list.forEach((item, i) => {
        if(i === index) {
          curIndex = i
          item.isOn = true
        } else {
          item.isOn = false
        }
      })

      let curSKUIndex = this.selectedSKU.findIndex(item => {
        return item.prop_cfg_id === option.prop_cfg_id
      })

      this.selectedSKU[curSKUIndex].prop_value_id = option.list[curIndex].prop_value_id

      this.selectedGood = this.goodsInfo.find(item => {
        return JSON.stringify(item.prop_list) === JSON.stringify(this.selectedSKU)
      })

      this.serviceBargins = this.selectedGood.service_bargins
    },
    decrease() {
      if(this.selectedGood.buyNumber === 1) return
      this.selectedGood.buyNumber--
    },
    increase() {
      if(this.selectedGood.buyNumber === this.selectedGood.buy_limit) return
      this.selectedGood.buyNumber++
    },
    changeService(bargin, info, infoIndex) {
      bargin.selectedServiceDesc = !info.selected ? info.service_desc : ''
      bargin.service_info.forEach((item, index) => {
        index === infoIndex ? (item.selected = !item.selected) : (item.selected = false)
      })
    },
    addToCart() {
      this.addCartCount(this.selectedGood.buyNumber)
      this.closeSku()
    },
    closeSku() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.pop {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 110;

  color: #000;
  background-color: #fff;
  padding: 16px 16px 66px;
  // height: 300px;
  // width: 375px;
  min-height: 250px;
  max-height: 480px;
  text-align: left;

  .close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 26px;
    height: 26px;

    .icon-icon-close {
      font-size: 30px;
      line-height: 20px;
      color: #bababa;
    }
  }

  .pro-info {
    min-height: 75px;

    .product-img {
      position: relative;
      width: 104px;
      height: 104px;
      text-align: center;
      background: #fff;

      img {
        height: 100%;
        width: auto;
        margin: 0 auto;
      }
    }

    .product-desc {
      position: relative;
      width: 225px;
      margin: 16px 8px;
      text-align: left;

      .price {
        display: inline;
        color: #ff6700;
        font-size: 24px;
        line-height: 19px;
      }

      .name {
        font-size: 14px;
        color: rgba(0,0,0,.87);
        line-height: 20px;
      }
    }
  }

  .option-title {
    position: relative;
    padding-bottom: 8px;
    line-height: 16px;
    font-size: 16px;
    color: rgba(0,0,0,.87);

    span {
      color: rgba(0,0,0,.54);
      margin-left: .5em;
      vertical-align: middle;
    }
  }

  .options-group {
    padding-bottom: 16px;
  }

  .option-item.line {
    width: 100%;
    padding: 12px 16px !important;
  }

  .option-item.on {
    color: #f56600;
  }

  .option-item.on::before {
    color: #f56600;
  }

  .option-item {
    height: 36px;
    line-height: 36px;
    min-width: 72px;
    box-sizing: border-box;
    padding: 0 4px;
    text-align: center;
    margin: 8px 0 0 8px;
    overflow: vivible;
    font-size: 14px;
  }

  .option-item::before {
    content: '';
    border-color: rgba(0,0,0,.15);
    border-radius: 2px;
  }

  .pd32 {
    padding: 16px 0;
  }

  .xm-input-number {
    display: inline-block;
    border: 1px solid #eee;

    .input-num {
      display: inline-block;
      vertical-align: middle;
      min-width: 30px;
      padding: 0 6px;
      text-align: center;
      font-size: 16px;
    }

    .input-add, .input-sub {
      display: inline-block;
      width: 30px;
      height: 30px;
      position: relative;
      vertical-align: middle;
      background-color: #fafafa;
      text-align: center;
    }

    .input-add.active, .input-sub.active {
      background-color: #ddd;
    }
  }

  .service-url {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-left: 5px;
    // vertical-align: middle;

    i {
      font-size: 16px;
      left: 14px;
      color: #999;
    }
  }

  .options-agree {
    margin-top: 8px;
    line-height: 20px;
    text-align: left;
    font-size: 12px;

    .choose {
      display: inline-block;
      padding: 0 4px 0 8px;
      height: 20px;
      position: relative;
      top: 3px;

      i {
        font-size: 20px;
        line-height: 20px;
        color: #ddd;
      }
    }

    .choose.checked i {
      color: #f56600;
    }

    .org {
      color: #f56600;
    }

  }

  .btn-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .action-box {
      background-color: #ff6700;
      color: #fff;
      text-align: center;

      .buy-btn {
        height: 52px;
        line-height: 52px;
      }
    }
  }
}

.no_price .option-item p {
  width: 100%;
}

.icon-reduce3, .icon-add {
  font-size: 20px;
  line-height: 30px;
  font-weight: 700;
  color: #857c7c;
}

.icon-reduce3 {
  color: #bababa;
}

.sku-enter-active, .sku-leave-active {
  transition: all .5s;
}
.sku-enter {
  transform: translateY(100%);
}
.sku-enter-to, .sku-leave {
  transform: translateY(0);
}
.sku-leave-to {
  transform: translateY(100%);
}
</style>
