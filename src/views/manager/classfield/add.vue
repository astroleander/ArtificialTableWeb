<!--
supplement: 为课程添加班级form

-->
<template>
  <div class="app-container rowframe">
    <el-card class="form-box">
      <div slot="header">
        <span class="rowframe title">添加班级</span>
      </div>
      <div v-if="!visible">
        <el-alert v-for="(error, idx) in errorList" :key="idx" :title="error.errorMsg" type="error" :closable="false"  show-icon></el-alert>
      </div>
      <el-form :rules="rules"  ref="ruleForm" v-if="visible" :model="form" label-width="100px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="form.name"  placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="班级编号" prop="cid" required>
          <el-input v-model="form.cid" placeholder="请输入班级编号"></el-input>
        </el-form-item>
        <el-form-item label="任课教师" prop="teacher_id">
          <el-select v-model="form.teacher_id" placeholder="请选择任课教师">
            <el-option
              v-for="(item,index) in teachers"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属课程组" prop="lesson_id">
          <el-select v-model="form.lesson_id" placeholder="请选择所属课程组">
            <el-option
              v-for="(item,index) in lessons"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开课年份" prop="variableYear">
          <el-date-picker v-model="form.variableYear" type="year"  value-format="yyyy" placeholder="请选择年份" required></el-date-picker>
        </el-form-item>
        <el-form-item label="开课学期" prop="variableSemester">
          <el-select v-model="form.variableSemester" placeholder="请选择学期">
            <el-option
              v-for="item in semesters"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="开课时间" prop="week" >
          <el-input v-model="form.week" placeholder="请输入上课时间"></el-input>
        </el-form-item>
        <el-form-item label="上课地点" prop="room" >
          <el-input v-model="form.room" placeholder="请输入上课地点"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('ruleForm')">添加</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userViewModel from '@/viewmodel/user'
import lessonViewModel from '@/viewmodel/lesson'
import classViewModel from '@/viewmodel/classinfos'
export default {
  data() {
    var validateClassId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入班级编号'))
      } else if (!Number.isInteger(+value)) {
        callback(new Error('输入数字值'))
      }
      callback()
    }
    return {
      visible: false, // 表单是否可见
      errorList: [],
      teachers: [],
      lessons: [],
      message: '',
      description: '',
      variableYear: '',
      variableSemester: '',
      semesters: [{
        value: '春季',
        label: '春季'
      }, {
        value: '秋季',
        label: '秋季'
      }, {
        value: '夏季小学期',
        label: '夏季小学期'
      }, {
        value: '春季小学期',
        label: '春季小学期'
      }, {
        value: '秋季小学期',
        label: '秋季小学期'
      }, {
        value: '其他',
        label: '其他'
      }],
      form: {
        name: '',
        cid: '',
        teacher_id: '',
        lesson_id: '',
        room: '',
        week: '',
        variableSemester: '',
        variableYear: ''
      },
      rules: {
        lesson_id: [
          { required: true, message: '请选择教学班所属课程组', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' }
        ],
        cid: [
          { validator: validateClassId, trigger: 'blur' }
        ],
        teacher_id: [
          { required: true, message: '请选择任课教师', trigger: 'blur' }
        ],
        semester: [
          { required: true, message: '请输入学期', trigger: 'blur' }
        ],
        variableYear: [
          { required: true, message: '请选择年份', trigger: 'change' }
        ],
        variableSemester: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ]
        // room: [
        //   { required: true, message: '请输入上课地点', trigger: 'blur' }
        // ],
        // week: [
        //   { required: true, message: '请输入上课时间', trigger: 'blur' }
        // ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user_collegeId',
      'token'
    ])
  },
  methods: {
    // 根据college_id获取课程组信息，教师信息
    fetchData() {
      Promise.all([
        userViewModel.requestUsersWithoutPwd({ college_id: this.user_collegeId }, this.token),
        lessonViewModel.requestLessons({ college_id: this.user_collegeId })
      ]).then(result => {
        if (result[0] && result[1]) {
          this.teachers = result[0]
          this.lessons = result[1]
          this.visible = true
        }
        if (result[0] === undefined) {
          this.errorList.push({
            id: this.user_collegeId,
            errorMsg: '该院系无教师信息，请导入教师信息后重新添加教学班'
          })
        }
        if (result[1] === undefined) {
          this.errorList.push({
            id: this.user_collegeId,
            errorMsg: '该院系无课程信息，请导入课程信息后重新添加教学班'
          })
        }
      })
    },
    // 添加班级
    submitForm: function(formName) {
      const semester = this.form.variableYear + '年' + this.form.variableSemester
      const classInfo = { ...this.form, semester: semester }
      // console.log('semester = ' + semester)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          classViewModel.requestPostClassInfo(classInfo).then(response => {
            if (response !== undefined) {
              this.$message({
                message: '添加教学班成功',
                type: 'success'
              })
              const class_id = response[0].id
              this.$router.push({
                name: 'addClassField',
                params: { id: class_id, type: 'add' },
                query: { id: class_id }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 重置表单
    onReset() {
      this.$refs['ruleForm'].resetFields()
    }
  },
  created() {
    this.fetchData()
    console.log(this.$router)
    if (this.$router.currentRoute.params) {
      this.form.lesson_id = this.$router.currentRoute.params.lesson_id
    }
  }
}
</script>

<style lang="scss">
  .title{
    font-weight: bold;
    font-size: larger;
  }
  .rowframe{
    display: flex;
    flex-direction: row;
    justify-content:center;
  }
  .form-box{
    width: 50%;
    min-width: 500px;
    padding: 20px;
    /*border: 1px solid #999999;*/
  }
</style>
