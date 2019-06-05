import request from '@/utils/request'
/**
 * description：小项条目信息的增删改查
 */

/**
 * 通过titleGroup_id,classInfo_id查询小项条目信息
 */
export function getTitle(titleGroup_id, classInfo_id) {
  return request({
    url: '/title/format',
    method: 'get',
    params: {
      titleGroup_id: titleGroup_id,
      classInfo_id: classInfo_id
    }
  })
}
/**
 * 查找小项条目信息
 * params：参数对象
 * （id,name,type,titleGroup_id,classInfo_id五个可选参数）
 */
export function getTitles(params) {
  return request({
    url: '/title/format',
    method: 'get',
    params
  })
}
/**
 * 添加一条小项条目信息
 */
export function postTitle(TitleItem) {
  return request({
    url: '/title/format',
    method: 'post',
    data: {
      subjects: [TitleItem]
    }
  })
}
/**
 * 添加多条小项条目信息
 */
export function postTitles(TitleArray) {
  return request({
    url: '/title/format',
    method: 'post',
    data: {
      subjects: TitleArray
    }
  })
}
/**
 * 修改一条小项条目信息
 */
export function putTitle(TitleItem) {
  return request({
    url: '/title/format',
    method: 'put',
    data: {
      subjects: [TitleItem]
    }
  })
}
/**
 * 修改多条小项条目信息
 */
export function putTitles(TitleArray) {
  return request({
    url: '/title/format',
    method: 'put',
    data: {
      subjects: TitleArray
    }
  })
}
/**
 * 删除一条小项条目信息
 */
export function deleteTitle(Title_id) {
  return request({
    url: '/title/format',
    method: 'delete',
    data: {
      subjects: [
        { id: Title_id }
      ]
    }
  })
}
/**
 * 批量删除小项条目信息
 */
export function deleteTitles(TitleIdArray) {
  return request({
    url: '/title/format',
    method: 'delete',
    data: {
      subjects: TitleIdArray
    }
  })
}

