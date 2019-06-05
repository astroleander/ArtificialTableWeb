<!--绘制成绩比较条形图-->
<template>
  <div :id="'PassDiagram'+DiagramId"  v-if="dataSet" >
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'PassExamBar',
  props: {
    dataSet: {
      type: Object,
      default: () => {}
    },
    DiagramId: {
      type: [String, Number],
      default: 0
    }
  },
  methods: {
    drawPassExamBar() {
      this.Bar = echarts.init(document.getElementById('PassDiagram' + this.DiagramId))
      this.Bar.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['及格', '不及格']
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 40
            },
            // data: ['一般', '一般', '一般', '一般', '一般', '一般', '一般', '一般']
            data: this.dataSet[2] // 班级名称
          }
        ],
        yAxis: [
          {
            name: '人数',
            type: 'value'
          }
        ],
        series: [
          {
            name: '及格',
            type: 'bar',
            stack: '总人数',
            color: '#B4EEB4',
            barMaxWidth: 50,
            // data: [20, 10, 14, 30, 20, 10, 14, 30]
            data: this.dataSet[3] // 各班及格人数
          },
          {
            name: '不及格',
            type: 'bar',
            stack: '总人数',
            color: '#E9967A',
            barMaxWidth: 50,
            // data: [10, 10, 4, 10, 20, 10, 14, 30]
            data: this.dataSet[4] // 各班不及格人数
          }
        ]
      }, true)
    }
  },
  watch: {
    dataSet: function() {
      this.drawPassExamBar()
    }
  },
  mounted() {
    this.drawPassExamBar()
  }
}
</script>

<style lang="scss" scoped>

</style>
