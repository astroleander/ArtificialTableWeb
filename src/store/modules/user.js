import { getToken, setToken, removeToken, getId, setId, removeId, getUser, setUser, removeUser } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    id: getId(),
    user: getUser()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_GROUPS: (state, group) => {
      state.group = group
    }
  },

  actions: {
    // 登录
    Login({ commit }, data) {
      setToken(data.token)
      setId(data.id)
      setUser(data.user)
      commit('SET_TOKEN', data.token)
      commit('SET_ID', data.id)
      commit('SET_USER', data.user)
    },
    // 登出
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ID', '')
      commit('SET_USER', null)
      removeToken()
      removeId()
      removeUser()
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
