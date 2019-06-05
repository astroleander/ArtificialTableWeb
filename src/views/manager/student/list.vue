<template>
  <div>
    <div class="frame">
      <span>学校：</span>
        <el-input style="width:200px" v-model="remoteUniversity.name"
        :disabled="true" size="mini"></el-input>
      <span style="padding-left: 10px;">专业：</span>
      <el-cascader
        size="small"
        clearable
        :options="remoteCollegeList"
        :props="props"
        @active-item-change="selectedCollegeChanged"
        @change="onMajorChanged"
        >
      </el-cascader>

      <span class="span" style="padding-left: 10px;">学年：</span>
      <el-date-picker
        v-model="selectedYear" @change="onYearChanged"
        placeholder="请选择学生入学年份" clearable
        size="small" type="year" format='yyyy' value-format="yyyy">
      </el-date-picker>
    </div>

    <el-table v-if="remoteStudentDataset.length > 0" :data="remoteStudentDataset" @selection-change="delChange" style="margin-top: 10px">
      <!-- <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
            {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="sid" label="学号" minWidth="150"></el-table-column>
      <el-table-column prop="name" label="姓名"  minWidth="150"></el-table-column>
      <el-table-column prop="major_message.name" label="专业"  minWidth="150"></el-table-column>
      <el-table-column prop="year" label="入学年份"  minWidth="150"></el-table-column>
      <el-table-column minWidth="150">
        <template slot-scope="scope">
          <el-button @click="deleteStudent(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="350">
        <template slot="header" slot-scope="scope">
          <el-button type="danger" size="mini" @click="confirmDeleteClassFields">删除选中</el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="confirmDeleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-card v-else style="height: 70vh; line-height: 50vh; text-align: center; margin-top: 10px">
      无数据, 请选择筛选项
    </el-card>
  </div>
</template>

<script>
import MajorViewModel from '@/viewmodel/major'
import CollegeViewModel from '@/viewmodel/college'
import StudentViewModel from '@/viewmodel/student'

import { mapGetters } from 'vuex'

export default {
  data: function() {
    return {
      selectedCollege: null,
      selectedMajor: null,
      selectedYear: null,

      delChange: [],

      remoteUniversity: {
        name: null
      },
      remoteCollegeList: [],
      // remoteMajorList: [],
      remoteStudentDataset: [],

      props: {
        value: 'id',
        label: 'name',
        children: 'major'
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    deleteStudent(student) {
      StudentViewModel.requestDelStudent(student.id).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    },
    onMajorChanged: function(collegemajor) {
      if (collegemajor[1]) {
        this.selectedMajor = collegemajor[1]
      }
      this.fetchStudentList()
    },
    onYearChanged: function(year) {
      this.selectedYear
      this.fetchStudentList()
    },
    selectedCollegeChanged(college_id) {
      this.fetchMajorListByCollegeId(college_id[0]).then(res => {
        // console.log(res)
        const college = this.remoteCollegeList.find(item => item.id === college_id[0])
        college.major = res
      })
    },
    fetchCollegeList() {
      let user = null
      if (typeof this.user === 'string') {
        user = JSON.parse(this.user)
      } else {
        user = this.user
      }
      const university_id = user.university_message.id
      this.remoteUniversity = user.university_message
      CollegeViewModel.requestByUniversityId(university_id).then(res => {
        Object.keys(res).forEach(idx => {
          res[idx]['major'] = []
        })
        this.remoteCollegeList = res
        console.log(this.remoteCollegeList)
      })
    },
    fetchMajorListByCollegeId(id) {
      return new Promise(resolve => {
        MajorViewModel.requestByCollegeId(id).then(res => {
          resolve(res)
        })
      })
    },
    fetchStudentList() {
      if (this.selectedYear && this.selectedMajor) {
        StudentViewModel.requestStudents({ major_id: this.selectedMajor, year: this.selectedYear })
          .then(students => {
            if (students) {
              this.remoteStudentDataset = students
            } else {
              this.remoteStudentDataset = []
            }
          })
      } else if (this.selectedYear && !this.selectedMajor) {
        StudentViewModel.requestStudents({ major_id: this.selectedMajor, year: this.selectedYear })
          .then(students => {
            if (students) {
              this.remoteStudentDataset = students
            } else {
              this.remoteStudentDataset = []
            }
          })
      } else if (this.selectedMajor && !this.selectedYear) {
        StudentViewModel.requestStudents({ major_id: this.selectedMajor, year: this.selectedYear })
          .then(students => {
            if (students) {
              this.remoteStudentDataset = students
            } else {
              this.remoteStudentDataset = []
            }
          })
      } else {
        this.remoteStudentDataset = []
      }
    }
  //   confirmDeleteClassFields() {
  //     this.$confirm('此操作将选中学生从班级中删除, 是否继续?', '提示', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     }).then(() => {
  //       this.delClassField(this.delList)
  //     }).catch(() => {
  //       this.$message({
  //         type: 'info',
  //         message: '已取消删除'
  //       })
  //     })
  //   },
  //   confirmDeleteOne(id) {
  //     this.$confirm('此操作将该学生从班级中删除, 是否继续?', '提示', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     }).then(() => {
  //       this.delClassField([{ id: id }])
  //     }).catch(() => {
  //       this.$message({
  //         type: 'info',
  //         message: '已取消删除'
  //       })
  //     })
  //   },
  },
  created() {
    this.fetchCollegeList()
  }
}
</script>

<style lang="scss" scoped>
.frame {
  display: flex;
  align-items: center;
  padding-bottom: 40px;
  padding-top: 40px;
  padding-left: 10px;
  background: #FFF;
  border-top: #EEE solid 1px;
  height: 30px;
}
</style>
