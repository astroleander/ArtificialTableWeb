import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// lang i18n
import locale from 'element-ui/lib/locale/lang/en'

// global css
// 引入Element UI，同时引入全局css文件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets

// icon
import '@/icons'
// permission control
import '@/permission'
// urls
import '@/urls'

// mockjs
// ban
// import './mock'

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

// 创建vue实例，指定对应操作容器ID为app 操作app.vue 将核心数据仓库store传给每个组件
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
