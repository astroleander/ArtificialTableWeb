import Cookies from 'js-cookie'

const TOKEN_KEY = 'Admin-Token'
const ID_KEY = 'Admin-Id'
const User_KEY = 'User'

const Use_Manager_KEY = 'Use-Manager'
const Is_Manager_KEY = 'Is-Manager'

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

// 2018/12/15
export function getUser() {
  return Cookies.get(User_KEY)
}
export function setUser(user) {
  return Cookies.set(User_KEY, user)
}
export function removeUser() {
  return Cookies.remove(User_KEY)
}

// use-manager
export function getUseManager() {
  return Cookies.get(Use_Manager_KEY)
}

export function setUseManager(is_manager) {
  return Cookies.set(Use_Manager_KEY, is_manager)
}

//
export function getIsManager() {
  return Cookies.get(Is_Manager_KEY)
}

export function setIsManager(is_manager) {
  return Cookies.set(Is_Manager_KEY, is_manager)
}

export function removeManager() {
  Cookies.remove(Is_Manager_KEY)
  Cookies.remove(Use_Manager_KEY)
  return
}
