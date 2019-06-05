<!--管理员查看班级信息

-->
<template>
  <article>
    <el-collapse v-model="lesson_current_selected" accordion
      @change="onSelectedLessonChanged">
      <el-collapse-item v-for="lesson in lesson_list"
        :key="lesson.id" :title="lesson.name" :name="lesson.id"
      >
        <section slot="title">
          <!-- general card -->
          <span class="lesson-name">
            <i :class="['el-icon-caret-right', {rotate: lesson.id === lesson_current_selected}]"/>
            {{lesson.name}}
          </span>
        </section>
          <!-- lesson has class inside -->
          <template>
            <el-table v-if="lesson.dataset"
              :data="lesson.dataset">
              <el-table-column
                v-for="(title, idx) in titles"
                :key="idx"
                :label="title.label"
                :prop="title.prop">
              </el-table-column>

              <el-table-column label="">
                <template slot-scope="scope">
                  <el-button @click="onModifyClicked(lesson, scope.row)" type="success">学生信息</el-button>
                </template>
              </el-table-column>

              <el-table-column label="">
                <template slot-scope="scope">
                  <el-button @click="showClass(scope.row)" type="success">修改信息</el-button>
                </template>
              </el-table-column>

              <el-table-column label="">
                <template slot-scope="scope">
                  <el-button @click="onDeleteClicked(lesson, scope.row)" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <template>
              <el-row>
              <el-button @click="onAddToLessonClicked(lesson)" style="margin: 20px 0 0 40px;" type="success">添加新的班级</el-button>
              <el-button @click="onDeleteLessonClicked(lesson)" style="margin: 20px 0 0 20px;" type="danger" :disabled="Boolean(lesson && lesson.dataset)">删除课程</el-button>
              </el-row>
            </template>
          </template>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="修改班级信息" class="ClassInfo" :visible.sync="show" :before-close="onDialogClose">
      <el-form :model="InfoForm" ref="infoform">
        <el-form-item label="班级编号：" prop="cid" style="max-height: 60px">
          <el-input  v-model="InfoForm.cid"></el-input>
        </el-form-item>
        <el-form-item label="班级名：" prop="name" style="max-height: 60px">
          <el-input  v-model="InfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="教师：" prop="teacher_message_name" style="max-height: 60px">
          <el-input  v-model="InfoForm.teacher_message_name"></el-input>
        </el-form-item>
        <el-form-item label="学期：" prop="semester" style="max-height: 60px">
          <el-input  v-model="InfoForm.semester"></el-input>
        </el-form-item>
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
  </article>
</template>

<script>
import LessonViewModel from '@/viewmodel/lesson'
import ClassInfoViewModel from '@/viewmodel/classinfos'

import { mapGetters } from 'vuex'

export default {
  name: 'class',
  data() {
    return {
      lesson_current_selected: 0,
      /**
       * lesson_list
       *      |- ...lesson
       *             |- dataset
       *             |- name
       *             |- college_id
       **/
      lesson_list: [],
      titles: [
        // DONE: teacher name
        { prop: 'cid', label: '班级编号' },
        { prop: 'name', label: '班级名' },
        { prop: 'teacher_message.name', label: '教师' },
        { prop: 'semester', label: '学期' },
        { prop: 'student_count', label: '学生数' },
        { prop: 'room', label: '教室' },
        { prop: 'week', label: '上课时间' }
      ],
      show: false,
      InfoForm: {
        lesson_id: '',
        id: '',
        cid: '',
        name: '',
        teacher_id: '',
        teacher_message_name: '',
        semester: '',
        room: '',
        week: ''
      },
      showDisable: false
    }
  },
  computed: {
    ...mapGetters([
      'user_collegeId'
    ])
  },
  methods: {
    fetchLessonList() {
      LessonViewModel.requestLessons({ college_id: this.user_collegeId }).then(res => {
        this.lesson_list = res
      })
    },
    fetchClassInfoListByLessonId(id) {
      return new Promise(resolve => {
        ClassInfoViewModel.requestClassInfos({ lesson_id: id }).then(res => resolve(res))
      })
    },
    onSelectedLessonChanged(id) {
      if (id) {
        this.fetchClassInfoListByLessonId(id).then(res => {
          console.log(res)
          const class_array = res
          this.lesson_list.forEach((lesson, idx) => {
            if (lesson.id === id) {
              this.$set(this.lesson_list,
                this.lesson_list.findIndex((lesson, idx) => lesson.id === id),
                Object.assign(this.lesson_list[idx], { dataset: class_array })
              )
            }
          })
        }).catch(e => {
          console.log(e)
        })
      }
    },
    onModifyClicked(lesson, row) {
      console.log(row)
      // jump to modify pabe
      this.$router.push({
        name: 'addClassField',
        params: { id: row.id, type: 'modify' },
        query: { id: row.id }
      })
    },
    onDeleteClicked(lesson, row) {
      this.$prompt(
        '若要继续, 请在文本框内输入\"确认\"\n此操作将彻底删除该班级, 所有分数信息都将丢失！', '请确认删除操作', {
          confrimButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /确认/
          // type: 'warning',
        }).then(() => {
        ClassInfoViewModel.requestDelClassInfo(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.lesson_list.forEach(orilesson => {
            if (orilesson.id === lesson.id) {
              const idx = orilesson.dataset.findIndex(classinfo => classinfo.id === row.id)
              orilesson.dataset.splice(idx, 1)
            }
          })
        })
      })
    },
    onAddToLessonClicked(lesson) {
      this.$router.push({
        name: 'addClassInfo',
        params: { lesson_id: lesson.id }
      })
    },
    onTransferLessonClicked(lesson) {

    },
    onDeleteLessonClicked(lesson) {
      this.$prompt(
        '若要继续, 请在文本框内输入\"确认\"\n此操作将彻底删除该课程, 所有该课程下的班级信息都将丢失！', '请确认删除操作', {
          confrimButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /确认/
          // type: 'warning',
        }).then(() => {
        LessonViewModel.requestDelLesson(lesson.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          const idx = this.lesson_list.findIndex(orilesson => orilesson.id === lesson.id)
          this.lesson_list.splice(idx, 1)
        })
      })
    },
    showByIdx(row, idx) {
      console.log(row)
      console.log(idx)
    },
    showClass(row) {
      console.log('1234567890')
      console.log(row)
      this.InfoForm.lesson_id = row.lesson_id
      this.InfoForm.teacher_id = row.teacher_id
      this.InfoForm.id = row.id
      this.InfoForm.cid = row.cid
      this.InfoForm.name = row.name
      this.InfoForm.teacher_message_name = row.teacher_message.name
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
          ClassInfoViewModel.requestPutClassInfo(this.InfoForm)
            .then(response => {
              if (response !== undefined) {
                this.$message({
                  message: '修改教学班成功',
                  type: 'success'
                })
              }
            })
            .catch(err => {
              console.error(err)
            })
        }
      })
    },
    showDisabled() {
      const button = document.getElementById('deleteButton')
      if (!button.disabled) {
        this.showDisable = true
      }
    },
    getData(row, title) {
      Object.keys(row).forEach(prop => {
        if (prop === title.prop) {

        }
      })
    }
  },
  mounted() {
    this.fetchLessonList()
  }
}
</script>

<style lang="scss" scoped>
.lesson_card {
  display: flex;
  flex-direction: column;
}
.lesson-name {
  margin: 0 0 0 20px;
  font-size: 1.2em;
}

.rotate {
  transform: rotate(90deg)
}
</style>
