const table = {
  state: {
    importTable: []
  },
  mutations: {
    SAVE_IMPORT_TABLE: (state, { table }) => {
      state.importTable = table
    },
    DELETE_IMPORT_TABLE: (state) => {
      state.importTable = []
    }
  },
  actions: {
    saveImportTable({ commit, state }, { table }) {
      return new Promise((resolve, reject) => {
        commit('SAVE_IMPORT_TABLE', { table })
        resolve()
      })
    },
    getImportTable({ commit, state }) {
      return new Promise((resolve, reject) => {
        resolve(state.importTable)
      })
    },
    deleteImportTable({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('DELETE_IMPORT_TABLE')
        resolve()
      })
    }
  }
}

export default table
