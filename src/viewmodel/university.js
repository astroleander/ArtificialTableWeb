import { getUniversity, getUniversityById,
  postUniversity, postUniversitys,
  putUniversity, putUniversitys,
  deleteUniversity, deleteUniversitys } from '@/api/university'
/**
 * date:2018/12/20
 * author:liqian
 * description：大学信息的get put post delete
 */

/**
 * description:请求大学信息
 * @param params  参数对象（id，name,shortname 三个可选参数）
 * @returns {Promise<any>}
 */
export const requestUniversitys = (params) => {
  return new Promise((resolve, reject) => {
    getUniversity(params).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过id查询大学信息
 * @param university_id
 * @returns {Promise<any>}
 */
export const requestUniversityById = (university_id) => {
  return new Promise((resolve, reject) => {
    getUniversityById(university_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条大学信息
 * @param universityItem
 * @returns {Promise<any>}
 */
export const requestPutUniversity = (universityItem) => {
  return new Promise((resolve, reject) => {
    putUniversity(universityItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条大学信息
 * @param universityArray
 * @returns {Promise<any>}
 */
export const requestPutUniversitys = (universityArray) => {
  return new Promise((resolve, reject) => {
    putUniversitys(universityArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条大学信息
 * @param universityItem
 * @returns {Promise<any>}
 */
export const requestPostUniversity = (universityItem) => {
  return new Promise((resolve, reject) => {
    postUniversity(universityItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条大学信息
 * @param universityArray
 * @returns {Promise<any>}
 */
export const requestPostUniversitys = (universityArray) => {
  return new Promise((resolve, reject) => {
    postUniversitys(universityArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条大学信息
 * @param universityId
 * @returns {Promise<any>}
 */
export const requestDelUniversity = (universityId) => {
  return new Promise((resolve, reject) => {
    deleteUniversity(universityId).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条大学信息
 * @param universityIdArray
 * @returns {Promise<any>}
 */
export const requestDelUniversitys = (universityIdArray) => {
  return new Promise((resolve, reject) => {
    deleteUniversitys(universityIdArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

