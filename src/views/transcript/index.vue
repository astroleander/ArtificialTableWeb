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
    <transcript-head
      :info='this.info'
      :table='this.table'
      :titles='this.model.titles'
    >
    </transcript-head>

    <input class="state" @click='switchMode("table")' type="radio" title="tab-one" name="tabs-state" id="tab-one" checked />
    <input class="state" @click='switchMode("stats")' type="radio" title="tab-two" name="tabs-state" id="tab-two" />
    <input class="state" @click='switchMode("students")' type="radio" title="tab-three" name="tabs-state" id="tab-three" />
    <input class="state" @click='switchMode("logs")' type="radio" title="tab-four" name="tabs-state" id="tab-four" />

    <div class="tabs flex-tabs">
      <label for="tab-one" id="tab-one-label" class="tab">成绩表</label>
      <label for="tab-two" id="tab-two-label" class="tab">成绩分析</label>
      <label for="tab-three" id="tab-three-label" class="tab">班级成员</label>
      <label for="tab-four" id="tab-four-label" class="tab">成绩日志</label>
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
        >
        </transcript-table>
      </transition>
      <transcript-weight v-show='getMode("stats")'
                         :avg="weightData.avg"
                         :total="weightData.total"
                         :rate="weightData.rate"
                         :flag="weightData.flag"
                         :titles="model.titles"
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

import FileSaver from 'file-saver'
import XLSX from 'xlsx'

import viewmodel from '@/viewmodel/table'
import titleViewmodel from '@/viewmodel/title'
import titleGroupViewModel from '@/viewmodel/titleGroup'

export default {
  components: {
    transcriptHead,
    transcriptTable,
    transcriptWeight
  },
  data() {
    return {
      id: this.$router.currentRoute.params.id,
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
        flag: false, // 判断是否能合法显示
        gradeSection: [], // 分数段//  gradeSection[0] 0-60 gradeSection[1] 60-70 gradeSection[2] 70-80 gradeSection[3] 80-90 gradeSection[0] 90-100
        titleAverage: [], // 小项平均分
        studentScore: [], // 学生成绩统计
        titlePoint: [] // 按照小项分别统计成绩
      },
      table: []
    }
  },
  watch: {
    id: function(newValue) {
      // console.log('view changed')
      // console.log(newValue)
    }
  },
  computed: {
    isShown: function() {
      return !this.loading
    },
    getInfo: function() {
      return this.$store.getters.course(this.id)
    }
  },
  created() {
    this.info = this.$store.getters.course(this.id)
  },
  mounted() {
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
      // console.log(this.model.titles)
      titleViewmodel.requestPostTitle(title).then(res => {
        title.id = res[0].id
        this.model.titles.push(title)
      })
    },
    handleExportTable: function(dialogResult) {
      // /* generate workbook object from table */
      // console.log(this.table)
      // let wb = XLSX.utils.json_to_sheet(generateOutput(this.table))
      // /* get binary string as output */
      // console.log(wb)
      // let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      // try {
      //   FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), dialogResult.filename + '.xlsx')
      // } catch (e) {
      //   if (typeof console !== 'undefined')
      //     console.log(e, wbout)
      // }
      // return wbout
    },
    fetchDataset: function() {
      Promise.all([
        viewmodel.requestTitles({ classInfo_id: this.id }),
        viewmodel.requestPoints({ classInfo_id: this.id }),
        viewmodel.requestStudents({ classInfo_id: this.id }),
        titleGroupViewModel.requestTitleGroups({ lesson_id: this.getInfo.lesson_id })
      ])
        .then(result => {
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
          // 获取大项项数据
          result[3].forEach(element => {
            this.model.titleGroupMap.set(element.id, element)
          })
          this.buildTable()
          this.buildWeight()
        }).catch(err => {
          // TODO: show error page
          console.log(err)
        })
    },
    init() {
      this.weightData.avg = 0 // 班级平均分
      this.weightData.rate = 0 // 班级及格率
      this.weightData.total = 0 // 班级总人数
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
        this.weightData.flag = false
        console.log('数据不全')
      }
      return flag
    },
    buildStudentScore() {
      let total = 0
      let num = 0
      this.model.studentMap.forEach(element => {
        const studentInfo = { id: element.id, name: element.name, sum: 0 }
        this.model.points.forEach(pointItem => {
          if (pointItem.student_id === element.id) {
            const temp = this.countPoint(pointItem)
            studentInfo[pointItem.title_id] = temp
            studentInfo.sum += temp
          }
        })
        this.judgeSum(studentInfo.sum)
        this.weightData.studentScore.push(studentInfo)
        total += studentInfo.sum
        num++
      })
      this.weightData.avg = Math.round(total / num)
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
        if (titleInfo.num !== 0) {
          titleInfo.avg = Math.round(titleInfo.sum / titleInfo.num)
        }
        this.weightData.titlePoint.push(titleInfo)
        this.weightData.titleAverage.push(titleInfo.avg)
      })
    },
    // 获取及格率
    getPassExamRate: function() {
      return Math.round((this.weightData.total - this.weightData.gradeSection[0]) * 100 / this.weightData.total)
    },
    // 判断分数区间
    judgeSum(sum) {
      if (sum < 60) {
        this.weightData.gradeSection[0]++
      } else if (sum >= 60 && sum < 70) {
        this.weightData.gradeSection[1]++
      } else if (sum >= 70 && sum < 80) {
        this.weightData.gradeSection[2]++
      } else if (sum >= 80 && sum < 90) {
        this.weightData.gradeSection[3]++
      } else if (sum >= 90 && sum < 100) {
        this.weightData.gradeSection[4]++
      }
    },
    // 计算一条分数信息的实际得分
    countPoint(pointItem) {
      let score = 0 // 总分数
      const title_id = pointItem.title_id
      // 根据分数的title_id得到小项及其权重
      const title = this.model.titleMap.get(title_id)
      const titleWeight = title.weight
      // 根据小项的titleGroup_id得到大项及其权重
      const titleGroup_id = title.titleGroup_id
      const titleGroup = this.model.titleGroupMap.get(titleGroup_id)
      const titleGroupWeight = titleGroup.weight
      // 分值*大项权重数值*小项权重数值/10000
      score = pointItem.pointNumber * titleWeight * titleGroupWeight / 10000
      // console.log('point.id = ' + pointItem.id)
      // console.log('title_id = ' + title_id)
      // console.log('titleGroup_id =' + titleGroup_id)
      // console.log('score = ' + pointItem.pointNumber + '*' + titleWeight + '*' + titleGroupWeight + ' = ' + score)
      return score
    },
    print(lable, msg) {
      console.log(lable + ' = ' + msg)
    },
    buildWeight: function() {
      // 初始化
      this.init()
      // 判断是否可以继续成绩分析
      if (this.judgeLegal()) {
        this.buildStudentScore()
        this.buildTitleAverage()
        this.weightData.rate = this.getPassExamRate()
        this.weightData.flag = true
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
