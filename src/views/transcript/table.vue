<!-- Tree Structure of Transcript Table of Transcript section -->
<!--
table
  |- div
  |- TODO: menu
  |- TODO: table
  |- ... TODO: row
-->
<!---->
<template>
  <section class="table-wrapper">
  <el-table
    @cell-dblclick='onCellClicked'
    :data="viewDataset"
    v-loading.body="loading"
    element-loading-text="Loading"
    height="calc(100vh - 315px)"
    ref="table"
    class="table">
    <el-table-column
      min-width="100px"
      prop="student.name"
      fixed
      label="学生姓名">
    </el-table-column>

    <el-table-column
      min-width="100px"
      prop="student.sid"
      fixed
      label="学号">
    </el-table-column>

    <el-table-column
      v-for="title in titles"
      min-width="120px"
      :key="title.id"
      :Z="title.id + ''"
      :label="title.name">
      <template slot-scope="scope">
        <div slot="reference" v-if="getPointNumber(scope, title)"
          class="item-wrapper with-point-div">
          <span class="point">{{getPointNumber(scope, title)}}</span>
          <span class="operator">
            <label :for='"at-operator-modify-button-"+title.id+"-"+scope.row.student.id'><svg-icon icon-class="pencil" /></label>
            <input :id='"at-operator-modify-button-"+title.id+"-"+scope.row.student.id' type="button"
              @click="onModifyClicked({scope, title})" class="operator-button"/>

            <label :for='"at-operator-delete-button-"+title.id+"-"+scope.row.student.id'><svg-icon icon-class="trash" /></label>
            <input :id='"at-operator-delete-button-"+title.id+"-"+scope.row.student.id' type="button"
              @click="onDeleteClicked({scope, title})" class="operator-button"/>
          </span>
        </div>

        <div v-else class="with-out-point-div">
          <span class="operator">
            <label :for='"at-operator-add-button-"+title.id+"-"+scope.row.student.id'><svg-icon class="svg" icon-class="add" /></label>
            <input :id='"at-operator-add-button-"+title.id+"-"+scope.row.student.id' type="button"
              @click="onAddClicked({scope, title})" class="operator-button"/>
          </span>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <!-- Dialog for showing and modifying details -->
  <at-point-dialog
    :v-if="this.pointDialogVisible"
    :visible="this.pointDialogVisible"
    :cell="this.dialogData"
    @onDialogClose="onDialogClose()"
    @onPointChanged="onPointChanged"
  ></at-point-dialog>
  <at-student-dialog
    :v-if="this.studentDialogVisible"
    :visible="this.studentDialogVisible"
    :student="this.dialogData"
    @onDialogClose="onDialogClose()"></at-student-dialog>
  </section>
</template>

<script>
export default {
  name: 'transcriptTable',
  components: {
    AtPointDialog: () => import('./dialogPoint'),
    AtStudentDialog: () => import('./dialogStudent')
  },
  props: {
    view: {
      type: Array,
      require: true
    },
    titles: {
      type: Array,
      require: true
    },
    info: {
      type: Object,
      require: false
    }
  },
  data() {
    return {
      viewDataset: [],
      loading: true,
      pointDialogVisible: false,
      studentDialogVisible: false,
      dialogData: {}
    }
  },
  computed: {
  },
  methods: {
    showPointDialog: function(dataset) {
      this.dialogData = dataset
      this.pointDialogVisible = true
    },
    showStudentDialog: function(dataset) {
      this.dialogData = dataset
      this.studentDialogVisible = true
    },
    getPointNumber: function(scope, title) {
      const item = scope.row.point.find(point => point.title_id === title.id)
      return item && item.pointNumber
    },
    getPointItem: function(scope, title) {
      const item = scope.row.point.find(point => point.title_id === title.id)
      return item
    },
    // listener
    onDialogClose: function() {
      this.pointDialogVisible = false
      this.studentDialogVisible = false
    },
    onAddClicked: function({ scope, title }) {
      // using point prototype to create a point item
      import('@/mock/point').then(mock => {
        // const pointNewItem = {point:{}, student:{}, title:{} }
        const pointNewItem = {}
        // modify standard point card info
        pointNewItem['point'] = mock.default.getPointPrototype()
        pointNewItem.point.title_id = title.id
        pointNewItem.point.student_id = scope.row.student.id
        pointNewItem.point.date = Date.now()
        pointNewItem.point.classInfo_id = this.$router.currentRoute.params.id
        // add some extra info message to help build the dialog
        pointNewItem['student'] = scope.row.student
        pointNewItem['title'] = title
        pointNewItem['info'] = this.info
        pointNewItem['type'] = 'add' // declear if item is exist

        this.showPointDialog(pointNewItem)
      })
    },
    onModifyClicked: function({ scope, title }) {
      // const pointExistItem = { point:{}, student:{}, title:{} }
      const pointExistItem = {}
      pointExistItem['point'] = this.getPointItem(scope, title)
      // add some extra info to build dialog
      pointExistItem['student'] = scope.row.student
      pointExistItem['title'] = title
      pointExistItem['info'] = this.info
      pointExistItem['type'] = 'modify' // declear if item is exist
      if (pointExistItem) {
        this.showPointDialog(pointExistItem)
      } else {
        console.error(pointExistItem)
        // this.showPointDialog(dataset)
      }
    },
    onDeleteClicked: function({ scope, title }) {
      const point = this.getPointItem(scope, title)
      if (point) {
        console.log(point)
      }
    },
    onCellClicked: function(row, column, cell, event) {
      if (RegExp('^student.').test(column.property)) {
        this.showStudentDialog(row.student)
      }
      // else {
      // const dataset = row[column.property]
      // dataset.label = column.label
      // this.showPointDialog(dataset)
      // }
    },
    onPointChanged: function(item) {
      // for ( let rowIndex in this.viewDataset ) {

      //   if (String(rowIndex) === String(item.title.id)){
      //     console.log(this.viewDataset[title_id].student)

      //     if (this.viewDataset[title_id].student.id === item.student.id) {
      //       console.log(this.viewDataset[title_id].student.id)

      //       // viewDataset[title_id][item.point.id] = item.point
      //       this.$set(this.viewDataset[title_id], item.point.id, item.point)
      //       // viewDataset[title_id].point[item.point.id] = item.point
      //       this.$set(this.viewDataset[title_id].point, item.point.id, item.point)
      //     }
      //   }
      // }

    }
  },
  created() {
  },
  watch: {
    view: function(newView) {
      this.viewDataset = newView
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%
}
.table-wrapper {
  height: 100%;
}

.item-wrapper {
  cursor: pointer;
  user-select: none;
}

.operator {
  .svg-icon {
    cursor: pointer;
    fill: #999;
    &:hover {
      fill: #212121;
    }
  }
}

.operator-button {
  display: none;
}

.point {
  margin-right: 8px;
  user-select: none;
  white-space: nowrap;
}

.with-point-div, .with-out-point-div {
  display: flex;
  .operator {
    margin-right: 33%;
    white-space: nowrap;

    opacity: 0.3;
    transition: all 0.1s 0.4s ease;
  }
  &:hover .operator {
    opacity: 1;
    transition: all 0.2s ease;
  }
}
.with-out-point-div {
  justify-content: flex-end;
}
.with-point-div {
  justify-content: space-between;
}

</style>
