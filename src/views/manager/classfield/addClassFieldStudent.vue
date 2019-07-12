<!-- 为班级导入学生模版-->
<template>
  <el-tabs class="container" id="add-student-page">
    <el-tab-pane label="添加一群学生">
        <el-steps :active="activeStep" finish-status="success" direction="horizontal" align-center>
            <el-step v-for='eachStep in steps' :key='eachStep.title' :title='eachStep.title' :description='eachStep.description'></el-step>
        </el-steps>
        <el-tabs v-model="getActiveStep" tab-position="hidden" class="tab flex-half flex-85">
            <el-tab-pane name="0">
                <el-button type="primary" style="margin-left: 800px;margin-bottom: 10px" @click="toStep(1, 2)">下一步</el-button>
                <el-form class="top-box">
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
                    </el-card>
                    <!-- <el-card id="select-input-semester"> -->
                    <el-card class="card-box">
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
                          </el-select> -->
                    </el-card>
                </el-form>
            </el-tab-pane>

            <el-tab-pane name="1">
                <el-button type="primary" style="margin-left: 700px;margin-bottom: 10px" @click="returnLast">上一步</el-button>
                <el-button type="primary" style="margin-left: 20px;margin-bottom: 10px" @click="toStep(2, 3)">下一步</el-button>
                <img :src="src" style="align-content: center;justify-content: center">
            </el-tab-pane>
            <el-tab-pane name="2">
                <div>
                    <import-excel-component @on-selected-file='onSelectedLocalExcel'></import-excel-component>
                </div>
                <el-table v-if="importStudentList !== null"
                          :data="importStudentList"
                >
                    <template slot="empty">
                        <el-alert id="table-emptyalert"
                                  title="没有数据"
                                  type="warning"
                                  :closable='false'
                                  description="没有数据，请确认您导入的文件完整性！"
                                  show-icon>
                        </el-alert>
                    </template>
                    <el-table-column v-for="(item, idx) in [...importStudentList[0]]"
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
                    </el-table-column>
                </el-table>
                <el-row>
                    <div class="row" style="padding:10px;">
                        <el-button @click="returnLast" type="primary">返回上一步</el-button>
                        <el-button @click="onResetClicked" type="primary">重新上传</el-button>
                        <el-button type="primary" @click="onSubmitClicked">提交学生</el-button>
                    </div>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ImportExcelComponent from '@/components/ImportExcel.vue'
import CollegeViewModel from '@/viewmodel/college'
import MajorViewModel from '@/viewmodel/major'
import classFieldViewModel from '@/viewmodel/classfield'
import StudentViewModel from '@/viewmodel/student'
import { mapGetters } from 'vuex'
import template from '@/assets/images/template.png'

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
  return results_array
}

export default {
  name: 'addClassStudent',
  components: {
    ImportExcelComponent
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
      importStudentList: null,
      activeStep: 0,
      steps: [
        { title: '必要信息选择', description: '请为导入的学生选择院系、专业、入学学年', picture: 'el-icon-edit' },
        { title: '上传Excel表格规范模版', description: '请确认本地需要上传的文件符合以下模版规范', picture: 'el-icon-upload' },
        { title: '上传Excel表格读取学生信息到当前页面', description: '请确保本地文件包括学生姓名、学号,学生信息上传界面后请选择相应的学号和姓名', picture: 'el-icon-check' }
      ],
      src: template
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    getActiveStep: {
      get() {
        if (this.activeStep === 3) {
          return '2'
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
      let array = data.results
      this.$confirm('导入的文件是否包含表头?(若选择包含，则导入Excel表格的第一行将会被删除，若选择不包含，则不会对导入Excel表格做任何处理)', '提示', {
        confirmButtonText: '包含',
        cancelButtonText: '不包含'
      }).then(() => {
        array = array.slice(1)
        this.importStudentList = eltableAdapter(array)
      }).catch(() => {
        this.importStudentList = eltableAdapter(array)
      })
    },
    onSubmitClicked() {
      const sid_idx = this.sidCheckedList.findIndex(item => item === true)
      const name_idx = this.nameCheckedList.findIndex(item => item === true)
      if (sid_idx === undefined || name_idx === undefined) {
        this.$message({
          type: 'error',
          message: '请先导入数据并选择学生列'
        })
        return
      }
      if (this.selectedMajorId === undefined || this.selectedMajorId === null) {
        this.$message({
          type: 'error',
          message: '尚未选择学生的归属信息'
        })
        return
      }
      if (this.seletedSemester.year === undefined || this.seletedSemester.year === null) {
        this.$message({
          type: 'error',
          message: '尚未选择学生的入学年份'
        })
        return
      }
      if (sid_idx === -1 || name_idx === -1) {
        this.$message({
          type: 'error',
          message: '必须为导入到界面的数据选择对应的学号或姓名'
        })
        return
      }
      if (sid_idx === name_idx) {
        this.$message({
          type: 'error',
          message: '学号和姓名不能是同一列'
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
        student.sid = row[sid_idx]
        student.name = row[name_idx]
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
        console.log('succeed_ids = ' + succeed_ids)
        console.log('repeated_ids = ' + repeated_ids)
        console.log('failed_sids = ' + failed_sids)
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
    importStudentList: function() {
      if (this.importStudentList !== null) {
        this.$confirm('由于系统无法识别导入Excel表格中的学号与姓名列，请为所需数据标记各自的名称（学号/姓名）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      }
    }
  },
  created() {
    this.fetchCollegeList()
  }
}
</script>

<style lang="scss" scoped>
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
  padding: 8px;
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
