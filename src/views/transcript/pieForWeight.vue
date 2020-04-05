<template>
    <div :id="'Diagram'+DiagramId"  class="pie">
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
      name: 'pieForWeight',
      data() {
        return {
          data: []
        }
      },
      props: {
        dataSet: {
          type: Array,
          default: () => []
        },
        DiagramId: {
          type: [String, Number],
          default: 1
        },
        titleText: {
          type: String,
          default: ''
        }
      },
      methods: {
        // 绘制条状图
        drawPie() {
          this.data = []
          if (this.dataSet) {
            this.data.push({
              value: this.dataSet[0],
              name: '0-60分'
            })
            this.data.push({
              value: this.dataSet[1],
              name: '60-70分'
            })
            this.data.push({
              value: this.dataSet[2],
              name: '70-80分'
            })
            this.data.push({
              value: this.dataSet[3],
              name: '80-90分'
            })
            this.data.push({
              value: this.dataSet[4],
              name: '90-100分'
            })
          }
          // 初始化图表
          // console.log('wolaile')
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
              data: ['0-60分', '60-70分', '70-80分', '80-90分', '90-100分']
            },
            series: [
              {
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                data: this.data
              }
            ]
          })
        }
      },
      watch: {
        dataSet: function() {
          this.drawPie()
        }
      },
      mounted() {
        this.drawPie()
      }
    }
</script>

<style lang="scss" scoped>
    .pie{
       width: 500px;
       height: 300px;
    }
</style>