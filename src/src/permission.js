import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (from.path.match(/\/transcript\//)) {
    if (store.state.table.changed === true) {
      confirm('当前页面还有数据未保存，请点击 "保存修改" 按钮')
      console.log(router)
      console.log(from)
      console.log(to)
      window.history.pushState(null, null, '#' + from.fullPath)
      return
    }
  }
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      console.log('[Router Permission]: to login page')
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.groups === -1) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          next()
        }).catch((err) => {
          console.log('[Router Permission]: fetch userinfo failed, execute logout')
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
