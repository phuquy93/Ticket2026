import { getDashboard, getDashboard2, getDashboardqc, getDashboardcall, getDashboardinfo, getDashboardviolate, getDashboardonline, getDashboardsupplies, getDashboardurgent } from '@/api/ticket'

const getDefaultState = () => {
  return {
    data: null
  }
}

const state = getDefaultState()

const mutations = {

  GET_DASHBOARD(state, data) {
    state.data = data
  }
}

const actions = {
  getDashboard({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboard().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDashboard2({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboard2().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }, getDashboardqc({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboardqc().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }, getDashboardcall({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboardcall().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }, getDashboardinfo({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboardinfo().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }, getDashboardviolate({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboardviolate().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }, getDashboardonline({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboardonline().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }, getDashboardsupplies({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboardsupplies().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }, getDashboardurgent({ commit }) {
    return new Promise((resolve, reject) => {
      getDashboardurgent().then(response => {
        if (response.status === 200) {
          commit('GET_DASHBOARD', response.data)
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

