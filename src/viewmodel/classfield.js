import {
  getClassFields, getByClassInfoId, getByStudentID,
  postClassField, postClassFields,
  deleteClassField, deleteClassFields } from '@/api/class_field'
/**
 * date:2018/12/20
 * author:liqian
 * description：教学班组织信息的get post delete
 */

/**
 * description:请求教学班组织信息
 * @param params  参数对象（id，classInfo_id,student_id 三个可选参数）
 * @returns {Promise<any>}
 */
const requestClassFields = (params) => {
  // 返回一个promise对象 在对象中进行 axios请求
  return new Promise((resolve, reject) => {
    getClassFields(params).then(response => {
      const dataset = response && response.subjects
      // resolve完成对动作成功进行解析
      resolve(dataset)
    }).catch(error => {
      // reject会捕获这个动作的异常
      reject(error)
    })
  })
}

/**
 * 请求某一教学班信息
 * @param classInfo_id 教学班id
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
 * 请求某一学生参加的课程
 * @param student_id
 * @returns {Promise<any>}
 */
const requestByStudentId = (student_id) => {
  return new Promise((resolve, reject) => {
    getByStudentID(student_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条教学班组织信息
 * @param classFieldItem
 * @returns {Promise<any>}
 */
const requestPostClassField = (classFieldItem) => {
  return new Promise((resolve, reject) => {
    postClassField(classFieldItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条教学班组织信息
 * @param classFieldArray
 * @returns {Promise<any>}
 */
const requestPostClassFields = (classFieldArray) => {
  return new Promise((resolve, reject) => {
    postClassFields(classFieldArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条教学班组织信息
 * @param classFieldId
 * @returns {Promise<any>}
 */
const requestDelClassField = (classFieldId) => {
  return new Promise((resolve, reject) => {
    deleteClassField(classFieldId).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条教学班组织信息
 * @param classFieldIdArray
 * @returns {Promise<any>}
 */
const requestDelClassFields = (classFieldIdArray) => {
  return new Promise((resolve, reject) => {
    deleteClassFields(classFieldIdArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestByClassInfoId, requestClassFields, requestByStudentId,
  requestPostClassFields, requestPostClassField,
  requestDelClassField, requestDelClassFields
}
/*
// before
 const requestClassField = (user_id) => {
  return new Promise((resolve, reject) => {
    getClassField(user_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}*/
