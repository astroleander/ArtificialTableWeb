import { getTitles, getTitle,
  postTitle, postTitles,
  putTitle, putTitles,
  deleteTitle, deleteTitles } from '@/api/title'
/**
 * date:2018/12/20
 * author:liqian
 * description：小项信息的get put post delete
 */

/**
 * description:请求小项信息
 * @param params  参数对象（id,name,type,titleGroup_id,classInfo_id五个可选参数）
 * @returns {Promise<any>}
 */
export const requestTitles = (params) => {
  return new Promise((resolve, reject) => {
    getTitles(params).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过classInfo_id和titleGroup_id查询小项条目信息
 * @param titleGroup_id
 * @param classInfo_id
 * @returns {Promise<any>}
 */
export const requestTitle = (titleGroup_id, classInfo_id) => {
  return new Promise((resolve, reject) => {
    getTitle(titleGroup_id, classInfo_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条小项信息
 * @param titleItem
 * @returns {Promise<any>}
 */
export const requestPutTitle = (titleItem) => {
  return new Promise((resolve, reject) => {
    putTitle(titleItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条小项信息
 * @param titleArray
 * @returns {Promise<any>}
 */
export const requestPutTitles = (titleArray) => {
  return new Promise((resolve, reject) => {
    putTitles(titleArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条小项信息
 * @param titleItem
 * @returns {Promise<any>}
 */
export const requestPostTitle = (titleItem) => {
  return new Promise((resolve, reject) => {
    postTitle(titleItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条小项信息
 * @param titleArray
 * @returns {Promise<any>}
 */
export const requestPostTitles = (titleArray) => {
  return new Promise((resolve, reject) => {
    postTitles(titleArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条小项信息
 * @param titleId
 * @returns {Promise<any>}
 */
export const requestDelTitle = (titleId) => {
  return new Promise((resolve, reject) => {
    deleteTitle(titleId).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条小项信息
 * @param titleIdArray
 * @returns {Promise<any>}
 */
export const requestDelTitles = (titleIdArray) => {
  return new Promise((resolve, reject) => {
    deleteTitles(titleIdArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

