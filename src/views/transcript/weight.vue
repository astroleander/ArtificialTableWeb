<!-- Tree Structure of weight and analysis page of Transcript section  -->
<!--
table
    |- div
        |- TODO: menu
        |- TODO: table
            |- ... TODO: row
-->
<!---->
<!--suppress ALL -->
<template>
  <div class="row" >
    <div class="row-box">
    <at-bar class="bar-box" :data-set="gradeSection"></at-bar>
    <div class="col">
      <el-progress type="circle" :width="80"  :percentage="0" status="text">总人数<br>{{total}}</el-progress>
      <el-progress type="circle" :width="80"  :percentage="100"  status="text">有效成绩<br>{{valid}}</el-progress>
      <el-progress type="circle" :width="80"  :percentage="rate"  color="#13ce66" status="text">及格率<br>{{rate}}%</el-progress>
      <el-progress type="circle" :width="80"  :percentage="100" color="#FFA07A" status="text">平均分<br/>{{avg}}</el-progress>
    </div>
    </div>
    <at-radar class="radar-box" :title-data="titles" :data-set="titleAverage" v-if="flag"></at-radar>
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
</template>

<script>
import AtRadar from './radar'
import AtBar from './Bar'
import viewmodel from '@/viewmodel/table'
import titleGroupViewModel from '@/viewmodel/titleGroup'

export default {
  name: 'transcriptWeight',
  components: { AtBar, AtRadar },
  props: {
    // 是否显示提示卡片
    flag:{
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
      default:0
    },
    // 班级总人数
    total:{
      type: Number,
      default:0
    },
    // 班级有效成绩
    valid:{
      type: Number,
      default:0
    },
    // 及格率
    rate:{
      type: Number,
      default:0
    },
    // 小项的信息，包含name，max
    titles:{
      type:Array,
      default: () =>[]
    },
    // 小项平均分
    titleAverage:{
      type:Array,
      default: () =>[]
    },
    //成绩分组
    gradeSection:{
      type:Array,
      default: () =>[]
    }
  },
  data() {
    return {
      message: '数据不全，请完善数据后分析成绩',
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
  width: 40%;
  min-width: 380px;
}
.row{
  display: flex;
  flex-direction: row;
}
.text{

}
.row-box{
  display: flex;
  width: 50%;
  margin-left: 5%;
  flex-direction: row;
}
.col{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 50px;
  margin-top: 30px;
  height: 350px;
  width: 80px;
}
.bar-box{
  width: 40%;
}
</style>
