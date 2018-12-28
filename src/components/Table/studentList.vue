<template>
  <el-table :data="dataDisplay" v-loading.body="listLoading" element-loading-text="Loading">
    <el-table-column align="center" width="95">
      <template slot-scope="scope">
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column label="姓名" width="110" align="center">
      <template slot-scope="scope">
        {{scope.row.name}}
      </template>
    </el-table-column>
    <el-table-column label="学号" align="center">
      <template slot-scope="scope">
        {{ scope.row.id }}
      </template>
    </el-table-column>
    <el-table-column label="院系" align="center">
      <template slot-scope="scope">
        {{ collageMap[scope.row.collage].name }}
      </template>
    </el-table-column>
    <el-table-column label="班级" align="center">
      <template slot-scope="scope">
        {{ scope.row.class_field }}
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
import { getStudent } from '@/api/user'
import { getCollege } from '@/api/college'

export default {
  name: 'student-list',
  // hooks
  created() {
    this.fetchData()
  },
  data() {
    return {
      dataFormat: null,
      dataDisplay: null,
      listLoading: true,
      collageMap: {
        '0': { name: 'unknown' },
        '2': { id: '2', name: 'Computer Science', shortname: 'CS', university: '1' }
      }
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
      getStudent(this.lesson_id)
        .then(response => {
          this.dataFormat = response.subjects
          // only fetch collages including in dataDisplay
          this.fetchCollageData()
        })
        .catch(e => {
          window.console.log('err: ' + e)
        })
    },
    fetchCollageData() {
      var ids = []
      for (const eachStudent in this.dataFormat) {
        if (this.dataFormat.hasOwnProperty(eachStudent)) {
          const id = this.dataFormat[eachStudent].collage
          if (id === undefined) {
            this.dataFormat[eachStudent].collage = '0'
          } else if (!(id in this.collageMap) && !(id in ids)) {
            this.collageMap[id] = { name: 'loading...' }
            ids.push(this.dataFormat[eachStudent].collage)
          }
        }
      }
      getCollege(ids).then(response => {
        const collage = response.subjects
        for (let i = 0; i < collage.length; i++) {
          // Iterate over numeric indexes from 0 to 5, as everyone expects.
          this.collageMap[collage[i].id] = collage[i]
          this.dataDisplay = this.dataFormat
          this.listLoading = false
        }
      })
    },
    handleEdit(idx, item) {
      this.$emit('on-edit-dialog', idx, item)
    },
    handleDelete(idx, item) {
      this.$emit('on-delete-dialog', idx, item)
    }
  }
}
</script>

<style scoped>

</style>
