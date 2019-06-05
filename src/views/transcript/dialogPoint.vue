<!-- 修改成绩模版-->
<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="onDialogClose">
    <template slot="title">
        修改分数
    </template>
    <slot>
      <el-form
        :rules="this.pointRules"
        :model="this.cell_copy"
        ref="form"
        class="container">
        <p class="display-info course-info">
          <svg-icon class="svg" icon-class="table" />
          <span>{{cell_copy.info.name}}</span>
          <span>{{cell_copy.title.name}}</span>
        </p>
        <p class="display-info student-info">
          <svg-icon class="svg" icon-class="user" />
          <span>{{cell_copy.student.name}}</span>
        </p>
        <div class="text-editor">
          <el-form-item prop="point">
            <!-- DONE: 更加交互性的提示 -->
            <el-input type="number"
              v-model.number="cell_copy.point.pointNumber"
            ></el-input>
          </el-form-item>
          <el-form-item prop="date">
            <el-date-picker type="date"
              placeholder="选择日期"
              value-format="timestamp"
              v-model="cell_copy.point.date">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="note">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="备注"
              v-model="cell_copy.point.note">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </slot>
    <template slot="footer" class="dialog-footer">
      <el-button @click="onDialogClose()">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { isPointNumber } from '@/utils/validate'
import viewmodel from '@/viewmodel/table'

const validatePointNumber = (rule, value, callback) => {
  if (isPointNumber(value.pointNumber)) {
    callback()
  } else {
    callback(new Error('分数至多保留两位小数点'))
  }
}

const cell_prototype = {
  info: {},
  title: {},
  point: {},
  student: {}
}

export default {
  // pointItem items here are not equal to pointItem model,
  // they contain some extra info to display cards
  // cell(pointItem)
  //   |- point
  //   |- title
  //   |- student
  //   |- info
  //   |- type
  props: ['visible', 'cell'],
  components: {
  },
  computed: {
  },
  watch: {
    cell: function(newValue) {
      this.cell_copy = JSON.parse(JSON.stringify(newValue))
    }
  },
  data() {
    return {
      // using cell_copy to avoid modify without submit
      // initialize cell_copy to avoid vue bind error
      cell_copy: cell_prototype,
      pointRules: {
        point: [{ required: true, trigger: 'blur', validator: validatePointNumber }]
        // date: [{ required: true, trigger: 'blur', validator: validateDate }]
      }
    }
  },
  methods: {
    onDialogClose: function() {
      // reset cell_copy and validator
      this.cell_copy = cell_prototype
      this.$refs.form.resetFields()
      this.$emit('onDialogClose', false)
    },
    handleSubmit: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // upload request for modifying
          // and close dialog if success
          const cell_upload = this.cell
          cell_upload.point = this.cell_copy.point
          console.log(cell_upload)
          if (cell_upload.type === 'modify') {
            viewmodel.modifyPoint(cell_upload.point).then(response => {
              const id = response[0]['id']
              cell_upload.point['id'] = id
              this.$emit('onPointChanged', cell_upload)
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.onDialogClose()
            }).catch(err => {
              console.log(err)
              this.$message({
                message: '添加失败',
                type: 'error'
              })
            })
          } else {
            viewmodel.addPoint(cell_upload.point).then(response => {
              const id = response['succeed_ids'][0]['id']
              cell_upload.point['id'] = id
              this.$emit('onPointChanged', cell_upload)
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.onDialogClose()
            }).catch(err => {
              console.log(err)
              this.$message({
                message: '修改失败',
                type: 'error'
              })
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
}

.display-info {
  min-width: 250px;
  width: 50%;
  margin: 2px;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: center;
  align-items: center;

  * {
    margin: 5px;
  }
}

.text-editor {
  width: 100%;
}
</style>
