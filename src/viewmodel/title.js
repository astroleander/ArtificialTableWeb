import { getTitle, getTitles, postTitle, putTitles, getTitleGroups, postTitleGroup, putTitleGroups } from '@/api/title'

const requestTitle = (group_id, class_id) => {
  return new Promise((resolve, reject) => {
    getTitle(group_id, class_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
const requestTitles = (class_id) => {
  return new Promise((resolve, reject) => {
    getTitles(class_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
const requestPostTitleGroup = (titleGroup) => {
  return new Promise((resolve, reject) => {
    postTitleGroup(titleGroup).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
const requestPutTitleGroups = (titleGroups) => {
  return new Promise((resolve, reject) => {
    putTitleGroups(titleGroups).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
const requestTitleGroups = (class_id) => {
  return new Promise((resolve, reject) => {
    getTitleGroups(class_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

const requestPutTitles = (titles) => {
  return new Promise((resolve, reject) => {
    putTitles(titles).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
const requestPostTitle = (title) => {
  return new Promise((resolve, reject) => {
    postTitle(title).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export default { requestTitle, requestTitles, requestTitleGroups,
  requestPutTitleGroups, requestPutTitles, requestPostTitleGroup, requestPostTitle }

