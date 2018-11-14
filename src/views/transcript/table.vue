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
          {{ scope.row[id] }}
        </div>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    class=""
    :visible.sync="pointDialogVisible"
    :before-close="onDialogClose">
    <template slot-scope="title" slot="title">
      {{dialogData.title}}
    </template>
    <slot>
      {{dialogData.title}}
    </slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="pointDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="pointDialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'transcriptTable',
  components: {},
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
      dialogData: {}
    }
  },
  computed: {},
  methods: {
    onCellClicked: function(row, column, cell, event) {
      this.showDialog(row, column, cell, event)
    },
    showDialog: function(row, column, cell, event) {
      this.dialogData.title = cell
      this.pointDialogVisible = true
    },
    onDialogClose: function() {
    },
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
