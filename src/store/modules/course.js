const course = {
  state: {
    course_list: []
  },
  mutations: {
    ADD_COURSE: (state, { course }) => {
      state.course_list.push(course)
    }
  },
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
