import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    collage: '',
    year: '',
    class_field: '',
    groups: -1,
    status: 0,

    position: '',
    avatar: '',
    email: '',
    alternate_email: '',
    mobile: '',
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
    SET_COLLAGE: (state, collage) => {
      state.collage = collage
    },
    SET_YEAR: (state, year) => {
      state.year = year
    },
    SET_CLASS: (state, class_field) => {
      state.class_field = class_field
    },
    SET_GROUPS: (state, group) => {
      state.group = group
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_POSITION: (state, position) => {
      state.position = position
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_ALTER_EMAIL: (state, alter_email) => {
      state.alter_email = alter_email
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    }

  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          window.console.log(response)
          const data = response
          setToken(data.subjects.token)
          
          commit('SET_TOKEN', data.subjects.token)
          commit('SET_ID', data.subjects.id)
          
          resolve()
        }).catch(error => {
          window.console.log('login err: ' + error)
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
          console.log(data)
          // set user profile info
          // TODO: refactor user profile info in vuex
          commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
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
          commit('SET_GROUP', -1)
          removeToken()
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
        resolve()
      })
    }
  }
}

export default user
