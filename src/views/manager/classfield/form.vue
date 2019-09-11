<!--
（1）添加一条classfield记录
    1.参数需要student_id,classInfo_id
     在classInfo_id 存在的情况下，只需要确定student_id即可
    2.student_id 的选择问题
         |--可以按照专业（major）选择,将整个专业的添加到这个班级
         |--可以全院搜索
   （1）可以当做一个查询问题，将筛选好的数据放在transfer左侧的列表中，
   （2）查询参数为major_id,
               |---major_id不选择时，获取院系所有的学生： 获取院系所有专业->获取每个专业所有学生 {college_id}
               |---major_id选择时，显示这个专业的学生{college_id,major_id}
    (3) transfer需要注意事项
              |--- 已经在该班级中的学生不能选
              |--- 按照学号筛选
    3.添加
  （2）删除一条classfield记录
   1.在classfiled中按照classfield的id删除
   2.在point表中将student_id,classInfo_id相同的删除（保留）
-->
<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span class="rowframe title">班级管理</span>
      </div>
      <!-- 此班级的学生列表-->
      <el-table :data="tableStudents"  @selection-change="delChange">
        <template slot="empty">
            该班级没有学生信息,请点击左上方的 "批量导入" 按钮为班级引入学生
        </template>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
              {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="sid" label="学号" minWidth="150" sortable></el-table-column>
        <el-table-column prop="name" label="姓名"  minWidth="150"></el-table-column>
        <el-table-column prop="major" label="专业"  minWidth="150"></el-table-column>

        <el-table-column label="操作" width="350">
          <template slot="header" slot-scope="scope">
            <el-button type="primary" size="medium"  @click="openImportDialog">批量导入</el-button>
            <el-button type="primary" size="medium"  @click="openAddDialog">添加学生</el-button>
            <el-button title="primary" size="medium" @click="confirmDeleteClassFields" type="danger">删除选中</el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="confirmDeleteOne(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="添加学生" :center="true" width="70%" :visible.sync="ImportDialogVisible" :before-close="handleClose">
        <add-class-student :class-info_id="this.$router.currentRoute.params.id"
                           @addEnd="handleAddEnd"
        ></add-class-student>
      </el-dialog>

        <el-dialog title="添加单个学生" :center="true"  width="70%" :visible.sync="AddDialogVisible" :before-close="handleClose">
                <el-form :rules='rules' ref='ruleForm' :model='form' label-width='100px'>
                    <el-form-item label='学生姓名' prop='name'>
                        <el-input v-model='form.name' placeholder='请输入学生姓名'></el-input>
                    </el-form-item>
                    <el-form-item label='学生编号' prop='sid' required>
                        <el-input v-model='form.sid' placeholder='请输入学生编号(至少6位数字)'></el-input>
                    </el-form-item>
                    <el-form-item label='入学年份' prop='year'>
                        <el-date-picker
                                v-model='form.year'
                                placeholder='请选择入学年份'
                                type='year'
                                format='yyyy'
                                value-format='yyyy'
                        ></el-date-picker>
                    </el-form-item>
                    <!--<el-form-item label='所属院系' prop='college_id'>
                        <el-select
                                v-model='form.college_id'
                                placeholder='请选择学生所在院系'
                                @change='fetchFormMajorList'
                        >
                            <el-option
                                    v-for='item in formCollegeList'
                                    :key='item.id'
                                    :label='item.name'
                                    :value='item.id'
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label='所属专业' prop='major_id'>
                        <el-select v-model='form.major_id' :placeholder='majorMessage'>
                            <el-option
                                    v-for='(item,index) in formMajorList'
                                    :key='index'
                                    :label='item.name'
                                    :value='item.id'
                            ></el-option>
                        </el-select>
                    </el-form-item>-->
                    <el-form-item>
                        <el-button type='primary' @click='submitForm("ruleForm")'>添加单个学生</el-button>
                        <el-button @click='onReset'>重新填写</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>

      <!-- 添加学生的对话框-->
      <!--<el-dialog title="选择要添加的学生" :center="true"  width="70%" :visible.sync="AddDialogVisible" :show-close="false">
          <el-select class="majorBox" v-model="selectedMajor" @change="handleMajorChange" placeholder="按专业筛选左侧学生列表" :clearable="true">
              <el-option v-for="major in majorList"
                         :key="major.id"
                         :label="major.name"
                         :value="major.id">
              </el-option>
            </el-select>
        <el-transfer
          class="transferBox"
            filterable
            :titles="['可选学生列表', '当前范围内已选']"
            :filter-method="filterMethod"
            :render-content="renderFunc"
            filter-placeholder="请输入学生的学号"
            v-model="selectedStudents"
            :props="transferProps"
            :data="transferData">
            </el-transfer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddStudent">取 消</el-button>
          <el-button type="success" @click="confirmAddStudents">下一步</el-button>
        </div>
      </el-dialog>

      <!-- 确认学生的界面-->
      <!--<el-dialog title="添加学生" class="confirmPage" :center="true" width="80%" :visible.sync="confirmDialogVisible" :show-close="false">
        <el-table :data="confirmTableStudents" >
          <template slot="empty">
            该班级暂无学生信息，请点击条目右上角导入
          </template>
          <el-table-column prop="sid" label="学号" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="major" label="专业" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleSelectedDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="backLastDialog">上一步</el-button>
          <el-button type="success" @click="handleAddClassFields">添加学生</el-button>
        </div>
      </el-dialog>
      <!--<div class="rowframe">-->
        <!--<el-cascader-->
          <!--v-if="selectList.length > 0"-->
          <!--expand-trigger="hover"-->
          <!--:options= "selectList"-->
          <!--prefix="请选择添加学生的班级"-->
          <!--@active-item-change="handleItemChange"-->
          <!--:props="cascaderProps"-->
          <!--:placeholder="message"-->
          <!--v-model="selectedValue"-->
          <!--:show-all-levels="false"-->
          <!--@change="handleChange">-->
        <!--</el-cascader>-->
      <!--</div>-->
    </el-card>
  </div>
</template>

<script>
import lessonViewModel from '@/viewmodel/lesson'
import classInfoViewModel from '@/viewmodel/classinfos'
import classFieldViewModel from '@/viewmodel/classfield'
import studentViewModel from '@/viewmodel/student'
import CollegeViewModel from '@/viewmodel/college'
import majorViewModel from '@/viewmodel/major'
import { mapGetters } from 'vuex'
import AddClassStudent from './addClassFieldStudent'

const validateName = (rule, value, callback) => {
  if (value.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
    callback(new Error('学生名称不可为空'))
  } else {
    callback()
  }
}
const validateStudentId = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入学生编号'))
  } else if (!Number.isInteger(+value)) {
    callback(new Error('请输入数字值'))
  } else {
    const tidReg = /^\d{6,}$/
    if (tidReg.test(value)) {
      callback()
    } else {
      callback(new Error('学生编号至少6位'))
    }
  }
  callback()
}
export default {
  components: { AddClassStudent },
  data() {
    return {
      // 选择列表相关信息
      message: '请选择添加学生的班级',
      selectList: [],
      delList: [],
      selectedValue: '',
      cascaderProps: {
        value: 'id',
        label: 'name'
        // children: 'cities'
      },
      // 表格中的学生信息
      tableStudents: [],
      classFields: [],
      // 要操作的classInfo_id
      classInfo_id: '',
      // 院系所拥有的专业
      majorList: [],
      selectedMajor: '',
      // 穿梭框相关数据
      transferData: [],
      studentMap: new Map(),
      transferProps: {
        key: 'id',
        label: 'name'
      },
      renderFunc(h, option) {
        return <span>{option.name}-{option.sid}</span>
      },
      selectedStudents: [], // 选中的学生
      filterMethod(query, item) {
        return item.sid.indexOf(query) > -1
      },
      // 添加dialog对话框相关数据
      AddDialogVisible: false,
      //  确认dialog对话框相关数据
      confirmDialogVisible: false,
      // 准备提交的数据
      confirmTableStudents: [],
      // 批量导入dialog对话框相关数据
      ImportDialogVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateName }
        ],
        sid: [{ validator: validateStudentId, trigger: 'blur' }],
        year: [{ required: true, message: '请选择年份', trigger: 'change' }],
        college_id: [
          { required: true, message: '请选择所属院系', trigger: 'change' }
        ],
        major_id: [
          { required: true, message: '请选择所属专业', trigger: 'change' }
        ]
      },
      form: {
        name: '',
        sid: '',
        year: '',
        major_id: '',
        college_id: ''
      },
      // 表单需要的院系信息以及专业信息
      formCollegeList: [],
      formMajorList: [],
      majorMessage: '请先选择院系'
    }
  },
  computed: {
    ...mapGetters([
      'user_collegeId',
      'user'
    ])
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleAddEnd() {
      this.ImportDialogVisible = false
      this.fetchTableStudentInfo()
    },
    delChange(val) {
      // console.log(val)
      this.delList = val
    },
    handleAddClassFields() {
      if (this.confirmTableStudents.length > 0) {
        this.addClassFields(this.confirmTableStudents)
        this.confirmDialogVisible = false
      } else {
        this.$message({
          type: 'info',
          message: '请返回上一步选择要添加的学生'
        })
      }
    },
    handleSelectedDelete(index, student) {
      this.confirmTableStudents.splice(index, 1)
      this.selectedStudents.splice(index, 1)
    },
    initTransfer() {
      // 专业选择列表相关数据
      this.majorList = []
      this.selectedMajor = ''
      // 穿梭框相关数据
      this.transferData = []
      this.selectedStudents = []
      this.studentMap = new Map()
      // 准备提交的数据
      this.confirmTableStudents = []
    },
    // 构建穿梭
    buildTransfer() {
      // 初始化
      this.initTransfer()
      // 获取所有专业
      this.fetchMajorInfo()
      //
      this.fetchTransferStudentInfo({ college_id: this.user_collegeId })
    },
    cancelAddStudent() {
      this.AddDialogVisible = false
      this.initTransfer()
    },
    // 返回添加的页面
    backLastDialog() {
      this.AddDialogVisible = true
      this.confirmDialogVisible = false
    },
    // 前往确认添加的学生的页面
    confirmAddStudents() {
      if (this.selectedStudents.length > 0) {
        this.buildConfirmTable()
        this.AddDialogVisible = false
        this.confirmDialogVisible = true
      } else {
        this.$message({
          type: 'info',
          message: '请先选择要添加的学生'
        })
      }
    },
    // 确认的表单
    buildConfirmTable() {
      this.confirmTableStudents = []
      for (let i = 0; i < this.selectedStudents.length; i++) {
        const id = this.selectedStudents[i]
        this.confirmTableStudents.push({
          student_id: this.studentMap.get(id).id,
          classInfo_id: this.classInfo_id,
          sid: this.studentMap.get(id).sid,
          name: this.studentMap.get(id).name,
          major: this.studentMap.get(id).major_message.name
        })
      }
    },
    confirmDeleteOne(id) {
      this.$confirm('此操作将该学生从班级中删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delClassField([{ id: id }])
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    confirmDeleteClassFields() {
      this.$confirm('此操作将选中学生从班级中删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delClassField(this.delList)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据参数删除classfiled记录
    delClassField(params) {
      classFieldViewModel.requestDelClassFields(params)
        .then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchTableStudentInfo()
        }).catch(reject => {
          console.log(reject)
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        })
    },
    // 根据college_id获取这个院系的课程组
    fetchLessonInfo() {
      lessonViewModel.requestLessons({ college_id: this.user_collegeId })
        .then(lessons => {
          lessons.forEach(lesson => {
            const item = {
              ...lesson,
              children: []
            }
            this.selectList.push(item)
          })
        }).catch(reject => {
          console.log('此院系无课程组信息')
        })
    },
    // 获取这个院系所有的学生
    // 根据college_id获取这个院系的专业
    fetchMajorInfo() {
      majorViewModel.requestMajors({ college_id: this.user_collegeId })
        .then(response => {
          this.majorList = response
        }).catch(reject => {
          console.log(reject)
        })
    },
    // 根据参数查询班级信息
    fetchClassInfo(param) {
      classInfoViewModel.requestClassInfos({ lesson_id: param[0] })
        .then(response => {
          for (let i = 0; i < this.selectList.length; i++) {
            if (this.selectList[i].id === param[0]) {
              this.selectList[i].children = response
              break
            }
          }
        }).catch(reject => {
          console.log(reject)
        })
    },
    // 根据classInfo_id获取学生信息
    fetchTableStudentInfo() {
      this.tableStudents = []
      classFieldViewModel.requestClassFields({ classInfo_id: this.classInfo_id })
        .then(classfields => {
          studentViewModel.requestStudents({ classInfo_id: this.classInfo_id })
            .then(students => {
              for (let i = 0; i < classfields.length; i++) {
                if (classfields[i].student_id === students[i].id) {
                  this.tableStudents.push({
                    id: classfields[i].id,
                    sid: students[i].sid,
                    student_id: students[i].id,
                    name: students[i].name,
                    major: students[i].major_message.name
                  })
                }
              }
            })
        }).catch(error => {
          console.log(error)
        })
    },
    /* fetchTableStudentInfo() {
      this.tableStudents = []
      classFieldViewModel.requestClassFields({ classInfo_id: this.classInfo_id })
        .then(classfields => {
          studentViewModel.requestStudents({ classInfo_id: this.classInfo_id })
            .then(students => {
              // for (let i = 0; i < classfields.length; i++) {
              for (let i = 0; i < students.length; i++) {
                // if (classfields[i].student_id === students[i].id) {
                this.tableStudents.push({
                  // id: classfields[i].id,
                  sid: students[i].sid,
                  student_id: students[i].id,
                  name: students[i].name,
                  major: students[i].major_message.name
                })
                // }
              }
            })
        }).catch(error => {
          console.log(error)
        })
    },*/
    // 根据classInfo_id获取学生信息,放入studentMap
    fetchTransferStudentInfo(params) {
      this.transferData = []
      studentViewModel.requestStudents(params)
        .then(response => {
          this.transferData = response
          if (params.college_id !== undefined) {
            this.studentMap = new Map()
            this.transferData.forEach(student => {
              this.studentMap.set(student.id, student)
            })
          }
          this.dealTransferData()
        }).catch(error => {
          console.log(error)
        })
    },
    // ?
    dealTransferData() {
      for (let i = 0; i < this.transferData.length; i++) {
        const temp = this.tableStudents.findIndex((item, index, arr) => {
          return item.student_id === this.transferData[i].id
        })
        if (temp > -1) {
          this.transferData[i].disabled = true
        }
      }
      this.transferData = this.transferData.filter(item => !item.disabled)
    },

    addClassFields(params) {
      classFieldViewModel.requestPostClassFields(params)
        .then(response => {
          if (response.length > 0) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '添加失败!'
            })
          }
          this.fetchTableStudentInfo()
        }).catch(reject => {
          this.$message({
            type: 'error',
            message: '创建失败!'
          })
        })
    },
    handleItemChange(lesson_id) {
      this.fetchClassInfo(lesson_id)
    },
    handleChange(value) {
      console.log('value[0] = ' + value[0])
      console.log('value[1] = ' + value[1])
    },
    // 开始添加学生 获取班级ID
    openAddDialog() {
      if (this.classInfo_id) {
        this.AddDialogVisible = true
        this.fetchCollegeList()
        // this.buildTransfer()
      } else {
        this.$message({
          type: 'error',
          message: '缺少班级参数!'
        })
      }
    },
    openImportDialog() {
      if (this.classInfo_id) {
        this.ImportDialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: '缺少班级参数!'
        })
      }
    },
    handleMajorChange(major_id) {
      // console.log(major_id)
      console.log('changeval = ' + this.selectedStudents)
      if (major_id === '' || major_id === undefined) {
        this.fetchTransferStudentInfo({ college_id: this.user_collegeId })
      } else {
        this.fetchTransferStudentInfo({ major_id: major_id })
      }
    },
    submitForm: function(formName) {
      this.form.college_id = 1
      this.form.major_id = 1
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form['classInfo_id'] = this.classInfo_id
          this.submitFormStudent([this.form])
          // this.fetchTableStudentInfo()
        } else {
          return false
        }
      })
    },
    submitFormStudent(list) {
      studentViewModel.requestPostStudents(list).then(res => {
        if (res.succeed_ids.length > 0) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.AddDialogVisible = false
          this.handleAddEnd()
        } else if (res.repeated_ids.length > 0) {
          this.$confirm('该学号已占用', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } else {
          this.$confirm('添加失败', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
      })
    },
    // 重置表单
    onReset() {
      this.$refs['ruleForm'].resetFields()
    },
    fetchCollegeList() {
      if (typeof this.user === 'string') {
        const user = JSON.parse(this.user)
        const university_id = user.university_message.id
        CollegeViewModel.requestByUniversityId(university_id).then(res => {
          this.formCollegeList = res
        })
      } else {
        const user = this.user
        const university_id = user.university_message.id
        CollegeViewModel.requestByUniversityId(university_id).then(res => {
          this.formCollegeList = res
        })
      }
    },
    fetchFormMajorList(value) {
      if (value === '') {
        this.majorMessage = '请先选择院系'
      } else {
        majorViewModel.requestByCollegeId(value).then(res => {
          this.formMajorList = res
          this.majorMessage = '请选择学生所属专业'
        })
      }
    }
  },
  created() {
    if (this.$router.currentRoute.params.id) {
      this.classInfo_id = this.$router.currentRoute.params.id
      this.fetchTableStudentInfo()
    } else {
      this.$confirm('此页面依赖于班级信息界面，请到班级信息页面选择班级查看, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ path: '/class/index' })
      })
    }
  }
}
</script>

<style lang="scss">
  .form-box{
    width: 100%;
    height: 100%;
    min-width: 600px;
    padding: 20px;
  }
  .title{
    font-weight: bold;
    font-size: larger;
  }
  .rowframe{
    display: flex;
    justify-content:center;
  }
  .transferBox{
    width: 500px;
    margin-left:15%;
  }
  .majorBox{
    margin-left: 15%;
    margin-bottom: 10px;
  }
</style>
