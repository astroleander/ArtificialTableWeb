<!--
name:滑动条组件
Author:liqian
Date:2018.11.16
version:0.0.2
function：拖动条样式、拖动条高度、提示框的样式、最小值、最大值均可以在sliderStyle对象中设置
-->
<template>
  <div class="container">
    <div class="title-box">
      {{title}}
    </div>
    <div class="slider-box">
    <vue-slide-bar v-model="value"
      :data="dataPoint"
      :lineHeight="sliderStyle.lineHeight"
      :tooltipStyles="sliderStyle.tooltipStyle"
      :processStyle="sliderStyle.processStyle"
      :min="sliderStyle.min"
      :max="sliderStyle.max"
      />
    </div>
  </div>
</template>

<script>
import VueSlideBar from 'vue-slide-bar'
export default {
  name: 'at-slider-power',
  components: { VueSlideBar },
  props: {
    // label的名字
    title: {
      type: String,
      default: 'loading...'
    },
    // 滑动条的值
    value: {
      type: [String, Number],
      default: 50
    },
    // 是否可用
    // isdisabled: {
    //   type: Boolean,
    //   default: false
    // },
    // 样式等
    sliderStyle: {
      type: Object,
      default: () => {
        return {
          min: 0, // 最小值
          max: 100, // 最大值
          lineHeight: 5, // 拖动条高度
          processStyle: null, // 拖动条样式
          tooltipStyle: null // 提示框样式
        }
      }
    },
    // 间断点
    dataPoint: {
      type: Array,
      default: null
    }
  },
  // 监听value
  watch: {
    value: function(val) {
      this.$emit('notifyChanged', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  flex-direction: row;
  max-width: 50%;
  justify-content: flex-start;
  align-content: space-between;
  flex-wrap: wrap;
  min-width: 300px;
}  
// simplest and most clear way to make text vertically align center
.title-box{
  width: 10%;
  display: inline-flex;
  align-content: center;
  align-items: center;
  flex-direction: row;
}
.slider-box{
  width: 80%;
  min-width: 300px;
  padding-bottom:  24px;
}
</style>
