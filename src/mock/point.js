const pointMap = {
  point: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, classInfo_id: 1, student_id: 11, title_id: 1, pointNumber: 33, date: null, note: '' },
      { id: 2, classInfo_id: 1, student_id: 11, title_id: 2, pointNumber: 44, date: null, note: '' },
      { id: 3, classInfo_id: 1, student_id: 11, title_id: 3, pointNumber: 55, date: null, note: '' },
      { id: 4, classInfo_id: 1, student_id: 12, title_id: 1, pointNumber: 64, date: null, note: '' },
      { id: 5, classInfo_id: 1, student_id: 12, title_id: 2, pointNumber: 75, date: null, note: '' },
      { id: 6, classInfo_id: 1, student_id: 12, title_id: 4, pointNumber: 89, date: null, note: '' },
      { id: 7, classInfo_id: 1, student_id: 13, title_id: 4, pointNumber: 34, date: null, note: '' },
      { id: 8, classInfo_id: 1, student_id: 13, title_id: 2, pointNumber: 63, date: null, note: '' },
      { id: 9, classInfo_id: 1, student_id: 13, title_id: 3, pointNumber: 87, date: null, note: '' }
    ],
    count: 9
  }
}
export default {
  info: config => {
    return pointMap.point
  }
}
