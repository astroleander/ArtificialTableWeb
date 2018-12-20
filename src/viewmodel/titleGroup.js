import { getTitleGroup, getTitleGroups,
  postTitleGroup, postTitleGroups,
  putTitleGroup, putTitleGroups,
  deleteTitleGroup, deleteTitleGroups } from '@/api/titleGroup'
/**
 * date:2018/12/20
 * author:liqian
 * description：大项信息的get put post delete
 */

/**
 * description:请求大项信息
 * @param params  参数对象（id,name,lesson_id,weight四个可选参数）
 * @returns {Promise<any>}
 */
export const requestTitleGroups = (params) => {
  return new Promise((resolve, reject) => {
    getTitleGroup(params).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过lesson_id查询大项信息
 * @param lesson_id
 * @returns {Promise<any>}
 */
export const requestByLessonId = (lesson_id) => {
  return new Promise((resolve, reject) => {
    getTitleGroups(lesson_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条大项信息
 * @param titleGroupItem
 * @returns {Promise<any>}
 */
export const requestPutTitleGroup = (titleGroupItem) => {
  return new Promise((resolve, reject) => {
    putTitleGroup(titleGroupItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条大项信息
 * @param titleGroupArray
 * @returns {Promise<any>}
 */
export const requestPutTitleGroups = (titleGroupArray) => {
  return new Promise((resolve, reject) => {
    putTitleGroups(titleGroupArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条大项信息
 * @param titleGroupItem
 * @returns {Promise<any>}
 */
export const requestPostTitleGroup = (titleGroupItem) => {
  return new Promise((resolve, reject) => {
    postTitleGroup(titleGroupItem).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条大项信息
 * @param titleGroupArray
 * @returns {Promise<any>}
 */
export const requestPostTitleGroups = (titleGroupArray) => {
  return new Promise((resolve, reject) => {
    postTitleGroups(titleGroupArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条大项信息
 * @param titleGroupId
 * @returns {Promise<any>}
 */
export const requestDelTitleGroup = (titleGroupId) => {
  return new Promise((resolve, reject) => {
    deleteTitleGroup(titleGroupId).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条大项信息
 * @param titleGroupIdArray
 * @returns {Promise<any>}
 */
export const requestDelTitleGroups = (titleGroupIdArray) => {
  return new Promise((resolve, reject) => {
    deleteTitleGroups(titleGroupIdArray).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

