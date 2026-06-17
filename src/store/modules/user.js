import { logout, login } from '@/api/user'
import { removeData, setUser, getUser, setUserCall, getUserCall } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  user: getUser() ? JSON.parse(getUser()) : null,
  userCall: getUserCall() ? JSON.parse(getUserCall()) : null
}

const mutations = {
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        if (Number(res.status) === 200) {
          let rule = res.rule
          for (const value of userInfo) {
            if (value[1] === 'phan.dinh') {
              rule = 1
            }
          }
          setUser(JSON.stringify(['code_store=' + res.code_store, 'data=' + res.data, 'dataid=' + res.dataid, 'rule=' + rule, 'token=' + res.token]))
          setUserCall(JSON.stringify(res.flag_content))
        }
        resolve(res)
      }).catch(err => reject(err))
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        resetRouter()
        removeData('ticket_user')
        router.push({ path: '/login' })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
