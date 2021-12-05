import { carCount } from '@/api/cart'

export default {
  namespaced: true,
  state: {
    count: 0
  },
  mutations: {
    setCount(state, count) {
      state.count = count
    },
    addCount(state, number) {
      state.count += number
    }
  },
  actions: {
    getCount({ commit }) {
      carCount().then(res => {
        if(res.status === 200) {
          commit('setCount', res.data)
        }
      })
    }
  }
}
