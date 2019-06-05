<template>
  <div>
    <div class="select-box">
      <!--选择学期 -->
      <el-select v-model="semester" placeholder="请选择学期" @change="selectedSemester">
        <el-option
          v-for="item in semesterList"
          :key="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>

    <div  v-if="empty" class="loading-box" v-loading="loading">
      <p >{{Message}}</p>
    </div>
    <div v-else="empty" class="info-box">
      <at-bar :data-item="this.Item" :data-value="this.Value"></at-bar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import classInfosViewModel from '@/viewmodel/classinfos'
import lessonanalyseViewModel from '@/viewmodel/lesson'
import AtBar from './bar'

export default {
  components: { AtBar },
  name: 'analyse',
  data() {
    return {
      placeText: '', // placeholder的文本内容
      Message: '', // 首页提示信息
      loading: false,
      semester: '', // 已选择学期
      semesterList: [], // 学期列表
      errorList: [], // 错误信息列表
      empty: true,
      datavalue: [],
      Item: [],
      Value: [],
      data: []
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'token'
    ])
  },
  methods: {
    // 接收到返回课程分析信息
    selectedSemester() {
      this.empty = false
      lessonanalyseViewModel
        .requestAnalyseLessons(this.semester)
        .then(response => {
          this.datavalue = response
          console.log(this.datavalue)
          this.Item = Object.keys(this.datavalue)
          console.log(this.Item)
          this.Value = Object.values(this.datavalue)
          console.log(this.Value)
        })
    },
    // 接收学期列表
    buildSemesterList(data) {
      this.semesterList = []
      this.errorList = []
      const temp = {}
      for (let i = 0; i < data.length; i++) {
        if (temp[data[i].semester] !== true) {
          this.semesterList.push({
            name: data[i].semester
          })
          temp[data[i].semester] = true
        }
      }
    },
    changeMessage(Message) {
      this.$message({
        message: Message,
        type: 'info'
      })
      this.Message = Message
    },
    initSelectList() {
      this.selectData = []
      this.semesterList = []
      this.semester = ''
    },
    fetchsemesterInfosById() {
      return classInfosViewModel
        .requestByTeacherId(this.id)
        .then(response => {
          if (response !== undefined) {
            // 将获取到班级信息按照学期分类
            this.buildSemesterList(response)
          }
        }).catch(reject => {
        })
    },
    initPage() {
      this.Message = '请选择要进行课程分析的学期'
      this.fetchsemesterInfosById()
    }
  },
  created() {
    this.initPage()
  }
}
</script>

<style  lang="scss" scoped>
  .row{
    display: flex;
    flex-direction: row;
    justify-content:center;
  }
  .select-box{
    display: flex;
    padding-left: 10px;
    align-items: center;
    background: white;
    height: 60px;
    /*border: 1px solid #CCCCCC;*/
  }
  .alert-box{
    width: 550px;
  }
  .info-box{
    display: flex;
    background: white;
    margin-top: 1px;
    align-items: center;
    justify-content: center;
  }
  .loading-box{
    display: flex;
    height: 400px;
    background: white;
    margin-top: 1px;
    font-size: 20px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    align-items: center;
    justify-content: center;
  }
</style>
