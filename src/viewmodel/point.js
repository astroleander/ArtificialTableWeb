import { getPoints, getByClassInfoId, getByStudentId, getByTitleId,
  postPoint, postPoints,
  putPoint, putPoints,
  deletePoint, deletePoints, importPoints, getTitlePoints, getCompareData, outPut, getWeightData, getPrediction } from '@/api/point'
/**
 * @date 2018/12/20
 * @author liqian
 * @description 分数条目信息的get put post delete
 */

/**
 * @description 用于批量导入页面,数据格式较为复杂,会覆盖已有的 point, 别瞎用
 * @params
 *   |- @array lesson_id
 *   |- @array title_list
 *   |- @array sid_list
 *   |- @array point_list
 * @return not from subjects
 */
const requestImportPoints = (subjects) => {
  return new Promise((resolve, reject) => {
    importPoints(subjects).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * description:请求分数条目信息
 * @param params  （classInfo_id必需，id,student_id,title_id,date,note五个可选参数）
 * @returns {Promise<any>}
 */
const requestPoints = (params) => {
  return new Promise((resolve, reject) => {
    getPoints(params).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过classInfo_id查询分数条目信息
 * @param classInfo_id
 * @returns {Promise<any>}
 */
const requestByClassInfoId = (classInfo_id) => {
  return new Promise((resolve, reject) => {
    getByClassInfoId(classInfo_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过classInfo_id和student_id查询分数条目信息
 * @param classInfo_id
 * @param student_id
 * @returns {Promise<any>}
 */
const requestByStudentId = (classInfo_id, student_id) => {
  return new Promise((resolve, reject) => {
    getByStudentId(classInfo_id, student_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过classInfo_id和title_id查询分数条目信息
 * @param classInfo_id
 * @param title_id
 * @returns {Promise<any>}
 */
const requestByTitleId = (classInfo_id, title_id) => {
  return new Promise((resolve, reject) => {
    getByTitleId(classInfo_id, title_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条分数条目信息
 * @param pointItem
 * @returns {Promise<any>}
 */
const requestPutPoint = (pointItem) => {
  return new Promise((resolve, reject) => {
    putPoint(pointItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条分数条目信息
 * @param pointArray
 * @returns {Promise<any>}
 */
const requestPutPoints = (pointArray) => {
  return new Promise((resolve, reject) => {
    putPoints(pointArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条分数条目信息
 * @param pointItem
 * @returns {Promise<any>}
 */
const requestPostPoint = (pointItem) => {
  return new Promise((resolve, reject) => {
    postPoint(pointItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条分数条目信息
 * @param pointArray
 * @returns {Promise<any>}
 */
const requestPostPoints = (pointArray) => {
  return new Promise((resolve, reject) => {
    postPoints(pointArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条分数条目信息
 * @param pointId
 * @returns {Promise<any>}
 */
const requestDelPoint = (pointId) => {
  return new Promise((resolve, reject) => {
    deletePoint(pointId).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条分数条目信息
 * @param pointIdArray
 * @returns {Promise<any>}
 */
const requestDelPoints = (pointIdArray) => {
  return new Promise((resolve, reject) => {
    deletePoints(pointIdArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求成绩分析各个小项成绩分布
 * @param pointIdArray
 * @returns {Promise<any>}
 */
const requestTitlePoints = (classInfo_id, title_id) => {
  return new Promise((resolve, reject) => {
    getTitlePoints(classInfo_id, title_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 用于班级成绩比较
 * @param pointIdArray
 * @returns {Promise<any>}
 */
const requestCompareData = (params) => {
  return new Promise((resolve, reject) => {
    getCompareData(params).then(response => {
      const dataset = response && response.data
      console.log(dataset)
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 用于班级成绩导出
 * @param classInfo_id
 * @returns {Promise<any>}
 */
const requestOutPut = (classInfo_id) => {
  return new Promise((resolve, reject) => {
    outPut(classInfo_id).then(response => {
      const dataset = response && response.subjects
      // console.log(dataset)
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 用于成绩分析页面数据更新查找
 * @param classInfo_id
 * @returns {Promise<any>}
 */

const requestWeightData = (classInfo_id) => {
  return new Promise((resolve, reject) => {
    getWeightData(classInfo_id).then(response => {
      const dataset = response && response.subjects
      // console.log(dataset)
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 用于成绩权重页面更改权重的成绩分布查看
 * @param classInfo_id, currentDataSet
 * @returns {Promise<any>}
 */
/*
 const requestWeightChange = (classInfo_id) => {
  return new Promise((resolve, reject) => {
    getWeightChange(classInfo_id).then(response => {
      const dataset = response && response.data
      // console.log(dataset)
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}*/

const requestPrediction = (classInfo_id, student_id) => {
  return new Promise((resolve, reject) => {
    getPrediction(classInfo_id, student_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
      console.log('cccccccccccccccccc')
      //      console.log(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestByStudentId, requestByClassInfoId, requestByTitleId, requestPoints,
  requestPutPoint, requestPutPoints,
  requestPostPoint, requestPostPoints,
  requestDelPoint, requestDelPoints,
  requestImportPoints, requestTitlePoints, requestCompareData, requestOutPut, requestWeightData,  requestPrediction// requestWeightChange
}
