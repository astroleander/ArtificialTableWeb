import request from '@/utils/request'
/**
 * date：2018.12.18
 * author:liqian
 * description：课程组信息的增删改查
 */

/**
 * get lesson taught by teacher with right-token
 * 获取所有的课程组(get)
 */
export function getAllLessons() {
  return request({
    url: '/table/lesson/format',
    method: 'get',
    params: {
      all: 'true'
    }
  })
}
/**
 * 获取某一college所有的课程组(get)
 */
export function getByCollegeId(college_id) {
  return request({
    url: '/table/lesson/format',
    method: 'get',
    params: {
      college_id: college_id
    }
  })
}
/**
 * 修改一条课程组信息
 */
export function putLesson(lessonItem) {
  return request({
    url: '/table/lesson/format',
    method: 'put',
    data: {
      subjects: [lessonItem]
    }
  })
}
/**
 * 修改多条课程组信息
 */
export function putLessons(lessonArray) {
  return request({
    url: '/table/lesson/format',
    method: 'put',
    data: {
      subjects: lessonArray
    }
  })
}
/**
 * 添加一条课程组信息
 */
export function postLesson(lessonItem) {
  return request({
    url: '/table/lesson/format',
    method: 'post',
    data: {
      subjects: [lessonItem]
    }
  })
}
/**
 * 添加多条课程组信息
 */
export function postLessons(lessonArray) {
  return request({
    url: '/table/lesson/format',
    method: 'post',
    data: {
      subjects: lessonArray
    }
  })
}
/**
 * 删除一条课程组信息
 */
export function deleteLesson(lesson_id) {
  return request({
    url: '/table/lesson/format',
    method: 'delete',
    data: {
      subjects: [
        { id: lesson_id }
      ]
    }
  })
}
/**
 * 批量删除课程组
 */
export function deleteLessons(lessonIdArray) {
  return request({
    url: '/table/lesson/format',
    method: 'delete',
    data: {
      subjects: lessonIdArray
    }
  })
}
