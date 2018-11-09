import Cookies from 'js-cookie'

const TOKEN_KEY = 'Admin-Token'
const ID_KEY = 'Admin-Id'

export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY)
}

export function getId() {
  return Cookies.get(ID_KEY)
}

export function setId(id) {
  return Cookies.set(ID_KEY, id)
}

export function removeId() {
  return Cookies.remove(ID_KEY)
}
