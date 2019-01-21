<!-- Tree Structure of Transcript section -->
<!--
index
  |- div
    |- TODO: head (固定头部)
    |- TODO: radio tag card
    |- TODO: route
      |- TODO: transcript table
      |- TODO: check weight & analysis
-->
<!---->
<template>
  <div class="transcript-wrapper">
    <!-- <transcript-head
      :info='this.info'
      :table='this.table'
      :titles='this.model.titles'
    >
    </transcript-head> -->

    <input class="state" @click='switchMode("table")' type="radio" title="tab-one" name="tabs-state" id="tab-one" checked />
    <input class="state" @click='switchMode("stats")' type="radio" title="tab-two" name="tabs-state" id="tab-two" />
    <!-- <input class="state" @click='switchMode("students")' type="radio" title="tab-three" name="tabs-state" id="tab-three" /> -->
    <!-- <input class="state" @click='switchMode("logs")' type="radio" title="tab-four" name="tabs-state" id="tab-four" /> -->

    <div class="tabs flex-tabs">
      <label for="tab-one" id="tab-one-label" class="tab">成绩表</label>
      <label for="tab-two" id="tab-two-label" class="tab">成绩分析</label>
      <!-- <label for="tab-three" id="tab-three-label" class="tab">班级成员</label> -->
      <!-- <label for="tab-four" id="tab-four-label" class="tab">成绩日志</label> -->
    </div>


    <div id="transcript-container">
      <transition>
        <transcript-table
        v-show='this.getMode("table")'
        :view='this.table'
        :titles='this.model.titles'
        :info='this.info'
        @onTitleAdded='handleTitleChanged'
        @onExportTable='handleExportTable'
        @onDeletedTitle="handleDeletedTitle"
        >
        </transcript-table>
      </transition>
      <transcript-weight v-show='getMode("stats")'
                         :avg="weightData.avg"
                         :description="weightData.description"
                         :total="weightData.total"
                         :rate="weightData.rate"
                         :flag="weightData.flag"
                         :titles="model.titles"
                         :valid="weightData.studentScore.length-weightData.invalidScore"
                         :grade-section="weightData.gradeSection"
                         :title-average="weightData.titleAverage">
      </transcript-weight>
    </div>
  </div>
</template>

<script>
import transcriptHead from './head'
import transcriptTable from './table'
import transcriptWeight from './weight'

// import XLSX from 'xlsx'

import viewmodel from '@/viewmodel/table'
import titleViewmodel from '@/viewmodel/title'
import titleGroupViewModel from '@/viewmodel/titlegroups'
import classinfoViewmodel from '@/viewmodel/classinfos'

