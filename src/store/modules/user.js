import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, getId, setId, removeId } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    id: getId(),

    name: '',
    manager: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },

    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_GROUPS: (state, group) => {
      state.group = group
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response
          try {
            setToken(data.subjects.token)
            setId(data.subjects.id)

            commit('SET_TOKEN', data.subjects.token)
            commit('SET_ID', data.subjects.id)
          } catch (err) {
            const message = '\ncode:' + data.code + '\nmessage:' + data.message
            throw new Error(message)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const token = state.token
        const id = state.id
        getInfo({ token, id }).then(response => {
          // set user info
          // commit('SET_GROUPS', data.groups)
          const data = response && response.subjects && response.subjects[0]
          // TODO: refactor user profile info in vuex
          commit('SET_NAME', data.name)
          commit('SET_MANAGER', data.isManager)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ID', '')
          removeToken()
          removeId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 仅前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeId()
        resolve()
      })
    }
  }
}

export default user
