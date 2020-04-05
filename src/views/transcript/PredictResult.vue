<template>
  <div class="predictResult">
    <section class="table">
      <el-table :data="dataSet" v-loading.body="loading" ref="table" id="transcript-predict"
                element-loading-text="Loading">
        <template slot="empty">
          <el-alert id="table-emptyalert"
            title="没有数据"
            type="warning"
            :closable='false'
            description="没有数据，请确认您选择数据的完整性！"
            show-icon>
          </el-alert>
        </template>
        <el-table-column label="序号" width="50">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="sid" sortable min-width="100"></el-table-column>
        <el-table-column label="学生姓名" prop="name"></el-table-column>
        <el-table-column label="预测分数" prop="pointNumber" sortable min-width="100"></el-table-column>
        <el-table-column label="预测结果" prop="pass" sortable min-width="100">
          <template slot-scope="scope">
            <span v-if="showPassed(scope.row)">不及格</span>
            <span v-else>及格</span>
          </template>
        </el-table-column>
      </el-table>
        <div class="pie-box" style="width: 40%; background-color: white">
            <at-pie  v-if="this.number > 1" class="pie" :dataSet="currentDataSet"></at-pie>
        </div>
    </section>
      <at-para v-if="this.number == 1" class='para' :titles="this.titleNames" :points="this.points"></at-para>

  </div>
</template>

<script>
  import AtPie from './Pie'
  import AtPara from './parallel'
  import getPredictionViewModel from '@/viewmodel/point'

  export default {
    name: 'PredictResult',
    components: { AtPie, AtPara },
    props: {
      dataSet: {
        type: Array,
        default: []
      },
      number: {
        type: Number,
        default: 0
      },
      sid: {
        type: Array,
        default: []
      },
      classId: {
        type: String
      }
    },
    data() {
      return {
        // database: this.getData(),
        loading: true,
        currentDataSet: [],
        titleNames: [],
        points: []
      }
    },
    creare() {
    },
    mounted() {
      setTimeout(() => {
        if (this.loading) this.loading = false
      }, 1000)
      this.init()
    },
    methods: {
      init() {
        var countPass = 0
        var countNoPass = 0
        const Data = this.dataSet
        for (let i = 0; i < Data.length; i++) {
          if (Data[i].pass == 0) {
            countNoPass++
          } else {
            countPass++
          }
        }
        this.currentDataSet = []
        this.currentDataSet.push({
          value: countPass,
          name: '及格'
        })
        this.currentDataSet.push({
          value: countNoPass,
          name: '不及格'
        })
        this.getTitlePoints()
      },
      showPassed(row) {
        // alert(row.pass)
        if (row.pass == 0) {
          return true
        }
        return false
      },
      getTitlePoints() {
        getPredictionViewModel.requestPrediction(
          this.classId, this.sid[0]).then(response => {
          // console.log('yyyyyyyyyyyyyyyyyyy')
          this.titleNames = response.title_names
          this.points = response.points
        }
        )
      }
    },
    watch: {
      dataSet() {
        this.init()
      }
    }
  }
</script>

<style scoped>
  .predictResult {
    display: flex;
    flex-direction: column;
  }

  .pie-box {
    display: flex;
    background-color: white;
  }

  .pie {
    margin-top: 50px;
    margin-left: 50px;
  }

  .para {
      width: 500px;
      height: 500px;
  }
    .table{
        display: flex;
        flex-direction: row;
    }
</style>
