import request from '@/utils/request'
/**
 * description：专业信息的增删改查
 */

/**
 * 查找专业信息
 * params：参数对象（id，name,college_id三个可选参数）
 */
export function getMajors(params) {
  return request({
    url: '/major/format',
    method: 'get',
    params
  })
}
/**
 * 通过college_id查询专业信息
 */
export function getByCollegeId(college_id) {
  return request({
    url: '/major/format',
    method: 'get',
    params: {
      college_id: college_id
    }
  })
}
/**
 * 添加一条专业信息
 */
export function postMajor(MajorItem) {
  return request({
    url: '/major/format',
    method: 'post',
    data: {
      subjects: [MajorItem]
    }
  })
}
/**
 * 添加多条专业信息
 */
export function postMajors(MajorArray) {
  return request({
    url: '/major/format',
    method: 'post',
    data: {
      subjects: MajorArray
    }
  })
}
/**
 * 修改一条专业信息
 */
export function putMajor(MajorItem) {
  return request({
    url: '/major/format',
    method: 'put',
    data: {
      subjects: [MajorItem]
    }
  })
}
/**
 * 修改多条专业信息
 */
export function putMajors(MajorArray) {
  return request({
    url: '/major/format',
    method: 'put',
    data: {
      subjects: MajorArray
    }
  })
}
/**
 * 删除一条专业信息
 */
export function deleteMajor(Major_id) {
  return request({
    url: '/major/format',
    method: 'delete',
    data: {
      subjects: [
        { id: Major_id }
      ]
    }
  })
}
/**
 * 批量删除专业信息
 */
export function deleteMajors(MajorIdArray) {
  return request({
    url: '/major/format',
    method: 'delete',
    data: {
      subjects: MajorIdArray
    }
  })
}
