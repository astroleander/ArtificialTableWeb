import request from '@/utils/request'
/**
 * @description 用户信息的增删改查
*/

/**
 * @description 查找用户信息，返回时不会返回密码
 * @param {headers} token
 * @param params.id
 * @param params.tid
 * @param params.name
 * @param params.college_id
 * @param params.email
 * @param params.mobile
 */
export function getUserInfoWithOutPwd(params, token) {
  return request({
    url: '/user/info/display',
    method: 'get',
    // params = params : params, 同名参数可以简写
    params,
    headers: { token }
  })
}
// 方法之间要空行 哪怕有注释

/**
 * @description 通过id查询用户信息
 */
export function getUserInfo(id) {
  return request({
    url: '/user/info/manage',
    method: 'get',
    params: {
      id: id
    }
  })
}

/**
 * 查找用户信息，返回时带有密码
 * @param params 参数对象（id,tid,name,college_id,email,mobile,is_manager七个可选参数）
 */
export function getUserInfoWithPwd(params) {
  return request({
    url: '/user/info/manage',
    method: 'get',
    params
  })
}
/**
 * 添加一条用户信息
 */
export function postUser(UserItem) {
  return request({
    url: '/user/info/manage',
    method: 'post',
    data: {
      subjects: [UserItem]
    }
  })
}
/**
 * 添加多条用户信息
 */
export function postUsers(UserArray) {
  return request({
    url: '/user/info/manage',
    method: 'post',
    data: {
      subjects: UserArray
    }
  })
}
/**
 * 修改一条用户信息
 */
export function putUser(UserItem) {
  return request({
    url: '/user/info/manage',
    method: 'put',
    data: {
      subjects: [UserItem]
    }
  })
}
/**
 * 修改多条用户信息
 */
export function putUsers(UserArray) {
  return request({
    url: '/user/info/manage',
    method: 'put',
    data: {
      subjects: UserArray
    }
  })
}
/**
 * 删除一条用户信息
 */
export function deleteUser(User_id) {
  return request({
    url: '/user/info/manage',
    method: 'delete',
    data: {
      subjects: [
        { id: User_id }
      ]
    }
  })
}
/**
 * 批量删除用户信息
 */
export function deleteUsers(UserIdArray) {
  return request({
    url: '/user/info/manage',
    method: 'delete',
    data: {
      subjects: UserIdArray
    }
  })
}
/**
 * 修改个人信息
 */
export function changeOwnInfo(UserItem) {
  return request({
    url: '/user/info/format',
    method: 'put',
    data: {
      subjects: [UserItem]
    }
  })
}
/**
 * 请求个人信息
 */
export function OwnInfo(user_id) {
  return request({
    url: '/user/info/format',
    method: 'get',
    params: {
      id: user_id }
  })
}

