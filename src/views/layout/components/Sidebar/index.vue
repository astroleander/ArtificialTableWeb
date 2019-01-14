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

    <el-menu-item v-if="this.is_manager" index="999">
      <template slot="title">
        <span style="color:#EEE;">开启管理员模式</span>
        <el-switch v-model="handler"
          @change="onSwitchChange"
          active-color="#000"
          inactive-color="#000"
          >
        </el-switch>
      </template> 
    </el-menu-item>
    <el-menu-item v-if="this.handler" index="9991">
      <template slot="title">
        <router-link to="/manager/user" >
          <svg-icon icon-class="domain"></svg-icon>
          <span>添加用户</span>
        </router-link>
      </template>
    </el-menu-item>
    <el-menu-item v-if="this.handler" index="9992">
      <template slot="title">
        <router-link to="/manager/student">
          <svg-icon icon-class="domain"></svg-icon>
          <span>添加学生</span>
        </router-link>
      </template>
    </el-menu-item>
    <el-menu-item v-if="this.handler" index="9993">
      <template slot="title">
        <router-link to="/manager/lesson">
          <svg-icon icon-class="domain"></svg-icon>
          <span>添加课程</span>
        </router-link>
      </template>
    </el-menu-item>
    <el-menu-item v-if="this.handler" index="9995">
      <template slot="title">
        <router-link to="/manager/class">
          <svg-icon icon-class="domain"></svg-icon>
          <span>添加班级</span>
        </router-link>
      </template>
    </el-menu-item>
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
  },
}
</script>
