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
    </el-table-column>
  </el-table>
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
      loading: true
    }
  },
  computed: {},
  methods: {
    onCellClicked: function(row, column, cell, event) {
      console.log(row)
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

</style>
