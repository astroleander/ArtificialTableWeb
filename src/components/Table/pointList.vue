<template>
  <el-table :data="dataDisplay" v-loading.body="listLoading" element-loading-text="Loading">
    <el-table-column align="center" width="95">
      <template slot-scope="scope">
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column label="所属列名" width="110" align="center">
      <template slot-scope="scope">
        {{scope.row.title}}
      </template>
    </el-table-column>
    <el-table-column label="操作学号" align="center">
      <template slot-scope="scope">
        {{scope.row.student}}
      </template>
    </el-table-column>
    <el-table-column label="类型" align="center">
      <template slot-scope="scope">
        {{showType(scope.row.type)}}
      </template>
    </el-table-column>
    <el-table-column label="得分" align="center">
      <template slot-scope="scope">
        {{ scope.row.point }}
      </template>
    </el-table-column>
    <el-table-column label="权重" align="center">
      <template slot-scope="scope">
        {{scope.row.weight}}
      </template>
    </el-table-column>
    <el-table-column label="日期" align="left">
      <template slot-scope="scope">
        {{scope.row.date}}
      </template>
    </el-table-column>
    <el-table-column label="修改时间" align="left">
      <template slot-scope="scope">
        {{scope.row.date_stamp}}
      </template>
    </el-table-column>
    <el-table-column label="备注" align="left">
      <template slot-scope="scope">
        {{scope.row.notes}}
      </template>
    </el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getByClassInfoId } from '@/api/point'
import { mapPointTypeName } from '@/format'

export default {
  name: 'point-list',
  // hooks
  created() {
    this.fetchData()
  },
  data() {
    return {
      dataFormat: null,
      dataDisplay: null,
      listLoading: true
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
      getByClassInfoId(this.lesson_id)
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
