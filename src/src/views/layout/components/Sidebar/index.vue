<!-- 左侧菜单栏中管理员增加的权限显示 此处可添加管理员权限功能 -->
<template>
  <el-scrollbar  wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="this.color"
      text-color="#DDD"
      active-text-color="#212121"
    >
    <sidebar-item :routes="routes"></sidebar-item>

    <el-menu-item v-if="this.use_manager" index="999" disabled divided id="divided">
      <template slot="title">
      </template>
    </el-menu-item>

    <el-menu-item v-if="this.use_manager" index="999" disabled class="switch">
      <svg-icon icon-class="lock"></svg-icon>
      <template slot="title">
        <span style="color:#EEE;">管理员模式</span>
      </template>
    </el-menu-item>

      <el-submenu v-if="this.use_manager" index="9992">
        <template slot="title">
          <svg-icon icon-class="lessonManage"></svg-icon>
          <span>管理课程信息</span>
        </template>
        <el-menu-item index="99921">
          <template slot="title">
            <router-link to="/manager/lesson/addLesson">
              <svg-icon icon-class="addCourse"></svg-icon>
              <span>添加课程</span>
            </router-link>
          </template>
        </el-menu-item>
      </el-submenu>

    <el-submenu v-if="this.use_manager" index="9990">
      <template slot="title">
          <svg-icon icon-class="user"></svg-icon>
          <span>管理教师信息</span>
      </template>
      <el-menu-item index="9998">
        <template slot="title">
          <router-link to="/manager/user/list">
            <svg-icon icon-class="userList"></svg-icon>
            <span>教师列表</span>
          </router-link>
        </template>
      </el-menu-item>
      <router-link :to="{ name: 'addmanager', params: { type:'add' }}">
        <el-menu-item index="9995">
          <svg-icon icon-class="addUser"></svg-icon>
          <span slot="title">添加教师</span>
        </el-menu-item>
      </router-link>
    </el-submenu>


    <el-submenu v-if="this.use_manager" index="9991">
      <template slot="title">
          <svg-icon icon-class="domain"></svg-icon>
          <span>管理教学班信息</span>
      </template>
      <el-menu-item index="2131">
        <template slot="title">
          <router-link to="/manager/class/list">
            <svg-icon icon-class="list"></svg-icon>
            <span>班级列表</span>
          </router-link>
        </template>
      </el-menu-item>
      <router-link :to="{ name: 'addClassInfo', params: { type:'add' }}">
        <el-menu-item index="21412">
          <svg-icon icon-class="addClass"></svg-icon>
          <span slot="title">添加班级</span>
        </el-menu-item>
      </router-link>
    </el-submenu>

    <el-submenu v-if="this.use_manager" index="9993">
      <template slot="title">
          <svg-icon icon-class="userList"></svg-icon>
          <span>管理学生信息</span>
      </template>
      <el-menu-item index="213133">
        <template slot="title">
          <router-link to="/manager/student/list">
            <svg-icon icon-class="list"></svg-icon>
            <span>学生列表</span>
          </router-link>
        </template>
      </el-menu-item>
      <el-menu-item v-if="this.use_manager" index="99925">
        <template slot="title">
          <router-link to="/manager/student/add">
            <svg-icon icon-class="addUser"></svg-icon>
            <span>添加学生</span>
          </router-link>
        </template>
      </el-menu-item>
    </el-submenu>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
const cyan = '#4CAF50'
const green = '#00BCD4'
export default {
  components: { SidebarItem },
  data() {
    return {
      color: null
    }
  },
  methods: {
    onSwitchChange(newValue) {
      this.$store.dispatch('setUseManager', newValue)
    },
    init() {
      console.log('1234567')
      console.log(this.is_manager)
      console.log(this.use_manager)
      if (this.use_manager) {
        return cyan
      } else {
        return green
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'use_manager',
      'is_manager',
      'user'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    // console.log('sizebar create use_manager')
    // console.log(this.use_manager)
    // this.handler = this.use_manager
    if (this.use_manager) {
      this.color = cyan
    } else {
      this.color = green
    }
  },
  watch: {
    use_manager() {
      // console.log('sizebar watch use_manager')
      // console.log(this.use_manager)
      this.color = this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.switch {
  opacity: 1;
  cursor: default;
}
</style>

<style lang="scss">
#divided {
  height: 2px;
  background-color: #FFF !important;
  cursor: default;
}
</style>