export default {
  components: {
    transcriptHead,
    transcriptTable,
    transcriptWeight
  },
  data() {
    return {
      info: this.getInfo,
      shownTab: 'table',
      loading: true,
      model: {
        points: null,
        studentMap: new Map(),
        titles: [],
        titleMap: new Map(),
        titleGroupMap: new Map()
      },
      weightData: {
        avg: 0, // 班级平均分
        rate: 0, // 班级及格率
        total: 0, // 班级总人数
        invalidScore: 0, // 不合法成绩，不在0-100之间
        flag: false, // 若数据不全则显示提示信息，否则显示雷达图
        description: '', // 若不能合法显示的提示信息
        gradeSection: [], // 分数段//  gradeSection[0] 0-60 gradeSection[1] 60-70 gradeSection[2] 70-80 gradeSection[3] 80-90 gradeSection[4] 90-100
        titleAverage: [], // 小项平均分（只计算有成绩的列）
        studentScore: [], // 学生成绩统计
        titlePoint: [] // 按照小项分别统计成绩
      },
      table: []
    }
  },
  watch: {
  },
  computed: {
    isShown: function() {
      return !this.loading
    },
    getInfo: function() {
      return this.$store.getters.course(this.id)
    },
    id: function() {
      return this.$router.currentRoute.params.id
    }
  },
  created() {
    // 要是想好好写这个代码的话可以考虑回滚到 12 月之前的版本
    this.info = this.$store.getters.course(this.id)
    if (this.info === undefined) {
      const class_id = this.id
      classinfoViewmodel.requestClassInfos({ id: class_id }).then(res => {
        // console.log(res[0])
        this.info = res && res[0]
      })
    }
    // console.log(this.$store.getters.course(''+1))
  },
  mounted() {
    console.log(this.$router.currentRoute.params.id)
    this.fetchDataset()
  },
  methods: {
    getMode: function(code) {
      if (code === this.shownTab) return true
      else false
    },
    switchMode: function(code) {
      this.shownTab = code
    },
    buildTable: function() {
      // build table cell
      // each student map to a row on table
      this.model.studentMap.forEach(element => {
        const row = {
          // add student info (first two column line of the table)
          student: element,
          point: []
        }
        // add student's point
        this.model.points.forEach(pointItem => {
          if (pointItem.student_id === element.id) {
            row.point.push(pointItem)
            // row[pointItem.title_id] = pointItem
          }
        })
        this.table.push(row)
      })
      // build title
    },
    findStudentById(student_id) {
      return this.model.studentMap.get(student_id)
    },
    findTitleById(title_id) {
      return this.model.titles.find(title => {
        return title.id === title_id
      })
    },
    handleTitleChanged(title) {
      console.log(this.model.titles)
      titleViewmodel.requestPostTitle(title).then(res => {
        title.id = res[0].id
        this.model.titles.push(title)
      })
    },
    handleExportTable: function(dialogResult) {
    },
    handleDeletedTitle: function(title) {
      const idx = this.model.titles.findIndex(item => item.id === title.id)
      this.model.titles.splice(idx, 1)
    },
    fetchDataset: function() {
      // const lesson_id = this.info.lesson_id
      Promise.all([
        viewmodel.requestTitles({ classInfo_id: this.id }),
        viewmodel.requestPoints({ classInfo_id: this.id }),
        viewmodel.requestStudents({ classInfo_id: this.id }),
        classinfoViewmodel.requestClassInfos({ id: this.id })
      ])
        .then(result => {
          console.log(result)
          // 获取小项数据
          result[0].forEach(element => {
            this.model.titles.push({ ...element, max: 100 })
            this.model.titleMap.set(element.id, element)
          })
          // 获取分数数据
          this.model.points = result[1]
          // 获取学生信息
          result[2].forEach(element => {
            this.model.studentMap.set(element.id, element)
          })
          this.info = result && result[3] && result[3][0]
          titleGroupViewModel.requestTitleGroups({ lesson_id: this.info.lesson_id }).then(res => {
            // 获取大项数据
            res.forEach(element => {
              this.model.titleGroupMap.set(element.id, element)
            })
            this.buildWeight()
          })
          this.buildTable()
        }).catch(err => {
        // TODO: show error page
          console.log(err)
          this.table = []
        })
    },
    init() {
      this.weightData.avg = 0 // 班级平均分
      this.weightData.rate = 0 // 班级及格率
      this.weightData.total = 0 // 班级总人数
      this.weightData.invalidScore = 0 // 不合法成绩
      this.weightData.flag = false // 班级总人数
      this.weightData.gradeSection = [] // 分数段
      this.weightData.titleAverage = [] // 小项平均分
      this.weightData.studentScore = [] // 学生成绩统计
      this.weightData.titlePoint = [] // 小项成绩统计
      for (let i = 0; i < 5; i++) {
        this.weightData.gradeSection.push(0)
      }
    },
    judgeLegal() {
      let flag = false
      const studentLength = this.model.studentMap.size
      const titleLength = this.model.titleMap.size
      const titleGroupLength = this.model.titleGroupMap.size
      const pointLength = this.model.points.length
      this.weightData.total = studentLength
      if (studentLength > 0 && titleLength > 0 && titleGroupLength > 0 && pointLength > 0) {
        flag = true
      } else {
        flag = false
        if (studentLength === 0) {
          this.weightData.description = '当前班级无学生信息'
        } else if (pointLength === 0) {
          this.weightData.description = '请检查成绩数据是否全部导入'
        } else if (titleLength === 0) {
          this.weightData.description = '请检查小项数据是否全部导入'
        } else if (titleGroupLength === 0) {
          this.weightData.description = '请检查大项数据是否全部导入'
        }
      }
      return flag
    },
    buildStudentScore() {
      let flag = true // 判断是否计算出所有学生的成绩
      let total = 0
      let num = 0
      this.model.studentMap.forEach(element => {
        const studentInfo = { id: element.id, name: element.name, sum: 0 }
        try {
          this.model.points.forEach(pointItem => {
            if (pointItem.student_id === element.id) {
              const temp = this.countPoint(pointItem)
              if (temp[0]) {
                // 该分数条目计算成功
                studentInfo[pointItem.title_id] = temp[1]
                studentInfo.sum += temp[1]
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
            return false
          }
        }
        // console.log('studentInfo.id =' + element.id)
        // console.log('studentInfo.sum =' + studentInfo.sum)
        this.judgeSum(studentInfo.sum)
        this.weightData.studentScore.push(studentInfo)
        total += studentInfo.sum
        num++
      })
      this.weightData.avg = Math.round(total / num)
      return flag
    },
    buildTitleAverage() {
      this.model.titles.forEach(element => {
        const titleInfo = { id: element.id, name: element.name, sum: 0, avg: 0, num: 0 }
        this.model.points.forEach(pointItem => {
          if (pointItem.title_id === element.id) {
            titleInfo.num++
            titleInfo.sum += pointItem.pointNumber
          }
        })
        // 若此小项下有分数条目，则将分析的结果存入
        if (titleInfo.num !== 0) {
          titleInfo.avg = Math.round(titleInfo.sum / titleInfo.num)
          this.weightData.titlePoint.push(titleInfo)
          this.weightData.titleAverage.push(titleInfo.avg)
        }
      })
    },
    // 获取及格率
    getPassExamRate: function() {
      const validScore = this.weightData.studentScore.length
      return Math.round((validScore - this.weightData.gradeSection[0]) * 100 / validScore)
    },
    // 判断分数区间
    judgeSum(sum) {
      if (sum >= 0 && sum < 60) {
        this.weightData.gradeSection[0]++
      } else if (sum >= 60 && sum < 70) {
        this.weightData.gradeSection[1]++
      } else if (sum >= 70 && sum < 80) {
        this.weightData.gradeSection[2]++
      } else if (sum >= 80 && sum < 90) {
        this.weightData.gradeSection[3]++
      } else if (sum >= 90 && sum < 100) {
        this.weightData.gradeSection[4]++
      } else { // 不合法分数
        this.weightData.invalidScore++
      }
    },
    // 计算一条分数信息的实际得分
    countPoint(pointItem) {
      let flag = false
      let score = 0 // 分数
      const title_id = pointItem.title_id
      // 根据分数的title_id得到小项及其权重
      if (this.model.titleMap.get(title_id)) {
        const title = this.model.titleMap.get(title_id)
        const titleWeight = title.weight
        const titleGroup_id = title.titleGroup_id
        // 根据小项的titleGroup_id得到大项及其权重
        if (this.model.titleGroupMap.get(titleGroup_id)) {
          const titleGroup = this.model.titleGroupMap.get(titleGroup_id)
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
          this.weightData.description = '请检查大项数据是否全部导入'
        }
      } else {
        // 若无法根据分数中的title_id获取小项
        // 计算成绩失败,给出提示信息
        this.weightData.description = '请检查小项数据是否全部导入'
      }
      return [flag, score]
    },
    print(lable, msg) {
      console.log(lable + ' = ' + msg)
    },
    buildWeight: function() {
      // 初始化
      this.init()
      // 判断是否可以继续成绩分析
      if (this.judgeLegal()) {
        if (this.buildStudentScore()) {
          // 若全部学生的成绩都可以计算出，计算小项平均值
          this.buildTitleAverage()
          // 若小项平均值计算完成,可显示雷达图显示小项信息
          this.weightData.flag = true
        }
        this.weightData.rate = this.getPassExamRate()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.transcript-wrapper {
  background: white;
}

.state{
  position: absolute;
  left: -10000px;
}

.flex-tabs{
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  .tab{
    opacity: 0.6;
    flex-grow: 0.5;
    max-width: 200px;
    max-height: 40px;
    transition: 0.3s ease-in-out;
  }
}

.tab {
  display: inline-block;
  padding: 10px;
  vertical-align: top;
  cursor: hand;
  cursor: pointer;
  border-bottom: 4px solid #fff;
}

#tab-one:checked ~ .tabs #tab-one-label,
#tab-two:checked ~ .tabs #tab-two-label,
#tab-three:checked ~ .tabs #tab-three-label,
#tab-four:checked ~ .tabs #tab-four-label{
    cursor: default;
    opacity: 1;
    transition: 0.3s ease-in-out;
    border-color: #69be28;
}

</style>
