<!--
supplement:

-->
<template>
  <div class="app-container rowframe">
    <el-card class="form-box">
      <div slot="header">
        <span class="rowframe title">添加班级</span>
      </div>
      <div v-if="!visible">
        <el-alert :title="lessonMsg" type="error"  v-if="lessonFlag" closable="false"  show-icon></el-alert>
        <el-alert :title="teacherMsg" type="error" v-if="teacherFlag" closable="false"  show-icon></el-alert>
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
        <el-form-item label="开课学期" prop="semester" >
          <el-input v-model="form.semester" placeholder="请输入开课学期" ></el-input>
        </el-form-item>
        <el-form-item label="开课时间 " prop="week" >
          <el-input v-model="form.week" placeholder="请输入上课时间"></el-input>
        </el-form-item>
        <el-form-item label="上课地点 " prop="room" >
          <el-input v-model="form.room" placeholder="请输入上课地点"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
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
      lessonFlag: false,
      teacherFlag: false,
      lessonMsg: '',
      teacherMsg: '',
      teachers: [],
      lessons: [],
      message: '',
      description: '',
      form: {
        name: '',
        cid: '',
        teacher_id: '',
        lesson_id: '',
        semester: '',
        room: '',
        week: ''
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
          this.teacherFlag = true
          this.teacherMsg = '该院系无教师信息，请导入教师信息后重新添加教学班'
        }
        if (result[1] === undefined) {
          this.lessonFlag = true
          this.lessonMsg = '该院系无课程信息，请导入课程信息后重新添加教学班'
        }
      })
    },
    // 添加班级
    submitForm: function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          classViewModel.requestPostClassInfo(this.form).then(response => {
            if (response !== undefined) {
              this.$message({
                message: '添加教学班成功',
                type: 'success'
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
