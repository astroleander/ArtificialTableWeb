import request from '@/utils/request'
/**
 * date：2018.12.18
 * author:liqian
 * description：大项条目信息的增删改查
 */

/**
 * 通过lesson_id查询大项条目信息
 */
export function getTitleGroups(lesson_id) {
  return request({
    url: '/titleGroup/format',
    method: 'get',
    params: {
      lesson_id: lesson_id
    }
  })
}
/**
 * 查找大项条目信息
 * params：参数对象
 * （id,name,lesson_id,weight四个可选参数）
 */
export function getTitleGroup(params) {
  return request({
    url: '/titleGroup/format',
    method: 'get',
    params: {
      params
    }
  })
}
/**
 * 添加一条大项条目信息
 */
export function postTitleGroup(TitleGroupItem) {
  return request({
    url: '/titleGroup/format',
    method: 'post',
    data: {
      subjects: [TitleGroupItem]
    }
  })
}
/**
 * 添加多条大项条目信息
 */
export function postTitleGroups(TitleGroupArray) {
  return request({
    url: '/titleGroup/format',
    method: 'post',
    data: {
      subjects: TitleGroupArray
    }
  })
}
/**
 * 修改一条大项条目信息
 */
export function putTitleGroup(TitleGroupItem) {
  return request({
    url: '/titleGroup/format',
    method: 'put',
    data: {
      subjects: [TitleGroupItem]
    }
  })
}
/**
 * 修改多条大项条目信息
 */
export function putTitleGroups(TitleGroupArray) {
  return request({
    url: '/titleGroup/format',
    method: 'put',
    data: {
      subjects: TitleGroupArray
    }
  })
}
/**
 * 删除一条大项条目信息
 */
export function deleteTitleGroup(TitleGroup_id) {
  return request({
    url: '/titleGroup/format',
    method: 'delete',
    data: {
      subjects: [
        { id: TitleGroup_id }
      ]
    }
  })
}
/**
 * 批量删除大项条目信息
 */
export function deleteTitleGroups(TitleGroupIdArray) {
  return request({
    url: '/titleGroup/format',
    method: 'delete',
    data: {
      subjects: TitleGroupIdArray
    }
  })
}

