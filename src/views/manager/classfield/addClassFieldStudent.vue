<!-- 为班级导入学生模版-->
<template>
  <div class="container" id="add-student-page">
        <el-steps :active="activeStep" finish-status="success" direction="horizontal" align-center style="height: 40px">
            <el-step v-for='eachStep in steps' :key='eachStep.title' :title='eachStep.title' :description="eachStep.description"></el-step>
        </el-steps>
        <el-tabs v-model="getActiveStep" tab-position="hidden" class="tab flex-half flex-85">
            <el-tab-pane name="0" style="display: flex;flex-flow: column">
                <div class="card-box">
                    <span class="span">请选择上传学生的入学学年</span><span class="span" style="color: red">（必选项）</span><span class="span">：</span>
                    <el-date-picker v-model="seletedSemester.year" placeholder="请选择入学年份"
                                    size="mini" type="year" format='yyyy' value-format="yyyy">
                    </el-date-picker>
                    <el-button type="primary"  style="float: right; text-align: center" @click="toStep(1, 2)">下一步</el-button>
                </div>
                <div>
                   <el-alert :title="this.Alert"></el-alert>
                </div>
                <div style="display: flex;flex-flow: row; justify-content: center;">
                    <!--<import-excel-component @on-selected-file='onSelectedLocalExcel'></import-excel-component>-->
                    <hot-table :settings="hotSettings" ref="hotTable" class="table"></hot-table>
                </div>

                <!--<div style="display: flex;flex-flow: row">
                    <span style="font-size: 20px;color: red; margin-left: 100px">请确保上传Excel文件前两列为学号列与姓名列</span>

                </div>
                <div style="display:flex;justify-content: center;">
                    <img :src="src" style="margin-top: 1px">
                </div>

                <!--<el-form class="top-box">
                    <el-card class="card-box">
                        <span class="span">院系</span>
                        <el-select v-model="selectedCollegeId"
                                   filterable
                                   remote
                                   size="mini"
                                   placeholder="请选择所属院系"
                                   @change="fetchMajorList"
                                   :loading="collegeLoading"
                        >
                            <el-option
                                    v-for="item in remoteCollegeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-card>
                    <el-card class="card-box">
                        <span class="span">专业</span>
                        <el-select v-model="selectedMajorId"
                                   filterable
                                   size="mini"
                                   remote
                                   placeholder="请选择所属专业"
                                   :loading="majorLoading"
                        >
                            <el-option
                                    v-for="item in remoteMajorList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-card>-->
                    <!-- <el-card id="select-input-semester"> -->
                    <!--<el-card class="card-box">
                        <span class="span" style="width:80px">学年</span>
                        <el-date-picker v-model="seletedSemester.year" placeholder="请选择入学年份"
                                        size="mini" type="year" format='yyyy' value-format="yyyy">
                        </el-date-picker>
                        <!-- <el-select size="mini" v-model="seletedSemester.season" placeholder="学期">
                            <el-option value="春季"></el-option>
                            <el-option value="暑假"></el-option>
                            <el-option value="秋季"></el-option>
                            <el-option value="夏季小学期"></el-option>
                            <el-option value="春季小学期"></el-option>
                          </el-select> -
                    </el-card>
                </el-form>-->
            </el-tab-pane>

            <el-tab-pane name="1">
                <el-table v-if="importStudentList !== null"
                          :data="importStudentList"
                          height="450"
                >
                    <template slot="empty">
                        <el-alert id="table-emptyalert"
                                  title="没有数据"
                                  type="warning"
                                  :closable='false'
                                  description="没有数据，请确认您导入学生信息的完整性！"
                                  show-icon>
                        </el-alert>
                    </template>
                    <el-table-column label="学号" prop="sid" align="center"
                                     min-width="200px">
                    </el-table-column>
                    <el-table-column label="姓名" prop="name" align="center"
                                     min-width="200px">
                    </el-table-column>
                    <!--<el-table-column v-for="(item, idx) in [...importStudentList[0]]"
                                     :key="idx"
                                     align="center"
                                     min-width="200px"
                    >
                        <template slot="header" slot-scope="scope" >
                            <div class="header">

              <span>
                <el-checkbox
                        v-model="nameCheckedList[idx]"
                        :true-label="scope.$index + 1"
                        @change="onNameChecked" border
                        style="background-color: #CCCCCC">姓名列</el-checkbox>
              </span>
                                <span>
                <el-checkbox
                        v-model="sidCheckedList[idx]"
                        :true-label="scope.$index + 1"
                        @change="onSidChecked" border
                        style="background-color: #CCCCCC">学号列</el-checkbox>
              </span>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div>
                                {{scope.row[idx]}}
                            </div>
                        </template>
                    </el-table-column>-->
                </el-table>
                <el-row>
                    <div class="row" style="padding:10px;">
                        <el-button @click="returnLast" type="primary">返回上一步</el-button>
                        <!--<el-button @click="onResetClicked" type="primary">重新上传</el-button>-->
                        <el-button type="primary" @click="onSubmitClicked">确认提交</el-button>
                    </div>
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
            </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import ImportExcelComponent from '@/components/ImportExcel.vue'
import CollegeViewModel from '@/viewmodel/college'
import MajorViewModel from '@/viewmodel/major'
import classFieldViewModel from '@/viewmodel/classfield'
import StudentViewModel from '@/viewmodel/student'
import { mapGetters } from 'vuex'
import { CLIP_BOARD_ALERT } from '@/utils/alerts'

