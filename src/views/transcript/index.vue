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
    <button class='select' @click='switchMode()'>Switch</button><!-- Switch Bar -->
    <div id="transcript-container">
      <transcript-table
        v-show='this.isTable'
        :view='this.table'
        :titles='this.model.titles'
        :info='this.info'
        @onTitleAdded='handleTitleChanged'
      >
      </transcript-table>
      <transcript-weight v-show='!this.isTable'></transcript-weight>
    </div>
  </div>
</template>

<script>
import transcriptHead from './head'
import transcriptTable from './table'
import transcriptWeight from './weight'

import viewmodel from '@/viewmodel/transcript/'

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
      containerShown: true,
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
    isTable: function() {
      return this.containerShown === true
    },
    isShown: function() {
      return !this.loading
    },
    getInfo: function() {
      return this.$store.getters.course(this.id)
    }
  },
  created() {
    this.info = this.$store.getters.course(this.id)
    // console.log(this.$store.getters.course(''+1))
  },
  mounted() {
    this.fetchDataset()
  },
  methods: {
    switchMode: function() {
      this.containerShown = !this.containerShown
    },
    fetchDataset: function() {
      Promise.all([
        viewmodel.requestTitle(this.id),
        viewmodel.requestPoint(this.id),
        viewmodel.requestStudent(this.id)
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
      this.model.titles.push(title)
    }
  }
}
</script>

<style lang="scss" scoped>
.transcript-wrapper {
  background: white;
}
</style>
