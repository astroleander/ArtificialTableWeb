const userMap = {
  admin: {
    tid: 'mockadmin',
    subjects: { token: 'mockadmin' }
  }
}

export default {
  login: config => {
    return userMap.admin
  },
  logout: config => {
    return {}
  }
}
