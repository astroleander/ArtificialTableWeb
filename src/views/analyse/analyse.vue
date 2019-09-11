<template>
  <div>
    <div class="select-box">
      <!--      &lt;!&ndash;选择学期 &ndash;&gt;-->
      <!--      <el-select v-model="semester" placeholder="请选择学期" @change="selectedSemester">-->
      <!--        <el-option-->
      <!--          v-for="item in semesterList"-->
      <!--          :key="item.name"-->
      <!--          :value="item.name">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <!--选择课程组 -->
      <el-select v-model="lessonId" placeholder="请选择课程组" @change="selectedLesson">
        <el-option
          v-for="item in lessonList"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
      </el-select>
      <!--选择大项 -->
      <el-select v-model="titleGroupId" placeholder="请选择大项" @change="selectedTitleGroup" style="margin-left: 10px">
        <el-option
          v-for="item in titleGroupList"
          :key="item.id"
          :value="item.id"
          :label="item.name">
        </el-option>
      </el-select>
    </div>
    <div v-if="empty" class="loading-box" v-loading="loading">
      <p>{{Message}}</p>
    </div>
    <div v-else="empty" class="info-box">
      <el-table :data="this.connection" class="flex-30">
        <el-table-column prop="number" label="相关值"></el-table-column>
        <el-table-column prop="tip" label="相关程度"></el-table-column>
      </el-table>
      <div v-if="this.showDraw" class="flex-70" style="display: flex;flex-flow: row">
        <at-bar :data-item="this.Item" :data-value="this.Value" :data-titlegroupname="this.titleGroupName"
                style="width: 80%"></at-bar>
        <el-button @click="onChangeDraw()" size="mini" style="height: 30px;width: 20%" type="primary">切换成雷达图</el-button>
      </div>
      <div v-else="this.showDraw" class="flex-70" style="display: flex;flex-flow: row">
        <radar-bar :data-item="this.radarItem" :data-set="this.Value" :data-titlegroupname="this.titleGroupName" style="width: 80%"></radar-bar>
        <el-button @click="onChangeDraw()" size="mini" style="height: 30px;width: 20%" type="primary">切换成条状图</el-button>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import classInfosViewModel from '@/viewmodel/classinfos'
  import lessonanalyseViewModel from '@/viewmodel/lesson'
  import titleGroupViewModel from '@/viewmodel/titlegroups'
  import AtBar from './bar'
  import RadarBar from './rabar'

  export default {
    components: {AtBar, RadarBar},
    name: 'analyse',
    data() {
      return {
        placeText: '', // placeholder的文本内容
        Message: '', // 首页提示信息
        loading: false,
        semester: '', // 已选择学期
        semesterList: [], // 学期列表
        lessonId: '', // 已选择课程组
        lessonList: [], // 课程组列表
        titleGroupId: '', // 已选大项
        titleGroupList: [], // 大项列表
        titleGroupName: '', // 已选大项名称
        errorList: [], // 错误信息列表
        empty:
          true,
        datavalue:
          [],
        showDraw:
          true,
        Item:
          [],
        Value:
          [],
        data:
          [],
        radarItem:
          [],
        connection:
          [
            {
              number: '0.8-1.0',
              tip: '极强相关'
            },
            {
              number: '0.6-0.8',
              tip: '强相关'
            },
            {
              number: '0.4-0.6',
              tip: '中等程度相关'
            },
            {
              number: '0.2-0.4',
              tip: '弱相关'
            },
            {
              number: '0.0-0.2',
              tip: '极弱相关或无相关'
            }
          ]
      }
    },
    computed: {
      ...mapGetters([
        'id',
        'token',
        'use_manager'
      ])
    },
    methods: {
      onChangeDraw() {
        if (this.showDraw === true) {
          this.showDraw = false
        } else {
          this.showDraw = true
        }
      },
      // 接收到返回课程分析信息
      selectedSemester() {
        this.empty = false
        lessonanalyseViewModel
          .requestAnalyseLessons(this.semester)
          .then(response => {
            this.datavalue = response
            this.Item = Object.keys(this.datavalue)
            for (let i = 0; i < this.Item.length; i++) {
              this.radarItem.push({
                name: this.Item[i],
                max: 1
              })
            }
            this.Value = Object.values(this.datavalue)
          })
      },
      // 计算分析结果
      selectedTitleGroup() {
        this.empty = false
        this.titleGroupList.forEach(titleGroup => {
          if (titleGroup.id === this.titleGroupId) this.titleGroupName = titleGroup.name
        })
        // console.log('this.titleGroupName=', this.titleGroupName)
        lessonanalyseViewModel
          .requestAnalyseLessons(this.titleGroupId)
          .then(response => {
            this.datavalue = response
            this.Item = Object.keys(this.datavalue)
            this.radarItem = []
            for (let i = 0; i < this.Item.length; i++) {
              this.radarItem.push({
                name: this.Item[i],
                max: 1
              })
            }
            this.Value = Object.values(this.datavalue)
            // console.log('this.Value=', this.Value)
          })
      },
      // 选择课程组后组装大项titleGroup
      selectedLesson() {
        titleGroupViewModel
          .requestTitleGroups({'lesson_id': this.lessonId})
          .then(response => {
            this.titleGroupList = response
            console.log('response=', this.titleGroupList)
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
        if (this.use_manager) {
          return classInfosViewModel
            .requestAll(this.token)
            .then(response => {
              if (response !== undefined) {
                // 将获取到班级信息按照学期分类
                this.buildSemesterList(response)
              }
            }).catch(reject => {
            })
        } else {
          return classInfosViewModel
            .requestByTeacherId(this.id)
            .then(response => {
              if (response !== undefined) {
                // 将获取到班级信息按照学期分类
                this.buildSemesterList(response)
              }
            }).catch(reject => {
            })
        }
      },
      // fetchTitleGroupByTeacherId(){
      //   return titleGroupViewModel
      // },
      fetchLessonByTeacherId() {
        return classInfosViewModel
          .requestLessonIdListByteacherId(this.id).then(response => {
            if (response !== undefined) {
              this.lessonList = response
            }
          }).catch(reject => {
          })
      },
      initPage() {
        this.Message = '请选择要进行课程分析的学期'
        this.fetchsemesterInfosById()
        this.fetchLessonByTeacherId()
      }
    },
    created() {
      this.initPage()
    }
  }
</script>

<style lang="scss" scoped>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .select-box {
    display: flex;
    padding-left: 10px;
    align-items: center;
    background: white;
    height: 60px;
    /*border: 1px solid #CCCCCC;*/
  }

  .alert-box {
    width: 550px;
  }

  .info-box {
    display: flex;
    background: white;
    margin-top: 1px;
    flex-flow: row;
    // align-items: center;
    // justify-content: center;
  }

  .loading-box {
    display: flex;
    height: 400px;
    background: white;
    margin-top: 1px;
    font-size: 20px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    align-items: center;
    justify-content: center;
  }

  .flex-10 {
    float: left;
    width: 10%;
    background: white;
  }

  .flex-30 {
    float: left;
    width: 30%;
    background: white;
  }

  .flex-70 {
    float: left;
    width: 70%;
    background: white;
  }
</style>
