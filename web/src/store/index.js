import { createStore } from 'vuex'
import { fetchUserInfo } from '@/api/user'
// refer address module
import address from './modules/address.js'
import cart from './modules/cart'

export default createStore({
  state: {
    viewLoading: false,
    transitionName: 'page-left',
    userInfo: null
  },
  // like computed
  getters: {
    isLogin: state => {
      return !!state.userInfo
    }
  },
  // synchronization
  mutations: {
    setViewLoading(state, value) {
      state.viewLoading = value
    },
    setTransitionName(state, value) {
      state.transitionName = value
    },
    setUserInfo(state, value) {
      state.userInfo = value
    }
  },
  // asynchronization
  // global processing
  // Normally, it's not global, will process in every page
  actions: {
    // context <==> store instance <==> this.$store

    // getUserInfo(context) {
    //   fetchUserInfo().then(res => {
    //     if(res.status === 200) {
    //       context.commit('setUserInfo', res.data.user)
    //     }
    //   })
    // }

    // short hand --> parameter assignment
    // Asynchronous execution cause get data later using
    // Use watch
    getUserInfo({ commit }) {
      fetchUserInfo().then((res) => {
        if(res.status === 200) {
          commit('setUserInfo', res.data.user)
        }
      })
    }
  },
  modules: {
    // refer address module
    address,
    cart
  }
})
