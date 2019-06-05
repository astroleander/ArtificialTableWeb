<!-- 左侧菜单栏中点击一个主菜单显示下方子菜单列表-->
<template>
  <div class="menu-wrapper">
    <!-- for each routes item, if not hidden or its not a child -->
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <!-- generate route-link for root item if only have one children -->
      <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name">
        <!-- default root button -->
        <!-- if not isNest, will not show the dropdwon -->
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- read route item's .meta.icon -->
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <!-- read route item's .meta.title -->
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <!-- if continue on line 6, if not hasOneShowingChildren, execute this template -->
      <!-- generate route-link and bottons with dropdown menu -->
      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <!-- button -->
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>

        <!-- generate button for each child of item -->
        <template v-for="child in item.children" v-if="!child.hidden">
          <!-- call sidebar-item recursively -->
          <!-- if have multiple children -->
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>
          <!-- or for item, there is just only one child, then generate the child button, not create recursion loop -->
          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>
