import router, { constantRouterMap } from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { teacherRouter, adminRouter } from './router'

const whiteList = ['/login'] // 不重定向白名单

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
      const role = store.getters.use_manager
      console.log('用户权限加载' + role)
      if (store.getters.use_manager !== undefined) {
        next()
        console.log('权限加载' + store.getters.use_manager)
        if (!store.getters.addRouterFlag) {
          store.dispatch('setAddRouterFlag', true)
          // console.log('111111' + store.getters.addRouterFlag)
          console.log(typeof (store.getters.use_manager))
          if (String(store.getters.use_manager) === 'true') {
            // console.log(store.getters.use_manager)
            // console.log('我进入管理员模式')
            router.options.routes = constantRouterMap.concat(adminRouter)
            router.addRoutes(adminRouter)
            // console.log('222' + router.options.routes.length)
          } else if (String(store.getters.use_manager) === 'false') {
            // console.log('我进入教师模式')
            router.options.routes = constantRouterMap.concat(teacherRouter)
            router.addRoutes(teacherRouter)
          }
          // console.log('222' + router.options.routes.length)
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
