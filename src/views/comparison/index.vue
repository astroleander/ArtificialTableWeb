<!-- Tree structure of comparison -->
<!--
    div
    TODO: demand analysis
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
<template>
  <div class="app-container">  <!--选择-->
    <div class="select-box" v-if="this.use_manager">
      <el-select class="courseSelect" v-model="value" :placeholder="placeText" @change="selectedChange">
        <el-option
          v-for="item in selectData"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="semester" v-if="semesterList.length >0" placeholder="请选择学期" @change="selectedSemester">
        <el-option
          v-for="item in semesterList"
          :key="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>
    <div v-else class="select-box" >
      <el-select v-model="semester" v-if="semesterList.length >0" placeholder="请选择学期" @change="selectedSemester">
        <el-option
          v-for="item in semesterList"
          :key="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>
    <div  v-if="empty"  class="loading-box" v-loading="loading">
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
    <div class="rowframe" v-if="!empty" >
      <el-card class="barCard" shadow="hover">
        <pass-exam-bar class="barClass" :dataSet="diagramPointInfo"></pass-exam-bar>
      </el-card>
      <el-card class="tableCard" shadow="hover">
        <el-table :data="classPointInfos" stripe >
          <el-table-column prop="name"  label="教学班名称" align="center" width="150"/>
          <el-table-column prop="total" label="总人数" align="center" width="80"/>
          <el-table-column prop="validScoreNum" label="有效成绩" align="center" width="80"/>
          <el-table-column prop="noPassExamNum" label="不及格人数" align="center" width="100"/>
          <el-table-column label="及格率" align="center" width="80">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.passExamRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="avgScore" label="平均分" align="center" width="100"/>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import PassExamBar from './PassExamBar'
