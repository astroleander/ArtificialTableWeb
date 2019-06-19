import {
  getUserInfoWithOutPwd, getUserInfo, getUserInfoWithPwd,
  postUser, postUsers,
  putUser, putUsers,
  deleteUser, deleteUsers, changeOwnInfo, OwnInfo } from '@/api/user'
/**
 * date:2018/12/20
 * @author: liqian
 * @description：user infos viewmodel
 */

/**
 * description:请求用户信息, 返回时不会返回密码
 * @param params @see /api/user
 * @param token 唯一需要手动注入 token 的函数，其实可以通过修改 login 或者 store 里面的逻辑来避免它
 * @returns {Promise<any>}
 */
const requestUsersWithoutPwd = (params, token) => {
  return new Promise((resolve, reject) => {
    getUserInfoWithOutPwd(params, token).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * description:请求用户信息,返回时返回密码
 * @param params  （id,tid,name,college_id,email,mobile,is_manager七个可选参数）
 * @returns {Promise<any>}
 */
const requestUserInfoWithPwd = (params) => {
  return new Promise((resolve, reject) => {
    getUserInfoWithPwd(params).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过id查询用户信息
 * @param id
 * @returns {Promise<any>}
 */
const requestUserInfoById = (id) => {
  return new Promise((resolve, reject) => {
    getUserInfo(id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条用户信息
 * @param userItem
 * @returns {Promise<any>}
 */
const requestPutUser = (userItem) => {
  return new Promise((resolve, reject) => {
    putUser(userItem).then(response => {
      const dataset = response
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条用户信息
 * @param userArray
 * @returns {Promise<any>}
 */
const requestPutUsers = (userArray) => {
  return new Promise((resolve, reject) => {
    putUsers(userArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条用户信息
 * @param userItem
 * @returns {Promise<any>}
 */
const requestPostUser = (userItem) => {
  return new Promise((resolve, reject) => {
    postUser(userItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条用户信息
 * @param userArray
 * @returns {Promise<any>}
 */
const requestPostUsers = (userArray) => {
  return new Promise((resolve, reject) => {
    postUsers(userArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条用户信息
 * @param userId
 * @returns {Promise<any>}
 */
const requestDelUser = (userId) => {
  return new Promise((resolve, reject) => {
    deleteUser(userId).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条用户信息
 * @param userIdArray
 * @returns {Promise<any>}
 */
const requestDelUsers = (userIdArray) => {
  return new Promise((resolve, reject) => {
    deleteUsers(userIdArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 请求修改一条个人信息
 * @param userItem
 * @returns {Promise<any>}
 */
const requestChangeOwnInfo = (userItem) => {
  return new Promise((resolve, reject) => {
    changeOwnInfo(userItem).then(response => {
      const dataset = response
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 请求获取一条个人信息
 * @param userItem
 * @returns {Promise<any>}
 */
const requestOwnInfo = (user_id) => {
  return new Promise((resolve, reject) => {
    OwnInfo(user_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestUserInfoById,
  requestUsersWithoutPwd,
  requestUserInfoWithPwd,
  requestPutUser,
  requestPutUsers,
  requestPostUser,
  requestPostUsers,
  requestDelUser,
  requestDelUsers,
  requestChangeOwnInfo,
  requestOwnInfo
}
