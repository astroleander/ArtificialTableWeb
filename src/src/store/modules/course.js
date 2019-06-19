const course = {
  state: {
    course_list: []
  },
  // 通过commit调用函数 同步事务
  mutations: {
    ADD_COURSE: (state, { course }) => {
      state.course_list.push(course)
    }
  },
  // 异步处理 Action 提交commit的是 mutation
  // Action 通过 store.dispatch 方法触发：
  actions: {
    addCourse({ commit, state }, { course }) {
      return new Promise((resolve, reject) => {
        if (state.course_list.find(element => element.id === course.id)) {
          console.log('try to add an exist course, skip')
          resolve()
        } else {
          // console.log('add ${course} course to router')
          // console.log(state.course_list)
          commit('ADD_COURSE', { course })
          resolve()
        }
      })
    },
    getCourse({ commit, state }, id) {
      return new Promise((resolve, reject) => {
        resolve(state.course_list.find(element => {
          return element.id === id
        }))
      })
    }
  }
}

export default course
