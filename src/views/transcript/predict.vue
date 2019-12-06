<template>

  <div>
    <section class="table-wrapper">

      <el-alert v-if="showAlert" type="warning" title="尚未选中任何预测学生"></el-alert>
      <el-table
        :data="viewDataset"
        v-loading.body="loading"
        border
        stripe
        ref="table" id="transcript-predict"
        element-loading-text="Loading"
        height="calc(100vh - 100px)"
        @selection-change="handlePredictdata">

        <el-table-column type="selection" width="100" class="el-checkbox" align="center"></el-table-column>
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="学号" prop="student.sid" sortable align="center"></el-table-column>
        <el-table-column label="学生姓名" prop="student.name" align="center"></el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <el-button @click="handlePredict" type="primary">批量预测</el-button>
          </template>
          <template slot-scope="scope">
            <el-button @click="handlePredictOne(scope.row)" type="primary" plain>预测</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-dialog :visible.sync="showResult"
               width="50%"
               title="预测结果">
      <predict-result></predict-result>
    </el-dialog>
  </div>
</template>

<script>
  import Predictmodel from '@/viewmodel/student'

  export default {
    name: 'predict',
    components: {
      PredictResult: () => import('./PredictResult.vue')
    },
    props: {
      view: { // table页面
        type: Array,
        require: true
      },
      info: { // 具体信息
        type: Object,
        require: false
      }
    },
    data() {
      return {
        viewDataset: [],
        multipleSelection: [],
        sidList: [],
        classInfo_id: null,
        studentInfo: [],
        loading: true,
        showAlert: false,
        showResult: false
      }
    },
    methods: {
      handlePredictdata: function (val) {
        this.multipleSelection.push(val)
        // 获取班级成绩预测
      },
      handlePredictOne: function (row) {
        this.sidList.push(row.student.id)
        Predictmodel.requestPredict(this.sidList, this.classInfo_id).then(result => {
          // 将传回来的数据存到store
          this.$store.dispatch('savePredictTable', { table: result })
          // this.$store.dispatch('saveStudentInfoTable', { table: result })
          this.showResult = true
          // this.$router.push({ path: '/predict' })
          // var aaa = this.$store.state.table.predictTable
        })
      },
      handlePredict: function () {
        // 所有选中行信息
        var len = this.multipleSelection.length
        if (len === 0) {
          this.showAlert = true
        } else {
          var arr = this.multipleSelection[len - 1]
          this.sidList = []
          arr.forEach(res => {
            // 获取学生id用于与后端交互
            this.sidList.push(res.student.id)
          })
          this.classInfo_id = this.$router.currentRoute.params.id
          // 将sidlist传给后台
          Predictmodel.requestPredict(this.sidList, this.classInfo_id).then(result => {
            // Predictmodel.requestPredict(JSON.parse(this.sidList)).then(result => {
            // 将传回来的数据存到store
            this.$store.dispatch('savePredictTable', {table: result})
            this.showResult = true
            // this.$store.dispatch('saveStudentInfoTable', { table: result })
            // this.$router.push({ path: '/predict' })
            // var aaa = this.$store.state.table.predictTable
          })
        }
      },
      init() {
        this.multipleSelection = []
      }
    },
    created() {
      this.init()
    },
    mounted() {
      setTimeout(() => {
        if (this.loading) this.loading = false
      }, 5000)
    },
    watch: {
      view: function(newView) {
        this.viewDataset = newView
        this.loading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table__header .el-table-column--selection .cell .el-checkbox:after {
    content: '全选';
  }
    .table-wrapper{
        height: calc(100vh - 100px);
        background-color: white;
        padding: 10px;
    }
</style>
