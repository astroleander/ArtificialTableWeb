<!--
supplement:添加管理员所在本院系的课程
-->
<template>
  <div class="app-container rowframe">
    <el-card class="form-box">
      <div slot="header">
        <span class="rowframe title">添加课程组</span>
      </div>
      <el-form :rules="rules"  status-icon ref="ruleForm" :model="form" label-width="100px">
        <el-form-item label="课程组名称 " prop="name" >
          <el-input v-model="form.name"  placeholder="请输入课程组名称"></el-input>
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
  import lessonViewModel from '@/viewmodel/lesson'
  const validateName = (rule, value, callback) => {
    if (value.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
      callback(new Error('课程名称不可为空'))
    } else {
      callback()
    }
  }
  export default {
    data() {
      return {
        form: {
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
            { required: true, trigger: 'blur', validator: validateName }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'user_collegeId'
      ])
    },
    methods: {
      // 添加用户
      submitForm: function(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.name = this.form.name.replace(/\s*/g, '')
            const Lesson = { ...this.form, college_id: this.user_collegeId }
            lessonViewModel.requestPostLesson(Lesson)
              .then(response => {
                if (response !== undefined) {
                  // console.log('11111' + response)
                  this.$store.dispatch('setLessonId', response[0].id)
                  this.$message({
                    message: '添加课程组成功',
                    type: 'success'
                  })
                  this.$router.push({
                    path: '/manager/weight',
                    query: {
                      lesson_id: response[0].id
                    }
                  })
                } else {
                  this.$message({
                    message: '插入新课程组项已存在，无法重复添加',
                    type: 'error',
                    duration: 3000
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
  }
</style>
