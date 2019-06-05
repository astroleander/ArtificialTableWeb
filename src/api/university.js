import request from '@/utils/request'
/**
 * description：大学信息的增删改查
 */

/**
 * 查找大学信息
 * params：参数对象（id，name,shortname 三个可选参数）
 */
export function getUniversity(params) {
  return request({
    url: '/university/format',
    method: 'get',
    params
  })
}
/**
 * 通过Id查询大学信息
 */
export function getUniversityById(university_id) {
  return request({
    url: '/university/format',
    method: 'get',
    params: {
      id: university_id
    }
  })
}
/**
 * 添加一条大学信息
 */
export function postUniversity(UniversityItem) {
  return request({
    url: '/university/format',
    method: 'post',
    data: {
      subjects: [UniversityItem]
    }
  })
}
/**
 * 添加多条大学信息
 */
export function postUniversitys(UniversityArray) {
  return request({
    url: '/university/format',
    method: 'post',
    data: {
      subjects: UniversityArray
    }
  })
}
/**
 * 修改一条大学信息
 */
export function putUniversity(UniversityItem) {
  return request({
    url: '/university/format',
    method: 'put',
    data: {
      subjects: [UniversityItem]
    }
  })
}
/**
 * 修改多条大学信息
 */
export function putUniversitys(UniversityArray) {
  return request({
    url: '/university/format',
    method: 'put',
    data: {
      subjects: UniversityArray
    }
  })
}
/**
 * 删除一条大学信息
 */
export function deleteUniversity(University_id) {
  return request({
    url: '/university/format',
    method: 'delete',
    data: {
      subjects: [
        { id: University_id }
      ]
    }
  })
}
/**
 * 批量删除大学信息
 */
export function deleteUniversitys(UniversityIdArray) {
  return request({
    url: '/university/format',
    method: 'delete',
    data: {
      subjects: UniversityIdArray
    }
  })
}
