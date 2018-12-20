import request from '@/utils/request'
import urls from '@/urls'

export function login(username, password) {
  return request({
    url: urls.login,
    method: 'post',
    data: {
      tid: username,
      password
    }
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
