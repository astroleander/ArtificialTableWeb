import { getClassInfos, getByTeacherId,
  postClassInfo, postClassInfos,
  putClassInfo, putClassInfos,
  deleteClassInfo, deleteClassInfos, getAllClassInfo } from '@/api/class_info'

  /**
 * date: 2018/12/20
 * @author liqian
 * @description 班级信息的get put post delete
 */

const requestAll = (token) => {
  return new Promise((resolve, reject) => {
    getAllClassInfo(token).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * description:请求班级信息
 * @param params.id
 * @param params.name
 * @param params.cid
 * @param params.teacher_id
 * @param params.semester
 * @param params.week
 * @param params.room
 * @returns {Promise<any>}
 */
const requestClassInfos = (params) => {
  return new Promise((resolve, reject) => {
    getClassInfos(params).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 查找某一教师所执教的所有班级
 * @param teacher_id 教师的id
 * @returns {Promise<any>}
 */
const requestByTeacherId = (teacher_id) => {
  return new Promise((resolve, reject) => {
    getByTeacherId(teacher_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条班级信息
 * @param classInfoItem
 * @returns {Promise<any>}
 */
const requestPutClassInfo = (classInfoItem) => {
  return new Promise((resolve, reject) => {
    putClassInfo(classInfoItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条班级信息
 * @param classInfoArray
 * @returns {Promise<any>}
 */
const requestPutClassInfos = (classInfoArray) => {
  return new Promise((resolve, reject) => {
    putClassInfos(classInfoArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条班级信息
 * @param classInfoItem
 * @returns {Promise<any>}
 */
const requestPostClassInfo = (classInfoItem) => {
  return new Promise((resolve, reject) => {
    postClassInfo(classInfoItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条班级信息
 * @param classInfoArray
 * @returns {Promise<any>}
 */
const requestPostClassInfos = (classInfoArray) => {
  return new Promise((resolve, reject) => {
    postClassInfos(classInfoArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条班级信息
 * @param classInfoId
 * @returns {Promise<any>}
 */
const requestDelClassInfo = (classInfoId) => {
  return new Promise((resolve, reject) => {
    deleteClassInfo(classInfoId).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条班级信息
 * @param classInfoIdArray
 * @returns {Promise<any>}
 */
const requestDelClassInfos = (classInfoIdArray) => {
  return new Promise((resolve, reject) => {
    deleteClassInfos(classInfoIdArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestByTeacherId, requestClassInfos,
  requestPutClassInfo, requestPutClassInfos,
  requestPostClassInfo, requestPostClassInfos,
  requestDelClassInfo, requestDelClassInfos,
  requestAll
}
