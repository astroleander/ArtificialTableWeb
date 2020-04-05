<template>
    <div :id="'Diagram'+DiagramId"  class="funnel">
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
      name: 'AtFun',
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
          default: 3
        }
      },
      methods: {
        // 绘制条状图
        drawFun: function() {
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
          // console.log('2222222222222')
          // console.log(this.data)

          // 初始化图表
          // console.log('wolaile')
          this.chartPie = echarts.init(document.getElementById('Diagram' + this.DiagramId))
          // 绘制
          this.chartPie.setOption({
            // 图表颜色
            title: {
              text: '漏斗图',
              subtext: '',
              left: 'right',
              top: 'top'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%'
            },
            toolbox: {
              orient: 'vertical',
              top: 'center',
              feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
              }
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['0-60分', '60-70分', '70-80分', '80-90分', '90-100分']
            },

            series: [
              {
                name: '漏斗图',
                type: 'funnel',
                left: '10%',
                top: 60,
                // x2: 80,
                bottom: 60,
                width: '80%',
                // height: {totalHeight} - y - y2,
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                  show: true,
                  position: 'inside'
                },
                labelLine: {
                  length: 10,
                  lineStyle: {
                    width: 1,
                    type: 'solid'
                  }
                },
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 1
                },
                emphasis: {
                  label: {
                    fontSize: 20
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
          this.drawFun()
        }
      },
      mounted() {
        this.drawFun()
      }
    }
</script>

<style lang="scss" scoped>
    .funnel{
       width: 400px;
       height: 350px;
    }
</style>