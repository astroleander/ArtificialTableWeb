const userMap = {
  admin: {
    code: '1031',
    message: 'get\u8bf7\u6c42\u6210\u529f',
    subjects: [
      {
        id: 1,
        tid: '10011',
        name: 'lalala',
        password: '12345',
        college_id: 3,
        isManager: false,
        email: '12345',
        mobile: '12345'
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
