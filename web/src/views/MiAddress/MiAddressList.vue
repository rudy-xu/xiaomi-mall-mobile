<template>
  <div class="app-shell app-shell-bottom-navigation">
    <div class="app-view-wrapper">

      <MiTitle title="收货地址" :show-search-icon="false"/>

      <div class="container app-view app-view-with-header">
        <div class="page-wrap">
          <div class="address-manager">
            <div class="address-manager-list">
              <div
                v-for="(list,index) in lists"
                :key="list.address_id"
                class="ui-card"
              >
                <ul class="ui-card-item ui-list">
                  <li class="ui-list-item identity">
                    <a @click="remove(list, index)">删除</a>
                    <span class="consignee">{{list.consignee}}</span>
                    <span>{{list.tel}}</span>
                    <em v-if="list.is_default"> [默认]</em>
                  </li>

                  <router-link
                    :to="{name: 'addressEdit', query: {address_id: list.address_id}}"
                    tag="li"
                    class="ui-list-item edit">
                    <p>{{list.province}} {{list.city}} {{list.district}} {{list.area}}</p>
                    <p>{{list.address}}</p>
                  </router-link>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="add">
          <router-link
            :to="{name: 'addressEdit'}"
            class="btn ui-button ui-button-active"
          >
            <span>新建地址</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Normally use custom component -->
    <!-- <MiDialog
      v-model:value="showDialog"
      message="确定删除当前地址?"
      show-cancel-button
      @confirm="confirmRemove">
    </MiDialog> -->
  </div>
</template>

<script>
// import { addressList, addressDelete } from '@/api/address.js'
import MiTitle from '@/components/MiTitle.vue'
import Dialog from '@/components/dialog'
import Address from '@/api/addressService'

export default {
  components: {
    MiTitle
    // MiDialog
  },
  data() {
    return {
      lists: [],
      showDialog: false,
      removeCash: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    if(from.name) {
      // addressList().then(res => {
      Address.list().then(res => {
        if(res.status === 200) {
          next(vm => vm.setLists(res))
        }
      })
    } else {
      next(vm => vm.getLists())
    }
  },
  methods: {
    getLists() {
      Address.list().then(res => {
        if(res.status === 200) {
          this.setLists(res)
        }
      })
    },
    setLists(res) {
      this.$store.commit('setViewLoading', false)
      this.$NProgress.done()
      this.lists = res.data
    },
    remove(list, index) {
      // this.removeCash = {
      //   id: list.address_id,
      //   index
      // }
      // this.showDialog = true

      // invoke function component
      Dialog.confirm({
        message: '确定删除当前地址?'
      }).then((action) => {
        console.log('dialog')
        console.log(action)
        Address.remove(list.address_id).then(res => {
          if(res.status === 200) {
            this.lists.splice(index, 1)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    }
    // confirmRemove() {
    //   let { id, index } = this.removeCash
    //   addressDelete({
    //     address_id: id
    //   }).then(res => {
    //     if(res.status === 200) {
    //       this.lists.splice(index, 1)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.address-manager {
  position: relative;
  padding-bottom: 50px;

  .ui-card {
    border: 1px solid #f6f6f6;
    overflow: hidden;
    margin: 10px;
    border-radius: 3px;
    background: #fff;
    text-align: left;

    .ui-list {
      padding-top: 0;
      padding-bottom: 0;
      position: relative;

      .ui-list-item {
        border-bottom: 1px solid #f6f6f6;
        display: block;
        font-size: 14px;
        overflow: hidden;
        background: #fff;
        padding: 10px 15px;

        &:last-child {
          border: 0;
        }
      }

      .edit {
        position: relative;
        padding-right: 25px;
        font-size: 12px;

        &:after {
          content: " ";
          position: absolute;
          width: 7px;
          height: 7px;
          right: 7px;
          top: 50%;
          margin-top: 4px;
          border-right: 1px solid #999;
          border-bottom: 1px solid #999;
          transform: rotate(-45deg);
        }
      }
    }

    .ui-card-item {
      padding: 10px;

      p {
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .identity {
    a {
      float: right;
      color: #999;
    }

    em {
    color: #f60;
    font-size: 10px;
    font-style: normal;
    margin-left: 3px;
  }
  }

  .consignee {
    margin-right: 30px;
    color: #f60;
  }
}

.add {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1;

  span {
    font-size: 15px;
    color: #fff;
  }
}
</style>
