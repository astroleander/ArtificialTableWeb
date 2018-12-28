<!-- Tree structure of comparison -->
<!--
    div
    TODO: demand analysis
-->
<!-- 管理员-->
<!-- 1.获取当前学校的课程组lessonInfo-->
<!-- 2.选择课程组后，-->
<!--     (1)根据lesson_id查询此课程组下的课程classInfo-->
<!--     (2)根据lesson_id在titleGroup中查询，获得当前课程的大项权重信息TitleGroupInfo-->
<!-- 3.遍历classInfo，-->
<!--    (1)根据classInfo_id在Point中查询，将查询到PointInfo信息按照学生id分类-->
<!--    (2)根据classInfo_id在title中查询，获得当前课程的小项权重TitleInfo-->
<!--    (3)将这个班级中学生的小项按照大项id分组，每组成绩与权重相乘，求和，-->
<!--       最后将每组的分数与大项的权重分布相乘，求和可得到这个班级所有学生的成绩-->

<!-- 普通教师-->
<!-- 1.获取当前教师的教学班classInfo-->
<!-- 2.选择教学班后，-->
<!--    (1)根据教学班的lesson_id在titleGroup中查询，获得当前课程的大项权重信息TitleGroupInfo-->
<!--    (2)根据classInfo_id在Point中查询，将查询到PointInfo信息按照学生id分类-->
<!--    (3)根据classInfo_id在title中查询，获得当前课程的小项权重TitleInfo-->
<!--    (4)将这个班级中学生的小项成绩与权重相乘，求和，可得到这个班级所有学生的成绩-->

