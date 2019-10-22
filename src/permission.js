import router, { constantRouterMap } from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { teacherRouter, adminRouter } from './router'

const whiteList = ['/login'] // 不重定向白名单
var addRouteFlag = false

router.beforeEach((to, from, next) => {
  if (from.path.match(/\/transcript\//)) {
    if (store.state.table.changed === true) {
      confirm('成绩表页面还有数据未保存，请点击 "保存修改" 按钮')
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
      // 获取用户权限
      const role = store.getters.is_manager
      console.log('用户权限加载' + role)
      if (role !== undefined) {
        next()
        console.log('luyou加载' + addRouteFlag)
        if (!addRouteFlag) {
          addRouteFlag = true
          if (role === false) {
            router.options.routes = constantRouterMap.concat(teacherRouter)
            router.addRoutes(teacherRouter)
          } else {
            router.options.routes = constantRouterMap.concat(adminRouter)
            router.addRoutes(adminRouter)
          }
          router.push({ path: to.path })
        }
      } else {
        if (to.path === '/') {
          next()
        } else {
          next('/')
        }
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
