const titleMap = {
  title: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, name: '\u7b2c\u4e00\u6b21\u6d4b\u9a8c', titleGroup_id: 1, weight: 20 },
      { id: 2, name: '\u7b2c\u4e8c\u6b21\u6d4b\u9a8c', titleGroup_id: 1, weight: 10 },
      { id: 3, name: '\u671f\u672b\u8003\u8bd5', titleGroup_id: 2, weight: 70 },
      { id: 4, name: '\u7b2c\u4e00\u6b21\u6d4b\u9a8c', titleGroup_id: 3, weight: 10 },
      { id: 5, name: '\u7b2c\u4e8c\u6b21\u6d4b\u9a8c', titleGroup_id: 3, weight: 20 },
      { id: 6, name: '\u671f\u672b\u8003\u8bd5', titleGroup_id: 4, weight: 70 }
    ],
    count: 6
  }
}

const titlegroupMap = {
  titlegroup: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, name: '口头', lesson_id: 3, weight: 30 },
      { id: 2, name: '口语', lesson_id: 3, weight: 70 },
      { id: 3, name: '口球', lesson_id: 4, weight: 30 },
      { id: 4, name: '期末考试', lesson_id: 4, weight: 70 }
    ],
    count: 4
  }
}
export default {
  title: config => {
    return titlegroupMap.titlegroup
  },
  group: config => {
    return titleMap.title
  }
}
