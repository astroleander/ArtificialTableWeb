<!-- Tree structure of comparison -->
<!--
    div
    DONE: demand analysis
-->
<!-- 管理员-->
<!-- 1.获取当前学校的课程组lessonInfo-->
<!-- 2.选择课程组后，-->
<!--     (1)根据lesson_id查询此课程组下的课程classInfos-->
<!--     (2)根据lesson_id在titleGroup中查询，获得当前课程的大项权重信息TitleGroupInfo-->
<!-- 3.遍历classInfos，-->
<!--    (1)根据classInfos_id在Point中查询，将查询到PointInfo信息按照学生id分类-->
<!--    (2)根据classInfos_id在title中查询，获得当前课程的小项权重TitleInfo-->
<!--    (3)将这个班级中学生的小项按照大项id分组，每组成绩与权重相乘，求和，-->
<!--       最后将每组的分数与大项的权重分布相乘，求和可得到这个班级所有学生的成绩-->

<!-- 普通教师-->
<!-- 1.获取当前教师的教学班classInfos-->
<!-- 2.选择教学班后，-->
<!--    (1)根据教学班的lesson_id在titleGroup中查询，获得当前课程的大项权重信息TitleGroupInfo-->
<!--    (2)根据classInfos_id在Point中查询，将查询到PointInfo信息按照学生id分类-->
<!--    (3)根据classInfos_id在title中查询，获得当前课程的小项权重TitleInfo-->
<!--    (4)将这个班级中学生的小项成绩与权重相乘，求和，可得到这个班级所有学生的成绩-->

