<template>
  <el-table :data="dataDisplay" v-loading.body="listLoading" element-loading-text="Loading">
    <el-table-column align="center" width="95">
      <template slot-scope="scope">
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column label="学号" align="center">
      <template slot-scope="scope">
        {{scope.row.student}}
      </template>
    </el-table-column>
    <el-table-column label="姓名" align="center">
      <template slot-scope="scope">
        {{showType(scope.row.type)}}
      </template>
    </el-table-column>
    <el-table-column v-for=""/>

  </el-table>
</template>

<script>
  import { getPoint } from '@/api/point'
  import { mapPointTypeName } from '@/format'

  export default {
    name: 'point-list',
    // hooks
    created() {
      this.fetchData()
    },
    data() {
      /**
       * @define dataFormat:
       *  material data send by BACK-END, fetched when vue object created
       *  + real data structure
       *  + once user try to change the table data, data get student & title info from [rowList] and [column] then locate
       *    the real point item in dataFormat
       * @define dataDisplay:
       *  + table to display
       *
       * @define rowList:
       *  + title list
       *  + title <---> row
       *
       * @define columnList:
       *  + name list
       *  + name <---> column
       *
       * @define listLoading:
       *  + flag for animation
       *  + set false when data loaded
       *
       * @define current_item:
       *  + item current select
       */
      return {
        dataFormat: null,
        dataDisplay: null,
        rowList: [],
        columnList: [],
        listLoading: true,
        current_item: null
      }
    },
    props: ['lesson_id'],
    watch: {
      list: function() {
      },
      lesson_id: function() {
        /**
         * Refresh list when selected lesson changed
         */
        this.fetchData()
      }
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getPoint(this.lesson_id)
          .then(response => {
            this.dataFormat = response.subjects
            // handle format data here
            this.dataDisplay = this.dataFormat
            this.listLoading = false
          })
          .catch(e => {
            window.console.log('err: ' + e)
          })
      },
      handleEdit(idx, item) {
        this.$emit('on-edit-dialog', idx, item)
      },
      handleDelete(idx, item) {
        this.$emit('on-delete-dialog', idx, item)
      },
      showType(type_code) {
        return mapPointTypeName(type_code)
      }
    }
  }
</script>

<style scoped>

</style>
