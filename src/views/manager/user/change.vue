<template>
  <div class="rowframe">
    <el-card class="form-box" v-if="!empty">
      <div slot="header">
        <span class="rowframe title">个人信息</span>
      </div>
      <el-form class="form" :rules="rules"   ref="ruleForm" :model="form" label-width="100px">
        <el-form-item label="教师姓名:" prop="name">
          <span> {{form.name}}</span>
        </el-form-item>
        <el-form-item label="教师编号:" prop="tid" required>
          <span> {{form.tid}}</span>
        </el-form-item>
        <el-form-item label="输入旧密码: " prop="old_password" required>
          <el-input v-model="form.old_password" placeholder="请输入旧密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码: " prop="new_password" required>
          <el-input v-model="form.new_password" placeholder="请输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="请确认密码: " prop="renew_password" required>
          <el-input v-model="form.renew_password" placeholder="请确认密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="教师邮箱: " prop="email" >
          <el-input v-model="form.email" placeholder="请输入邮箱" ></el-input>
        </el-form-item>
        <el-form-item label="教师电话: " prop="mobile"  >
          <el-input v-model="form.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
          <el-button @click="onReset">清空重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import UserViewModel from '@/viewmodel/user'
export default {
    name: 'change',
    data() {
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
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
        // 以字母开头，长度在6~18之间，只能 包含字母、数字和下划线
          const passReg = /\w{4,20}/
          if (passReg.test(value)) {
            callback()
          } else {
            callback(new Error('请以字母开头，长度在5~18之间'))
          }
          callback()
        }
      }
      var validateNewPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (value === this.form.old_password) {
          callback(new Error('新密码不可与原密码一致!'))
        } else {
          const passReg = /\w{4,20}/
          if (passReg.test(value)) {
            callback()
          } else {
            callback(new Error('请以字母开头，长度在5~18之间'))
          }
          callback()
        }
      }
      var validateRePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.new_password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
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
        form: {
          id: null,
          name: '',
          tid: '',
          old_password: '',
          new_password: '',
          renew_password: '',
          email: '',
          mobile: ''
        },
        ChangePassword: false,
        empty: true,
        rules: {
          name: [
            { required: true, message: '请输入教师姓名', trigger: 'blur' }
          ],
          tid: [
            { validator: validateTeacherId, trigger: 'blur' }
          ],
          old_password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          new_password: [
            { validator: validateNewPassword, trigger: 'blur' }
          ],
          renew_password: [
            { validator: validateRePassword, trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { validator: validateMobile, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'user_collegeId',
        'token',
        'id',
        'sid',
        'is_manager'
      ])
    },
    methods: {
    // 修改用户信息
      submitForm: function(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const Teacher = this.form
            console.log(Teacher)
            UserViewModel.requestChangeOwnInfo(Teacher).then(response => {
              console.log(response)
              if (response.code === '2005') {
                this.$message({
                  message: '修改用户成功',
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
      },
      changePassword() {
        if (!this.ChangePassword) {
          this.ChangePassword = true
        } else {
          this.ChangePassword = false
          this.form.new_password = ''
          this.form.renew_password = ''
        }
      }
    },
    created() {
      UserViewModel.requestOwnInfo(this.id)
        .then(response => {
          this.form.id = response[0].id
          this.form.name = response[0].name
          this.form.email = response[0].email
          this.form.mobile = response[0].mobile
          this.form.tid = response[0].tid
          this.empty = false
        })
    }
}
</script>

<style scoped>
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
    width: 100%;
    height: calc(100vh - 50px);
    /*min-width: 500px;
    padding: 20px;
    /*border: 1px solid #999999;*/
  }
    .form{
        width: 50%;
        margin-left: 25%;
    }
</style>
