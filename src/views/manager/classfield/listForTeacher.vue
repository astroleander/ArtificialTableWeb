<template>
    <div>
        <el-table :data="this.classInfos">
            <el-table-column
                    v-for="(title, idx) in titles"
                    :key="idx"
                    :label="title.label"
                    :prop="title.prop">
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <div>
                        <el-button type="primary" @click="onModifyClicked(scope.row)">班级学生信息管理</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import classInfoViewModel from '@/viewmodel/classinfos'

    export default {
      name: 'listForTeacher',
      computed: {
        ...mapGetters([
          'id'
        ])
      },
      data() {
        return {
          classInfos: [],
          titles: [
            // DONE: teacher name
            { prop: 'cid', label: '班级编号' },
            { prop: 'name', label: '班级名' },
            { prop: 'semester', label: '学期' },
            { prop: 'student_count', label: '学生数' },
            { prop: 'room', label: '教室' },
            { prop: 'week', label: '上课时间' }
          ]
        }
      },
      methods: {
        getClassInfosByID() {
          classInfoViewModel.requestByTeacherId(this.id)
            .then(response => {
              this.classInfos = response
            }).catch(err => {
              console.log(err)
            })
        },
        onModifyClicked(row) {
          // jump to modify pabe
          this.$router.push({
            name: 'addClassField',
            params: { id: row.id, type: 'modify' },
            query: { id: row.id }
          })
        }
      },
      created() {
        this.getClassInfosByID()
      }
    }
</script>

<style scoped>

</style>