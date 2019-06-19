/*  用于保存与后端交互的函数   */

import request from '@/utils/request'
import urls from '@/urls'
/**
 * 登录函数，参数为用户名，密码
 * 将用户名 密码以post形式发送到后端
 */
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
