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
    :data="viewDataset"
    v-loading.body="this.loading"
    element-loading-text="Loading">
    <el-table-column
      v-for="item in viewDataset"
      :label="item.studentId"
      :key="item.studentId"
      :prop="item.studentId"
    >
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
    }
  },
  data() {
    return {
      viewDataset: [],
      loading: true
    }
  },
  computed: {},
  methods: {},
  created() {
    console.log(this.viewDataset)
    console.log(this.view)
  },
  watch: {
    view: function(newView) {
      console.log('viewset changed')
      this.viewDataset = newView
      console.log(this.viewDataset)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
