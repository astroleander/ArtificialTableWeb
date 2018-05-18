const getters = {
  // app status
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // user cookies
  token: state => state.user.token,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  groups: state => state.user.groups
}
export default getters
