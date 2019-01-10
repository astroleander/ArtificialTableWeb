import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

// layout
import Layout from '../views/layout/Layout'
// import { url } from 'inspector'

// url path
import urls from '@/urls'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    name: 'mainpage',
    children: [{
      meta: { title: '主界面', icon: 'tree' },
      path: 'index',
      component: () => import('@/views/mainpage/index')
    }]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/table',
    name: 'Manage',
    meta: { title: '教学管理', icon: 'example' },
    children: [
      {
        path: 'plist',
        name: 'Point List',
        component: () => import('@/views/plist/index'),
        meta: { title: '分数条目', icon: 'plist' }
      },
      {
        path: 'slist',
        name: 'Student List',
        component: () => import('@/views/slist/index'),
        meta: { title: '学生列表', icon: 'slist' }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '成绩表格', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      },
      {
        path: 'nostudentpage',
        name: 'No Student Page',
        hidden: true,
        component: () => import('@/views/slist/nostudentpage'),
        meta: { title: '错误提示', icon: 'slist' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: urls.comparison,
    component: Layout,
    children: [{
      path: 'index',
      name: 'comparison',
      component: () => import('@/views/comparison/index'),
      meta: { title: '成绩比较', icon: 'tree' }
    }]
  },
  {
    path: urls.weight,
    component: Layout,
    children: [{
      path: 'index',
      name: 'weight',
      component: () => import('@/views/weight/index'),
      meta: { title: '权重调整', icon: 'tree' }
    }]
  },
  /**
   * 曲线救国，可能是版本过旧的原因反正我这儿 alwaysShow 不好用
   */
  {
    path: '/input-wrapper',
    component: Layout,
    children: [{
      path: 'index',
      name: 'input-wrapper',
      redirect: '/input',
      meta: { title: '导入成绩', icon: 'tree' }
    }]
  },
  {
    path: '/input',
    redirect: '/input/index/',
    meta: { title: '导入成绩', icon: 'tree' },
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      name: 'input',
      meta: { title: '导入成绩', icon: 'tree' },
      component: () => import('@/views/input/index')
    }]
  },
  {
    path: urls.transcript,
    component: Layout,
    hidden: true,
    children: [{
      path: ':id',
      name: 'transcript',
      component: () => import('@/views/transcript'),
      meta: { title: '课程信息', icon: 'tree' }
    }]
  }
  // { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

