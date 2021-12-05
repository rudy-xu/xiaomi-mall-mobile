import Address from '@/api/addressService'

export default {
  // Default in global domain
  // use 'namespace' to different domain
  // namespace name is the word which you define when you refer
  namespaced: true,
  state: {
    list: []
  },
  getters: {
    default(state) {
      return state.list.find(item => {
        return item.is_default
      })
    }
  },
  mutations: {
    setList(state, list) {
      state.list = list
    }
  },
  actions: {
    // use callback to deal async
    getList({ commit }, callback) {
      Address.list().then(res => {
        if(res.status === 200) {
          commit('setList', res.data)
          callback && callback()
        }
      })
    }
  }
}