const eltableAdapter = (array) => {
  const array_flag = []
  const results_array = []
  array.forEach(row => {
    let flagEmpty = true
    for (let index = 0; index < row.length; index++) {
      const element = row[index]
      if (element &&
        element !== null &&
        element !== undefined &&
        element !== '' &&
        element.trim() !== ''
      ) {
        flagEmpty = false
      }
    }
    array_flag.push(flagEmpty)
  })
  array.forEach((row, idx) => {
    if (!array_flag[idx]) {
      results_array.push(row)
    }
  })
  const studentInfo = []
  results_array.forEach(arr => {
    const object = {}
    object['sid'] = arr[0]
    object['name'] = arr[1]
    studentInfo.push(object)
  })
  return studentInfo
}

export default {
  name: 'addClassStudent',
  components: {
    HotTable, ImportExcelComponent
  },
  props: {
    classInfo_id: {
      type: [String, Number],
      default: 0
    }
  },
  data: function() {
    return {
      // selected college
      selectedCollegeId: null,
      selectedMajorId: null,
      seletedSemester: {
        year: null,
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
      activeStep: 0,
      steps: [
        { title: '选择入学学年，将学号与姓名复制到页面的Excel表格', description: '', picture: 'el-icon-edit' },
        { title: '确认上传学生信息', description: '', picture: 'el-icon-upload' }
      ],
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
          // this.onSelectedLocalExcel(importDataset)
          // console.log('111111111')
          // console.log(importDataset)
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
    },
    getActiveStep: {
      get() {
        if (this.activeStep === 2) {
          return '1'
        }
        return String(this.activeStep)
      },
      set(step) {
        this.activeStep = Number(step)
      }
    }
  },
  methods: {
    returnLast() {
      this.activeStep--
    },
    onSelectedLocalExcel(data) {
      // let array = data.results
      // array = array.slice(1)
      this.importStudentList = eltableAdapter(data)
      // console.log('222222222')
      // console.log(this.importStudentList)
    },
    onSubmitClicked() {
      // const sid_idx = this.sidCheckedList.findIndex(item => item === true)
      // const name_idx = this.nameCheckedList.findIndex(item => item === true)
      /* if (sid_idx === undefined || name_idx === undefined) {
        this.$message({
          type: 'error',
          message: '请先导入数据并选择学生列'
        })
        return
      } */
      /* if (this.selectedMajorId === undefined || this.selectedMajorId === null) {
        this.$message({
          type: 'error',
          message: '尚未选择学生的归属信息'
        })
        return
      } */
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
        // student.sid = row[sid_idx]
        student.sid = row.sid
        // student.name = row[name_idx]
        student.name = row.name
        studentList.push(student)
      })
      this.submitStudentList(studentList)
    },
    onResetClicked() {
      this.selectedCollegeId = null
      this.selectedMajorId = null
      this.seletedSemester = {
        year: null,
        semester: null
      }
      this.importStudentList = null
    },
    submitStudentList(list) {
      StudentViewModel.requestPostStudents(list).then(res => {
        const succeed_ids = res.succeed_ids
        const repeated_ids = res.repeated_ids
        const failed_sids = res.failed_sids
        // console.log('succeed_ids = ' + succeed_ids)
        // console.log('repeated_ids = ' + repeated_ids)
        // console.log('failed_sids = ' + failed_sids)
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
    onNameChecked(idx) {
      if (idx !== false) {
        idx = idx - 1
        this.nameCheckedList.forEach((item, idx) => this.$set(this.nameCheckedList, idx, false))
        this.$set(this.nameCheckedList, idx, true)
        console.log(this.nameCheckedList)
      }
    },
    onSidChecked(idx) {
      if (idx !== false) {
        idx = idx - 1
        this.sidCheckedList.forEach((item, idx) =>
          this.$set(this.sidCheckedList, idx, false))
        this.$set(this.sidCheckedList, idx, true)
        console.log(this.sidCheckedList)
      }
    },
    getNameChecked(scope) {
      console.log(this.nameCheckedList)
      return this.nameCheckedList[scope.$index] || false
    },
    fetchCollegeList() {
      console.log(this.user)
      console.log(typeof this.user)
      if (typeof this.user === 'string') {
        const user = JSON.parse(this.user)
        const university_id = user.university_message.id
        this.remoteUniversity = user.university_message
        CollegeViewModel.requestByUniversityId(university_id).then(res => {
          this.remoteCollegeList = res
          this.collegeLoading = false
          this.majorLoading = true
        })
      } else {
        const user = this.user
        const university_id = user.university_message.id
        this.remoteUniversity = user.university_message
        CollegeViewModel.requestByUniversityId(university_id).then(res => {
          this.remoteCollegeList = res
          this.collegeLoading = false
          this.majorLoading = true
        })
      }
    },
    fetchMajorList() {
      console.log('fetchMajorList')
      MajorViewModel.requestByCollegeId(this.selectedCollegeId).then(res => {
        console.log('fetchMajorList success')
        this.remoteMajorList = res
        this.majorLoading = false
      })
    },
    addClassFields(params) {
      classFieldViewModel.requestPostClassFields(params)
        .then(response => {
          if (response) {
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
    },
    toStep(from, to) {
      switch (to) {
        case 1:
          if (from === 3) {
            this.$router.push('')
          } else {
            this.activeStep = 0
          }
          break
        case 2: {
          if (from === 1) {
            this.activeStep = 1
          }
          break
        }
        case 3: {
          this.activeStep = 2
          break
        }
      }
    }
  },
  watch: {
  },
  created() {
    this.fetchCollegeList()
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
        width: 70%;
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
