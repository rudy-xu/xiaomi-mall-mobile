<template>
  <div class="app-shell">
    <mi-title title="分类"/>
    <!-- <div v-if="loading">
      <span>Loading . . .</span>
    </div> -->
    <!-- <div v-else class="app-view-wrapper"> -->
    <div class="app-view-wrapper">
      <div class="container app-view app-view-with-header app-view-with-footer">
        <div class="list-navbar">
          <ul>
            <li
              v-for="(list,index) in categoryList"
              :key="list.category_id"
              :class="index == curIndex ? 'active' : ''"
              @click="handleChangeIndex(index)"
            >
              <a>
                <span>{{list.category_name}}</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="list-wrap" @touchstart="handleWrapScroll">
          <div
            v-for="(list, index) in categoryList"
            :key="list.category_id"
            :ref="'category'+index"
            class="list-item"
          >
            <div class="component-list-main">
              <div class="cells_auto_fill" index ="0">
                <a class="exposure items">
                  <img :src="list.category_img" lazy="loaded">
                </a>
              </div>
              <template
                v-for="item in list.category_list"
                :key="item.id"
              >
                <div
                  class="category_title"
                >
                  <span>{{item.category_title}}</span>
                </div>
                <category-group :products="item.category_group" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-footer/>
  </div>
</template>

<script>
import { getCategory } from '@/api/category'
import CategoryGroup from '@/components/CategoryGroup.vue'
// import MiSearch from '@/components/MiTitle.vue'
// import bus from '@/util/bus.js'
// import PageFooter from '@/components/PageFooter.vue'

export default {
  components: {
    CategoryGroup
    // MiSearch
    // PageFooter
  },
  data() {
    return {
      categoryList: null,
      curIndex: 0,
      // loading: true,
      offsetTop: [],
      scrollTimer: null
    }
  },
  beforeRouteEnter(to, from, next) {
    // Judge whether the router is refreshed or switched
    if(from.name) {
      // refresh
      getCategory().then(res => {
        if(res.status === 200) {
          next(vm => vm.setNavList(res.data.lists))
        }
      })
    } else {
      // switch
      next(vm => vm.getCategoryList())
    }
  },
  // created() {
  //   this.getCategoryList()
  // },
  destoryed() {
    this.$NProgress.remove()
  },
  // unmounted() {
  //   this.$NProgress.remove()
  // },
  methods: {
    getCategoryList() {
      getCategory().then(res => {
        if(res.status === 200) {
          this.setNavList(res.data.lists)
        }
      })
    },
    setNavList(res) {
      this.$NProgress.done()
      this.categoryList = res
      this.$store.commit('setViewLoading', false)
      // this.loading = false
      /**
       * vue2.x
       */
      // bus.$emit('loading', false)

      /**
       * vue3.x
       */
      // local invoke
      // bus.emit('loading', false)

      // global invoke
      // this.$bus.emit('loading', false)

      // Handle scroll
      this.$nextTick(() => {
        this.categoryList.forEach((item, index) => {
          this.offsetTop.push(this.$refs['category' + index].offsetTop)
        })
      })
    },
    handleChangeIndex(index) {
      this.curIndex = index
      const listWrapDom = document.querySelector('.list-wrap')
      listWrapDom.removeEventListener('scroll', this.scrollHandler)
      listWrapDom.scrollTo(0, this.offsetTop[index])
    },
    handleWrapScroll() {
      document.querySelector('.list-wrap').addEventListener('scroll', this.scrollHandler)
    },
    scrollHandler() {
      clearTimeout(this.scrollTimer)
      this.scrollTimer = null
      this.scrollTimer = setTimeout(() => {
        const scrollTop = document.querySelector('.list-wrap').scrollTop
        const len = this.offsetTop.length
        for(let index = 0; index < len; ++index) {
          if(scrollTop >= this.offsetTop[index] && scrollTop < this.offsetTop[index + 1]) {
            this.curIndex = index
            break
          }
        }
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-right: auto;
  margin-left: auto;
  flex-basis: 100%;

  .list-navbar {
    position: fixed;
    top: 40px;
    bottom: 40px;
    left: 0;
    width: 80px;
    border-right: 1px solid #efefef;
    overflow: hidden;

    ul {
      z-index: 90;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      /* hide scroll bar */
      right: -6px;
      padding: 8px 6px 8px 0px;
      background: #fefefe;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      li {
        font-size: 18px;
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        text-align: center;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        transition: transform 0.1s linear;
        transform-origin: center center;
        transform: scale(0.76);

        span {
          display: inline-block;
        }
      }

      li.active {
        color: #fb7d34;
        transform: scale(1);
      }
    }
  }

  .list-wrap {
    position: absolute;
    left: 80px;
    right: 0;
    top: 59px;
    bottom: 50px;
    padding: 2px 16px;
    overflow: auto;

    .component-list-main {
      .cells_auto_fill {
        .items {
          height: auto!important;
          display: block;

          img {
            width: 260px;
            height: 104px;
            background-color: #f2f2f2;
          }
        }
      }

      .category_title {
        background: #fff;
        font-size: 16px;
        text-align: center;
        font-weight: 400;
        margin-top: 10px;
        height: 66px;
        line-height: 66px;
        overflow: hidden;

        span {
          position: relative;
        }

        span::after, span::before{
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 30px;
          border-top: 1px solid #e0e0e0;
          transform: translate3d(-150%,-50%,0);
        }

        span::after {
          left: auto;
          right: 0;
          transform: translate3d(150%,-50%,0);
        }
      }
    }
  }
}
</style>
