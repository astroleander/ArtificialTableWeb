<template>
  <div>
    <el-steps :active="activeStep" class="steps">
      <el-step title="步骤 1" description="这是一段很长很长很长的描述性文字"></el-step>
      <el-step title="步骤 2" description="这是一段很长很长很长的描述性文字"></el-step>
      <el-step title="步骤 3" description="这段就没那么长了"></el-step>
    </el-steps>
    <div id="hot-preview" class="table-wrapper">
      <section class="table-content">
        <hot-table :settings="settings" class="table-hot"></hot-table>
      </section>
      <section class="table-menu">
        <el-alert title="请使用 「Ctrl+V」 进行粘贴" description="出于安全因素的考虑，现代浏览器不允许网页自动从您的剪切板中获取数据。" close-text="知道了" type="warning" show-icon></el-alert>
      </section>
    </div>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'

export default {
  components: {
    HotTable
  },
  data() {
    return {
      settings: {
        startRows: 80,
        startCols: 15,
        colHeaders: true,
        rowHeaders: true,
        contextMenu: {
          items: {
            'row_above': {
              name: '在当前行的上方插入'
            },
            'row_below': {
              name: '在当前行的下方插入'
            },
            'separator1': Handsontable.plugins.ContextMenu.SEPARATOR,
            'clear_custom': {
              name: '清除所有表格',
              callback: function() {
                this.clear()
              }
            },
            'separator2': Handsontable.plugins.ContextMenu.SEPARATOR,
            'copy': {
              name: '复制'
            },
            'cut': {
              name: '剪切'
            }
          }
        } // contextMenu-end
      }, // settings-end
      activeStep: 1
    }
  }
}
</script>

<style lang="scss">
@import '../../../node_modules/handsontable/dist/handsontable.full.min.css';
</style>

<style lang="scss" scoped>
.steps {
  background: white;
  padding: 2em;
}

.table-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: columns;
  align-items: flex-start;
}

.table-content {
  flex: 0 0 auto;
  box-sizing: border-box;
}

.table-menu {
  box-sizing: border-box;
  width: 60%;
  flex: 1 1 auto;
}


</style>
