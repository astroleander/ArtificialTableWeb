<!--成绩管理系统的左上侧的标头 可直接套用-->
<!-- 模版   -->
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- 页面过渡转换 -->
    <transition-group name="breadcrumb">
      <!-- ? -->
      <!-- v-for循环操作 输出（item,index） 来源于levelList v-if 条件判断 连接下方v-else -->
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <!-- ? -->
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
        <!-- 路由地址，同时:to用于绑定进行传参-->
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<!-- 逻辑操作部分 -->
<script>
// 对外暴露 输出口
export default {
  created() {
    this.getBreadcrumb()
  },
  // 数据存储
  data() {
    return {
      levelList: null
    }
  },
  // ？
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  // 方法调用
  methods: {
    // 函数
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first) {
        matched = [{ path: '/', meta: { title: '成绩录入系统' }}].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
