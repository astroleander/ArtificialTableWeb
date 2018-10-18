const userMap = {
  admin: {
    username: 'admin',
    token: 'admin'
  }
}

export default {
  login: config => {
    return userMap.admin
  },
  logout: config => {
    return null
  }
}
