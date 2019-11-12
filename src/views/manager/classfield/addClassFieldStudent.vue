<!-- 为班级导入学生模版-->
<template>
  <div class="container" id="add-student-page">
      <div style="width: 80%; display: flex;flex-flow: row;justify-content: center">
          <hot-table :settings="hotSettings" ref="hotTable" class="table"></hot-table>
      </div>
      <div class="card-box">
          <el-button type="primary" @click="onResetClicked" style="float: right; text-align: center" plain>重置学生信息</el-button>
          <el-button type="primary" @click="onSubmitClicked" style="margin-top: 15px;float: right; text-align: center" v-loading.fullscreen.lock="loading" plain>确认提交</el-button>
      </div>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import classFieldViewModel from '@/viewmodel/classfield'
import StudentViewModel from '@/viewmodel/student'
import { mapGetters } from 'vuex'
import { CLIP_BOARD_ALERT } from '@/utils/alerts'

export default {
  name: 'addClassStudent',
  components: {
    HotTable
  },
  props: {
    classInfo_id: {
      type: [String, Number],
      default: 0
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      selectedCollegeId: null,
      selectedMajorId: null,
      seletedSemester: {
        year: new Date().getFullYear(),
        semester: null
      },
      Alert: CLIP_BOARD_ALERT.title + CLIP_BOARD_ALERT.description,
      //
      nameCheckedList: [],
      sidCheckedList: [],
      // loading flag
      collegeLoading: true,
      majorLoading: true,
      // remote list
      remoteUniversity: {
        name: null
      },
      remoteMajorList: [],
      remoteCollegeList: [],
      // import data
      // importStudentList: null,
      loading: false,
      hotSettings: {
        startRows: 3,
        startCols: 2,
        minCols: 4,
        colWidths: 150,
        rowHeights: 30,
        minRows: 110,
        height: 400, // 设置高度
        rowHeaders: true,
        colHeaders: ['学号', '姓名'],
        // 表格右键一层操作设置
        contextMenu: {
          items: {
            'row_above': {
              name: '在当前行的上方插入'
            },
            'row_below': {
              name: '在当前行的下方插入'
            },
            'separator1': Handsontable.plugins.ContextMenu.SEPARATOR,
            'clear_custom': {
              name: '清除所有表格',
              callback: function() {
                this.clear()
              }
            },
            'separator2': Handsontable.plugins.ContextMenu.SEPARATOR,
            'copy': {
              name: '复制'
            },
            'cut': {
              name: '剪切'
            }
          }
        }, // contextMenu-end

        /** 下面都是 hook
             * @see https://handsontable.com/docs/6.2.0/tutorial-introduction.html
             */
        // 每次表格中数据改变，此时触发此函数
        afterChange: function() {
          let importDataset = this.getData()
          // 返回不是全空的行
          importDataset = importDataset.filter((row, rowIndex, arr) => {
            return !row.every(cell => {
              return cell === null || cell.trim() === '' || cell === undefined
            })
          })
          const importStudentList = []
          importDataset.forEach(dataSet => {
            const student = {
              sid: dataSet[0],
              name: dataSet[1]
            }
            importStudentList.push(student)
          })
          console.log(importStudentList)
          const env = this.rootElement.__vue__
          env.$store.dispatch('saveStudentTable', { table: importStudentList })
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    // 导入数据
    importStudentList: {
      get() {
        return this.$store.state.table.studentTable
      }
    }
  },
  methods: {
    onSubmitClicked() {
      console.log('11111111')
      console.log(this.importStudentList)
      if (this.importStudentList.length > 0) {
        this.loading = true
      } else {
        this.$confirm('未引入学生信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
      this.selectedMajorId = 1
      this.selectedCollegeId = 1
      if (this.seletedSemester.year === undefined || this.seletedSemester.year === null) {
        this.$confirm('您尚未选择学生的入学学年，请在返回上一页选择', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        return
      }
      // generate student objs list
      const studentList = []
      const Student = () => {
        return {
          sid: null,
          name: null,
          year: this.seletedSemester.year,
          major_id: this.selectedMajorId
        }
      }
      this.importStudentList.forEach(row => {
        const student = new Student()
        student.sid = row.sid
        student.name = row.name
        studentList.push(student)
      })
      this.submitStudentList(studentList)
    },
    onResetClicked() {
      this.$refs.hotTable.hotInstance.clear()
    },
    submitStudentList(list) {
      StudentViewModel.requestPostStudents(list).then(res => {
        const succeed_ids = res.succeed_ids
        const repeated_ids = res.repeated_ids
        // const failed_sids = res.failed_sids
        const classFieldList = []
        if (succeed_ids.length + repeated_ids.length > 0) {
          succeed_ids.forEach(item => {
            classFieldList.push({
              student_id: item.id,
              classInfo_id: this.classInfo_id
            })
          })
          repeated_ids.forEach(item => {
            classFieldList.push({
              student_id: item.id,
              classInfo_id: this.classInfo_id
            })
          })
          this.addClassFields(classFieldList)
        }
      }).catch(reject => {
        console.log('reject = ' + reject)
      })
    },
    addClassFields(params) {
      classFieldViewModel.requestPostClassFields(params)
        .then(response => {
          if (response) {
            this.loading = false
            // const unsucceed = params.length - response.length
            const message = response.length + '条学生数据添加到班级中,' + (params.length - response.length) + '条学生数据由于已存在未能成功添加到班级中'
            // clean the store
            this.$store.dispatch('saveStudentTable', { table: null })
            this.importStudentList = null
            this.seletedSemester.year = null
            this.$confirm(message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            })
          } else {
            this.$confirm('提交失败，请重试', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            })
          }
          this.$emit('addEnd')
        })
    }
  },
  watch: {
    // 关闭窗口，清空页面缓存
    reset: function(reset) {
      if (reset === true) {
        this.seletedSemester.year = ''
        this.$refs.hotTable.hotInstance.clear()
      }
    }
  },
  created() {
  }
}
</script>

<style lang="scss">
    @import '../../../../node_modules/handsontable/dist/handsontable.full.min.css';
</style>

<style lang="scss" scoped>
    .table {
        margin-top: 5px;
        // margin-left: 8px;
        text-align: center;
        width: 91%;
    }
    .table-wrapper {
        height: 100%;
        // height: 200px;
    }
.header {
  display:flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
}
.container {
  background: #FFF;
  display: flex;
  flex-flow: row;
  padding-bottom: 10px;
}
.select-menu {
  padding: 12px
}
.span {
  // padding: 8px;
  font-weight: bold;
}
.card-box{
  margin: 5px;
  display: flex;
  flex-flow: column;
}
.row {
  display:flex;
  justify-content:center;
  align-content:center;
  flex-direction:row;
}
.top-box{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.form-box{
  margin-left: 25%;
  width: 50%;
  min-width: 500px;
  padding: 20px;
  /*border: 1px solid #999999;*/
}
.rowframe{
  display: flex;
  flex-direction: row;
  justify-content:center;
}
</style>

<style lang="scss">
#select-input-semester {
  padding-left: 0px;
  .el-input {
    width: 100px;
  }
}

#add-student-page {
  .el-tabs__nav-scroll {
    padding-left: 12px;
      margin: auto;
  }
}
</style>
