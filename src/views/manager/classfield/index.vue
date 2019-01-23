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
          <template v-if="lesson.dataset">
            <el-table
              :data="lesson.dataset"
            >
              <el-table-column label="">
                <template slot-scope="scope">
                  <el-button icon="el-icon-edit" @click="onModifyClicked(lesson, scope.row)">学生信息</el-button>
                  <el-button icon="el-icon-delete" @click="onDeleteClicked(lesson, scope.row)"></el-button>
                </template>
              </el-table-column>

              <el-table-column 
                v-for="(title, idx) in titles" 
                :key="idx"
                :label="title.label"
                :prop="title.prop"
              >
                <!-- <template slot-scope="scope">
                  <div>
                    {{scope.row[title.prop]}}
                     {{showByIdx(scope.row, idx)}} --> 
                  <!-- </div> -->
                <!-- </template> -->
              </el-table-column>

            </el-table>
          </template>
          <!-- lesson without class inside -->
          <template>
            <el-button @click="onAddToLessonClicked(lesson)" style="margin: 20px 0 0 40px;">添加新的班级</el-button>
            <el-button @click="onTransferLessonClicked(lesson)" style="margin: 20px 0 0 20px;" disabled>转移课程班级</el-button>
            <el-button @click="onDeleteLessonClicked(lesson)" style="margin: 20px 0 0 20px;" type="danger" :disabled="Boolean(lesson && lesson.dataset)">删除课程</el-button>
          </template>
      </el-collapse-item>
    </el-collapse>
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
        // TODO: teacher name
        { prop: 'name', label: '班级名' },
        { prop: 'cid', label: '班级编号' },
        { prop: 'teacher_message.name', label: '教师' },
        { prop: 'semester', label: '学期' },
        { prop: 'student_count', label: '学生数' },
        { prop: 'room', label: '教室' },
        { prop: 'week', label: '上课时间' }
      ]
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
                       