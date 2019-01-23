<template>
  <div>
    <div class="frame">
      <span class="span">学校: </span>
      <el-input style="width:200px" v-model="remoteUniversity.name"
        :disabled="true" size="mini"></el-input>

      <span class="span">院系: </span>
      <el-select 
        v-model="selectedCollege"
        @change="selectChange" 
        size="mini" placeholder="请选择院系">
        <el-option
          v-for="college in remoteCollegeList"
          :key="college.id"
          :value="college.id"
          :label="college.name">
        </el-option>
      </el-select>
      
    </div>

    <el-table v-if="remoteUserList.length > 0" :data="remoteUserList" @selection-change="delChange">
      <!-- <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
            {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="tid" label="教职工号" minWidth="120"></el-table-column>
      <el-table-column prop="name" label="姓名"  minWidth="100"></el-table-column>
      <el-table-column prop="college_message.name" label="院系"  minWidth="150"></el-table-column>
      <el-table-column label="管理员"  minWidth="80">
        <template slot-scope="scope">
          {{scope.row.is_manager? '管理员' : '教师'}}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button @click="deleteUser(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card v-else style="height: 70vh; line-height: 50vh; text-align: center;">
      无数据, 请选择筛选项
    </el-card>
  </div>
</template>

<script>
import CollegeViewModel from '@/viewmodel/college'
import UserViewModel from '@/viewmodel/user'
import ClassInfoViewMdoel from '@/viewmodel/classinfos'
import { mapGetters } from 'vuex'

export default {
  data: function() {
    return {
      selectedCollege: null,
      delChange: [],

      remoteUniversity: {
        name: null
      },
      remoteCollegeList: [],
      remoteUserList: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    selectChange() {
      this.fetchUserList()
    },
    deleteUser(user) {
      ClassInfoViewMdoel.requestByTeacherId(user.id).then(res => {
        if (res === undefined) {
          UserViewModel.requestDelUser(user.id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const idx = this.remoteUserList.findIndex(ouser => ouser.id === user.id)
            this.remoteUserList.splice(idx, 1)
          })
        } else {
          this.$confirm('该用户还有正在教授的班级，无法删除！您可以到班级列表中进行确认。', '无法删除', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '关闭'
          })
        }
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
        this.remoteCollegeList = res
      })
    },
    fetchUserList() {
      UserViewModel.requestUsersWithoutPwd({ college_id: this.selectedCollege })
        .then(users => {
          if (users) {
            this.remoteUserList = users
          } else {
            this.remoteStudentDataset = []
          }
        })
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
  padding: 0.3rem;
  background: #FFF;
  border-top: #EEE solid 1px;
}
.span ~ *{
  margin-right: 10px;
}
</style>
