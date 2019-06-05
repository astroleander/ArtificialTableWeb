const lessonMap = {
  lessons: {
    code: '2000',
    message: 'OK, with Response',
    subjects: [
      {
        id: 1,
        name: '英语学术听说',
        college_id: 1
      },
      {
        id: 2,
        name: '英语电影视听说',
        college_id: 1
      }
    ],
    'count': 2,
    'all': 'true'
  },
  Lessonanalyse: {
    code: '2000',
    message: 'OK, with Response',
    subjects:
      {
        'vocabulary': 0.18,
        'hearing': 0.34,
        'translate': 0.42,
        'writing': 0.64,
        'details': 0.32,
        'subjective_qz': 0.53,
        'objective_qm': 0.12,
        'subjective_qm': 0.43
      }
  }

}
export default {
  info: config => {
    return lessonMap.lessons
  },
  analyse: config => {
    return lessonMap.Lessonanalyse
  }
}
