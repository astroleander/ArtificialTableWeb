<!--suppress ALL -->
<template>
    <div :id="'radar' + radarId" class="box" >
    </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    name: 'AtRadar',
    props: {
      // 贡献值数组
      dataSet: {
        type: Array,
        default: () => []
      },
      // 贡献组
      dataItem: {
        type: Array,
        default: () => []
      },
        dataTitlegroupname: {
            type: String,
            default: null
        },
      radarId: {
        type: [String, Number],
        default: 0
      }
    },
    methods: {
      drawRadar() {
        // 初始化图表
        // console.log(this.dataItem)
        this.chartRadar = echarts.init(document.getElementById('radar' + this.radarId))
        // 绘制
        this.chartRadar.setOption({
        // 标题
          title: {
            text: '各项测试对提高' + this.dataTitlegroupname + '的贡献值'
          },
          tooltip: {},
          // 雷达图
          radar: {
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
              }
            },
            // 加载数据
            indicator: this.dataItem
          },
          // 各个小项加载
          series: [{
            name: '贡献值',
            type: 'radar',
            areaStyle: { normal: { }},
            data: [{
              value: this.dataSet,
              name: '贡献值',
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    return params.value
                  }
                }
              }
            }]
          }]
        }, true)
      }
    },
    watch: {
      dataItem: function() {
        if (this.dataItem) {
          this.drawRadar()
        }
      }
    },
    mounted() {
      this.drawRadar()
    },
    created() {
      this.drawRadar()
    }
  }
</script>

<style lang="scss" scoped>
    .box{
        width: 500px;
        height: 500px;
    }
</style>
