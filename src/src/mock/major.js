const majorMap = {
  major: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      { id: 1, name: '\u8f6f\u4ef6\u5de5\u7a0b', shortname: '', college_id: 1 },
      { id: 2, name: '\u7f51\u7edc\u5de5\u7a0b', shortname: '', college_id: 2 },
      { id: 3, name: '\u9ed1\u79d1\u6280', shortname: '', college_id: 2 },
      { id: 4, name: '\u82f1\u8bed', shortname: '', college_id: 3 },
      { id: 5, name: '\u897f\u73ed\u7259\u8bed', shortname: '', college_id: 3 },
      { id: 6, name: '\u6cd5\u8bed', shortname: '', college_id: 3 }
    ],
    count: 6
  }
}
export default {
  info: config => {
    return majorMap.major
  }
}
