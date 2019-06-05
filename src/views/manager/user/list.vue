<!-- 管理员查看教师信息 -->
<!--   界面运行过程   -->
<!--   create 生命周期函数调用 fetchCollegeList函数 加载所有院系列表remoteCollegeList-->
<!--  1、模版构建界面  -->
<!--     学校：remoteUniversity.name
         院系：通过el-select 从remoteCollegeList中选择单一院系 绑定 selectedCollege，调用函数 selectChange => fetchUserList 将远端数据的所有用户传入remoteUserList
<!--  2、当上方remoteUserList成功调出数据，显示table数据  -->
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

    <el-table v-if="remoteUserList.length > 0" :data="remoteUserList" @selection-change="delChange" style="margin-top: 10px">
      <!-- <el-table-column type="selection" width="50"></el-table-column> -->
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
            {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="tid" label="教职工号" minWidth="80"></el-table-column>
      <el-table-column prop="name" label="姓名"  minWidth="80"></el-table-column>
      <el-table-column prop="college_id" label="院系"  minWidth="100"></el-table-column>
      <el-table-column prop="email" label="邮箱"  minWidth="80"></el-table-column>
      <el-table-column prop="mobile" label="电话"  minWidth="80"></el-table-column>

      <el-table-column label="身份"  minWidth="80">
        <template slot-scope="scope">
          {{scope.row.is_manager? '年级组长' : '普通教师'}}
        </template>
      </el-table-column>
      <el-table-column minWidth="80">
        <template slot="header" slot-scope="head">
          <div>
          <el-checkbox v-model="showPwd" size="mini" class="pwd-switch"
              >显示密码</el-checkbox>
          </div>
        </template>
        <template slot-scope="scope">
          <template v-if="showPwd">
            {{scope.row.password}}
          </template>
          <template v-else>
            ******
          </template>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <el-button @click="PutUser(scope.row)" type="success">更改</el-button>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <el-button @click="deleteUser(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-card v-else style="height: 70vh; line-height: 50vh; text-align: center; margin-top: 10px">
      无数据, 请选择筛选项
    </el-card>

    <el-dialog title="修改教师信息" class="TeacherInfo" :visible.sync="showDialog" :before-close="onDialogClose">
      <el-form :rules="rules"   ref="infoForm" :model="form" label-width="100px">
        <el-form-item label="教师姓名:" prop="name">
          <span> {{form.name}}</span>
        </el-form-item>
        <el-form-item label="教师编号:" prop="tid" required>
          <span> {{form.tid}}</span>
        </el-form-item>
        <el-form-item label="身份选择: " prop="is_manager" required>
          <el-select v-model="role" placeholder="请选择该用户身份">
            <el-option
              v-for="item in actors"
              :key="item.id"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师邮箱: " prop="email" >
          <el-input v-model="form.email" placeholder="请输入邮箱" ></el-input>
        </el-form-item>
        <el-form-item label="教师电话: " prop="mobile"  >
          <el-input v-model="form.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitChange('infoForm')">确认</el-button>
          <el-button @click="onDialogClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import CollegeViewModel from '@/viewmodel/college'
import UserViewModel from '@/viewmodel/user'
import ClassInfoViewMdoel from '@/viewmodel/classinfos'
import { mapGetters } from 'vuex'

export default {
  data: function() {
    var validateTeacherId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入教师编号'))
      } else if (!Number.isInteger(+value)) {
        callback(new Error('请输入数字值'))
      } else {
        const tidReg = /^\d{4,}$/
        if (tidReg.test(value)) {
          callback()
        } else {
          callback(new Error('教师编号至少四位'))
        }
      }
      callback()
    }
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        const mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        // Number.isInteger是es6验证数字是否为整数的方法,
        // 前面加了一个+实现隐式转换
        const phoneReg = /^1(3|4|5|7|8)\d{9}$/
        if (!Number.isInteger(+value)) {
          callback(new Error('输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }
    }
    return {
      selectedCollege: null,
      delChange: [],

      remoteUniversity: {
        name: null
      },
      remoteCollegeList: [],
      remoteUserList: [],

      showPwd: false,
      showDialog: false,
      actors: [
        {
          id: 1,
          name: '普通教师',
          value: 0
        },
        {
          id: 2,
          name: '年级组长',
          value: 1
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' }
        ],
        tid: [
          { validator: validateTeacherId, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      form: {
        id: null,
        name: '',
        tid: '',
        is_manager: false,
        email: '',
        mobile: ''
      },
      role: null
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
    // 加载远端用户信息到 remoteUserList 中
    fetchUserList() {
      UserViewModel.requestUserInfoWithPwd({ college_id: this.selectedCollege })
        .then(users => {
          if (users) {
            this.remoteUserList = users
          } else {
            this.remoteStudentDataset = []
          }
        })
    },
    PutUser(user) {
      this.form.id = user.id
      this.form.name = user.name
      this.form.tid = user.tid
      this.form.is_manager = user.is_manager
      this.form.email = user.email
      this.form.mobile = user.mobile
      this.showDialog = true
    },
    submitChange(infoForm) {
      console.log('12345678')
      this.$refs[infoForm].validate((valid) => {
        if (valid) {
          console.log('12345678')
          this.form.is_manager = this.role
          const Teacher = this.form
          console.log(Teacher)
          UserViewModel.requestPutUser(Teacher).then(response => {
            if (response.code === '2005') {
              this.$message({
                message: '修改教师信息成功,请刷新',
                type: 'success'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    onDialogClose() {
      this.showDialog = false
    }
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
.span ~ *{
  margin-right: 10px;
}
</style>

<style>
.pwd-switch .el-switch{
}
</style>
