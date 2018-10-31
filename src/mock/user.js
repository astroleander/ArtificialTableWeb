const userMap = {
  admin: {
    id: 12313123131341,
    tid: '2013412444',
    name: 'Dvocka',
    collage: 502,
    manager: true,
    email: '2@1.com',
    mobile: '234214'
  }
}

export default {
  info: config => {
    return userMap.admin
  }
}
