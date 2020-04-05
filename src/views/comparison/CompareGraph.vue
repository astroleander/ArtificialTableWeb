<template>
  <div id="Diagram" class="compareGraph"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'CompareGraph',
  props: {
    dataSet: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      index: 0
    }
  },
  methods: {
    // 绘制条状图
    drawPie() {
      // console.log("dataSet");
      // console.log(this.dataSet);
      // console.log(this.dataSet[0].source);
      // console.log(this.dataSet[0].source[0][1]);

      var Diagram = document.getElementById('Diagram')
      // 初始化图表
      var myChart = echarts.init(Diagram)

      this.index = 1
      const that = this
      var option = {
        legend: {
          orient: 'horizontal', // 'vertical' | 'horizontal'
          x: 'left', // 'center' | 'left' | {number},
          y: 'top' // 'center' | 'bottom' | {number}
        },
        tooltip: {
          trigger: 'axis',
          showContent: true,

          formatter: function(params) {
            // console.log("toooltip.params");
            // console.log(params);
            // return ``;

            if (params.length === 1) {
              return `
              ${that.varyArray[0][1]}</br>
              ${params[0].name}: ${params[0].value[1]}人</br>
            `
            } else {
              return `
              ${params[0].value[0]}</br>
              ${params[0].seriesName}: ${params[0].value[1]}%</br>
              ${params[1].seriesName}: ${params[0].value[2]}分</br>
            `
            }
          }
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        dataset: [
          {
            source: this.varyArray
            // [
            //   ["classes","1班","2班","3班","4班","5班","6班","7班","8班","9班","10班"],
            //   ["0~60", 10, 10, 10, 10, 10, 20, 20, 20, 30, 20],
            //   ["60~70", 30, 40, 20, 20, 20, 10, 10, 10, 20, 20],
            //   ["70~80", 20, 30, 30, 20, 20, 30, 20, 20, 20, 20],
            //   ["80~90", 20, 10, 20, 30, 20, 20, 30, 20, 20, 20],
            //   ["90~100", 20, 10, 20, 20, 30, 20, 20, 30, 10, 20]
            // ]
          },
          {
            source: this.dataSet[1].source
            // [
            //   ["classes","1班","2班","3班","4班","5班","6班","7班","8班","9班","10班"],
            //   ["及格率", 50, 66, 69, 84, 91, 43, 81, 90, 77, 83],
            //   ["平均分", 54, 60, 72, 81, 99, 46, 85, 95, 62, 79]
            // ]
          }
        ],
        xAxis: [
          {
            type: 'category',
            axisPointer: {
              type: 'shadow'
            },
            gridIndex: 0
          },
          {
            type: 'category',
            axisPointer: {
              type: 'shadow'
            },
            gridIndex: 1
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数',
            axisLabel: {
              formatter: '{value} 人'
            },
            gridIndex: 0
          },
          {
            type: 'value',
            name: '平均分',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value} 分'
            },
            gridIndex: 1
          },
          {
            type: 'value',
            name: '及格率',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value} %'
            },
            gridIndex: 1
          }
        ],
        grid: [{ bottom: '60%', right: '50%' }, { top: '50%' }],
        series: [
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            datasetIndex: 0,
            center: ['80%', '25%'],
            label: {
              formatter: '{b}: {@' + this.dataSet[0].source[0][1] + '} 人({d}%)'
            },
            encode: {
              itemName: 'classes',
              value: this.dataSet[0].source[0][1],
              tooltip: this.dataSet[0].source[0][1]
            },
            color: ['#C23531', '#FFDB5C', '#FF9F7F', '#37A2DA', '#9FE6B8']
          },
          {
            name: '各分数段人数',
            type: 'line',
            color: '#37A2DA',
            datasetIndex: 0,
            barMaxWidth: 50,
            xAxisIndex: 0,
            yAxisIndex: 0
            // smooth:true,
            // label: {
            //   formatter: "{b}: {@" + this.dataSet[0].source[0][1] + "} 人({d}%)"
            // },
            // encode: {
            //   itemName: "classes",
            //   value: this.dataSet[0].source[0][1],
            //   tooltip: this.dataSet[0].source[0][1]
            // },
          },
          {
            name: '及格率',
            type: 'line',
            color: '#E062AE',
            seriesLayoutBy: 'row',
            barMaxWidth: 50,
            datasetIndex: 1,
            xAxisIndex: 1,
            yAxisIndex: 1
          },
          {
            name: '平均分',
            type: 'bar',
            color: '#67E0E3',
            barMaxWidth: 50,
            seriesLayoutBy: 'row',
            datasetIndex: 1,
            xAxisIndex: 1,
            yAxisIndex: 2
          }
        ]
      }

      myChart.on('click', function(params) {
        // console.log("params:");
        // console.log(params);

        if (params.componentIndex !== 0) {
          that.index = params.dataIndex + 1
          console.log('thatIndex:')
          console.log(that.varyArray)

          var choiceName = that.varyArray[0][1]
          console.log(choiceName)

          myChart.setOption({
            dataset: [
              {
                source: that.varyArray
              }
            ],
            series: [
              {
                name: '各分数段人数',
                type: 'line',
                color: '#37A2DA',
                datasetIndex: 0,
                xAxisIndex: 0,
                yAxisIndex: 0
              },
              {
                type: 'pie',
                id: 'pie',
                radius: '30%',
                datasetIndex: 0,
                center: ['80%', '25%'],
                label: {
                  formatter:
                    '{b}: {@' + choiceName + '} 人({d}%)'
                },
                encode: {
                  itemName: 'classes',
                  value: choiceName,
                  tooltip: choiceName
                },
                color: ['#C23531', '#FFDB5C', '#FF9F7F', '#37A2DA', '#9FE6B8']
              }
            ]
          })
        }
      })

      myChart.setOption(option, true)
    }
  },
  computed: {
    varyArray: function() {
      var temp = [
        ['classes', ''],
        ['0~60', 0],
        ['60~70', 0],
        ['70~80', 0],
        ['80~90', 0],
        ['90~100', 0]
      ]

      if (this.index != 0) {
        temp[0][1] = this.dataSet[0].source[0][this.index]
        temp[1][1] = this.dataSet[0].source[1][this.index]
        temp[2][1] = this.dataSet[0].source[2][this.index]
        temp[3][1] = this.dataSet[0].source[3][this.index]
        temp[4][1] = this.dataSet[0].source[4][this.index]
        temp[5][1] = this.dataSet[0].source[5][this.index]
      }

      return temp
    }
  },
  watch: {
    dataSet: function() {
      if (this.dataSet.length > 0) {
        this.drawPie()
      }
    }
  },
  mounted() {
    if (this.dataSet.length > 0) {
      this.drawPie()
    }
  }
}
</script>

<style lang="scss" scoped>
.compareGraph {
  width: 800px;
  height: 600px;
  margin: auto;
}
</style>
