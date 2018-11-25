<!-- Tree Structure of Transcript Table of Transcript section -->
<!--
table
  |- section
  |- TODO: menu
  |- DONE: table
  |- ... DONE: row
-->
<!---->
<template>
  <section class="table-wrapper">

    <!-- table menu-->
    <el-row class="menu">
      <el-button @click="handleAddNewTitle()" type="primary" icon="el-icon-d-arrow-right">添加新列</el-button>
      <el-button @click="handleExportTable()" type="success" icon="el-icon-download">导出文件</el-button>
      <el-button @click="handleRefresh()" type="warning" icon="el-icon-refresh" >重新加载</el-button>
      <el-button @click="handleBackToMainpage()" type="danger" icon="el-icon-back" >返回主页</el-button>
      <!-- <el-button icon="el-icon-search"></el-button> -->
      <!-- <el-button type="info" icon="el-icon-message" ></el-button> -->
    </el-row>
    <!-- table main container-->
    <el-table
      :data="viewDataset"
      @cell-dblclick='onCellClicked'
      v-loading.body="loading"
      ref="table"
      element-loading-text="Loading"
      height="calc(100vh - 340px)"
      class="table">

    <el-table-column label="学生姓名" prop="student.name"
      fixed min-width="100px">
    </el-table-column>

    <el-table-column label="学号" prop="student.sid"
      fixed min-width="100px">
    </el-table-column>

    <el-table-column
      v-for="title in titles" :label="title.name" :key="title.id"
      min-width="120px">
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
    :cell="this.tableDialogDataset"
    @onDialogClose="onDialogClose()"
    @onPointChanged="onPointChanged"
  ></at-point-dialog>
  <at-student-dialog
    :v-if="this.studentDialogVisible"
    :visible="this.studentDialogVisible"
    :student="this.tableDialogDataset"
    @onDialogClose="onDialogClose()">
  </at-student-dialog>
  <at-add-title-dialog
    :v-if="this.menuAddTitleDialogVisible"
    :visible="this.menuAddTitleDialogVisible"
    @onDialogClose="onDialogClose()"
    @onAddNewTitle="handleAddNewTitle">
  </at-add-title-dialog>
  <at-export-dialog
    :v-if="this.menuExportDialogVisible"
    :visible="this.menuExportDialogVisible"
    @onDialogClose="onDialogClose()"
    @onExport="handleExportTable">
  </at-export-dialog>
  </section>
</template>

<script>
export default {
  name: 'transcriptTable',
  components: {
    AtPointDialog: () => import('./dialogPoint'),
    AtStudentDialog: () => import('./dialogStudent'),
    AtAddTitleDialog: () => import('./dialogAddTitle.vue'),
    AtExportDialog: () => import('./dialogExport')
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
      // point dialog and student dialog use the same one dataset,
      // every time open the dialog will re-set the dataset
      pointDialogVisible: false,
      studentDialogVisible: false,
      tableDialogDataset: {},
      // "add title" dialog and "export" dialog use the same dataset,
      // every time open the dialog will re-set the dataset
      menuAddTitleDialogVisible: false,
      menuExportDialogVisible: false
      // 暂时不用携带数据
      // menuDialogDataset: {}
    }
  },
  computed: {},
  methods: {
    // shown controller, ensure dataset before
    showPointDialog: function(dataset) {
      this.tableDialogDataset = dataset
      this.pointDialogVisible = true
    },
    showStudentDialog: function(dataset) {
      this.tableDialogDataset = dataset
      this.studentDialogVisible = true
    },
    showAddTitleDialog: function(dataset) {
      // this.menuDialogDataset = dataset
      this.menuAddTitleDialogVisible = true
    },
    showExportDialog: function(dataset) {
      // this.menuDialogDataset = dataset
      this.menuExportDialogVisible = true
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
      // reset flag
      this.pointDialogVisible = false
      this.studentDialogVisible = false
      this.menuAddTitleDialogVisible = false
      this.menuExportDialogVisible = false
      // cannot reset dialog data set before dialog close
      // this.tableDialogDataset = {} // cant here
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
      // search table original dataset and replace or add new point item
      this.viewDataset.forEach(row => {
        if (row.student.id === item.student.id) {
          if (item.type === 'modify') {
            for (const pointIdx in row.point) {
              if (row.point.hasOwnProperty(pointIdx)) {
                const element = row.point[pointIdx]
                if (String(item.point.id) === String(element.id)) {
                  this.$set(row.point, pointIdx, item.point)
                } // end if
              } // end hasOwnProperty if
            } // end for
          } else {
            console.log('not exist yet, create new one')
            row.point.push(item.point)
          }
        }
      })
    },
    handleAddNewTitle: function() {
      this.showAddTitleDialog({})
    },
    handleExportTable: function() {
      this.showExportDialog({})
    },
    handleRefresh: function() {

    },
    handleBackToMainpage: function() {

    }
  },
  created() {},
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
  width: 100%;
}
.table-wrapper {
  height: 100%;
}
.menu {
  margin: 12px 5px;
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

.with-point-div,
.with-out-point-div {
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
