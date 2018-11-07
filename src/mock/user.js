const userMap = {
  admin: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      {
        id: 1,
        tid: '10011',
        name: '\u65b9\u4e16\u73891\u53f7',
        college_id: 3,
        isManager: false,
        email: '2@1.com',
        mobile: '1313131'
      }
    ],
    count: 1
  }
}

export default {
  info: config => {
    return userMap.admin
  }
}
