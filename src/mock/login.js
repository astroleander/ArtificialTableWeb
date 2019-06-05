const userMap = {
  admin: {
    subjects: {
      id: 'mockadmin',
      token: 'mockadmin'
    }
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
