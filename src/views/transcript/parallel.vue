<template>
  <div :id="'Diagram'+DiagramId"  class="parallel">
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: 'AtPara',
    props: {
      titles: {
        type: Array,
        default: () => []
      },
      points: {
        type: Array,
        default: () => []
      },
      DiagramId: {
        type: [String, Number],
        default: 1
      }
    },
    data() {
      return {
        dims: []
      }
    },
    methods: {
      // 绘制条状图
      drawPara() {
        // 初始化图表
        // console.log('aaaaaaaaaa')
        this.chartPie = echarts.init(document.getElementById('Diagram' + this.DiagramId))
        // 初始化维度
        let i = 0
        this.dims = []
        this.titles.forEach(elem => {
          this.dims.push({ dim: i, name: elem, min: 0, max: 100 })
          i += 1
        })
        // console.log(this.dims)
        // 绘制
        this.chartPie.setOption({
          parallelAxis: this.dims,
          series: {
            type: 'parallel',
            lineStyle: {
              width: 4
            },
            data: [
              this.points
            ]
          }
        }, true)
      }
    },
    watch: {
      points: function() {
        this.drawPara()
      }
    },
    mounted() {
      this.drawPara()
    }
  }
</script>

<style lang="scss" scoped>
  .parallel{
    width: 850px;
    height: 400px;
  }
</style>
