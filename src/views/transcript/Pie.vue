<template>
  <div :id="'Diagram'+DiagramId"  class="pie">
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'AtPie',
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
      drawPie() {
        // 初始化图表
        console.log('wolaile')
        this.chartPie = echarts.init(document.getElementById('Diagram' + this.DiagramId))
        // 绘制
        console.log('wolaile1')
        this.chartPie.setOption({
          // 图表颜色
          title: {
            text: '预测成绩及格情况',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['及格', '不及格']
          },
          series: [
            {
              name: '预测成绩及格情况',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.dataSet,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }, true)
      }
    },
    watch: {
      dataSet: function() {
        if (this.dataSet) {
          this.drawPie()
        }
      }
    },
    mounted() {
      this.drawPie()
    }
  }
</script>

<style lang="scss" scoped>
  .pie{
    width: 400px;
    height: 400px;
  }
</style>
