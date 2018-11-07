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

export function getInfo(token) {
  return request({
    url: '/user/info/format',
    // url: urls.logout,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