<!-- 数据说明-->
<!--       classActualPointInfo   {}  存储一个班级的实际成绩信息   -->
<!--                       以student_id作为key值         -->
<!--                       value值类型为{                -->
<!--                      "classInfo_id": 1,             -->
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
    <div class="select-box" v-if="this.user.is_manager">
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
      <p >{{Message}}</p>
    </div>
    <div class="rowframe" v-if="!empty" >
      <el-card class="barCard" shadow="hover">
        <pass-exam-bar class="barClass" :dataSet="diagramPointInfo"></pass-exam-bar>
      </el-card>
      <el-card class="tableCard" shadow="hover">
        <el-table :data="tablePointInfo" stripe >
          <el-table-column prop="name"  label="教学班名称" align="center" width="150"/>
          <el-table-column prop="total" label="总人数" align="center" width="100"/>
          <el-table-column prop="noPassExam" label="不及格人数" align="center" width="100"/>
          <el-table-column label="及格率" align="center" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.passExamRate }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="avg" label="平均分" align="center" width="100"/>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
  import PassExamBar from './PassExamBar'
  import LessonViewModel from '@/viewmodel/lesson'
  import classInfoViewModel from '@/viewmodel/classinfos'
  import TitleGroupViewModel from '@/viewmodel/titleGroup'
  import TitleViewModel from '@/viewmodel/title'
  import PointViewModel from '@/viewmodel/point'
  import ClassFieldViewModel from '@/viewmodel/classfield'
  import { mapGetters } from 'vuex'
  export default {
    components: { PassExamBar },
    props: [],
    data() {
      return {
        placeText: '', // placeholder的文本内容
        Message: '', // 首页提示信息
        college_id: 1, // 学校id
        empty:true,
        loading:false,
        selectData: [], // 课程组列表/教学班列表
        lessonInfo: [], // 根据college_id获取当前学校的课程组
        classInfo: [], // 根据课程组id（lesson_id）查询到的各教学班信息
        classInfoMap: {}, // 根据课程组id（lesson_id）查询到的各教学班信息
        classFieldInfo: [], // 根据课程组id（classInfo_id）查询到的各教学班的学生
        titleGroupInfo: {}, // 根据lesson_id查询titleGroup，查询本课程组的大类权重,
        titleGroupsInfo: {}, // 根据教师教学班所属的lesson_id查询titleGroup，查询大类权重
        pointInfo: {}, // 根据classInfo_id查询Point
        titleInfo: {}, // 根据classInfo_id查询title，查询教学班的所有
        classesPointInfo: {}, // 多个班级的成绩信息
        studentActualPointInfo: {}, // 存储一个学生处理后的成绩信息
        classActualPointInfo: {}, // 存储一个班级的处理后的成绩信息
        classesActualPointInfo: {}, // 存储多个班级的处理后的成绩信息
        classesAnalysisPointInfo: {}, // 多个班级的成绩的统计信息
        tablePointInfo:[],// 表格展示各班级信息
        diagramPointInfo: {}, // 各班级分数信息（包含平均成绩，及格人数等统计信息）
        value: '', // 选择列表的值
        semester:'',//学期列表的值
        semesterList:[],
      }
    },
    methods: {
      changeMessage(Message) {
        this.$message({
          message: Message,
          type: 'info'
        })
        this.Message = Message
      },
      //
      buildClassPoint(classData) {
        const  newData = {}
        for(let i = 0;i < classData.length;i++){
          this.buildObject(newData,classData[i].student_id,classData[i])
        }
        return newData
      },
      buildSemesterList(data){
        this.semesterList = []
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
      // 创建选择列表
      buildSelectData(data) {
        this.selectData = data
      },
      selectedSemester(semester_name){
        console.log('semester_name = '+ semester_name)
        let param = {}
        if (this.user.is_manager){
          param = {
            semester:semester_name,
            lesson_id: this.value
          }
          this.buildClassesPointInfo(param)
        }else {
          param = {
            semester:semester_name,
            teacher_id: this.id
          }
          this.buildTeacherClassesPointInfo(param)
        }

      },
      // 列表选中值改变时  (角色判断)
      selectedChange: function(data_id) {
        console.log('data_id = '+ data_id)
        // (1)根据lesson_id查询此课程组下的教学班信息classInfo和大项信息titleGroupInfo
        this.semesterList = []
        let params = { lesson_id: data_id }
        this.fetchAllClassInfo(params).then(flag =>{
          if (flag){
            this.semester = ''
            this.changeMessage('请选择学期')
            this.empty = true
          }else{
            this.changeMessage('当前课程组无教学班信息')
            console.log(params.lesson__id + ' 当前课程组无教学班信息')
            this.empty = true
          }
        })
      },
      initParams(){
        this.titleGroupInfo = {}
        this.titleInfo = {}
        this.classesPointInfo = {}
        this.classesActualPointInfo = {}
        this.diagramPointInfo = {}
      },
      buildTeacherClassesPointInfo(params) {
        this.initParams()
        // 根据教师id获取教师的教学班
        this.fetchClassInfo(params).then(flag =>{
          if (flag){// 获取当前所有教学班分别所属的课程组
            this.fetchTitleGroupsInfo().then(flag =>{
              if (flag){
                this.dealClassInfoAndTitleGroupInfo()
              }
            })
          }else{
            this.changeMessage('暂无教学班信息')
            this.empty = true
          }
        })
      },
      // 获取当前教师的教学班所属课程组的大项信息
      fetchTitleGroupsInfo(){
        let promiseArray = []
        let temp = {}
        let j = 0
        for(let i = 0; i< this.classInfo.length;i++ ){
          let lesson_id = this.classInfo[i].lesson_id
          console.log('lesson_id = '+ lesson_id)
          if (temp[lesson_id] !== true){
            temp[lesson_id] = true
            promiseArray[j] = this.fetchTitleGroupInfo({lesson_id: lesson_id})
            j++
          }
        }
        return Promise.all(promiseArray).then(result => {
          let flag = false
          if (this.isExistTrue(result)){
            flag = true
          }else{
            this.changeMessage('请检查大项信息是否录入')
          }
          return Promise.resolve(flag)
        })
      },
      /**
       * 构建多个班级的成绩信息
       * @param params   管理员：{lesson_id,semester} 教师：{teacher_id，semester}
       */
      buildClassesPointInfo(params){
        this.initParams()
        const classInfoPromise = this.fetchClassInfo(params)
        const titleGroupPromise = this.fetchTitleGroupInfo({ lesson_id:params.lesson_id })
        Promise.all([classInfoPromise,titleGroupPromise]).then(result => {
          console.log('result = '+ result)
          if (result[0]&&result[1]){ // (1)成功获取班级信息和大项信息
            this.loading = true
            this.dealClassInfoAndTitleGroupInfo()
          }else if (result[1] === false){
            this.changeMessage('当前课程组的大项权重为空,不能进行成绩分析')
            this.empty = true
          }else if (result[0] == false){
            this.changeMessage('当前学期此课程组无教学班信息,不能进行成绩分析')
            this.empty = true
          }

        })
      },
      dealClassInfoAndTitleGroupInfo(){
        this.classesPointInfo = {} // 初始化存储多个班级成绩的对象
        const promiseArray = []     // 初始化处理每个班级成绩需要的promise数组
        for (let i = 0; i < this.classInfo.length; i++){
          let params2 = { classInfo_id: this.classInfo[i].id }
          let titlePromise = this.fetchTitleInfo(params2)
          let classFieldPromise = this.fetchStudentInfo(params2)
          let pointPromise = this.fetchPointInfo(params2)
          let paramPromise = [titlePromise,classFieldPromise,pointPromise]
          promiseArray.push(this.buildClassPromise(paramPromise,i))
        }
        Promise.all(promiseArray).then(dealResult =>{
          if (this.isExistTrue(dealResult)){// 如果有一个班的成绩统计成功
            // 各个班级的成绩信息处理完毕后，将成绩进行一些统计分析
            this.loading = false
            console.log('dealresult = '+ dealResult)
            this.dealClassesPointInfo(this.classesActualPointInfo)
            this.empty = false
          }else{
            this.loading = false
            this.changeMessage('数据不全不能进行成绩分析，请检查小项信息、成绩信息和学生信息是否全部录入')
            this.empty = true
          }
        })
      },
      isExistTrue(arr){
        for(let i = 0 ; i< arr.length;i++){
          if (arr[i] === true) {
            return true
          }
        }
        return false
      },
      buildClassPromise(params,i){
        return Promise.all(params).then(([titleResult,classFieldResult,pointResult]) =>{
          let flag =false
          this.classActualPointInfo = {}
          // 获取此班级的成绩信息、小项信息和学生信息,只有三个部分都有时，才可以计算最终统计结果
          if (pointResult&&titleResult&&classFieldResult){
            console.log('this.classInfo[i].id = '+ this.classInfo[i].id)
            // 数据库中读取到的未处理的单个班级的成绩对象
            let classPoint = this.classesPointInfo[this.classInfo[i].id]
            // 计算班级每个人的分数
            let classflag = 0
            for(let studentId in classPoint){
              console.log('studentId = '+ studentId)
              // 根据studentId确定学生的pointArray
              // for(let k =0; k< classPoint[studentId].length;k++){
              // 单个学生的成绩数组
              let stuPointArray = classPoint[studentId]
              this.studentActualPointInfo = {
                classInfo_id: this.classInfo[i].id,
                student_id: studentId
              }
              let sum = 0
              let studentflag = 0
              // 计算单个学生的总分
              for(let j =0; j < stuPointArray.length; j++){
                let point = stuPointArray[j]
                let actualPoint = this.dealPoint(point)
                if (actualPoint[0]){
                  sum += actualPoint[1]
                }else {
                  studentflag = 1
                  break
                }
                this.studentActualPointInfo[point.title_id] = actualPoint[1]
              }
              if (studentflag){
                // 有学生的成绩无法计算成功
                classflag = 1
                break
              }else {
                this.studentActualPointInfo['总分'] = sum
                console.log('sum = ' + sum)
                this.$set(this.classActualPointInfo,studentId,this.studentActualPointInfo)
                this.studentActualPointInfo = {}
              }
            }
            // 一个学生的成绩由于小项或者大项信息不全计算失败，则这个班级的成绩分析失败
            if (classflag){
              flag = false
            }else{
              this.$set(this.classesActualPointInfo,this.classInfo[i].id,this.classActualPointInfo)
              flag = true
            }
          }
          return Promise.resolve(flag)
        })
      },
      dealPoint(point){
        let flag = false
        let score = 0
        // 根据分数的title_id得到小项及其小项权重
        let title_id = point.title_id
        // console.log('title_id = ' +title_id )
        // for(let item_id in this.titleInfo){
        //   console.log('item_id = ' + item_id )
        //   console.log('this.titleInfo[item_id]  = ' + this.titleInfo[item_id] )
        // }

        let title = this.titleInfo[title_id]
        if (title!==undefined&&title.weight!==undefined){
          let titleWeight = title.weight
          // 根据小项的titleGroup_id得到大项及其权重
          let titleGroup_id = title.titleGroup_id
          let titleGroup = this.titleGroupInfo[titleGroup_id]
          if (titleGroup!==undefined&&titleGroup.weight!==undefined){
            let titleGroupWeight = titleGroup.weight
            //分值*大项权重数值*小项权重数值/10000
            score = point.pointNumber*titleWeight*titleGroupWeight/10000
            console.log('point.id = '+ point.id)
            console.log('title_id = '+ title_id)
            console.log('titleGroup_id =' + titleGroup_id)
            console.log('score = ' + point.pointNumber + '*' + titleWeight + '*'+titleGroupWeight + ' = ' + score)
            flag = true
          }
        }
        return [flag,score]
      },
      dealClassesPointInfo(classesPoint) {
        console.log('test1')
        this.tablePointInfo = []
        for (let class_id in classesPoint) {
          console.log('test2')
          const classPoint = classesPoint[class_id]
          let sum = 0   // 全班总分
          let num = 0   // 全班人数
          let passExam = 0 // 及格人数
          let noPassExam = 0 // 不及格人数
          for (let student_id in classPoint) {
            console.log('test3')
            let studentPoint = classPoint[student_id]
            let score = studentPoint['总分']
            sum += score
            num++
            if (score >= 60) {
              passExam++
            } else {
              noPassExam++
            }
          }
          console.log('test4')
          let avg = Math.round(sum / num)
          let passExamRate = Math.round( passExam*100/(passExam+noPassExam))
          console.log('class_id     name    passExam    noPass  avg')
          console.log(class_id + '   '+ this.classInfoMap[class_id].name + '   ' +  passExam + '   ' + noPassExam+ '   ' +avg)
          let tableItem ={
            name: this.classInfoMap[class_id].name,
            passExamRate: passExamRate,
            avg: avg,
            noPassExam: noPassExam,
            total:passExam+noPassExam
          }
          this.tablePointInfo.push(tableItem)
          this.setDiagramPoint(class_id, this.classInfoMap[class_id].name, passExam, noPassExam, avg, passExamRate)
        }
      },
      setDiagramPoint(id, name, pass, noPass, avg,rate) {
        this.buildObject(this.diagramPointInfo, 1, id)
        this.buildObject(this.diagramPointInfo, 2, name)
        this.buildObject(this.diagramPointInfo, 3, pass)
        this.buildObject(this.diagramPointInfo, 4, noPass)
        this.buildObject(this.diagramPointInfo, 5, avg)
        this.buildObject(this.diagramPointInfo, 6, rate)
      },
      buildObject(object, key, value) {
        if (!object[key]) {
          this.$set(object, key, [value])
        } else {
          object[key].push(value)
        }
      },
      // 将获取到的数据处理成以id为key值的对象
      buildIdObject(dealData) {
        let newData = {}
        for (let i = 0; i < dealData.length; i++) {
          if (newData[dealData[i].id] === undefined){
            this.$set(newData, dealData[i].id, dealData[i])
          }
        }
        return newData
      },
      // 获取课程组信息
      fetchLessonInfo(college_id) {
        LessonViewModel
          .requestByCollegeId(college_id)
          .then(response => {
            if (response !== undefined) {
              this.buildSelectData(response)
            } else {
              this.changeMessage('当前学校无课程组信息')
            }
          })
      },
      // 根据lesson_id或者teacher_id查询课程信息classInfo
      fetchAllClassInfo(params) {
        return classInfoViewModel
          .requestClassInfos(params)
          .then(response => {
            let flag = false
            if (response !== undefined) {
              this.buildSemesterList(response)
              if (this.user.is_manager){
                this.classInfo = response
                this.classInfoMap = this.buildIdObject(this.classInfo)
              }
              flag = true
            }
            // else{
            //   this.changeMessage('当前课程组无教学班信息')
            // }
            return Promise.resolve(flag)
          })
      },
      // 根据lesson_id,semester查询课程信息classInfo
      fetchClassInfo(params) {
        return classInfoViewModel
          .requestClassInfos(params)
          .then(response => {
            let flag = false
            if (response !== undefined) {
              this.classInfo = response
              this.classInfoMap = this.buildIdObject(this.classInfo)
              flag = true
            }else{
              console.log('当前课程组无教学班')
            }
            return Promise.resolve(flag)
          })
      },
      // 根据classInfo_id参数查询学生信息
      fetchStudentInfo(params) {
        return ClassFieldViewModel
          .requestClassFields(params)
          .then(response => {
            let flag = false
            if (response !== undefined){
              this.classFieldInfo = response
              flag = true
            }else{
              console.log(params.classInfo_id + ' 当前班级无学生')
            }
            return Promise.resolve(flag)
          })
      },
      // 根据参数查询大项信息
      fetchTitleGroupInfo(params) {
        return TitleGroupViewModel
          .requestTitleGroups(params)
          .then(response => {
            let flag = false
            if (response !== undefined){
              this.titleGroupInfo = this.buildIdObject(response)
              flag = true
            }else{
              console.log(params.lesson_id + ' 当前课程组下无大项')
            }
            return Promise.resolve(flag)
          })
      },
      // 根据参数查询小项信息
      fetchTitleInfo(params) {
        return TitleViewModel
          .requestTitles(params)
          .then(response => {
            let flag = false
            if (response !== undefined){
              this.titleInfo = this.buildIdObject(response)
              flag = true
            }else{
              console.log(params.classInfo_id +' 当前教学班下无小项')
            }
            return Promise.resolve(flag)
          })
      },
      // 根据参数classInfo_id查询分数信息
      fetchPointInfo(params) {
        return PointViewModel
          .requestPoints(params)
          .then(response => {
            let flag = false
            if (response !== undefined){
              this.$set(this.classesPointInfo,params.classInfo_id,this.buildClassPoint(response))
              flag = true
            }else{
              console.log(params.classInfo_id + '当前教学班下无成绩信息')
            }
            return Promise.resolve(flag)
          })
      }
    },
    computed: {
      ...mapGetters([
        'user',
        'id'
      ])
    },
    created() {
      this.loading = false
      if (this.user.is_manager){
        this.fetchLessonInfo(this.user.college_id)
        this.placeText = '请选择课程组'
        this.Message = '请选择要进行成绩分析的课程组'
      }else{// fix
        this.fetchAllClassInfo({teacher_id: this.id}).then(flag => {
          this.Message = '请选择要进行成绩分析的学期'
          if (flag === false) {
            this.changeMessage(this.id + ' 当前教师无教课信息')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .barClass{
    width: 100%;
    height: 400px;
    border: 1px solid #CCCCCC;
  }
  .barCard{
    width: 50%;
    height: 80%;
    min-width: 400px;
    min-height: 400px;
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
    font-weight: bold;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    color: #409EFF;
    align-items: center;
    justify-content: center;
  }
</style>

