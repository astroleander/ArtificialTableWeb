import request from '@/utils/request'

/**
 * date：2018.12.18
 * author:liqian
 * description：学生信息的增删改查
 */

// before
export function getStudent(class_id) {
  return request({
    url: '/student/display',
    method: 'get',
    params: { classInfo_id: class_id }
  })
}
/**
 * 查找学生信息
 * params：参数对象（id，sid,name,classInfo_id,major_id,year 6个可选参数,
 * 若参数里有classInfo_id，其他参数被忽略）
 */
export function getClassFields(params) {
  return request({
    url: '/table/class_field/format',
    method: 'get',
    params: {
      params
    }
  })
}
/**
 * 获取某一教学班所有学生
 */
export function getByClassInfoId(classInfo_id) {
  return request({
    url: '/student/format',
    method: 'get',
    params: {
      classInfo_id: classInfo_id
    }
  })
}
/**
 * 修改一条学生信息
 */
export function putStudent(studentItem) {
  return request({
    url: '/student/format',
    method: 'put',
    data: {
      subjects: [studentItem]
    }
  })
}
/**
 * 修改多条学生信息
 */
export function putStudents(studentArray) {
  return request({
    url: '/student/format',
    method: 'put',
    data: {
      subjects: studentArray
    }
  })
}
/**
 * 添加一条学生信息
 */
export function postStudent(studentItem) {
  return request({
    url: '/student/format',
    method: 'post',
    data: {
      subjects: [studentItem]
    }
  })
}
/**
 * 添加多条学生信息
 */
export function postStudents(studentArray) {
  return request({
    url: '/student/format',
    method: 'post',
    data: {
      subjects: studentArray
    }
  })
}
/**
 * 删除一条学生信息
 */
export function deleteStudent(student_id) {
  return request({
    url: '/student/format',
    method: 'delete',
    data: {
      subjects: [
        { id: student_id }
      ]
    }
  })
}
/**
 * 批量删除学生
 */
export function deleteStudents(studentIdArray) {
  return request({
    url: '/student/format',
    method: 'delete',
    data: {
      subjects: studentIdArray
    }
  })
}

