<!-- 成绩分析雷达图 -->
<template>
  <div :id="'radar' + radarId" class="box" >
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'AtRadar',
  data() {
    return {
    }
  },
  props: {
    // 小项平均值数组
    dataSet: {
      type: Array,
      default: () => []
    },
    // 名称以及最大值数组
    titleData: {
      type: Array,
      default: () => []
    },
    radarId: {
      type: [String, Number],
      default: 0
    }
  },
  methods: {
    drawRadar() {
      // 初始化图表
      this.chartRadar = echarts.init(document.getElementById('radar' + this.radarId))
      // 绘制
      this.chartRadar.setOption({
        // 标题
        title: {
          text: '小项平均分'
        },
        tooltip: {},
        // 雷达图
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          // 加载数据
          indicator: this.titleData
        },
        // 各个小项加载
        series: [{
          name: '班级小项平均分',
          type: 'radar',
          areaStyle: { normal: { }},
          data:
            [
              {
                value: this.dataSet,
                name: '小项平均分',
                label: {
                  normal: {
                    show: true,
                    formatter: function(params) {
                      return params.value
                    }
                  }
                }
              }
            ]
        }]
      }, true)
    }
  },
  watch: {
    dataSet: function() {
      console.log('this.dataSet.length = ' + this.dataSet.length)
      console.log('this.titleData.length = ' + this.titleData.length)
      if (this.dataSet.length > 0 && this.titleData.length > 0) {
        this.drawRadar()
      }
    }
  },
  mounted() {
    this.drawRadar()
  }
}
</script>

<style lang="scss" scoped>
.box{
  width: 500px;
  height: 400px;
}
</style>
