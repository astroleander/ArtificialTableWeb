<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="onDialogClose">
    <template slot-scope="title" slot="title">
      {{point.label}}
    </template>
    <slot>
      {{point.label}}
    </slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onDialogClose()">取 消</el-button>
      <el-button type="primary" @click="onDialogClose()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible', 'point'],
  components: {
  },
  computed: {
  },
  methods: {
    onDialogClose: function() {
      this.$emit('onDialogClose', false)
    }
  }
}
</script>

<style>

</style>
