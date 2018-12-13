const lessonMap = {
  lessons: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      // { id: 1, name: '\u6570\u636e\u7ed3\u6784', college_id: 1 },
      // { id: 2, name: '\u6570\u636e\u7ed3\u6784', college_id: 2 },
      { id: 3, name: '\u82f1\u8bed\u5b66\u672f\u542c\u8bf4', college_id: 3 },
      { id: 4, name: '\u82f1\u8bed\u7535\u5f71\u89c6\u542c\u8bf4', college_id: 3 }
      // { id: 5, name: '\u6570\u636e\u7ed3\u6784', college_id: 5 },
      // { id: 6, name: '\u8f68\u9053\u7ed3\u6784', college_id: 4 },
      // { id: 7, name: '\u82f1\u8bed\u7535\u5f71\u89c6\u542c\u8bf4', college_id: 6 },
      // { id: 8, name: '\u82f1\u8bed\u65b0\u95fb\u89c6\u542c\u8bf4', college_id: 6 }
    ],
    count: 2,
    all: false
  }
}
export default {
  info: config => {
    return lessonMap.lessons
  }
}
