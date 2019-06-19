import request from '@/utils/request'
/**
 * description：教学班组织信息的增删改查
 */

/**
 * 查找教学班组织信息
 * params：参数对象（id，classInfo_id,student_id 三个可选参数）
 */
export function getClassFields(params) {
  // 此时request 为一个 axios实例，发送请求
  return request({
    url: '/table/class_field/format',
    method: 'get',
    params: params
  })
}
/**
 * 查找某一教学班信息
 */
export function getByClassInfoId(classInfo_id) {
  return request({
    url: '/table/class_field/format',
    method: 'get',
    params: {
      classInfo_id: classInfo_id
    }
  })
}
/**
 * 查找某一学生参加的课程
 */
export function getByStudentID(student_id) {
  return request({
    url: '/table/class_field/format',
    method: 'get',
    params: {
      student_id: student_id
    }
  })
}
/**
 * 添加一条教学班组织信息
 */
export function postClassField(classFieldItem) {
  return request({
    url: '/table/class_field/format',
    method: 'post',
    data: {
      subjects: [classFieldItem]
    }
  })
}
/**
 * 添加多条教学班组织信息
 */
export function postClassFields(classFieldArray) {
  return request({
    url: '/table/class_field/format',
    method: 'post',
    data: {
      subjects: classFieldArray
    }
  })
}
/**
 * 删除一条教学班组织信息
 */
export function deleteClassField(classField_id) {
  return request({
    url: '/table/class_field/format',
    method: 'delete',
    data: {
      subjects: [
        { id: classField_id }
      ]
    }
  })
}
/**
 * 批量删除教学班组织信息
 */
export function deleteClassFields(classFieldIdArray) {
  return request({
    url: '/table/class_field/format',
    method: 'delete',
    data: {
      subjects: classFieldIdArray
    }
  })
}
