<template>
  <div class="predictResult">
    <section class="table" style="width: 55%">
      <el-table :data="database" v-loading.body="loading" ref="table" id="transcript-predict"
                element-loading-text="Loading" class="table"
      height="500">
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
        <el-table-column label="学号" prop="sid" sortable></el-table-column>
        <el-table-column label="学生姓名" prop="name"></el-table-column>

        <el-table-column label="预测结果" prop="pass" sortable min-width="150">
          <template slot-scope="scope">
            <span v-if="showPassed(scope.row)">不及格</span>
            <span v-else>及格</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <div class="pie-box" style="width: 45%; background-color: white">
      <at-pie class="pie" :dataSet="currentDataSet"></at-pie>
    </div>
  </div>
</template>

<script>
  import AtPie from './Pie'

  export default {
    name: 'PredictResult',
    components: { AtPie },
    data() {
      return {
        database: this.getData(),
        loading: true,
        currentDataSet: this.init()
      }
    },
    creare() {
    },
    mounted() {
      setTimeout(() => {
        if (this.loading) this.loading = false
      }, 1000)
    },
    methods: {
      getData() {
        return this.$store.state.table.predictTable
      },
      init() {
        var countPass = 0
        var countNoPass = 0
        const Data = this.getData()
        for (let i = 0; i < Data.length; i++) {
          if (Data[i].pass == 0) {
            countNoPass++
          } else {
            countPass++
          }
        }
        const data = []
        data.push({
          value: countPass,
          name: '及格'
        })
        data.push({
          value: countNoPass,
          name: '不及格'
        })
        return data
      },
      showPassed(row) {
        // alert(row.pass)
        if (row.pass == 0) {
          return true
        }
        return false
      }
    }
  }
</script>

<style scoped>
  .predictResult {
    display: flex;
    flex-direction: row;
  }

  .pie-box {
    display: flex;
    background-color: white;
  }

  .pie {
    margin-top: 50px;
    margin-left: 50px;
  }
</style>
