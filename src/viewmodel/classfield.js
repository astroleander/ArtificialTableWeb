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
export const requestClassFields = (params) => {
  return new Promise((resolve, reject) => {
    getClassFields(params).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求某一教学班信息
 * @param classInfo_id 教学班id
 * @returns {Promise<any>}
 */
export const requestByClassInfoId = (classInfo_id) => {
  return new Promise((resolve, reject) => {
    getByClassInfoId(classInfo_id).then(response => {
      resolve(response)
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
export const requestByStudentId = (student_id) => {
  return new Promise((resolve, reject) => {
    getByStudentID(student_id).then(response => {
      resolve(response)
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
export const requestPostClassField = (classFieldItem) => {
  return new Promise((resolve, reject) => {
    postClassField(classFieldItem).then(response => {
      resolve(response)
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
export const requestPostClassFields = (classFieldArray) => {
  return new Promise((resolve, reject) => {
    postClassFields(classFieldArray).then(response => {
      resolve(response)
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
export const requestDelClassField = (classFieldId) => {
  return new Promise((resolve, reject) => {
    deleteClassField(classFieldId).then(response => {
      resolve(response)
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
export const requestDelClassFields = (classFieldIdArray) => {
  return new Promise((resolve, reject) => {
    deleteClassFields(classFieldIdArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
/*
// before
 export const requestClassField = (user_id) => {
  return new Promise((resolve, reject) => {
    getClassField(user_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}*/
