<template>
  <div class="app-container">
    <el-tabs :value="getFirstLessonCode" type="card" @tab-click="handleTabChange" ref="tab">
      <el-tab-pane
        v-for="(item, index) in lesson_list"
        :key="item.id"
        :label="item.name"
        :name="item.id+''"
      >
      </el-tab-pane>
    </el-tabs>



    <el-table :data="dataDisplay" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.pageviews}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.display_time}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getLesson } from '@/api/lesson'
import axios from 'axios'

export default {
  data() {
    return {
      dataDisplay: null,
      listLoading: true
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
    this.fetchPointData()
  },
  methods: {
    fetchPointData() {
      getLesson().then(response => {
        const list = response.subjects
        // if response not null
        if (list && list.length > 0) {
          this.lesson_list = list
          this.current_lesson_id = list[0].id + ''
        } else if (list) {
          this.$router.push('/manage/nostudentpage')
        } else {
          this.$router.push('/404')
        }
      })
    },
    fetchData() {
      this.listLoading = true
      /**
       * using axios directly to get example
       *
       */
      axios.get(`https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin/table/list`)
        .then(response => {
          console.log(response)
          this.dataDisplay = response.data.data.items
          this.listLoading = false
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    handleTabChange(tabPane) {
      this.current_lesson_id = tabPane.name
      console.log(tabPane.name)
    },
    onDialogEdit(idx, item) {
      this.dialogVisible = true
      this.dialogData = item
    },
    onDialogDelete(idx, item) {
      this.$confirm('此操作将永久删除该次操作记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onDialogClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
  }
}
</script>
