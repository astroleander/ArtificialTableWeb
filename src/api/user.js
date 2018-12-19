import request from '@/utils/request'
/**
 * date：2018.12.18
 * author:liqian
 * description：用户信息的增删改查
 */

/**
 * 返回时不会返回密码
 * @param params
 */
export function getUsersWithOutPass(params) {
  return request({
    url: '/user/info/format',
    method: 'get',
    params: { params }
  })
}
/**
 * 通过id查询用户信息
 */
export function getUser(id) {
  return request({
    url: '/user/info/manage',
    method: 'get',
    params: {
      id: id
    }
  })
}
/**
 * 查找用户信息
 * params：参数对象
 * （id,tid,name,college_id,email,mobile,is_manager七个可选参数）
 */
export function getUsersWithPass(params) {
  return request({
    url: '/user/info/manage',
    method: 'get',
    params: {
      params
    }
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

