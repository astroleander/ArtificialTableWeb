import { getUsersWithOutPass, getUser, getUsersWithPass,
  postUser, postUsers,
  putUser, putUsers,
  deleteUser, deleteUsers } from '@/api/user'
/**
 * date:2018/12/20
 * author:liqian
 * description：用户信息的get put post delete
 */

/**
 * description:请求用户信息,返回时不会返回密码
 * @param params  （id,tid,name,college_id,email,mobile,is_manager七个可选参数）
 * @returns {Promise<any>}
 */
const requestUsersWithoutPass = (params) => {
  return new Promise((resolve, reject) => {
    getUsersWithOutPass(params).then(response => {
      resolve(response)
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
const requestUsersWithPass = (params) => {
  return new Promise((resolve, reject) => {
    getUsersWithPass(params).then(response => {
      resolve(response)
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
const requestUserById = (id) => {
  return new Promise((resolve, reject) => {
    getUser(id).then(response => {
      resolve(response)
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
      resolve(response)
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
      resolve(response)
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
      resolve(response)
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
      resolve(response)
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
      resolve(response)
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
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestUserById, requestUsersWithoutPass, requestUsersWithPass,
  requestPutUser, requestPutUsers,
  requestPostUser, requestPostUsers,
  requestDelUser, requestDelUsers
}
