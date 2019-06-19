/* 路由适用于为各个页面提供查找引用的路径 */
import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* 通过import 引入所有希望建立路由的组件 */
// layout 引入外部框架layout
import Layout from '../views/layout/Layout'
// import { url } from 'inspector'

// url path
// 引入其他路径文件 简写方便
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

/* 对外输出路由 constantRouterMap为一整个路由数组 其中每个{}为一个路由 path为路由地址 component为跳转组件 */
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true }, // 登录路径；组件模版views/login/index；可隐藏信息
  { path: '/404', component: () => import('@/views/404'), hidden: true }, // 错误页面404
  {
    // 主界面
    path: '',
    component: Layout, // 上方引入的外部框架模版
    // 重定位 用于返回主界面模版页面
    redirect: 'index',
    // 路由名称
    name: 'mainpage',
    // 创建子路由，进行跳转到菜单相应子模块中
    children: [{
      // 左侧菜单栏中标题和图片应用
      meta: { title: '主界面', icon: 'list' },
      path: 'index',
      // 连接响应vue文件
      component: () => import('@/views/mainpage/index')
    }]
  },
  {
    path: urls.comparison,
    component: Layout, // 上方引入的外部框架模版
    children: [{
      path: 'index',
      name: 'comparison',
      component: () => import('@/views/comparison/index'),
      // 路由属性存储
      meta: { title: '成绩比较', icon: 'dash' }
    }]

  },
  {
    path: urls.weight,
    component: Layout,
    children: [{
      path: 'index',
      name: 'weight',
      component: () => import('@/views/weight/index'),
      meta: { title: '权重调整', icon: 'weight' }
    }]
  },
  {
    path: urls.analyse,
    component: Layout,
    children: [{
      path: 'index',
      name: 'analyse',
      component: () => import('@/views/analyse/analyse'),
      meta: { title: '课程分析', icon: 'lessonAnalyse' }
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
      // 重定位：用于返回导入成绩时直接返回，用于代替component
      redirect: '/input',
      meta: { title: '导入成绩', icon: 'upload' }
    }]
  },
  {
    path: '/redirector',
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      name: 'input-wrapper-redirector',
      component: () => import('@/views/redirector'),
      meta: { title: '导入成绩', icon: 'upload' }
    }]
  },
  {
    path: '/input',
    // 重定位：用于返回导入成绩时直接返回
    redirect: '/input/index/',
    meta: { title: '导入成绩', icon: 'upload' },
    component: Layout,
    hidden: true,
    children: [{
      path: 'index',
      name: 'input',
      meta: { title: '导入成绩', icon: 'upload' },
      component: () => import('@/views/input/index')
    }]
  },
  {
    path: '/help',
    component: Layout,
    children: [{
      path: 'index',
      name: 'help',
      component: () => import('@/views/help/index'),
      meta: { title: '帮助文档', icon: 'help' }
    }]
  },
  {
    path: urls.transcript,
    component: Layout,
    // 可隐藏信息
    hidden: true,
    children: [{
      path: ':id',
      name: 'transcript',
      component: () => import('@/views/transcript'),
      meta: { title: '课程信息', icon: 'tree' }
    }]
  },
  {
    path: urls.transcript,
    component: Layout,
    // 可隐藏信息
    hidden: true,
    children: [{
      path: '/predict',
      name: 'predict',
      component: () => import('@/views/transcript/PredictResult'),
      meta: { title: '成绩预测', icon: 'tree' }
    }]
  },
  {
    path: urls.info,
    component: Layout,
    // 可隐藏信息
    hidden: true,
    children: [{
      path: '/',
      name: 'change',
      component: () => import('@/views/manager/user/change'),
      meta: { title: '个人信息', icon: 'tree' }
    }]
  },
  // 以下均为管理员权限
  {
    path: '/manager',
    component: Layout,
    hidden: true,
    children: [{
      path: 'student/add',
      name: 'addstudent',
      component: () => import('@/views/manager/student/add.vue'),
      meta: { title: '添加学生', icon: 'tree', roles: ['admin'] }
    },
    {
      path: 'student/list',
      name: 'liststudent',
      component: () => import('@/views/manager/student/list.vue'),
      meta: { title: '学生列表', icon: 'tree', roles: ['admin'] }
    },
    {
      path: 'user/add',
      name: 'addmanager',
      component: () => import('@/views/manager/user/add.vue'),
      meta: { title: '添加教师', icon: 'tree', roles: ['admin'] }
    },
    {
      path: 'user/list',
      name: 'showmanager',
      component: () => import('@/views/manager/user/list.vue'),
      meta: { title: '教师列表', icon: 'tree', roles: ['admin'] }
    },
    {
      path: 'lesson/addLesson',
      name: 'addlesson',
      component: () => import('@/views/manager/lesson/addLesson.vue'),
      meta: { title: '添加课程', icon: 'tree', roles: ['admin'] }
    },
    {
      path: 'class/add',
      name: 'addClassInfo',
      component: () => import('@/views/manager/classfield/add.vue'),
      meta: { title: '添加班级', icon: 'tree', roles: ['admin'] }
    },
    {
      path: 'class/list',
      name: 'classList',
      component: () => import('@/views/manager/classfield/index.vue'),
      meta: { title: '班级信息列表', icon: 'tree', roles: ['admin'] }
    },
    {
      path: 'class/classfield',
      name: 'addClassField',
      component: () => import('@/views/manager/classfield/form.vue'),
      meta: { title: '添加和修改班级', icon: 'tree', roles: ['admin'] }
    }]
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开 使用可以消除绝对路径url中的'#'符，可选操作
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

