<!-- As container for Class Card Conponent -->
<!--用于存储课程信息卡片的容器-->
<template>
  <div>
    <el-select v-model="currentSemester">
      <el-option
        v-for="item in dataset"
        :key="item"
        :label="item">

      </el-option>
    </el-select>
    <!-- Card List -->
    <!-- 课程卡片列表-->
    <!-- transition 过渡转换 mode为转换形式 out-in现消失，再出现 -->
    <transition name="fade" mode="out-in">
      <div id="at-m-list-container" class="at-collapsible" v-show="collapsed">
        <at-class-card
          :key="item.id"
          v-for="item in dataset"
          :dataset="item">
          </at-class-card>
      </div>
    </transition>
  </div>
</template>

<script>
import AtClassCard from '@/components/Mainpage/ClassCard'

export default {
  components: { AtClassCard },
  // ？
  props: [
    'dataset'
  ],
  data() {
    return {
      collapsed: true
    }
  },
  methods: {
    onClickCard: cid => {
      //
    }
  }
}
</script>

<style lang="scss" scoped>
// toggle boxs
.toggle {
  display: none;

  //     & ~ .at-collapsible{
  //         display: none;
  //         transition: all 1s ease-in-out;
  //         // opacity: 0;
  //     }
  //     &:checked ~  .at-collapsible{
  //         display: block;
  //         transition: all 1s ease-in-out;
  //         opacity: 100;
  //     }
}

.label-toggle {
  display: block;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  &:hover {
    transform: translateY(1px);
    transition: 0ms;
  }
  // 建立小三角形，并添加动画效果，在::before
  // 更多信息 @see https://css-tricks.com/snippets/css/css-triangle/
  // TODO: 小三角
  &::before {
    content: " ";
    display: inline-block;

    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid currentColor;

    vertical-align: middle;
    margin-right: 0.7rem;
    transform: translateY(-2px);

    transition: transform 0.2s ease-out;
  }
}
</style>
