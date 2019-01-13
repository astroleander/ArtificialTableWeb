<template>
  <div :id="'Diagram'+DiagramId"  class="bar">
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'AtBar',
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
      this.chartBar = echarts.init(document.getElementById('Diagram' + this.DiagramId))
      this.chartBar.setOption({
        color: ['#3398FB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: '分数段',
            data: ['0-60', '60-70', '70-80', '80-90', '90-100']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数'
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: 50,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: this.dataSet
          }
        ]
      }, true)
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
.bar{
  width: 400px;
  height: 400px;
}
</style>
