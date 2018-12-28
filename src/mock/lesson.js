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
  }
}
export default {
  info: config => {
    return lessonMap.lessons
  }
}
