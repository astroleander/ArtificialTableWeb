const titleMap = {
  title: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, name: '口语 1', titleGroup_id: 1, weight: 20 },
      { id: 2, name: '口语 2', titleGroup_id: 1, weight: 10 },
      { id: 3, name: '口语 3', titleGroup_id: 2, weight: 70 },
      { id: 4, name: '听说 1', titleGroup_id: 3, weight: 10 },
      { id: 5, name: '听说 2', titleGroup_id: 3, weight: 20 },
      { id: 6, name: '听说 3', titleGroup_id: 4, weight: 70 },
      { id: 7, name: '小作文训练', titleGroup_id: 4, weight: 70 },
      { id: 8, name: '小作文训练2', titleGroup_id: 4, weight: 70 },
      { id: 9, name: '小作文训练3', titleGroup_id: 4, weight: 70 },
      { id: 10, name: '阅读 1', titleGroup_id: 4, weight: 70 },
      { id: 11, name: '期中考试', titleGroup_id: 4, weight: 70 },
      { id: 12, name: '期末考试', titleGroup_id: 4, weight: 70 }
    ],
    count: 6
  }
}

const titlegroupMap = {
  titlegroup: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, name: '作文', lesson_id: 3, weight: 30 },
      { id: 2, name: '口语', lesson_id: 3, weight: 70 },
      { id: 3, name: '听力', lesson_id: 4, weight: 30 },
      { id: 4, name: '期末考试', lesson_id: 4, weight: 70 },
      { id: 5, name: '期中考试', lesson_id: 4, weight: 70 }
    ],
    count: 4
  }
}
export default {
  title: config => {
    return titleMap.title
  },
  group: config => {
    return titlegroupMap.titlegroup
  }
}
