<template>
  <el-tabs class="container" id="add-student-page">
    <el-tab-pane label="添加一群学生">
      <el-row :gutter="12" class="select-menu">
        <el-form>
        <el-col :span="6">
          <el-card>
            <span class="span">学校</span>
            <el-input style="width:200px"
              v-model="remoteUniversity.name"
              :disabled="true"
              size="mini"
            ></el-input>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <span class="span">院系</span>
            <el-select v-model="selectedCollegeId" 
              filterable
              remote
              size="mini"
              placeholder="哪个院的"
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
        </el-col>
        <el-col :span="6">
          <el-card>
            <span class="span">专业</span>
            <el-select v-model="selectedMajorId" 
              filterable
              size="mini"
              remote   
              placeholder="哪个专业的"
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
        </el-col>
        <el-col :span="6">
          <!-- <el-card id="select-input-semester"> -->
          <el-card>
            <span class="span" style="width:80px">学年</span>
            <el-date-picker v-model="seletedSemester.year"
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
        </el-col>
        </el-form>
      </el-row>

      <el-table v-if="importStudentList !== null" 
          :data="importStudentList"
          >
        <el-table-column v-for="(item, idx) in [...importStudentList[0]]" 
          :key="idx"
          align="center"
          >
          <template slot="header" slot-scope="scope" >
            <div class="header">
              <span>
                <el-checkbox
                  v-model="nameCheckedList[idx]"
                  :true-label="scope.$index + 1"
                  @change="onNameChecked">姓名列</el-checkbox>
              </span>
              <span>
                <el-checkbox 
                  v-model="sidCheckedList[idx]"
                  :true-label="scope.$index + 1"
                  @change="onSidChecked">学号列</el-checkbox>
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
      <div v-else>
        <el-alert 
          title="请保证导入的数据包含学号列和姓名列" type="info"
          style="margin: 4px 12px 4px 12px;"
        ></el-alert>
        <el-alert 
          title="一次只能导入同一个教学班的学生" type="info"
          style="margin: 4px 12px 4px 12px;"
        ></el-alert>
      </div>
      <div>
        <import-excel-component @on-selected-file='onSelectedLocalExcel'></import-excel-component>
      </div>
       <el-row>
        <div class="row" style="padding:10px;">
          <el-button @click="onResetClicked">重置界面</el-button>
          <el-button type="success" @click="onSubmitClicked">上传学生</el-button>
        </div>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="添加单个学生">      
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ImportExcelComponent from '@/components/ImportExcel.vue'
import CollegeViewModel from '@/viewmodel/college'
import MajorViewModel from '@/viewmodel/major'
import StudentViewModel from '@/viewmodel/student'
import { mapGetters } from 'vuex'

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
  name: 'addstupid',
  components: {
    ImportExcelComponent
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
      importStudentList: null
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    onSelectedLocalExcel(data) {
      let array = data.results
      this.$confirm('导入的文件是否有列名?(若有则会被删除)', '提示', {
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
        this.$message({
          type: 'success',
          message: '添加成功'
        })
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
    }
  },
  created() {
    this.fetchCollegeList()
  },
  watch: {
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
.row {
  display:flex; 
  justify-content:center; 
  align-content:center; 
  flex-direction:row;
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
