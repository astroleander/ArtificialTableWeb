<!-- Tree Structure of weight and analysis page of Transcript section  -->
<!--
table
    |- div
        |- DONE: menu
        |- DONE: table
            |- ... DONE: row
-->
<!-- 成绩分析模版 -->
<!-- 1、成绩分析条形图 自定义组件 at-bar 来源于Bar.vue-->
<!-- 2、成绩分析数据图 -->
<!-- 3、成绩分析雷达图 自定义组件 at-radar 来源于radar.vue-->

<!-- 用于为用户定义成绩分析的自定义组件模版 -->
<!--suppress ALL -->
<template>
  <div>
  <div class="frame" style="margin-top: 1px">
    <div class="col">
      <el-progress type="circle" :width="100"  :percentage="0" status="text" style="margin-right: 70px; margin-left: 50px">总人数<br>{{total}}</el-progress>
      <el-progress type="circle" :width="100"  :percentage="100"  status="text"style="margin-right: 70px">有效成绩<br>{{valid}}</el-progress>
      <el-progress type="circle" :width="100"  :percentage="rate"  color="#13ce66" status="text"style="margin-right: 70px">及格率<br>{{rate}}%</el-progress>
      <el-progress type="circle" :width="100"  :percentage="100" color="#FFA07A" status="text"style="margin-right: 70px">平均分<br/>{{avg}}</el-progress>
    </div>
    <div style="background-color: #e2e1e0;height: 1px"></div>
    <div class="row-box">
     <!-- 条状图 -->
    <at-bar class="bar-box" :data-set="gradeSection"></at-bar>
      <!--雷达图-->
    <at-radar class="radar-box" :title-data="titles" :data-set="titleAverage" v-if="flag"></at-radar>
      <!-- 人数、成绩、及格率、平均分信息 -->
    </div>
    <!--数据无效警告 -->
    <el-card  class="card-box" v-if="!flag">
      <div slot="header" class="clearfix">
        <span>信息提示</span>
      </div>
      <div class="text">
        <el-alert
          :title="message"
          :description="description"
          type="error"
          :closable="false"
          center
          show-icon>
        </el-alert>
      </div>
    </el-card>
  </div>
  </div>
</template>

<script>
import AtRadar from './radar'
import AtBar from './Bar'
// import viewmodel from '@/viewmodel/table'
// import titleGroupViewModel from '@/viewmodel/titlegroups'

export default {
  name: 'transcriptWeight',
  components: { AtBar, AtRadar },
  props: {
    // 是否显示提示卡片
    flag: {
      type: Boolean,
      default: false
    },
    // 卡片提示信息
    description: {
      type: String,
      default: ''
    },
    // 班级平均分
    avg: {
      type: Number,
      default: 0
    },
    // 班级总人数
    total: {
      type: Number,
      default: 0
    },
    // 班级有效成绩
    valid: {
      type: Number,
      default: 0
    },
    // 及格率
    rate: {
      type: Number,
      default: 0
    },
    // 小项的信息，包含name，max
    titles: {
      type: Array,
      default: () => []
    },
    // 小项平均分
    titleAverage: {
      type: Array,
      default: () => []
    },
    // 成绩分组
    gradeSection: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      message: '数据不全，请完善数据后分析成绩'
    }
  }
}
</script>

<style lang="scss" scoped>
.card-box{
  height: 300px;
  width: 40%;
  min-width: 300px;
  margin: 40px;
}
.radar-box{
  height: 380px;
  width: auto;
  min-width: 380px;
}
.frame{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
.row-box{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content:center;
  height: 500px;
}
.col{
  display: flex;
  flex-direction: row;
  align-items: center;
  // align-content:center;
  // justify-content: space-around;
  height: 200px;
}
.bar-box{
  margin-left: 20px;
  width: 50%;
}
</style>
