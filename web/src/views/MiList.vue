<template>
  <div class="app-shell">
    <mi-title title="商品列表"/>

    <!-- <div v-if="loading">
      <span>Loading . . .</span>
    </div> -->

    <!-- <div v-else class="app-view-wrapper"> -->
    <div class="app-view-wrapper">
      <div class="app-view app-view-with-header app-view-with-footer">
        <ol>
          <router-link
            tag="li"
            v-for="list in commodityList"
            :key="list.product_id"
            :to="{name: 'detail', params: {id: list.product_id}}"
            class="item ui-flex align-center"
          >
            <a class="item-img exposure">
              <img
                :src="list.img_url"
                lazy="loaded"
              />
              <span>
                <img
                  :src="list.icon_img"
                  lazy="loaded"
                />
              </span>
            </a>
            <div class="item-intro box-flex flex">
              <div class="item-name flex">
                <p>{{list.name}}</p>
              </div>
              <div class="item-brief flex">
                <p v-html="list.product_desc" />
              </div>
              <div class="item-intro-price flex">
                <span class="price">
                  &nbsp;{{list.price}}
                </span>
              </div>
            </div>
          </router-link>
        </ol>

        <mi-recommend />
      </div>
    </div>
    <page-footer/>
  </div>
</template>

<script>
import { getCommodityById } from '@/api/category'
// import MiSearch from '@/components/MiTitle.vue'
// import bus from '@/util/bus.js'
import MiRecommend from '@/components/MiRecommend.vue'
import DOMPurify from 'dompurify'
import MiTitle from '@/components/MiTitle.vue'
// import PageFooter from '@/components/PageFooter.vue'

export default {
  components: {
    // MiSearch,
    MiRecommend,
    MiTitle
    // PageFooter
  },
  data() {
    return {
      commodityList: null
      // loading: true
    }
  },
  beforeRouteEnter(to, from, next) {
    if(from.name) {
      getCommodityById({
        category_id: to.params.id
      }).then(res => {
        if(res.code === 200) {
          next(vm => vm.setList(res.data.list))
        }
      })
    } else {
      next(vm => vm.fetchCommodityById())
    }
  },
  // created() {
  //   this.fetchCommodityById({
  //     category_id: this.$route.params.id
  //   })
  // },
  destoryed() {
    this.$NProgress.remove()
  },
  methods: {
    setList(list) {
      this.$NProgress.done()
      list.forEach(item => {
        item.product_desc = DOMPurify.sanitize(item.product_desc)
      })
      this.commodityList = list
      // this.loading = false
      // bus.emit('loading', false)
      this.$store.commit('setViewLoading', false)
    },
    async fetchCommodityById() {
      await getCommodityById({
        category_id: this.$route.params.id
      }).then(res => {
        if(res.code === 200) {
          this.setList(res.data.list)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.item:not(:last-child) {
  padding: 0 0 3px;
  position: relative;
}

.item:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: 1px;
  left: 1px;
  right: 1px;
  border-bottom: 1px solid #e4e4e4;
}

.item-img {
  position: relative;
  width: 156px;
  height: 156px;
  text-align: center;
  display: block;

  img {
    width: auto;
    height: 100%;
  }

  span {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 78px;
  }
}

.item-img span img {
  width: auto;
  height: 16px;
}

.item-intro {
  display: block;
  padding: 0 16px 4px;
  width: 185px;
  box-sizing: border-box;
  text-align: left;

  .item-name {
    font-size: 16px;
    color: rgba(0,0,0,.87);
    margin-bottom: 8px;
  }

  .item-brief {
    font-size: 12px;
    color: rgba(0,0,0,.54);
    margin-bottom: 8px;
    line-height: 16px;
    height: 32px;
    overflow: hidden;

    p {
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }

  span {
    color: #ff6000;
  }
}

// .price {
//   position: relative;
//   padding-left: 8px;
//   line-height: 18px;
// }

// .price:before {
//   content: "\A5";
//   position: absolute;
//   left: 0;
//   top: 0;
//   font-size: 16px;
//   text-decoration: none;
// }
</style>