<!-- 数据说明-->
<!--       classActualPointInfo   {}  存储一个班级的实际成绩信息   -->
<!--                       以student_id作为key值         -->
<!--                       value值类型为{                -->
<!--                      "classInfos_id": 1,             -->
<!--                      "student_id": 2,               -->
<!--                       "小项名称1": 78,小项的实际分数-->
<!--                       "小项名称2": 78,小项的实际分数-->
<!--                                    .                -->
<!--                                    .                -->
<!--                                    .                -->
<!--                       "小项名称n": 78,小项的实际分数-->
<!--                        "总分" :87    该学生的实际总分-->
<!--                       }                              -->
<!--       diagramPointInfo 最终统计数据格式说明：       -->
<!--                        diagramPointInfo[0]:各教学班是否可计算成绩  例：默认[0,0]-->
<!--                        diagramPointInfo[1]:各教学班id      例：[1,2]-->
<!--                        diagramPointInfo[2]:各教学班名称       例：['一班','二班']-->
<!--                        diagramPointInfo[3]:各教学班及格人数   例：[30,35]-->
<!--                        diagramPointInfo[4]:各教学班不及格人数 例：[10,8]-->
<!--                        diagramPointInfo[5]:各教学班平均分     例：[70,76]-->
<!--suppress ALL -->
<!-- 成绩比较模版 -->
<template>
  <div class="comparison">  <!--选择-->
   <!-- 管理员权限，需要选择课程组-->
    <div class="select-box" v-if="this.use_manager">
      <el-select class="courseSelect" v-model="value" :placeholder="placeText" @change="selectedChange">
        <el-option
          v-for="item in selectData"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <!--选择学期 -->
      <el-select v-model="semester" v-if="semesterList.length >0" placeholder="请选择学期" @change="selectedSemester">
        <el-option
          v-for="item in semesterList"
          :key="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>
    <!--普通教师权限，只选择学期即可-->
    <div v-else class="select-box" >
      <el-select v-model="semester" v-if="semesterList.length >0" placeholder="请选择学期" @change="selectedSemester">
        <el-option
          v-for="item in semesterList"
          :key="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>
     <!-- 数据为空，警告信息-->
    <div  v-if="empty"  class="loading-box" v-loading="loading" style="margin-top: 1px">
      <el-card class="alert-box">
        <div slot="header">
          <span class="row title">信息提示</span>
        </div>
        <p class="row">{{Message}}</p>

        <el-table  class="errortable" v-if="errorList.length> 0" :data="errorList">
          <el-table-column prop="name" label="班级名称" align="center" width="150"></el-table-column>
          <el-table-column  label="错误信息" align="center" width="200">
            <template slot-scope="scope">
              <el-tag type="danger" >{{scope.row.errorMsg}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="rowframe" v-if="!empty" style="margin-top: 1px">
      <!--表格显示具体数据信息-->
      <div>
        <el-alert v-if="showNone" title="尚未选中任何班级进行比较查看" type="warning" style="align-items: center"></el-alert>
      </div>
      <div class="tableCard">
        <el-table :data="classPointInfos" stripe
                  ref="table" @selection-change="handleSome">
          <el-table-column width="80" type="selection"/>
          <el-table-column prop="name"  label="教学班名称" align="center"/>
          <el-table-column prop="total" label="总人数" align="center"/>
          <el-table-column prop="validScoreNum" label="有效成绩" align="center"/>
          <el-table-column prop="noPassExamNum" label="不及格人数" align="center"/>
          <el-table-column label="及格率" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.passExamRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="avgScore" label="平均分" align="center"/>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-button type="success" @click="submitHandle">批量查看</el-button>
            </template>
            <template slot-scope="scope">
            <el-button @click="handleOne(scope.row)" type="success">查看信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
     <!--自定义绘制条形图-->
      <el-dialog :visible.sync="showDialogSome" title="各班级情况对比图">
        <pass-exam-bar class="barClass" :dataSet="diagramPointInfo"></pass-exam-bar>
      </el-dialog>
    </div>
    <el-dialog :visible.sync="showDialogOne" title="班级具体情况">
      <at-pie class="pie" :dataSet="Score"></at-pie>
    </el-dialog>
  </div>
</template>

<script>
import PassExamBar from './PassExamBar'
import AtPie from '@/components/Pie'
import lessonViewModel from '@/viewmodel/lesson'
import classInfosViewModel from '@/viewmodel/classinfos'
import titleGroupViewModel from '@/viewmodel/titlegroups'
import titleViewModel from '@/viewmodel/title'
import pointViewModel from '@/viewmodel/point'
import studentViewModel from '@/viewmodel/student'

// import classFieldViewModel from '@/viewmodel/classfield'
import { mapGetters } from 'vuex'
export default {
  components: { PassExamBar,AtPie },
  props: [],
  data() {
    return {
      placeText: '', // placeholder的文本内容
      Message: '', // 首页提示信息
      empty: true, // 是否显示分析结果
      loading: false,
      selectData: [], // 课程组列表/教学班列表
      value: '', // 课程组列表/教学班选择列表的值
      semester: '', // 学期列表的值
      semesterList: [], // 学期列表
      classInfos: [], // 根据课程组id（lesson_id）查询到的各教学班信息
      classPointInfos: [], // 存储多个班级的处理后的成绩信息
      diagramPointInfo: {}, // 处理classPointInfos里数据便于图表显示
      errorList: [],// 处理错误信息
      // error{ classInfo_id,classInfo_name,errorMsg}
      Score: [],  //学生成绩汇总
      showDialogOne: false, // 是否显示单一班级成绩
      multipleSelection: [],

      showDialogSome: false,
      showNone: false

    }
  },
  methods: {
    // 初始化多个班级相关信息
    initClassInfos() {
      this.errorList = []
      this.classPointInfos = [] // 存储多个班级的处理后的成绩信息
      this.diagramPointInfo = {} // 各班级分数信息（包含平均成绩，及格人数等统计信息）
    },
    // 初始化选择列表
    initSelectList() {
      this.selectData = []
      this.value = ''
      this.semesterList = []
      this.semester = ''
      this.empty = true
    },
    selectedChange: function(data_id) {
      // (1)根据lesson_id查询此课程组下的教学班信息classInfos和大项信息titleGroupInfo
      // 选中的课程组变化时，学期列表要清空
      this.semesterList = []
      this.semester = ''
      this.errorList = []
      this.empty = true
      this.fetchclassInfosByLessonId({ lesson_id: data_id })
    },
    // 创建学期列表
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
    // 学期列表值改变时
    selectedSemester(semester_name) {
      this.initClassInfos()
      this.empty = true
      if (this.use_manager) {
        this.buildClassPointInfos({
          semester: semester_name,
          lesson_id: this.value
        })
      } else {
        this.buildClassPointInfos({
          semester: semester_name,
          teacher_id: this.id
        })
      }
    },
    // 列表选中值改变时  (角色判断)
    /**
     * 根据参数获得多个班级信息
     * @param params   管理员：{lesson_id,semester} 教师：{teacher_id，semester}
     */
    buildClassPointInfos(params) {
      // 获取当前学期+当前课程组下的班级的信息和当前课程组的大项信息
      classInfosViewModel.requestClassInfos(params).then(response => {
        if (response !== undefined) {
          // (1)成功获取班级信息
          this.loading = true
          this.classInfos = response
          this.dealClassInfos()
        }
      })
    },
    // 根据获得的classInfo信息进行遍历，处理每个班级的成绩
    dealClassInfos() {
      const promiseClassArray = [] // 初始化处理每个班级成绩需要的promise数组
      for (let i = 0; i < this.classInfos.length; i++) {
        const classInfo_id = this.classInfos[i].id
        const lesson_id = this.classInfos[i].lesson_id
        const name = this.classInfos[i].name
        promiseClassArray.push(this.buildClassPromise(classInfo_id, lesson_id, name))
      }
      Promise.all(promiseClassArray).then(dealResult => {
        // console.log('dealresult = '+ dealResult)
        if (this.isExistTrue(dealResult)) { // 如果有一个班的成绩统计成功
          this.loading = false
          // this.buildDiagramData()
          this.empty = false
        } else {
          this.loading = false
          this.changeMessage('成绩分析失败，请检查数据是否全部录入')
          this.empty = true
        }
      })
    },
    buildDiagramData(classPointInfos) {
        this.diagramPointInfo = {}
        classPointInfos.forEach(classPointItem => {
          this.buildObject(this.diagramPointInfo, 1, classPointItem.id)
          this.buildObject(this.diagramPointInfo, 2, classPointItem.name)
          this.buildObject(this.diagramPointInfo, 3, classPointItem.passExamNum)
          this.buildObject(this.diagramPointInfo, 4, classPointItem.noPassExamNum)
          this.buildObject(this.diagramPointInfo, 5, classPointItem.avgScore)
          this.buildObject(this.diagramPointInfo, 6, classPointItem.passExamRate)
        })
        console.log(this.diagramPointInfo)
        this.showDialogSome = true
    },
    buildObject(object, key, value) {
      if (!object[key])
      {
        this.$set(object, key, [value])
      }else {
        object[key].push(value)
      }
    },
    // 判断数组里是否存在true值
    isExistTrue(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === true) {
          return true
        }
      }
      return false
    },

    // 获取一个班级的相关数据
    buildClassPromise(classInfo_id, lesson_id, name) {
      const model = {
        points: null,
        studentMap: new Map(),
        titleMap: new Map(),
        titleGroupMap: new Map(),
        titleSumMap: new Map()
      }
      const dataSet = {
        id: classInfo_id,
        name: name,
        total: 0,
        validScoreNum: 0,
        passExamNum: 0,
        noPassExamNum: 0,
        avgScore: 0,
        passExamRate: 0,
        studentScore: new Map()
      }
      return Promise.all([
        this.fetchTitleInfo({ classInfo_id: classInfo_id }),
        this.fetchPointInfo({ classInfo_id: classInfo_id }),
        this.fetchStudentInfo({ classInfo_id: classInfo_id }),
        this.fetchTitleGroupInfo({ lesson_id: lesson_id })])
        .then(result => {
           console.log('result[0] = ' + result[0])
           console.log('result[1] = ' + result[1])
           console.log('result[2] = ' + result[2])
           console.log('result[3] = ' + result[3])
          if (result[0] && result[1] && result[2] && result[3]) {
            // (1)获取小项数据
            result[0].forEach(element => {
              model.titleMap.set(element.id, element)
              if (model.titleSumMap.get(element.titleGroup_id)) {
                const temp = model.titleSumMap.get(element.titleGroup_id) + element.weight
                model.titleSumMap.set(element.titleGroup_id, temp)
              } else {
                model.titleSumMap.set(element.titleGroup_id, element.weight)
              }
            })
            // (2)获取分数数据
            model.points = result[1]
            // (3)获取学生信息
            result[2].forEach(element => {
              model.studentMap.set(element.id, element)
            })
            dataSet.total = model.studentMap.size
            // (4)获取大项项数据
            let titleGroupSum = 0
            result[3].forEach(element => {
              model.titleGroupMap.set(element.id, element)
              titleGroupSum += element.weight
            })
            model.titleGroupMap.set('TitleGroupSum', titleGroupSum)
            // console.log('classinfo_id = ' + classInfo_id)
            // 处理一个班级数据
            // 将处理好的数据存储
            this.classPointInfos.push(this.buildClassScore(model, dataSet))
          }
          if (result[0] === false) { // 无小项数据
            this.errorList.push({
              id: classInfo_id,
              name: name,
              errorMsg: '  无小项数据，请导入小项数据'
            })
          }
          if (result[1] === false) { // 分数数据
            this.errorList.push({
              id: classInfo_id,
              name: name,
              errorMsg: '  无成绩数据，请导入学生成绩'
            })
          }
          if (result[2] === false) { // 学生数据
            this.errorList.push({
              id: classInfo_id,
              name: name,
              errorMsg: '  无学生数据，请导入学生数据'
            })
          }
          if (result[3] === false) { // 大项数据
            this.errorList.push({
              id: classInfo_id,
              name: name,
              errorMsg: '  无大项数据，请导入大项数据'
            })
          }
          if (this.errorList.length > 0) {
            return Promise.resolve(false)
          } else {
            return Promise.resolve(true)
          }
        }).catch(error => {
          console.log(error)
          return Promise.resolve(false)
        })
    },
    // 根据参数查询大项信息
    fetchTitleGroupInfo(params) {
      return titleGroupViewModel.requestTitleGroups(params)
        .then(response => {
          if (response) {
            return Promise.resolve(response)
          } else {
            return Promise.resolve(false)
          }
        }).catch(reject => {
          return Promise.resolve(false)
        })
    },
    // 根据参数查询小项信息
    fetchTitleInfo(params) {
      return titleViewModel.requestTitles(params)
        .then(response => {
          if (response) {
            return Promise.resolve(response)
          } else {
            return Promise.resolve(false)
          }
        }).catch(reject => {
          return Promise.resolve(false)
        })
    },
    // 根据参数查询分数信息
    fetchPointInfo(params) {
      return pointViewModel.requestPoints(params)
        .then(response => {
          if (response) {
            return Promise.resolve(response)
          } else {
            return Promise.resolve(false)
          }
        }).catch(reject => {
          return Promise.resolve(false)
        })
    },
    // 根据参数查询学生信息
    fetchStudentInfo(params) {
      return studentViewModel.requestStudents(params)
        .then(response => {
          if (response) {
            return Promise.resolve(response)
          } else {
            return Promise.resolve(false)
          }
        }).catch(reject => {
          return Promise.resolve(false)
        })
    },
    // 根据一个班级的数据进行统计分析
    buildClassScore(model, dataSet) {
      let sum = 0
      model.points.forEach(pointItem => {
        // 只计算当前在此班级的学生的分数条目
        if (model.studentMap.get(pointItem.student_id)) {
          const temp = this.countPoint(model, pointItem, { classInfo_id: dataSet.id, name: dataSet.name })
          if (temp[0]) {
            // 该分数条目计算成功
            if (dataSet.studentScore.get(pointItem.student_id)) {
              const studentScore = dataSet.studentScore.get(pointItem.student_id) + temp[1]
              dataSet.studentScore.set(pointItem.student_id, studentScore)
            } else {
              dataSet.studentScore.set(pointItem.student_id, temp[1])
            }
            sum += temp[1]
          }
        }
      })
      dataSet.studentScore.forEach(score => {
        if (score >= 0 && score < 60) {
          dataSet.noPassExamNum++
          dataSet.validScoreNum++
        } else if (score >= 60 && score <= 100) {
          dataSet.passExamNum++
          dataSet.validScoreNum++
        }
      })
      // 有效成绩人数不为0
      if (dataSet.validScoreNum) {
        // 计算该班级的平均分，及格率
        dataSet.avgScore = Math.round(sum / dataSet.validScoreNum)
        dataSet.passExamRate = Math.round(dataSet.passExamNum * 100 / dataSet.validScoreNum)
      }
      return dataSet
    },
    // 计算一条分数信息的实际得分
    countPoint(model, pointItem, param) {
      let flag = false
      let score = 0 // 分数
      const title_id = pointItem.title_id
      // 根据分数的title_id得到小项及其权重
      if (model.titleMap.get(title_id)) {
        const title = model.titleMap.get(title_id)
        const titleWeight = title.weight
        const titleGroup_id = title.titleGroup_id
        // 根据小项的titleGroup_id得到大项及其权重
        if (model.titleGroupMap.get(titleGroup_id)) {
          const titleGroup = model.titleGroupMap.get(titleGroup_id)
          const titleGroupWeight = titleGroup.weight
          const titleSum = model.titleSumMap.get(titleGroup_id)
          const titleGroupSum = model.titleGroupMap.get('TitleGroupSum')
          const sum = titleSum * titleGroupSum
          // 分值*大项权重数值*小项权重数值/10000
          score = pointItem.pointNumber * titleWeight * titleGroupWeight / sum
          flag = true
          // console.log('point.id = ' + pointItem.id)
          // console.log('title_id = ' + title_id)
          // console.log('titleGroup_id =' + titleGroup_id)
          // console.log('score = ' + pointItem.pointNumber + '*' + titleWeight + '*' + titleGroupWeight + ' = ' + score)
        } else {
          // 若无法根据小项中的titleGroup_id获取大项
          // 计算成绩失败,给出提示信息
          this.errorList.push({
            id: param.classInfo_id,
            name: param.name,
            errorMsg: '  大项数据不全，请输入完整的大项数据'
          })
        }
      } else {
        // 若无法根据分数中的title_id获取小项
        // 计算成绩失败,给出提示信息
        this.errorList.push({
          id: param.classInfo_id,
          name: param.name,
          errorMsg: '  小项数据不全，请输入完整的小项数据'
        })
      }
      return [flag, score]
    },
    // 获取课程组信息
    fetchLessonInfo(college_id) {
      lessonViewModel
        .requestByCollegeId(college_id)
        .then(response => {
          if (response !== undefined) {
            this.selectData = response
          } else {
            this.changeMessage('当前学校无课程组信息')
          }
        })
    },
    // 根据lesson_id查询课程信息classInfos
    fetchclassInfosByTeacherId(params) {
      return classInfosViewModel
        .requestClassInfos(params)
        .then(response => {
          if (response !== undefined) {
            // 创建学期列表
            this.buildSemesterList(response)
          } else {
            // 若查询到的课程信息是空的
            this.changeMessage(' 当前教师无教学班信息')
          }
        }).catch(reject => {
          // 若查询到的课程信息是空的
          this.changeMessage(' 当前教师无教学班信息')
        })
    },
    // 根据lesson_id查询课程信息classInfos
    fetchclassInfosByLessonId(params) {
      return classInfosViewModel
        .requestClassInfos(params)
        .then(response => {
          if (response !== undefined) {
            // 将获取到课程信息按照学期分类
            this.buildSemesterList(response)
            this.changeMessage('请选择学期')
            this.classInfos = response
          } else {
            this.changeMessage('当前课程组无教学班信息')
          }
        }).catch(reject => {
          this.changeMessage('当前课程组无教学班信息')
        })
    },
    handleSome(val) {
      this.multipleSelection = val
    },
    handleOne(row) {
      this.Score = []
      console.log(row)
      var x1 = 0
      var x2 = 0
      var x3 = 0
      var x4 = 0
      var x5 = 0
      const studentScore = row.studentScore
      console.log(studentScore)
      for(let key in studentScore) {
        console.log('123456789')
        console.log(studentScore[key])
        const map = studentScore[key]
        console.log(map)
        map.forEach(score => {
          console.log('987654321')
          console.log(score)
          if(score>0 && score<60)
          {
            x1++
          }else if(score>=60 && score<70){
            x2++
          }else if(score>=70 && score<80){
            x3++
          }else if(score>=80 && score<90){
            x4++
          }else if(score>=90 && score<=100){
            x5++
          }
        })
      }
      this.Score.push({
        value: x1,
        name: '<60'
      })
      this.Score.push({
        value: x2,
        name: '60~70'
      })
      this.Score.push({
        value: x3,
        name: '70~80'
      })
      this.Score.push({
        value: x4,
        name: '80~90'
      })
      this.Score.push({
        value: x5,
        name: '90~100'
      })
      console.log(this.Score)
      this.showDialogOne = true
    },
    submitHandle() {
      console.log('asdfghjk')
      console.log(this.multipleSelection)

      if (this.multipleSelection === undefined || this.multipleSelection.length === 0)
      {
        this.showNone = true
      }else {
        this.buildDiagramData(this.multipleSelection)
      }
    },
    // 改变消息提示
    changeMessage(Message) {
      this.$message({
        message: Message,
        type: 'info'
      })
      this.Message = Message
    },
    // 初始化页面
    initPage() {
      // 管理员
      if (this.use_manager) {
        // 获取课程组信息，按照课程组进行成绩分析
        this.placeText = '请选择课程组'
        this.Message = '请选择要进行成绩比较的课程组'
        this.fetchLessonInfo(this.user_collegeId)
      } else {
        // 教师权限
        // 获取这个老师的所有教学班，按照学期进行成绩分析
        this.Message = '请选择要进行成绩比较的学期'
        this.fetchclassInfosByTeacherId({ teacher_id: this.id })
      }
    }
  },
  computed: {
    ...mapGetters([
      'user_collegeId',
      'use_manager',
      'id'
    ])
  },
    watch: {
        use_manager: function() {
            if (this.use_manager) {
                this.placeText = '请选择课程组'
                this.Message = '请选择要进行成绩比较的课程组'
                this.fetchLessonInfo(this.user_collegeId)
            } else {
                this.Message = '请选择要进行成绩比较的学期'
                this.fetchclassInfosByTeacherId({ teacher_id: this.id })
            }
        }
    },
  created() {
    this.initPage()
  }
}
</script>

<style lang="scss" scoped>
  .comparison{
    display: flex;
    flex-direction: column;
  }
  .row{
    display: flex;
    flex-direction: row;
    justify-content:center;
  }
  .errortable{
    padding-left: 10%;
    padding-right: 10%;
  }
  .barClass{
    width: 100%;
    height: 400px;
    border: 1px solid #CCCCCC;
  }
  .alert-box{
    width: 550px;
  }
  .barCard{
    width: 40%;
    height: 80%;
    // min-width: 400px;
    // min-height: 400px;
  }
  .tableCard{
    width: auto;
  }
  .rowframe{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }
  $grey: #999;
  $black: #212121;
  $white: #FFF;
  .select-box{
    display: flex;
    padding-left: 10px;
    align-items: center;
    background: white;
    height: 60px;
    /*border: 1px solid #CCCCCC;*/
  }
  .courseSelect{
    margin-right: 100px;
  }
  .primary-card{
    background-color: #d3dce6;
    z-index: -100;
  }

  .loading-box{
    display: flex;
    height: 400px;
    background: white;
    margin-top: 10px;
    font-size: 20px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    color: #409EFF;
    align-items: center;
    justify-content: center;
  }
</style>

