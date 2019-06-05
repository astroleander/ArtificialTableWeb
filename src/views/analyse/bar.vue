<!--suppress ALL -->
<template>
  <div :id="'chartBar'+ DiagramId"  v-if="dataItem" class="bar">
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'AtBar',
    props: {
      dataItem: {
        type: Array,
        default: () => []
      },
      dataValue: {
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
        console.log('12345678')
        console.log(this.dataItem)
        console.log(this.dataValue)
        this.chartBar = echarts.init(document.getElementById('chartBar' + this.DiagramId))
        // 绘制
        this.chartBar.setOption({
          // 图表颜色
          title: {
            text: '各项测试对提高学位英语成绩的贡献'
          },
          color: ['#3398FB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['课程影响程度']
          },
          grid: {
            left: '3%',
            right: '15%',
            bottom: '3%',
            containLabel: true
          },
          // 横坐标
          xAxis: [
            {
              type: 'category',
              name: '各项测试',
              data: this.dataItem,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          // 纵坐标
          yAxis: [
            {
              type: 'value',
              name: '数值'
            }
          ],
          // 加载数据
          series: [
            {
              name: '数值',
              type: 'bar',
              barWidth: 20,
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              data: this.dataValue
            }
          ]
        })
      }
    },
    watch: {
      dataItem: function() {
        if (this.dataItem) {
          this.drawBar()
        }
      }
    },
    mounted() {
      this.drawBar()
    },
    created() {
      this.drawBar()
    }
  }
</script>

<style lang="scss" scoped>
  .bar{
    height: 550px;
    width: 900px;
  }
</style>
