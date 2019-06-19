// 常量 大学信息
const collegeMap = {
  college: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, name: '\u8f6f\u4ef6\u5b66\u9662', shortname: 'rjxy', university_id: 1 },
      { id: 2, name: '\u8ba1\u7b97\u673a\u5b66\u9662', shortname: 'jsjxy', university_id: 1 },
      { id: 3, name: '\u5916\u56fd\u8bed\u5b66\u9662', shortname: 'wgyxy', university_id: 1 },
      { id: 4, name: '\u94c1\u8def\u5b66\u9662', shortname: 'rjxy', university_id: 2 },
      { id: 5, name: '\u8ba1\u7b97\u673a\u5b66\u9662', shortname: 'jsjxy', university_id: 2 },
      { id: 6, name: '\u5916\u56fd\u8bed\u5b66\u9662', shortname: 'wgyxy', university_id: 2 }
    ],
    count: 6
  }
}
// 向外输出 collegeMap中college常量信息
export default {
  info: config => {
    return collegeMap.college
  }
}
