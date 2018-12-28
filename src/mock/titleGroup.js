const titleGroupMap = {
  titlegroup: {
    code: '2000',
    message: 'OK, with Response',
    subjects: [
      {
        id: 1,
        name: '听力成绩',
        lesson_id: 1,
        weight: 20
      },
      {
        id: 2,
        name: '写作成绩',
        lesson_id: 1,
        weight: 30
      },
      {
        id: 3,
        name: '期末成绩',
        lesson_id: 1,
        weight: 50
      }
    ],
    count: 3
  }
}

export default {
  group: config => {
    return titleGroupMap.titlegroup
  }
}
