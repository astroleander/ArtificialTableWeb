import { removeManager, setIsManager, getIsManager, getUseManager, setUseManager, getToken, setToken, removeToken, getId, setId, removeId, getUser, setUser, removeUser } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    id: getId(),
    user: getUser(),
    is_manager: getIsManager(),
    use_manager: getUseManager()
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
    SET_MANAGER: (state, is) => {
      state.is_manager = is
      state.use_manager = is
    },
    SET_USE_MANAGER: (state, is) => {
      state.use_manager = is
    }
  },

  actions: {
    // 登录
    Login({ commit }, data) {
      setToken(data.token)
      setId(data.id)
      setUser(data.user)
      setIsManager(data.user.is_manager)
      setUseManager(data.user.is_manager)
      commit('SET_TOKEN', data.token)
      commit('SET_ID', data.id)
      commit('SET_USER', data.user)
      commit('SET_MANAGER', data.user.is_manager)
    },
    // 登出
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ID', '')
      commit('SET_USER', null)
      commit('SET_MANAGER', false)
      removeToken()
      removeId()
      removeUser()
      removeManager()
    },
    
    // 仅前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeId()
        resolve()
      })
    },

    setUseManager({ commit }, newValue) {
      return new Promise(resolve => {
        commit('SET_USE_MANAGER', newValue)
        setUseManager(newValue)
      })
    }
  }
}

export default user
