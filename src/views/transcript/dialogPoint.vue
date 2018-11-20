<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="onDialogClose">
    <template slot-scope="title" slot="title">
        修改分数
    </template>
    <slot>
      <el-form
        :rules="pointRules"
        class="container">
        <p class="display-info course-info">
          <svg-icon class="svg" icon-class="table" />
          <span>{{cell.info.name}}</span>
          <span>{{cell.title.name}}</span>
        </p>
        <p class="display-info student-info">
          <svg-icon class="svg" icon-class="user" />
          <span>{{cell.student.name}}</span>
        </p>
        <div class="text-editor">
          <el-input type="number"
            v-model.number="cell.point.pointNumber"
          ></el-input>
          note: ''
          <el-date-picker type="date"
            placeholder="选择日期"
            value-format="timestamp"
            v-model="cell.point.date">
          </el-date-picker>
        </div>
      </el-form>
    </slot>
    <template slot="footer" class="dialog-footer">
      <el-button @click="onDialogClose()">取 消</el-button>
      <el-button type="primary" @click="onDialogClose()">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { notPointNumber } from '@/utils/validate'
const validatePointNumber = (rule, value, callback) => {
  if (notPointNumber(value)) {
    callback(new Error('请确保输入的数字，且至多保留两位小数点'))
  } else {
    callback()
  }
}
export default {
  // pointItem items here are not equal to pointItem model,
  // they contain some extra info to display cards
  // cell(pointItem)
  //   |- point
  //   |- title
  //   |- student
  //   |- info
  props: ['visible', 'cell'],
  components: {
  },
  computed: {
    // date: {
    //   get() {
    //     return new Date(this.cell.point.date)
    //   },
    //   set(value) {
    //     this.cell.point.date = value.getTime();
    //   }
    // }
  },
  data() {
    return {
      pointRules: {
        point: [{ required: true, trigger: 'blur', validator: validatePointNumber }]
        // date: [{ required: true, trigger: 'blur', validator: validateDate }]
      },
    }
  },
  methods: {
    onDialogClose: function() {
      this.$emit('onDialogClose', false)
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
