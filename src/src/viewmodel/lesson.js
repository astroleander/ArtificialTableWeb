
import { getLessons, getAllLessons, getByCollegeId,
  postLesson, postLessons,
  putLesson, putLessons,
  deleteLesson, deleteLessons, lessonAnalyse } from '@/api/lesson'
/**
 * date:2018/12/20
 * author:liqian
 * description：课程组信息的get put post delete
 */

/**
 * description:请求课程组信息
 * @param params  参数对象（id，name,college_id，all四个可选参数）
 * 若参数中all=true，其他参数会被忽略
 * @returns {Promise<any>}
 */
const requestLessons = (params) => {
  return new Promise((resolve, reject) => {
    getLessons(params).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * description:请求所有课程组
 * @returns {Promise<any>}
 */
const requestAllLessons = () => {
  return new Promise((resolve, reject) => {
    getAllLessons().then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过college_id查询课程组信息
 * @param college_id
 * @returns {Promise<any>}
 */
const requestByCollegeId = (college_id) => {
  return new Promise((resolve, reject) => {
    getByCollegeId(college_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改一条课程组信息
 * @param lessonItem
 * @returns {Promise<any>}
 */
const requestPutLesson = (lessonItem) => {
  return new Promise((resolve, reject) => {
    putLesson(lessonItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求修改多条课程组信息
 * @param lessonArray
 * @returns {Promise<any>}
 */
const requestPutLessons = (lessonArray) => {
  return new Promise((resolve, reject) => {
    putLessons(lessonArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加一条课程组信息
 * @param lessonItem
 * @returns {Promise<any>}
 */
const requestPostLesson = (lessonItem) => {
  return new Promise((resolve, reject) => {
    postLesson(lessonItem).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求添加多条课程组信息
 * @param lessonArray
 * @returns {Promise<any>}
 */
const requestPostLessons = (lessonArray) => {
  return new Promise((resolve, reject) => {
    postLessons(lessonArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除单条课程组信息
 * @param lessonId
 * @returns {Promise<any>}
 */
const requestDelLesson = (lessonId) => {
  return new Promise((resolve, reject) => {
    deleteLesson(lessonId).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 请求删除多条课程组信息
 * @param lessonIdArray
 * @returns {Promise<any>}
 */
const requestDelLessons = (lessonIdArray) => {
  return new Promise((resolve, reject) => {
    deleteLessons(lessonIdArray).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 请求课程分析
 * @param lessonSemester
 * @returns {Promise<any>}
 */
const requestAnalyseLessons = (lessonSemester) => {
  return new Promise((resolve, reject) => {
    lessonAnalyse(lessonSemester).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(error => {
      reject(error)
    })
  })
}
export default{
  requestAllLessons, requestByCollegeId, requestLessons,
  requestPostLesson, requestPostLessons,
  requestPutLesson, requestPutLessons,
  requestDelLesson, requestDelLessons, requestAnalyseLessons
}
