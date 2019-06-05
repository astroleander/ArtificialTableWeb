<template>
  <div :id="'Diagram'+DiagramId"  v-show="dataSet">
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'AtBar',
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['一班', '二班', '三班', '四班']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['一班', '二班', '三班', '四班']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '不及格',
            type: 'bar',
            stack: '及格',
            data: [320, 332, 301, 334]
          },
          {
            name: '不及格',
            type: 'bar',
            data: [120, 132, 101, 134]
          }
        ]
      }
    }
  },
  props: {
    dataSet: {
      type: Array,
      default: () => []
    },
    DiagramId: {
      type: [String, Number],
      default: 0
    }
  },
  methods: {
    drawBar() {
      this.chartPie = echarts.init(document.getElementById('Diagram' + this.DiagramId))
      this.chartPie.setOption(this.option, true)
    }
  },
  watch: {
    dataSet: function() {
      if (this.dataSet) {
        this.drawBar()
      }
    }
  },
  mounted() {
    this.drawBar()
  }
}
</script>

<style lang="scss" scoped>

</style>
