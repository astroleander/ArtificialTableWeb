const universityMap = {
  school: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      {
        id: 1,
        name: '\u5317\u4eac\u90ae\u7535\u5927\u5b66',
        shortname: 'bupt'
      },
      {
        id: 2,
        name: '\u5317\u4eac\u4ea4\u901a\u5927\u5b66',
        shortname: 'bjtu'
      }
    ],
    count: 2
  }
}
export default {
  info: config => {
    return universityMap.school
  }
}
