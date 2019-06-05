<!--at-pie 自定义组件，图形化显示当前各个大项占比-->
<!-- 绘制图表 -->

<template>
  <div :id="'chartPie'+groupId"  v-show="dataSet">
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
    groupId: {
      type: [String, Number],
      default: 0
    }
  },
  methods: {
    drawPie() {
      this.chartPie = echarts.init(document.getElementById('chartPie' + this.groupId))
      this.chartPie.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '成绩权重',
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
  }
}
</script>

<style lang="scss" scoped>

</style>
