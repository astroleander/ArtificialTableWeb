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
  },
  {
    path: '/manager',
    component: Layout,
    hidden: true,
    children: [{
      path: 'student',
      name: 'addstudent',
      component: () => import('@/views/manager/addStudent.vue'),
      meta: { title: '添加学生', icon: 'tree' }
    },
    {
      path: 'user',
      name: 'addmanager',
      component: () => import('@/views/manager/addUser.vue'),
      meta: { title: '添加用户', icon: 'tree' }
    },
    {
      path: 'lesson',
      name: 'addlesson',
      component: () => import('@/views/manager/addLesson.vue'),
      meta: { title: '添加课程', icon: 'tree' }
    },
    {
      path: 'class',
      name: 'addClassInfo',
      component: () => import('@/views/manager/addClassInfo.vue'),
      meta: { title: '添加班级', icon: 'tree' }
    },
    {
      path: 'class/list',
      name: 'classList',
      component: () => import('@/views/manager/classfield/index.vue'),
      meta: { title: '班级信息列表', icon: 'tree' }
    },
    {
      path: 'class/add',
      name: 'addClassField',
      component: () => import('@/views/manager/classfield/form.vue'),
      meta: { title: '添加和修改班级', icon: 'tree' }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

