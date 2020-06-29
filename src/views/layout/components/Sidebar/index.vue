<!-- 左侧菜单栏中管理员增加的权限显示 此处可添加管理员权限功能 -->
<template>
  <el-scrollbar  wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="this.color"
      text-color="#FFF"
      active-text-color="#0054AF"
    >
    <sidebar-item  :routes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
const cyan = '#0054AF'
// const cyan = '#31b7a9' :background-color="this.color"
const leyan = '#0054AF'
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
    if (this.use_manager) {
      this.color = leyan
    } else {
      this.color = cyan
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

