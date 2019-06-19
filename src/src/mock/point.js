const PointPrototype = function() {
  this.id = ''
  this.classInfo_id = ''
  this.student_id = ''
  this.title_id = ''
  this.pointNumber = 0
  this.date = null
  this.note = ''
}

const pointMap = {
  point: {
    code: '2000',
    message: 'OK, with Response',
    subjects: [
      {
        id: 1,
        classInfo_id: 1,
        student_id: 1,
        title_id: 1,
        pointNumber: 25,
        date: '2018-12-24T22:41:16.356',
        note: ''
      },
      {
        id: 2,
        classInfo_id: 1,
        student_id: 1,
        title_id: 2,
        pointNumber: 20,
        date: '2018-12-18T20:32:00.430',
        note: ''
      },
      {
        id: 3,
        classInfo_id: 1,
        student_id: 1,
        title_id: 3,
        pointNumber: 20,
        date: '2018-12-18T20:32:00.445',
        note: ''
      },
      {
        id: 4,
        classInfo_id: 1,
        student_id: 1,
        title_id: 4,
        pointNumber: 20,
        date: '2018-12-18T20:32:00.458',
        note: ''
      },
      {
        id: 9,
        classInfo_id: 1,
        student_id: 2,
        title_id: 1,
        pointNumber: 20,
        date: '2018-12-25T09:38:08.464',
        note: ''
      },
      {
        id: 10,
        classInfo_id: 1,
        student_id: 2,
        title_id: 2,
        pointNumber: 34,
        date: '2018-12-25T10:30:43.136',
        note: ''
      },
      {
        id: 11,
        classInfo_id: 1,
        student_id: 2,
        title_id: 3,
        pointNumber: 35,
        date: null,
        note: ''
      },
      {
        id: 12,
        classInfo_id: 1,
        student_id: 2,
        title_id: 4,
        pointNumber: 100,
        date: '2018-12-13T14:04:51.771',
        note: ''
      },
      {
        id: 17,
        classInfo_id: 1,
        student_id: 2,
        title_id: 1,
        pointNumber: 33,
        date: null,
        note: ''
      },
      {
        id: 18,
        classInfo_id: 1,
        student_id: 2,
        title_id: 2,
        pointNumber: 34,
        date: null,
        note: ''
      },
      {
        id: 19,
        classInfo_id: 1,
        student_id: 2,
        title_id: 3,
        pointNumber: 35,
        date: null,
        note: ''
      },
      {
        id: 20,
        classInfo_id: 1,
        student_id: 2,
        title_id: 4,
        pointNumber: 36,
        date: null,
        note: ''
      },
      {
        id: 25,
        classInfo_id: 1,
        student_id: 2,
        title_id: 1,
        pointNumber: 38,
        date: '2018-12-20T16:16:41.651',
        note: ''
      },
      {
        id: 26,
        classInfo_id: 1,
        student_id: 2,
        title_id: 2,
        pointNumber: 34,
        date: null,
        note: ''
      },
      {
        id: 27,
        classInfo_id: 1,
        student_id: 2,
        title_id: 3,
        pointNumber: 35,
        date: null,
        note: ''
      },
      {
        id: 28,
        classInfo_id: 1,
        student_id: 2,
        title_id: 4,
        pointNumber: 36,
        date: null,
        note: ''
      },
      {
        id: 33,
        classInfo_id: 1,
        student_id: 4,
        title_id: 1,
        pointNumber: 43,
        date: '2018-12-25T11:33:40.451',
        note: ''
      },
      {
        id: 34,
        classInfo_id: 1,
        student_id: 4,
        title_id: 2,
        pointNumber: 35,
        date: '2018-12-25T09:39:08.191',
        note: ''
      },
      {
        id: 35,
        classInfo_id: 1,
        student_id: 4,
        title_id: 3,
        pointNumber: 35,
        date: null,
        note: ''
      },
      {
        id: 36,
        classInfo_id: 1,
        student_id: 4,
        title_id: 4,
        pointNumber: 36,
        date: null,
        note: ''
      },
      {
        id: 41,
        classInfo_id: 1,
        student_id: 6,
        title_id: 1,
        pointNumber: 35,
        date: '2018-12-25T11:26:01.837',
        note: ''
      },
      {
        id: 42,
        classInfo_id: 1,
        student_id: 6,
        title_id: 2,
        pointNumber: 34,
        date: null,
        note: ''
      },
      {
        id: 43,
        classInfo_id: 1,
        student_id: 6,
        title_id: 3,
        pointNumber: 33,
        date: '2018-12-25T11:26:16.086',
        note: ''
      },
      {
        id: 44,
        classInfo_id: 1,
        student_id: 6,
        title_id: 4,
        pointNumber: 58,
        date: '2018-12-08T14:12:35.271',
        note: ''
      },
      {
        id: 49,
        classInfo_id: 1,
        student_id: 8,
        title_id: 1,
        pointNumber: 88,
        date: '2018-12-08T14:33:02.365',
        note: ''
      },
      {
        id: 50,
        classInfo_id: 1,
        student_id: 6,
        title_id: 25,
        pointNumber: 58,
        date: '2018-12-08T14:35:31.165',
        note: ''
      },
      {
        id: 51,
        classInfo_id: 1,
        student_id: 13,
        title_id: 1,
        pointNumber: 22,
        date: '2018-12-08T18:06:39.065',
        note: ''
      },
      {
        id: 52,
        classInfo_id: 1,
        student_id: 12,
        title_id: 1,
        pointNumber: 12,
        date: '2018-12-08T17:07:10.396',
        note: ''
      },
      {
        id: 53,
        classInfo_id: 1,
        student_id: 13,
        title_id: 2,
        pointNumber: 78,
        date: '2018-12-11T23:16:49.924',
        note: ''
      },
      {
        id: 54,
        classInfo_id: 1,
        student_id: 11,
        title_id: 1,
        pointNumber: 44,
        date: '2018-12-08T17:07:06.495',
        note: ''
      },
      {
        id: 55,
        classInfo_id: 1,
        student_id: 14,
        title_id: 1,
        pointNumber: 44,
        date: '2018-12-11T16:37:13.425',
        note: ''
      },
      {
        id: 56,
        classInfo_id: 1,
        student_id: 14,
        title_id: 2,
        pointNumber: 33,
        date: '2018-12-11T16:37:16.549',
        note: ''
      },
      {
        id: 57,
        classInfo_id: 1,
        student_id: 11,
        title_id: 2,
        pointNumber: 89,
        date: '2018-12-13T14:49:32.083',
        note: ''
      },
      {
        id: 58,
        classInfo_id: 1,
        student_id: 9,
        title_id: 1,
        pointNumber: 74,
        date: '2018-12-24T22:51:23.447',
        note: ''
      },
      {
        id: 59,
        classInfo_id: 1,
        student_id: 1,
        title_id: 25,
        pointNumber: 20,
        date: '2018-12-18T20:32:00.472',
        note: ''
      },
      {
        id: 60,
        classInfo_id: 1,
        student_id: 1,
        title_id: 27,
        pointNumber: 85,
        date: '2018-12-25T15:29:34.244',
        note: ''
      },
      {
        id: 61,
        classInfo_id: 1,
        student_id: 7,
        title_id: 1,
        pointNumber: 58,
        date: '2018-12-20T16:05:06.181',
        note: ''
      },
      {
        id: 63,
        classInfo_id: 1,
        student_id: 10,
        title_id: 1,
        pointNumber: 56,
        date: '2018-12-20T15:59:36.191',
        note: ''
      },
      {
        id: 64,
        classInfo_id: 1,
        student_id: 3,
        title_id: 1,
        pointNumber: 25,
        date: '2018-12-20T16:42:39.739',
        note: ''
      },
      {
        id: 65,
        classInfo_id: 1,
        student_id: 3,
        title_id: 2,
        pointNumber: 10,
        date: '2018-12-20T16:03:07.181',
        note: ''
      },
      {
        id: 66,
        classInfo_id: 1,
        student_id: 7,
        title_id: 2,
        pointNumber: 56,
        date: '2018-12-25T11:26:59.184',
        note: ''
      },
      {
        id: 67,
        classInfo_id: 1,
        student_id: 8,
        title_id: 2,
        pointNumber: 40,
        date: '2018-12-21T16:11:22.851',
        note: ''
      },
      {
        id: 68,
        classInfo_id: 1,
        student_id: 9,
        title_id: 2,
        pointNumber: 76,
        date: '2018-12-25T11:27:04.344',
        note: ''
      },
      {
        id: 69,
        classInfo_id: 1,
        student_id: 10,
        title_id: 2,
        pointNumber: 45,
        date: '2018-12-24T22:51:29.360',
        note: ''
      },
      {
        id: 70,
        classInfo_id: 1,
        student_id: 7,
        title_id: 27,
        pointNumber: 36,
        date: '2018-12-25T15:29:43.129',
        note: ''
      },
      {
        id: 71,
        classInfo_id: 1,
        student_id: 7,
        title_id: 25,
        pointNumber: 699,
        date: '2018-12-25T15:43:28.699',
        note: ''
      },
      {
        id: 72,
        classInfo_id: 1,
        student_id: 8,
        title_id: 25,
        pointNumber: 2546,
        date: '2018-12-25T19:14:12.580',
        note: ''
      }
    ],
    count: 47
  }
}
export default {
  info: config => {
    return pointMap.point
  },
  getPointPrototype: () => {
    const pointObj = new PointPrototype()
    return pointObj
  },
  post: config => {
    return { code: '2004', 'message': 'OK, No Response content' }
  }
}
