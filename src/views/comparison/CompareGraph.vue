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
    return {}
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

      var option = {
        legend: {
          orient: 'vertical', // 'vertical' | 'horizontal'
          x: 'left', // 'center' | 'left' | {number},
          y: 'top' // 'center' | 'bottom' | {number}
        },
        tooltip: {
          trigger: 'axis',
          showContent: true,

          formatter: function(params) {
            // console.log("toooltip.params");
            // console.log(params);
            return `
            ${params[0].value[0]}</br>
              ${params[0].seriesName}: ${params[0].value[1]}%</br>
              ${params[1].seriesName}: ${params[0].value[2]}分</br>
            `
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
            source: this.dataSet[0].source
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
        xAxis: {
          type: 'category',
          axisPointer: {
            type: 'shadow'
          }

        },
        yAxis: [
          {
            type: 'value',
            name: '平均分',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value} 分'
            }
          },
          {
            type: 'value',
            name: '及格率',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        grid: { top: '45%' },
        series: [
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            datasetIndex: 0,
            center: ['50%', '25%'],
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
            name: '及格率',
            type: 'line',
            color: '#E062AE',
            seriesLayoutBy: 'row',
            datasetIndex: 1
          },
          {
            name: '平均分',
            type: 'bar',
            color: '#67E0E3',
            barMaxWidth: 50,
            seriesLayoutBy: 'row',
            datasetIndex: 1
          }
        ]
      }

      myChart.on('click', function(params) {
        // console.log("params:");
        // console.log(params);

        if (params.seriesType !== 'pie') {
          var choiceClassName =
            params.componentType === 'xAxis' ? params.value : params.name
          myChart.setOption({
            series: {
              type: 'pie',
              id: 'pie',
              radius: '30%',
              datasetIndex: 0,
              center: ['50%', '25%'],
              label: {
                formatter: '{b}: {@' + choiceClassName + '} 人({d}%)'
              },
              encode: {
                itemName: 'classes',
                value: choiceClassName,
                tooltip: choiceClassName
              },
              color: ['#C23531', '#FFDB5C', '#FF9F7F', '#37A2DA', '#9FE6B8']
            }
          })
        }
      })

      myChart.setOption(option, true)
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
