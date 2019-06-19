<!-- 右上角用于返回主页和退出登录模版 可直接套用 -->
<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
        <span>欢迎您，{{user.name}}{{role}}</span>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">

        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            返回主页
          </el-dropdown-item>
        </router-link>

        <router-link  class="inlineBlock" to="/user/info/">
          <el-dropdown-item>
            个人信息
          </el-dropdown-item>
        </router-link>

         <el-dropdown-item v-if="this.is_manager">
           <span @click="onSwitchChange" style="display:block;">切换身份</span>
         </el-dropdown-item>

        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出登陆</span>
        </el-dropdown-item>

      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user',
      'is_manager',
      'use_manager'
    ])
  },
  data() {
    return {
      role: ''
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    init() {
      if (this.use_manager) {
        return '年级组长'
      } else {
        return '普通教师'
      }
    },
    onSwitchChange() {
      this.$router.replace({ path: '/' })
      if (this.use_manager) {
        this.$store.dispatch('setUseManager', false)
        this.role = '普通教师'
        this.$message({
          message: '已开启教师身份',
          type: 'success'
        })
      } else {
        this.$store.dispatch('setUseManager', true)
        this.role = '年级组长'
        this.$message({
          message: '已开启年级组长身份',
          type: 'success'
        })
      }
      location.reload()
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  },
  watch: {
    use_manager: function() {
      this.init()
    }

  },
  created() {
    if (this.use_manager) {
      this.role = '年级组长'
    } else {
      this.role = '普通教师'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

