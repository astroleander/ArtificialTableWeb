import { getColleges, getByUniversityId,
  postCollege, postColleges,
  putCollege, putColleges,
  deleteCollege, deleteColleges } from '@/api/college'
/**
 * date:2018/12/20
 * author:liqian
 * description：院系信息的get put post delete
 */

/**
 * description:请求院系信息
 * @param params  参数对象（id，name,university_id三个可选参数）
 *                若参数中有university_id，其他参数会被忽略
 * @returns {Promise<any>}
 */
export const requestColleges = (params) => {
  return new Promise((resolve, reject) => {
    getColleges(params).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过university_id查询院系信息
 * @param university_id
 * @returns {Promise<any>}
 */
export const requestByUniversityId = (university_id) => {
  return new Promise((resolve, reject) => {
    getByUniversityId(university_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条院系信息
 * @param collegeItem
 * @returns {Promise<any>}
 */
export const requestPutCollege = (collegeItem) => {
  return new Promise((resolve, reject) => {
    putCollege(collegeItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条院系信息
 * @param collegeArray
 * @returns {Promise<any>}
 */
export const requestPutColleges = (collegeArray) => {
  return new Promise((resolve, reject) => {
    putColleges(collegeArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条院系信息
 * @param collegeItem
 * @returns {Promise<any>}
 */
export const requestPostCollege = (collegeItem) => {
  return new Promise((resolve, reject) => {
    postCollege(collegeItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条院系信息
 * @param collegeArray
 * @returns {Promise<any>}
 */
export const requestPostColleges = (collegeArray) => {
  return new Promise((resolve, reject) => {
    postColleges(collegeArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条院系信息
 * @param collegeId
 * @returns {Promise<any>}
 */
export const requestDelCollege = (collegeId) => {
  return new Promise((resolve, reject) => {
    deleteCollege(collegeId).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条院系信息
 * @param collegeIdArray
 * @returns {Promise<any>}
 */
export const requestDelColleges = (collegeIdArray) => {
  return new Promise((resolve, reject) => {
    deleteColleges(collegeIdArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

