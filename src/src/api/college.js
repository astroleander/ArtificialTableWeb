import request from '@/utils/request'
/**
 * description：院系信息的增删改查
 */

/**
 * 查找院系信息
 * params：参数对象（id，name,university_id三个可选参数）
 * 若参数中有university_id，其他参数会被忽略
 */
export function getColleges(params) {
  return request({
    url: '/college/format',
    method: 'get',
    params
  })
}
/**
 * 通过university_id查询院系信息
 */
export function getByUniversityId(university_id) {
  return request({
    url: '/college/format',
    method: 'get',
    params: {
      university_id: university_id
    }
  })
}
/**
 * 添加一条院系信息
 */
export function postCollege(CollegeItem) {
  return request({
    url: '/college/format',
    method: 'post',
    data: {
      subjects: [CollegeItem]
    }
  })
}
/**
 * 添加多条院系信息
 */
export function postColleges(CollegeArray) {
  return request({
    url: '/college/format',
    method: 'post',
    data: {
      subjects: CollegeArray
    }
  })
}
/**
 * 修改一条院系信息
 */
export function putCollege(CollegeItem) {
  return request({
    url: '/college/format',
    method: 'put',
    data: {
      subjects: [CollegeItem]
    }
  })
}
/**
 * 修改多条院系信息
 */
export function putColleges(CollegeArray) {
  return request({
    url: '/college/format',
    method: 'put',
    data: {
      subjects: CollegeArray
    }
  })
}
/**
 * 删除一条院系信息
 */
export function deleteCollege(College_id) {
  return request({
    url: '/college/format',
    method: 'delete',
    data: {
      subjects: [
        { id: College_id }
      ]
    }
  })
}
/**
 * 批量删除院系信息
 */
export function deleteColleges(CollegeIdArray) {
  return request({
    url: '/college/format',
    method: 'delete',
    data: {
      subjects: CollegeIdArray
    }
  })
}
