import { getStudents, getByClassInfoId,
  postStudent, postStudents,
  putStudent, putStudents,
  deleteStudent, deleteStudents } from '@/api/student'
/**
 * date:2018/12/20
 * author:liqian
 * description：学生信息的get put post delete
 */

/**
 * description:请求学生信息
 * @param params  参数对象（id，sid,name,classInfo_id,major_id,year 6个可选参数,
 *                若参数里有classInfo_id，其他参数被忽略）
 * @returns {Promise<any>}
 */
const requestStudents = (params) => {
  return new Promise((resolve, reject) => {
    getStudents(params).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过classInfo_id查询学生信息
 * @param classInfo_id
 * @returns {Promise<any>}
 */
const requestByClassInfoId = (classInfo_id) => {
  return new Promise((resolve, reject) => {
    getByClassInfoId(classInfo_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条学生信息
 * @param studentItem
 * @returns {Promise<any>}
 */
const requestPutStudent = (studentItem) => {
  return new Promise((resolve, reject) => {
    putStudent(studentItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条学生信息
 * @param studentArray
 * @returns {Promise<any>}
 */
const requestPutStudents = (studentArray) => {
  return new Promise((resolve, reject) => {
    putStudents(studentArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条学生信息
 * @param studentItem
 * @returns {Promise<any>}
 */
const requestPostStudent = (studentItem) => {
  return new Promise((resolve, reject) => {
    postStudent(studentItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条学生信息
 * @param studentArray
 * @returns {Promise<any>}
 */
const requestPostStudents = (studentArray) => {
  return new Promise((resolve, reject) => {
    postStudents(studentArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条学生信息
 * @param studentId
 * @returns {Promise<any>}
 */
const requestDelStudent = (studentId) => {
  return new Promise((resolve, reject) => {
    deleteStudent(studentId).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条学生信息
 * @param studentIdArray
 * @returns {Promise<any>}
 */
const requestDelStudents = (studentIdArray) => {
  return new Promise((resolve, reject) => {
    deleteStudents(studentIdArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestByClassInfoId, requestStudents,
  requestPutStudent, requestPutStudents,
  requestPostStudent, requestPostStudents,
  requestDelStudent, requestDelStudents
}
