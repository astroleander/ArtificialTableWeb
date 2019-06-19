import request from '@/utils/request'

/**
 * description：学生信息的增删改查
 */

/**
 * 查找学生信息
 * params：参数对象（id，sid,name,classInfo_id,major_id,year 6个可选参数,
 * 若参数里有classInfo_id，其他参数被忽略）
 */
export function getStudents(params) {
  return request({
    url: '/student/display',
    method: 'get',
    params
  })
}
/**
 * 获取某一教学班所有学生
 */
export function getByClassInfoId(classInfo_id) {
  return request({
    url: '/student/display',
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
/*
   获取预测成绩信息
 */
export function getPredict(studentIdArray) {
  // 此时request 为一个 axios实例，发送请求
  return request({
    url: '/analysis/pass',
    method: 'post',
    data: {
      sidList: studentIdArray
    }
  })
}

