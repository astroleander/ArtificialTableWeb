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
  <section>
  <el-table
    @cell-dblclick='onCellClicked'
    :data="viewDataset"
    v-loading.body="loading"
    element-loading-text="Loading">
    <el-table-column
      prop="student.name"
      label="学生姓名">
    </el-table-column>

    <el-table-column
      prop="student.sid"
      label="学号">
    </el-table-column>

    <el-table-column
      v-for="{ name, id } in titles"
      :key="id"
      :prop="id + ''"
      :label="name">
      <template slot-scope="scope">
        <div slot="reference" class="item-wrapper">
          {{ scope.row[id].pointNumber }}
        </div>
      </template>
    </el-table-column>
  </el-table>

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
  computed: {},
  methods: {
    onCellClicked: function(row, column, cell, event) {
      if (RegExp('^student.').test(column.property)) {
        this.showStudentDialog(row.student)
      } else {
        row
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
.item-wrapper {
  cursor: pointer;
}
</style>
