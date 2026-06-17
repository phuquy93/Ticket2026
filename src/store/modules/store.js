import { getStore } from '@/api/ticket'

const getDefaultState = () => {
  return {
    stores: []
  }
}

const state = getDefaultState()

const mutations = {

  GET_STORES(state, stores) {
    state.stores = stores
  }
}

const actions = {
  getStores({ commit }) {
    return new Promise((resolve, reject) => {
      getStore().then(response => {
        if (response.status == 200) {
          commit('GET_STORES', response.data.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

