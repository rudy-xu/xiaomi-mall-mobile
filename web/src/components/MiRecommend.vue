<template>
  <div class="recommend-box space-top">
    <div v-if="id" class="recommend-title-detail">为你推荐</div>
    <div v-else class="recommend-title">
      <span class="recommend-title-main">猜你喜欢</span>
      <span class="recommend-title-subtitle">实时推荐你的心心念念</span>
    </div>
    <!-- <div class="recommend-top-img">
      <img src="../assets/images/recommend.jpg">
    </div> -->
    <div class="recommend-list layout row wrap align-center align-content-start justify-space-between">
      <div
        v-for="list in lists"
        :key="list.id"
        class="goods-item"
      >
        <a class="exposure">
          <div class="goods-img-box">
            <img :src="list.image_url">
          </div>
          <div class="goods-info">
            <div class="goods-name no-wrap">
              {{list.name}}
            </div>
            <div class="goods-price price">
              ￥{{list.price}}
              <del class="price" v-show="list.showMarketPrice">
                ￥{{list.market_price}}
              </del>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommendBlank, getRecommend } from '@/api/category'

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lists: null
    }
  },
  created() {
    if(this.id) {
      this.fetchRecommendForDetail()
    } else {
      this.fetchRecommendBlank()
    }
  },
  methods: {
    async fetchRecommendBlank() {
      await getRecommendBlank().then(res => {
        if(res.code === 200) {
          const list = res.data.recom_list
          list.forEach(item => {
            /** 降价情况下处理 */
            item.showMarketPrice = Math.random() > 0.5
          })
          this.lists = list
        }
      })
    },
    async fetchRecommendForDetail() {
      await getRecommend({
        product_id: this.id
      }).then(res => {
        if(res.code === 200) {
          const list = res.data.recommend_list
          list.forEach(item => {
            /** 降价情况下处理 */
            item.showMarketPrice = Math.random() > 0.5
          })
          this.lists = list
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend-box {
  background-color: #fff;
  text-align: left;

  .recommend-title-detail {
    line-height: 40px;
    padding: 0 16px 5px;
    font-size: 15px;
  }

  .recommend-title {
    line-height: 40px;
    padding: 0 16px 5px;
    font-size: 15px;
    text-align: center;

    span {
      display: block;
    }

    .recommend-title-main {
      line-height: 25px;
      color: #ff6700;
      font-weight: 900;
    }

    .recommend-title-subtitle {
      line-height: 15px;
    }
  }

  .recommend-top-img {
    width: 375px;

    img {
      width: 375px;
      height: 62.5px;
    }
  }

  .recommend-list {
    overflow: hidden;

    .goods-item {
      flex: 0 1 49.5%;
      overflow: hidden;

      a {
        display: block;
      }
    }

    .goods-img-box {
      position: relative;

      img {
        display: block;
        width: 100%;
        min-height: 186px;
        background-color: #eee;
      }
    }

    .goods-info {
      padding: 9px 13px 11px;
    }

    .goods-name {
      font-size: 14px;
    }

    .goods-price {
      font-size: 14px;
      display: inline-block;
      color: #ff6700;
      margin-top: 5px;

      del {
        font-size: 12px;
        margin-left: 5px;
        color: rgba(0,0,0,.54);
        text-decoration: line-through;
      }
    }
  }
}
</style>
