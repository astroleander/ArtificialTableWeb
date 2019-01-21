<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#4caf50"
      text-color="#DDD"
      active-text-color="#212121"
      
    >
    <sidebar-item :routes="routes"></sidebar-item>

    <el-menu-item v-if="this.is_manager" index="999" disabled class="switch">
      <svg-icon icon-class="domain"></svg-icon>
      <template slot="title">
        <span style="color:#EEE;">管理员模式</span>
        <el-switch v-model="handler"
          @change="onSwitchChange"
          active-color="#000"
          inactive-color="#000"
          >
        </el-switch>
      </template>
    </el-menu-item>
    <el-submenu v-if="this.handler" index="9990">
      <template slot="title">
          <svg-icon icon-class="domain"></svg-icon>
          <span>管理教师信息</span>
      </template>
      <el-menu-item index="9998">
        <template slot="title">
          <router-link to="/manager/user/list">
            <svg-icon icon-class="domain"></svg-icon>
            <span>教师列表</span>
          </router-link>
        </template>
      </el-menu-item>
      <router-link :to="{ name: 'addmanager', params: { type:'add' }}">
        <el-menu-item index="9995">
          <svg-icon icon-class="domain"></svg-icon>
          <span slot="title">添加教师</span>
        </el-menu-item>
      </router-link>
    </el-submenu>


    <el-submenu v-if="this.handler" index="9991">
      <template slot="title">
          <svg-icon icon-class="domain"></svg-icon>
          <span>管理教学班信息</span>
      </template>
      <el-menu-item index="2131">
        <template slot="title">
          <router-link to="/manager/class/list">
            <svg-icon icon-class="domain"></svg-icon>
            <span>班级列表</span>
          </router-link>
        </template>
      </el-menu-item>
      <router-link :to="{ name: 'addClassInfo', params: { type:'add' }}">
        <el-menu-item index="21412">
          <svg-icon icon-class="domain"></svg-icon>
          <span slot="title">添加班级</span>
        </el-menu-item>
      </router-link>
    </el-submenu>

    <router-link to="/manager/student">
      <el-menu-item v-if="this.handler" index="9992">
        <svg-icon icon-class="domain"></svg-icon>
        <span slot="title">添加学生</span>
      </el-menu-item>
    </router-link>

    <router-link to="/manager/lesson">
      <el-menu-item v-if="this.handler" index="9993">
        <svg-icon icon-class="domain"></svg-icon>
        <span slot="title">添加课程</span>
      </el-menu-item>
    </router-link>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data() {
    return {
      handler: this.use_manager
    }
  },
  methods: {
    onSwitchChange(newValue) {
      this.$store.dispatch('setUseManager', newValue)
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
    this.handler = this.use_manager
  }
}
</script>

<style lang="scss" scoped>
.switch {
  opacity: 1;
  cursor: default;
}
</style>
