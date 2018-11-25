<template>
  <el-dialog title="添加新的小项" :visible.sync="visible" :before-close="onDialogClose">
  <el-form :model="titleForm" ref="form">
    <el-form-item label="小项名称">
      <el-input v-model="titleForm.name" autoComplete="off"></el-input>
    </el-form-item>
    <el-form-item label="所属类别">
      <el-select v-model="titleForm.titleGroup_id" placeholder="请选择小项所属的分数类别">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
        <el-option v-for='titleGroup in titleGroupList' :key='titleGroup.id'
          :label='titleGroup.name' :value='titleGroup.id'>
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="onDialogClose">取 消</el-button>
    <el-button type="primary" @click="onDialogClose">确 定</el-button>
  </div>
</el-dialog>
</template>

<script>
import viewmodel from '@/viewmodel/transcript/'

const titlePrototype = {
  name: '',
  titleGroup_id: null,
  weight: 0
}

export default {
  props: ['visible', 'classInfo'],
  data() {
    return {
      titleForm: titlePrototype,
      titleGroupList: []
    }
  },
  methods: {
    onDialogClose: function() {
      // reset cell_copy and validator
      this.$refs.form.resetFields()
      this.$emit('onDialogClose', false)
    },
    onAddNewTitle: function() {
      this.$emit('onAddNewTitle', this.titleForm)
      this.onDialogClose()
    },
    fetchTitleGroup: function() {
      // TODO: Add request params
      viewmodel.requestTitleGroup({ classInfo_id: 1 }).then(list => {
        this.titleGroupList = list
      }).catch(err => {
        console.error(err)
        this.$message({
          message: err,
          type: 'error'
        })
      })
    }
  },
  created() {
    this.fetchTitleGroup()
  }
}
</script>

<style>

</style>
