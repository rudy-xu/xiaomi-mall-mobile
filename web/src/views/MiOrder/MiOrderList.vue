<template>
  <div class="app-shell app-shell-bottom-navigation">
    <MiTitle title="商品订单" />

    <div class="app-view-wrapper">
      <div class="page-order-list app-view app-view-with-header app-view-with-footer">
        <ol class="tab">
          <li
            v-for="list in types"
            :key="list.type"
            :class="{active:type==list.type}"
            @click="changeTab(list.type)">
            <a>{{list.name}}</a>
          </li>
        </ol>

        <div class="page-con">
          <div v-for="list in types" :key="list.type">
            <transition :name="transitionName">
              <div v-show="type==list.type" class="page-con-items">
                <div v-if="orderList&&orderList.length>0" class="container">
                  <div class="order-list">
                    <ol>
                      <li
                        v-for="order in orderList"
                        :key="order.order_id"
                      >
                        <div
                          class="order-item"
                          @click="toView(order)"
                        >
                          <div class="item-box-top">
                            <div class="top-left">
                              <p class="order-data">
                                <strong>订单日期：</strong>
                                <span>{{order.add_time}}</span>
                              </p>
                              <p class="order-num">
                                <strong>订单编号：</strong>
                                <span>{{order.order_id}}</span>
                              </p>
                            </div>
                            <div class="top-right">
                              {{order.order_status_info}}
                            </div>
                          </div>

                          <div
                            v-for="product in order.product"
                            :key="product.goods_id"
                            class="item-box-center ui-flex align-center">
                            <!-- <img v-lazy="product.image_url" class="lazy"> -->
                            <img :src="product.image_url" class="lazy" lazy="loaded">
                            <span class="flex">{{product.product_name}}</span>
                          </div>

                          <div class="item-box-bottom">
                            <span>共{{order.goods_numbers}}件商品</span>
                            <span>总金额：</span>
                            <strong>{{order.goods_amount}}元</strong>
                          </div>
                        </div>

                        <div class="item-box-btn">
                          <template v-if="order.order_status==3">
                            <a href="javascript:;" class="btn btn-bordered btn-gray">取消订单</a>
                            <router-link :to="{name: 'orderView', params:{id: order.order_id}}" class="btn btn-bordered">立即付款</router-link>
                          </template>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                <div v-if="orderList&&orderList.length==0" class="container">
                  <div class="empty">您还没有 {{typeName}} 订单</div>
                  <MiRecommend />
                </div>
              </div>
            </transition>
          </div>
        </div>

      </div>
    </div>
    <page-footer/>
  </div>
</template>

<script>
import Order from '@/api/orderService'
import MiRecommend from '@/components/MiRecommend.vue'

export default {
  components: {
    MiRecommend
  },
  data() {
    return {
      orderList: null,
      type: parseInt(this.$route.query.type) || 1,
      types: [{
        type: 1,
        name: '全部'
      }, {
        type: 7,
        name: '待付款'
      }, {
        type: 8,
        name: '待收货'
      }],
      transitionName: 'page-left'
    }
  },
  computed: {
    typeName() {
      let status = ''
      switch (this.type) {
        case 1:
          status = ''
          break
        case 7:
          status = '待付款'
          break
        case 8:
          status = '待收货'
          break
      }
      return status
    }
  },
  beforeRouteEnter(to, from, next) {
    if(from.name) {
      Order.list({
        type: to.query.type || 1
      }).then(res => {
        next(vm => vm.setList(res))
      })
    } else {
      next(vm => vm.getList())
    }
  },
  methods: {
    getList() {
      Order.list({
        type: this.type
      }).then(res => {
        this.setList(res)
      })
    },
    setList(res) {
      let list = res.data.list
      list.forEach(order => {
        order.goods_numbers = order.product.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.product_count
        }, 0)
      })
      this.orderList = list
      this.$NProgress.done()
      this.$store.commit('setViewLoading', false)
    },
    changeTab(type) {
      this.transitionName = type > this.type ? 'page-left' : 'page-right'
      this.type = type
      this.getList()
    },
    toView(order) {
      this.$router.push({
        name: 'orderView',
        params: { id: order.order_id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-order-list {
  .tab {
    border-bottom: 0.5px solid #ececec;
    position: fixed;
    width: 100%;
    background: #fff;
    z-index: 2;

    li {
      display: inline-block;
      width: 33.33%;
      text-align: center;
      line-height: 30px;

      a {
        display: inline-block;
        padding: 0 5px;
        line-height: 30px;
        font-size: 14px;
      }
    }

    .active a {
      color: #ff6700;
      border-bottom: 1px solid #ff6700;
    }
  }

  .page-con {
    position: relative;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }

  .page-con-items {
    position: absolute;
    left: 0;
    right: 0;
    background: #fff;
    transition: transform .4s cubic-bezier(.55,0,.1,1);
  }

  .container {
    padding-top: 30px;
    color: rgba(60,60,60,.87);

    li {
      border-top: 10px solid #ececec;
      padding: 0 16px;
      font-size: 12px;
      display: block;
    }

    .item-box-top {
      border-bottom: 1px solid #ececec;
      // display: flex;
      display: -webkit-box;
      padding: 15px 60px 10px 0px;

      .top-left {
        -webkit-box-flex: 1;
        box-flex: 1;
        width: 100%;
        text-align: left;

        .order-data {
          font-size: 15px;
          margin-bottom: 3px;
        }

        .order-num {
          color: #999;
        }
      }

      .top-right {
        padding-right: 60px;
        color: #ff5722;
        font-size: 15px;
      }
    }

    strong {
      font-weight: 400;
    }

    .item-box-center {
      padding: 10px 5px;
      text-align: left;

      img {
        width: 50px;
        height: 50px;
        margin-right: 5px;
        display: block;
      }

      span {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .item-box-bottom {
      padding: 10px 0;
      text-align: right;
      border-top: 1px solid #ececec;

      span {
        margin-left: 10px;
      }

      strong {
        font-size: 15px;
      }
    }

    .item-box-btn {
      padding-bottom: 13px;
      overflow: hidden;
      text-align: right;

      .btn {
        display: inline-block;
        width: auto;
        height: auto;
        font-size: 14px;
        padding: 7px 10px;
        border-radius: 2px;
        margin-left: 10px;
        line-height: normal;
      }

      .btn-bordered {
        color: #ff6700;
        background: transparent;
        border: 1px solid #ff6700;

        &.btn-gray {
          color: #999;
          border: 1px solid #999;
        }
      }
    }
  }

  .empty {
    font-size: 15px;
    text-align: center;
    background: url(//s1.mi.com/m/images/m/empty.png) 50% 0 no-repeat;
    background-size: 100px 100px;
    padding-top: 125px;
    color: #999;
    margin: 40px 50px 0;
    /* display: box; */
  }
}
</style>
