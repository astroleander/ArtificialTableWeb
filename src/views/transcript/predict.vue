<template>

  <div>
  <section class="table-wrapper">

    <el-alert v-if="showAlert" type="warning" title="尚未选中任何预测学生" ></el-alert>
    <el-table
      :data="viewDataset"
      v-loading.body="loading"
      ref="table" id="transcript-predict"
      element-loading-text="Loading"
      class="table"
      height="800"
      @selection-change="handlePredictdata">

      <el-table-column label="预测操作" type="selection" ></el-table-column>
      <el-table-column label="序号" >
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="学号"  prop="student.sid"  sortable></el-table-column>
      <el-table-column label="学生姓名" prop="student.name" ></el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-button @click="handlePredict" type="success">批量预测</el-button>
        </template>
        <template slot-scope="scope">
          <el-button @click="handlePredictOne(scope.row)" type="success">预测</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
  </div>
</template>

<script>
import Predictmodel from '@/viewmodel/student'
export default {
  name: 'predict',
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
      studentInfo: [],
      loading: true,
      showAlert: false
    }
  },
  methods: {
    handlePredictdata: function(val) {
      this.multipleSelection.push(val)
      console.log('add data')
      console.log(this.multipleSelection)
      var len = this.multipleSelection.length
      console.log(len)
      // 获取班级成绩预测
    },
    handlePredictOne: function(row) {
      console.log('1234567887654321')
      console.log(row)
      this.sidList.push(row.student.id)
      Predictmodel.requestPredict(this.sidList).then(result => {
        // 将传回来的数据存到store
        this.$store.dispatch('savePredictTable', { table: result })
        // this.$store.dispatch('saveStudentInfoTable', { table: result })
        this.$router.push({ path: '/predict' })
        // var aaa = this.$store.state.table.predictTable
        // console.log('我传进去了吗')
        // console.log(aaa)
      })
    },
    handlePredict: function() {
      // 所有选中行信息
      var len = this.multipleSelection.length
      if (len === 0) {
        console.log('1234567890')
        this.showAlert = true
      } else {
        var arr = this.multipleSelection[len - 1]
        console.log('我得到了啥')
        console.log(arr)
        arr.forEach(res => {
          // 获取学生id用于与后端交互
          this.sidList.push(res.student.id)
          // 获取所有选中学生信息
          // this.studentInfo.push(res.student)
        })
        console.log('我又得到了啥')
        console.log(this.sidList)
        // console.log(this.studentInfo)
        // 将sidlist传给后台
        Predictmodel.requestPredict(this.sidList).then(result => {
        // Predictmodel.requestPredict(JSON.parse(this.sidList)).then(result => {
          // 将传回来的数据存到store
          this.$store.dispatch('savePredictTable', { table: result })
          // this.$store.dispatch('saveStudentInfoTable', { table: result })
          this.$router.push({ path: '/predict' })
          // var aaa = this.$store.state.table.predictTable
          // console.log('我传进去了吗')
          // console.log(aaa)
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

<style scoped>

</style>
