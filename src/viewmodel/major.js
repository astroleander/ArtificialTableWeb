import { getMajors, getByCollegeId,
  postMajor, postMajors,
  putMajor, putMajors,
  deleteMajor, deleteMajors } from '@/api/major'
/**
 * date:2018/12/20
 * author:liqian
 * description：专业信息的get put post delete
 */

/**
 * description:请求专业信息
 * @param params  （id，name,college_id三个可选参数）
 * @returns {Promise<any>}
 */
const requestMajors = (params) => {
  return new Promise((resolve, reject) => {
    getMajors(params).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过college_id查询专业信息
 * @param college_id
 * @returns {Promise<any>}
 */
const requestByCollegeId = (college_id) => {
  return new Promise((resolve, reject) => {
    getByCollegeId(college_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条专业信息
 * @param majorItem
 * @returns {Promise<any>}
 */
const requestPutMajor = (majorItem) => {
  return new Promise((resolve, reject) => {
    putMajor(majorItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条专业信息
 * @param majorArray
 * @returns {Promise<any>}
 */
const requestPutMajors = (majorArray) => {
  return new Promise((resolve, reject) => {
    putMajors(majorArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条专业信息
 * @param majorItem
 * @returns {Promise<any>}
 */
const requestPostMajor = (majorItem) => {
  return new Promise((resolve, reject) => {
    postMajor(majorItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条专业信息
 * @param majorArray
 * @returns {Promise<any>}
 */
const requestPostMajors = (majorArray) => {
  return new Promise((resolve, reject) => {
    postMajors(majorArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条专业信息
 * @param majorId
 * @returns {Promise<any>}
 */
const requestDelMajor = (majorId) => {
  return new Promise((resolve, reject) => {
    deleteMajor(majorId).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条专业信息
 * @param majorIdArray
 * @returns {Promise<any>}
 */
const requestDelMajors = (majorIdArray) => {
  return new Promise((resolve, reject) => {
    deleteMajors(majorIdArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestByCollegeId, requestMajors,
  requestPutMajor, requestPutMajors,
  requestPostMajor, requestPostMajors,
  requestDelMajor, requestDelMajors
}

