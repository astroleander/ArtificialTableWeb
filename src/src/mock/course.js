export default {
  classField: config => {
    return classFieldMap.fields
  },
  classInfo: config => {
    return classInfoMap.infos
  }
}
// TODO: classField need add lesson_id
const classInfoMap = {
  infos: {
    code: 2000,
    message: 'OK, with Response',
    subjects: [
      {
        id: 1,
        name: '英语学术听说1班',
        teacher_id: 1,
        semester: '2018秋季',
        week: '4-18单周',
        room: '3-319',
        cid: '001',
        lesson_id: 1
      }
      // {
      //   id: 2,
      //   name: '英语学术听说2班',
      //   teacher_id: 2,
      //   semester: '2018秋季',
      //   week: '4-18双周',
      //   room: '3-329',
      //   cid: '002',
      //   lesson_id: 1
      // },
      // {
      //   id: 3,
      //   name: '英语学术听说3班',
      //   teacher_id: 3,
      //   semester: '2018秋季',
      //   week: '5-19单周',
      //   room: '3-339',
      //   cid: '003',
      //   lesson_id: 1
      // }
    ],
    count: 3
  }
}

const classFieldMap = {
  fields: {
    code: 2000,
    message: 'OK, with Response',
    subjects: [
      {
        id: 1,
        student_id: 1,
        classInfo_id: 1
      },
      {
        id: 2,
        student_id: 2,
        classInfo_id: 1
      },
      {
        id: 3,
        student_id: 3,
        classInfo_id: 1
      },
      {
        id: 4,
        student_id: 4,
        classInfo_id: 1
      },
      {
        id: 5,
        student_id: 6,
        classInfo_id: 1
      },
      {
        id: 6,
        student_id: 7,
        classInfo_id: 1
      },
      {
        id: 7,
        student_id: 8,
        classInfo_id: 1
      },
      {
        id: 8,
        student_id: 9,
        classInfo_id: 1
      },
      {
        id: 9,
        student_id: 10,
        classInfo_id: 1
      },
      {
        id: 10,
        student_id: 11,
        classInfo_id: 1
      },
      {
        id: 11,
        student_id: 12,
        classInfo_id: 1
      },
      {
        id: 12,
        student_id: 13,
        classInfo_id: 1
      },
      {
        id: 13,
        student_id: 14,
        classInfo_id: 1
      }
    ],
    count: 13
  }
}
