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
const requestTitleGroups = (params) => {
  return new Promise((resolve, reject) => {
    getTitleGroup(params).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
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
const requestByLessonId = (lesson_id) => {
  return new Promise((resolve, reject) => {
    getTitleGroups(lesson_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
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
const requestPutTitleGroup = (titleGroupItem) => {
  return new Promise((resolve, reject) => {
    putTitleGroup(titleGroupItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
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
const requestPutTitleGroups = (titleGroupArray) => {
  return new Promise((resolve, reject) => {
    putTitleGroups(titleGroupArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
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
const requestPostTitleGroup = (titleGroupItem) => {
  return new Promise((resolve, reject) => {
    postTitleGroup(titleGroupItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
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
const requestPostTitleGroups = (titleGroupArray) => {
  return new Promise((resolve, reject) => {
    postTitleGroups(titleGroupArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
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
const requestDelTitleGroup = (titleGroupId) => {
  return new Promise((resolve, reject) => {
    deleteTitleGroup(titleGroupId).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
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
const requestDelTitleGroups = (titleGroupIdArray) => {
  return new Promise((resolve, reject) => {
    deleteTitleGroups(titleGroupIdArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestTitleGroups, requestByLessonId,
  requestPutTitleGroup, requestPutTitleGroups,
  requestPostTitleGroup, requestPostTitleGroups,
  requestDelTitleGroup, requestDelTitleGroups
}
