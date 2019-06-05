<template>
  <el-table :data="dataDisplayCell" v-loading.body="listLoading" element-loading-text="Loading">
    <el-table-column
      v-for="{ prop,label } in dataDisplayColumn"
      :label="label"
      :key="prop"
      :prop="prop"
    >
    </el-table-column>
  </el-table>
</template>

<script>
  import { getPoints } from '@/api/point'
  import { getStudent } from '@/api/user'
  import { mapPointTypeName } from '@/format'

  export default {
    name: 'table-list',
    props: ['lesson_id'],
    // hooks
    created() {
      this.fetchData()
    },
    watch: {
      dataFormat: function() {
      },
      dataStudent: function() {
      },
      lesson_id: function() {
        /**
         * Refresh list when selected lesson changed
         */
        this.fetchData()
      }
    },
    data() {
      /**
       * @define dataFormat:
       *  material data send by BACK-END, fetched when vue object created and lesson be selected
       *  + real data structure
       *  + once user try to change the table data, data get student & title info from [rowList] and [column] then locate
       *    the real point item in dataFormat
       *
       * @define dataStudent:
       *  material data send by BACK-END, fetched when vue object created and lesson be selected
       *
       * @define dataDisplayCell:
       *  + table to display
       *
       * @define dataDisplayColumn:
       *  + title list
       *  + title <---> column
       *
       * @define dataDisplayRowMaintain:
       *  + name list
       *  + **NOT** display, maintain click event
       *
       * @define listLoading:
       *  + flag for animation
       *  + set false when data loaded
       *
       * @define current_item:
       *  + item current be selected
       */
      return {
        // remote table data
        // remote table support data
        dataFormat: null,
        dataStudent: null,

        // table display data
        dataDisplayCell: null,
        dataDisplayColumn: [], /* column title list, contain string */
        dataDisplayRowMaintain: [], /* row title list, contain complete student object*/

        listLoading: true,

        current_item: null,

        is_sync: false
      }
    },
    methods: {
      attendToBuildTable() {
        if (!this.is_sync && this.dataFormat != null && this.dataStudent != null) {
          console.log('attendToBuildTable')
          this.is_sync = true
          this.buildTable()
        }
      },
      buildTable() {
        // USING CONST
        // ...constant cannot change through re-assignment
        // ...constant cannot be re-declared
        const material_data = this.dataFormat
        const material_student = this.dataStudent
        const title = []
        const name = []
        const table = []

        // generate title
        title.push({ prop: 'idx', label: '序号' })
        title.push({ prop: 'name', label: '姓名' })
        title.push({ prop: 'id', label: '学号' })
        const title_string = []
        for (const item in material_data) {
          if (material_data.hasOwnProperty(item)) {
            // if column category doesn't include current title, add it
            if (!title_string.includes(material_data[item].title)) {
              title_string.push(material_data[item].title)
            }
          }
        }
        title_string.map(e => {
          title.push({ prop: e, label: e })
        })
        console.log(title)
        // generate student list
        for (const item in material_student) {
          if (material_student.hasOwnProperty(item)) {
            name.push({ name: material_student[item].name, id: material_student[item].id })
          }
        }
        // generate cell
        /**
         * table should look like this:
         *
         * [
         *  {idx:0, name:'Li Hua', id:'1', 'Test 1':'32'},
         *  {idx:1, name:'Zhang Xi', id:'2', 'Test 1':'13'},
         *  {idx:2, name:'Han meimei', id:'3', 'Test 1':'22'},
         * ]
         *
         */
        const col = name.length
        for (let i = 0; i < col; i++) {
          table[i] = {
            idx: i,
            name: name[i].name,
            id: name[i].id
          }
        }
        for (const p in material_data) {
          if (material_data.hasOwnProperty(p)) {
            const r = name.map(e => { return e.id }).indexOf(material_data[p].student)
            const c = material_data[p].title

            if (r !== -1 && c !== -1) {
              table[r][c] = material_data[p].point
            }
          }
        }

        this.dataDisplayCell = table
        this.dataDisplayColumn = title
        this.dataDisplayRowMaintain = name

        this.is_sync = false
        this.listLoading = false
      },
      handleEdit(idx, item) {
        this.$emit('on-edit-dialog', idx, item)
      },
      handleDelete(idx, item) {
        this.$emit('on-delete-dialog', idx, item)
      },
      showType(type_code) {
        return mapPointTypeName(type_code)
      },
      fetchData() {
        this.listLoading = true
        this.dataFormat = null
        this.fetchPointData()
        this.dataStudent = null
        this.fetchStudentData()
      },
      fetchPointData() {
        getPoints(this.lesson_id)
          .then(response => {
            this.dataFormat = response.subjects
            this.attendToBuildTable()
          })
          .catch(e => {
            window.console.log('err: ' + e)
          })
      },
      fetchStudentData() {
        getStudent(this.lesson_id)
          .then(response => {
            this.dataStudent = response.subjects
            this.attendToBuildTable()
          })
          .catch(e => {
            window.console.log('err: ' + e)
          })
      }
    }
  }
</script>

<style scoped>

</style>
