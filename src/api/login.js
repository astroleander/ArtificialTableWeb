import request from '@/utils/request'
import urls from '@/urls'

export function login(username, password) {
  return request({
    // url: urls.login.uri,
    url: urls.login,
    method: 'post',
    data: {
      tid: username,
      password
    }
  })
}

/**
 *
 * @param token
 * @param id
 */
export function getInfo({ token, id }) {
  return request({
    url: '/user/info/format',
    // url: urls.logout,
    method: 'get',
    params: { token, id }
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 注册
 */
export function regist(User) {
  return request({
    url: '/user/logon',
    method: 'post',
    data: {
      subjects: [User]
    }
  })
}
