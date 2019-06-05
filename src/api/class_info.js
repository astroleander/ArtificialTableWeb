import request from '@/utils/request'
/**
 * description：课程辅助信息的增删改查
 */

export function getAllClassInfo(token) {
  return request({
    url: '/table/class_info/detail/all',
    // params: { token },
    method: 'get'
  })
}

/**
 * 查找课程的全部辅助信息
 * params：参数对象（id，name,cid,teacher_id,semester,week,room 七个可选参数）
 */
export function getClassInfos(params) {
  return request({
    url: '/table/class_info/detail/some',
    method: 'get',
    params
  })
}
/**
 * 查找某一教师所执教的所有课程
 */
export function getByTeacherId(teacher_id) {
  return request({
    url: '/table/class_info/format',
    method: 'get',
    params: {
      teacher_id: teacher_id
    }
  })
}
/**
 * 添加一条课程辅助信息
 * need fix content
 */
export function postClassInfo(classInfoItem) {
  return request({
    url: '/table/class_info/format',
    method: 'post',
    data: {
      subjects: [classInfoItem]
    }
  })
}
/**
 * 添加多条课程辅助信息
 * need fix content
 */
export function postClassInfos(classInfoArray) {
  return request({
    url: '/table/class_info/format',
    method: 'post',
    data: {
      subjects: classInfoArray
    }
  })
}
/**
 * 修改一条课程辅助信息
 * need fix token
 */
export function putClassInfo(classInfoItem) {
  return request({
    url: '/table/class_info/format',
    method: 'put',
    data: {
      subjects: [classInfoItem]
    }
  })
}
/**
 * 修改多条课程辅助信息
 * need fix token
 */
export function putClassInfos(classInfoArray) {
  return request({
    url: '/table/class_info/format',
    method: 'put',
    data: {
      subjects: classInfoArray
    }
  })
}
/**
 * 删除一条课程组信息
 */
export function deleteClassInfo(classInfo_id) {
  return request({
    url: '/table/class_info/format',
    method: 'delete',
    data: {
      subjects: [
        { id: classInfo_id }
      ]
    }
  })
}
/**
 * 批量删除课程组
 */
export function deleteClassInfos(classInfoIdArray) {
  return request({
    url: '/table/class_info/format',
    method: 'delete',
    data: {
      subjects: classInfoIdArray
    }
  })
}
