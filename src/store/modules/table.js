const table = {
  state: {
    importTable: [],
    settingsTable: {},
    previewTable: {},
    predictTable: {},
    studentInfo: {}
  },
  mutations: {
    SAVE_IMPORT_TABLE: (state, { table }) => {
      state.importTable = table
    },
    SAVE_SETTINGS_TABLE: (state, { table }) => {
      state.settingsTable = table
    },
    SAVE_PREDICT_TABLE: (state, { table }) => {
      state.predictTable = table
    },
    SAVE_STUDENT_INFO: (state, { table }) => {
      state.studentInfo = table
    },
    SAVE_PREVIEW_TABLE: (state, { table }) => {
      state.previewTable = table
    },
    DELETE_IMPORT_TABLE: (state) => {
      state.importTable = []
    },
    DELETE_SETTINGS_TABLE: (state) => {
      state.settingsTable = []
    },
    DELETE_PREVIEW_TABLE: (state) => {
      state.previewTable = []
    }

  },
  actions: {
    saveImportTable({ commit, state }, { table }) {
      return new Promise((resolve, reject) => {
        commit('SAVE_IMPORT_TABLE', { table })
        resolve()
      })
    },
    savePredictTable({ commit, state }, { table }) {
      return new Promise((resolve, reject) => {
        commit('SAVE_PREDICT_TABLE', { table })
        resolve()
      })
    },
    saveStudentInfoTable({ commit, state }, { table }) {
      return new Promise((resolve, reject) => {
        commit('SAVE_STUDENT_INFO', { table })
        resolve()
      })
    },
    saveSettingsTable({ commit, state }, { table }) {
      return new Promise((resolve, reject) => {
        commit('SAVE_SETTINGS_TABLE', { table })
        resolve()
      })
    },
    savePreviewTable({ commit, state }, { table }) {
      return new Promise((resolve, reject) => {
        commit('SAVE_PREVIEW_TABLE', { table })
        resolve()
      })
    },
    deleteImportTable({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('DELETE_IMPORT_TABLE')
        resolve()
      })
    },
    deleteSettingsTable({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('DELETE_SETTINGS_TABLE')
        resolve()
      })
    },
    deletePreviewTable({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('DELETE_PREVIEW_TABLE')
        resolve()
      })
    }
  }
}

export default table