import lessonViewModel from '@/viewmodel/lesson'
import classInfosViewModel from '@/viewmodel/classinfos'
import titleGroupViewModel from '@/viewmodel/titleGroup'
import titleViewModel from '@/viewmodel/title'
import pointViewModel from '@/viewmodel/point'
import studentViewModel from '@/viewmodel/student'
import classFieldViewModel from '@/viewmodel/classfield'
import { mapGetters } from 'vuex'
  export default {
    components: { PassExamBar },
    props: [],
    data() {
      return {
        placeText: '', // placeholder的文本内容
        Message: '', // 首页提示信息
        empty: true, // 是否显示分析结果
        loading: false,
        selectData: [], // 课程组列表/教学班列表
        value: '', // 课程组列表/教学班选择列表的值
        semester:'', //学期列表的值
        semesterList:[], // 学期列表
        classInfos: [], // 根据课程组id（lesson_id）查询到的各教学班信息
        classPointInfos: [], // 存储多个班级的处理后的成绩信息
        diagramPointInfo: {},// 处理classPointInfos里数据便于图表显示
        errorList: [],// 处理错误信息
        // error{ classInfo_id,classInfo_name,errorMsg}
      }
    },
    methods: {
      // 初始化多个班级相关信息
      initClassInfos(){
        this.errorList = []
        this.classPointInfos = [] // 存储多个班级的处理后的成绩信息
        this.diagramPointInfo = {} // 各班级分数信息（包含平均成绩，及格人数等统计信息）
      },
      // 初始化选择列表
      initSelectList(){
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
      buildSemesterList(data){
        this.semesterList = []
        this.errorList = []
        let temp = {}
        for(let i =0; i< data.length;i++){
          if (temp[data[i].semester] !== true){
            this.semesterList.push({
              name:data[i].semester
            })
            temp[data[i].semester] = true
          }
        }
      },
      // 学期列表值改变时
      selectedSemester(semester_name){
        this.initClassInfos()
        if (this.use_manager){
          this.buildClassPointInfos({
            semester:semester_name,
            lesson_id: this.value
          })
        }else {
          this.buildClassPointInfos({
            semester:semester_name,
            teacher_id: this.id
          })
        }

      },
      // 列表选中值改变时  (角色判断)
      /**
       * 根据参数获得多个班级信息
       * @param params   管理员：{lesson_id,semester} 教师：{teacher_id，semester}
       */
      buildClassPointInfos(params){
        // 获取当前学期+当前课程组下的班级的信息和当前课程组的大项信息
          classInfosViewModel.requestClassInfos(params)
            .then(response => {
              if (response !== undefined){
                // (1)成功获取班级信息
              this.loading = true
              this.classInfos = response
              this.dealClassInfos()
              }
            })
      },
      // 根据获得的classInfo信息进行遍历，处理每个班级的成绩
      dealClassInfos(){
        const promiseClassArray = []     // 初始化处理每个班级成绩需要的promise数组
        for (let i = 0; i < this.classInfos.length; i++){
          let classInfo_id = this.classInfos[i].id
          let lesson_id = this.classInfos[i].lesson_id
          let name = this.classInfos[i].name
          promiseClassArray.push(this.buildClassPromise(classInfo_id, lesson_id, name))
        }
        Promise.all(promiseClassArray).then(dealResult =>{
          // console.log('dealresult = '+ dealResult)
          if (this.isExistTrue(dealResult)){// 如果有一个班的成绩统计成功
            this.loading = false
            this.buildDiagramData()
            this.empty = false
          }else{
            this.loading = false
            this.changeMessage('成绩分析失败，请检查数据是否全部录入')
            this.empty = true
          }
        })
      },
      buildDiagramData(){
        this.classPointInfos.forEach(classPointItem =>{
          this.buildObject(this.diagramPointInfo, 1, classPointItem.id)
          this.buildObject(this.diagramPointInfo, 2, classPointItem.name)
          this.buildObject(this.diagramPointInfo, 3, classPointItem.passExamNum)
          this.buildObject(this.diagramPointInfo, 4, classPointItem.noPassExamNum)
          this.buildObject(this.diagramPointInfo, 5, classPointItem.avgScore)
          this.buildObject(this.diagramPointInfo, 6, classPointItem.passExamRate)
        })
      },
      buildObject(object, key, value) {
        if (!object[key]) {
          this.$set(object, key, [value])
        } else {
          object[key].push(value)
        }
      },
      // 判断数组里是否存在true值
      isExistTrue(arr){
        for(let i = 0 ; i< arr.length;i++){
          if (arr[i] === true) {
            return true
          }
        }
        return false
      },

      // 获取一个班级的相关数据
      buildClassPromise(classInfo_id, lesson_id, name){
        let model = {
          points: null,
          studentMap: new Map(),
          titleMap: new Map(),
          titleGroupMap: new Map()
        }
        let dataSet = {
          id: classInfo_id,
          name: name,
          total: 0 ,
          validScoreNum: 0,
          passExamNum: 0,
          noPassExamNum: 0,
          avgScore: 0,
          passExamRate: 0
        }
        return Promise.all([
          this.fetchTitleInfo({ classInfo_id: classInfo_id }),
          this.fetchPointInfo({ classInfo_id: classInfo_id }),
          this.fetchStudentInfo({ classInfo_id: classInfo_id }),
          this.fetchTitleGroupInfo({ lesson_id: lesson_id })])
          .then(result => {
            // console.log('result[0] = ' + result[0])
            // console.log('result[1] = ' + result[1])
            // console.log('result[2] = ' + result[2])
            // console.log('result[3] = ' + result[3])
            if(result[0] && result[1] && result[2] && result[3]){
              // (1)获取小项数据
                result[0].forEach(element => {
                  model.titleMap.set(element.id, element)
                })
                // (2)获取分数数据
                model.points = result[1]
                // (3)获取学生信息
                result[2].forEach(element => {
                  model.studentMap.set(element.id, element)
                })
                // (4)获取大项项数据
                result[3].forEach(element => {
                  model.titleGroupMap.set(element.id, element)
                })
                // console.log('classinfo_id = ' + classInfo_id)
                // 处理一个班级数据
                // 将处理好的数据存储
                this.classPointInfos.push(this.buildClassScore(model,dataSet))
              }
              if (result[0] === false)
              { // 无小项数据

                this.errorList.push({
                  id: classInfo_id,
                  name: name,
                  errorMsg: '  无小项数据，请导入小项数据'
                })
              }
              if (result[1] === false)
              {// 分数数据
                this.errorList.push({
                  id: classInfo_id,
                  name: name,
                  errorMsg: '  无成绩数据，请导入学生成绩'
                })
              }
              if (result[2] === false)
              {// 学生数据
                this.errorList.push({
                  id: classInfo_id,
                  name: name,
                  errorMsg: '  无学生数据，请导入学生数据'
                })
              }
              if (result[3] === false)
              {// 大项数据
                this.errorList.push({
                  id: classInfo_id,
                  name: name,
                  errorMsg: '  无大项数据，请导入大项数据'
                })
              }
              if( this.errorList.length > 0 ){
                return Promise.resolve(false)
              } else {
                return Promise.resolve(true)
              }
            }).catch(error =>{
              console.log(error)
            return Promise.resolve(false)
          })
      },
      // 根据参数查询大项信息
      fetchTitleGroupInfo(params) {
        return titleGroupViewModel.requestTitleGroups(params)
          .then(response => {
            return Promise.resolve(response)
          }).catch(reject =>{
            return Promise.resolve(false)
          })
      },
      // 根据参数查询小项信息
      fetchTitleInfo(params) {
        return titleViewModel.requestTitles(params)
          .then(response => {
            return Promise.resolve(response)
          }).catch(reject =>{
            return Promise.resolve(false)
          })
      },
      // 根据参数查询分数信息
      fetchPointInfo(params) {
        return pointViewModel.requestPoints(params)
          .then(response => {
            return Promise.resolve(response)
          }).catch(reject =>{
            return Promise.resolve(false)
          })
      },
    // 根据参数查询学生信息
    fetchStudentInfo(params) {
      return studentViewModel.requestStudents(params)
        .then(response => {
          return Promise.resolve(response)
        }).catch(reject =>{
          return Promise.resolve(false)
        })
    },
      // 根据一个班级的数据进行统计分析
      buildClassScore(model,dataSet){
        model.studentMap.forEach(element => {
          dataSet.total ++
          let sum = 0 // 计算一个学生成绩的总分
          let flag = true // 判断一个学生成绩是否有效
          try {
            model.points.forEach(pointItem => {
              if (pointItem.student_id === element.id) {
                const temp = this.countPoint(model, pointItem, {classInfo_id: dataSet.id, name: dataSet.name})
                if (temp[0]) {
                  // 该分数条目计算成功
                  sum += temp[1]
                } else {
                  // 该分数条目因为数据不全计算失败，通过抛出异常结束这个学生的成绩计算
                  // 若有数据不全情况，则暂不显示雷达图，显示错误提示信息
                  throw new Error('missing data')
                }
              }
            })
          } catch (e) {
            if (e.message === 'missing data') {
              // 结束这个学生的成绩计算
              flag = false
              return false  // 结束本次循环
            }
          }
          // console.log('flag = '+ flag)
          if(flag){
            // console.log('sum = ' + sum)
            if(sum >= 0 && sum < 60 ){
              dataSet.noPassExamNum++
              dataSet.validScoreNum++
              dataSet.avgScore += sum
            } else if ( sum >= 60 && sum <=100 ){
              dataSet.passExamNum ++
              dataSet.validScoreNum++
              dataSet.avgScore += sum
            }
          }
        })
        // 有效成绩人数不为0
        if(dataSet.validScoreNum !== 0){
          // 计算该班级的平均分，及格率
          dataSet.avgScore = Math.round(dataSet.avgScore / dataSet.validScoreNum)
          dataSet.passExamRate = Math.round(dataSet.passExamNum * 100/ dataSet.validScoreNum)
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
            // 分值*大项权重数值*小项权重数值/10000
            score = pointItem.pointNumber * titleWeight * titleGroupWeight / 10000
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
          }).catch(reject =>{
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
            }
          }).catch(reject =>{
            this.changeMessage('当前课程组无教学班信息')
          })
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
      initPage(){
        // 管理员
        if (this.use_manager){
          //获取课程组信息，按照课程组进行成绩分析
          this.placeText = '请选择课程组'
          this.Message = '请选择要进行成绩分析的课程组'
          this.fetchLessonInfo(this.user_collegeId)
        }else{ //教师权限
          // 获取这个老师的所有教学班，按照学期进行成绩分析
          this.Message = '请选择要进行成绩分析的学期'
          this.fetchclassInfosByTeacherId({teacher_id: this.id})
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
    watch:{
      use_manager:function (val) {
        this.initSelectList()
        this.initPage()
      }
    },
    created() {
     this.initPage()
    }
  }
</script>

<style lang="scss" scoped>
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
    min-width: 400px;
    min-height: 400px;
  }
  .tableCard{
    width: 55%;
  }
  .rowframe{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
  }
  $grey: #999;
  $black: #212121;
  $white: #FFF;
  .select-box{
    display: flex;
    padding-left: 40px;
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
    margin-top: 20px;
    font-size: 20px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    color: #409EFF;
    align-items: center;
    justify-content: center;
  }
</style>

