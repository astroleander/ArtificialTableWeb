const Info = {
  state: {
    college_id: null,
    year: null
  },
  // 通过commit调用函数 同步事务
  mutations: {
    SET_COLLEGE_ID_TEACHER: (state, { college_id }) => {
      state.college_id = college_id
    },
    SET_YEAR: (state, { year }) => {
      state.year = year
    }
  },
  // 异步处理 Action 提交commit的是 mutation
  // Action 通过 store.dispatch 方法触发：
  actions: {
    setCollegeId({ commit, state }, { college_id }) {
      return new Promise((resolve, reject) => {
        commit('SET_COLLEGE_ID_TEACHER', { college_id })
        resolve()
      })
    },
    setYear({ commit, state }, { year }) {
      return new Promise((resolve, reject) => {
        commit('SET_YEAR', { year })
        resolve()
      })
    }
  }
}

export default Info
