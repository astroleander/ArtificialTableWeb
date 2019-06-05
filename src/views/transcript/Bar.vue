<!-- 主页面点击任课班级卡片信息后跳转页面中的成绩分析模块的条状图 -->
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
    // 绘制条状图
    drawBar() {
      // 初始化图表
      this.chartBar = echarts.init(document.getElementById('Diagram' + this.DiagramId))
      // 绘制
      this.chartBar.setOption({
        // 图表颜色
        color: ['#3398FB'],
        title: {
          text: '分数分布'
        },
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
        // 横坐标
        xAxis: [
          {
            type: 'category',
            name: '分数段',
            data: ['0-60', '60-70', '70-80', '80-90', '90-100']
          }
        ],
        // 纵坐标
        yAxis: [
          {
            type: 'value',
            name: '人数'
          }
        ],
        // 加载数据
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
