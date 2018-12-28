<!--<template>-->
  <!--<div class="app-container">-->
    <!--<el-tabs :value="getFirstLessonCode" type="card" @tab-click="handleTabChange" ref="tab">-->
      <!--<el-tab-pane-->
        <!--v-for="(item, index) in lesson_list"-->
        <!--:key="item.id"-->
        <!--:label="item.name"-->
        <!--:name="item.id+''"-->
      <!--&gt;-->
      <!--</el-tab-pane>-->
    <!--</el-tabs>-->

    <!--<student-list-->
      <!--:lesson_id="current_lesson_id"-->
      <!--@on-delete-dialog="onDialogDelete"-->
      <!--@on-edit-dialog="onDialogEdit">-->
    <!--</student-list>-->

    <!--<el-dialog-->
      <!--title="提示"-->
      <!--:visible.sync="dialogVisible"-->
      <!--width="30%"-->
      <!--:before-close="onDialogClose">-->
      <!--<span>{{dialogData.name}}</span>-->
      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
      <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import StudentList from '@/components/Table/studentList'-->
<!--import { getLessons } from '@/api/lesson'-->

<!--export default {-->
  <!--components: { StudentList },-->
  <!--name: 'student',-->
  <!--data() {-->
    <!--return {-->
      <!--current_lesson_id: '',-->
      <!--lesson_list: [],-->
      <!--dialogVisible: false,-->
      <!--dialogData: {}-->
    <!--}-->
  <!--},-->
  <!--created() {-->
    <!--this.fetchLessonData()-->
  <!--},-->
  <!--filters: {-->

  <!--},-->
  <!--computed: {-->
    <!--getFirstLessonCode() {-->
      <!--if (this.lesson_list.length > 0) {-->
        <!--return this.current_lesson_id-->
      <!--}-->
    <!--}-->
  <!--},-->
  <!--methods: {-->
    <!--fetchLessonData() {-->
      <!--getLessons().then(response => {-->
        <!--const list = response.subjects-->
        <!--// if response not null-->
        <!--if (list && list.length > 0) {-->
          <!--this.lesson_list = list-->
          <!--this.current_lesson_id = list[0].id + ''-->
        <!--} else if (list) {-->
          <!--this.$router.push('/manage/nostudentpage')-->
        <!--} else {-->
          <!--this.$router.push('/404')-->
        <!--}-->
      <!--})-->
    <!--},-->
    <!--onDialogEdit(idx, item) {-->
      <!--this.dialogVisible = true-->
      <!--this.dialogData = item-->
    <!--},-->
    <!--onDialogDelete(idx, item) {-->
      <!--this.$confirm('此操作将永久删除该学生, 是否继续?', '提示', {-->
        <!--confirmButtonText: '确定',-->
        <!--cancelButtonText: '取消',-->
        <!--type: 'warning'-->
      <!--}).then(() => {-->
        <!--this.$message({-->
          <!--type: 'success',-->
          <!--message: '删除成功!'-->
        <!--})-->
      <!--}).catch(() => {-->
        <!--this.$message({-->
          <!--type: 'info',-->
          <!--message: '已取消删除'-->
        <!--})-->
      <!--})-->
    <!--},-->
    <!--onDialogClose(done) {-->
      <!--this.$confirm('确认关闭？')-->
        <!--.then(_ => {-->
          <!--done()-->
        <!--})-->
        <!--.catch(_ => {})-->
    <!--},-->
    <!--handleTabChange(tabPane) {-->
      <!--this.current_lesson_id = tabPane.name-->
      <!--console.log(tabPane.name)-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
