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
        default: 2
      },
      titleText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        data: []
      }
    },
    methods: {
      // 绘制条状图
      drawPie() {
        if (this.dataSet) {
          this.data.push({
            value: this.dataSet[0],
            name: '0-60'
          })
          this.data.push({
            value: this.dataSet[1],
            name: '60-70'
          })
          this.data.push({
            value: this.dataSet[2],
            name: '70-80'
          })
          this.data.push({
            value: this.dataSet[3],
            name: '80-90'
          })
          this.data.push({
            value: this.dataSet[4],
            name: '90-10'
          })
        }
        // 初始化图表
        this.chartPie = echarts.init(document.getElementById('Diagram' + this.DiagramId))
        // 绘制
        this.chartPie.setOption({
          // 图表颜色
          title: {
            text: this.titleText,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            data: ['0-60', '60-70', '70-80', '80-90', '90-100']
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.data,
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
    height: 300px;
  }
</style>
