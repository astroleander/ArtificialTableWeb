<template>
    <div>
        <el-table :data="this.classInfos"
        border
        stripe>
            <el-table-column
                    v-for="(title, idx) in titles"
                    :key="idx"
                    :label="title.label"
                    :prop="title.prop" align="center">
            </el-table-column>
            <el-table-column align="center">
                <template slot-scope="scope">
                    <div>
                        <el-button type="primary" @click="onModifyClicked(scope.row)">教学班级学生信息管理</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="" align="center">
                <template slot-scope="scope">
                    <el-button @click="onDeleteClicked(scope.row)" type="danger">删除</el-button>
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
            { prop: 'name', label: '班级名' },
            { prop: 'semester', label: '学期' },
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
        onDeleteClicked(row) {
          this.$prompt(
            '若要继续, 请在文本框内输入\"确认\"\n此操作将彻底删除该班级, 所有分数信息都将丢失！', '请确认删除操作', {
              confrimButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /确认/
              // type: 'warning',
            }).then(() => {
            classInfoViewModel.requestDelClassInfo(row.id).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              const idx = this.classInfos.findIndex(classinfo => classinfo.id === row.id)
              console.log(row)
              console.log(idx)
              this.classInfos.splice(idx, 1)
            })
          })
        },
        onModifyClicked(row) {
          // jump to modify pabe
          this.$router.options.routes[14].children.push({
            path: 'class/classfield',
            name: 'addClassField',
            component: () => import('@/views/manager/classfield/form.vue'),
            meta: { title: '班级添加删除学生', icon: 'tree' }
          })
          this.$router.addRoutes(this.$router.options.routes)
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