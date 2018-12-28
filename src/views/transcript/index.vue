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
      <transcript-weight v-show='getMode("stats")'></transcript-weight>
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
import classinfoViewmodel from '@/viewmodel/classinfos'

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
        titles: null
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
    // 要是想好好写这个代码的话可以考虑回滚到 12 月之前的版本
    this.info = this.$store.getters.course(this.id)
    if(this.info === undefined) {
      const class_id = this.id
      classinfoViewmodel.requestClassInfos({ id: class_id }).then(res => {
        // console.log(res[0])
        this.info = res && res[0]
      })
    }
    // console.log(this.$store.getters.course(''+1))
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
      console.log(this.model.titles)
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
        viewmodel.requestStudents({ classInfo_id: this.id })
      ])
        .then(result => {
          this.model.titles = result[0]
          this.model.points = result[1]

          result[2].forEach(element => {
            this.model.studentMap.set(element.id, element)
          })

          this.buildTable()
        }).catch(err => {
          // TODO: show error page
          console.log(err)
        })
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
