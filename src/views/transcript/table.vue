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
      :prop="title.id + ''"
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
    :visible="this.pointDialogVisible"
    :point="this.dialogData"
    @onDialogClose="onDialogClose()"
  ></at-point-dialog>
  <at-student-dialog
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
    onCellClicked: function(row, column, cell, event) {
      if (RegExp('^student.').test(column.property)) {
        this.showStudentDialog(row.student)
      } else {
        const dataset = row[column.property]
        dataset.label = column.label
        this.showPointDialog(dataset)
      }
    },
    showPointDialog: function(dataset) {
      this.dialogData = dataset
      this.pointDialogVisible = true
    },
    showStudentDialog: function(dataset) {
      this.dialogData = dataset
      this.studentDialogVisible = true
    },
    onDialogClose: function() {
      this.pointDialogVisible = false
      this.studentDialogVisible = false
    },
    getPointNumber: function(scope, title) {
      const item = scope.row.point.find(point => point.title_id === title.id)
      return item && item.pointNumber
    },
    getPointItem: function(scope, title) {
      const item = scope.row.point.find(point => point.title_id === title.id)
      return item
    },
    onModifyClicked: function({scope, title}) {
      const point = this.getPointItem(scope,title)
      if(point) {
        console.log(point)
      } else {
        console.log(point)
        // this.showPointDialog(dataset)
      }

    },
    onDeleteClicked: function({scope, title}) {
      const point = this.getPointItem(scope,title)
      if(point) {
        console.log(point)
      }

    },
    onAddClicked: function({scope, title}) {

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
