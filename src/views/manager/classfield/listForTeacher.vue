<template>
    <div>
        <el-table :data="this.classInfos"
        border
        stripe>
            <el-table-column
                    v-for="(title, idx) in titles"
                    :key="idx"
                    :label="title.label"
                    :prop="title.prop" align="center">
            </el-table-column>

            <el-table-column label="">
                <template slot-scope="scope">
                    <el-button @click="showClass(scope.row)" type="primary">修改班级信息</el-button>
                </template>
            </el-table-column>

            <el-table-column align="center">
                <template slot-scope="scope">
                    <div>
                        <el-button type="primary" @click="onModifyClicked(scope.row)">学生信息</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="" align="center">
                <template slot-scope="scope">
                    <el-button @click="onDeleteClicked(scope.row)" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--修改班级基本信息弹出框-->
        <el-dialog title="修改班级信息" class="ClassInfo" :visible.sync="show" :before-close="onDialogClose">
            <el-form :model="InfoForm" ref="infoform">
                <!--<el-form-item label="班级编号：" prop="cid" style="max-height: 60px">
                  <span>{{InfoForm.cid}}</span>
                </el-form-item>-->
                <el-form-item label="班级名：" prop="name" style="max-height: 60px">
                    <el-input  v-model="InfoForm.name"></el-input>
                </el-form-item>
                <el-form-item label="学期：" prop="semester" style="max-height: 60px">
                    <el-input  v-model="InfoForm.semester"></el-input>
                </el-form-item>
                <!--<el-form-item label="教师：" prop="teacher_id" style="max-height: 60px">
                    <el-select v-model="InfoForm.teacher_id" placeholder="请选择学期">
                        <el-option
                                v-for="(item,index) in teachers"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item label="教室：" prop="room" style="max-height: 60px">
                    <el-input  v-model="InfoForm.room"></el-input>
                </el-form-item>
                <el-form-item label="上课时间：" prop="week" style="max-height: 60px">
                    <el-input  v-model="InfoForm.week"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="submitChange('infoform')" style="margin-top: 10px" type="primary" plain>提交</el-button>
            <el-button @click="onDialogClose" style="margin-top: 10px" type="primary" plain>取消</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import classInfoViewModel from '@/viewmodel/classinfos'
    import router from '@/router'

    export default {
      name: 'listForTeacher',
      computed: {
        ...mapGetters([
          'id'
        ])
      },
      data() {
        return {
          classInfos: [],
          titles: [
            // DONE: teacher name
            { prop: 'name', label: '班级名' },
            { prop: 'semester', label: '学期' },
            { prop: 'student_count', label: '学生人数' },
            { prop: 'room', label: '教室' },
            { prop: 'week', label: '上课时间' }
          ],
          show: false,
          InfoForm: {
            lesson_id: '',
            id: '',
            // cid: '',
            name: '',
            teacher_id: '',
            semester: '',
            room: '',
            week: ''
          }
        }
      },
      methods: {
        getClassInfosByID() {
          classInfoViewModel.requestByTeacherId(this.id)
            .then(response => {
              this.classInfos = response
            }).catch(err => {
              console.log(err)
            })
        },
        showClass(row) {
          /* 修改班级信息由班级任课教师更改
              UserViewModel.requestUsersWithoutPwd({ college_id: this.user_collegeId }, this.token)
                .then(res => {
                  this.teachers = res
                })*/
          this.InfoForm.lesson_id = row.lesson_id
          this.InfoForm.teacher_id = row.teacher_id
          this.InfoForm.id = row.id
          // this.InfoForm.cid = row.cid
          this.InfoForm.name = row.name
          this.InfoForm.teacher_id = row.teacher_id
          this.InfoForm.semester = row.semester
          this.InfoForm.week = row.week
          this.InfoForm.room = row.room
          this.show = true
        },
        onDialogClose() {
          this.show = false
        },
        submitChange(infoForm) {
          this.$refs[infoForm].validate((valid) => {
            if (valid) {
              classInfoViewModel.requestPutClassInfo(this.InfoForm)
                .then(response => {
                  if (response !== undefined) {
                    this.$message({
                      message: '修改教学班成功',
                      type: 'success'
                    })
                    location.reload()
                  }
                })
                .catch(err => {
                  console.error(err)
                })
            }
          })
        },
        onDeleteClicked(row) {
          this.$confirm('此删除操作将彻底删除该班级, 所有分数信息都将丢失！', '提示', {
            confrimButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            classInfoViewModel.requestDelClassInfo(row.id).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              const idx = this.classInfos.findIndex(classinfo => classinfo.id === row.id)
              console.log(row)
              console.log(idx)
              this.classInfos.splice(idx, 1)
            })
          })
        },
        onModifyClicked(row) {
          // jump to modify pabe
          router.push({
            name: 'addClassField',
            params: { id: row.id, type: 'modify' },
            query: { name: row.name }
          })
        }
      },
      created() {
        this.getClassInfosByID()
      }
    }
</script>

<style scoped>

</style>