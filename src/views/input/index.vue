<template>
  <div>
    <el-steps :active="activeStep" class="steps" finish-status="success">
      <el-step v-for='eachStep in steps' :key='eachStep.title' :title='eachStep.title' :description='eachStep.description'></el-step>
    </el-steps>
    <el-tabs v-model="getActiveStep" tab-position="hidden">
      <!-- contains 3 steps -->
      <el-tab-pane name="1">
        <span slot="label" style="display:none"></span>
        <div id="step-import"
          class="content-wrapper flex-parent">
          <!-- 左边的导入表格 -->
          <section class="table-wrapper flex-left flex-half">
            <hot-table :settings="hotSettings" ref="hotTable" class="table"></hot-table>
          </section>
          <!-- 右边的统计和控制项 -->
          <section class="menu-wrapper flex-right flex-half">
            <div id="menu-input-helper">
              <import-excel-component @on-selected-file='onSelectedLocalExcel'></import-excel-component>
            </div>
            <div id="menu-table-board">
              <el-alert title="请使用 「Ctrl+V」 进行粘贴" description="出于安全因素的考虑，现代浏览器不允许网页自动从您的剪切板中获取数据。" type="warning" show-icon class="alert"></el-alert>
              <el-alert v-for="alert of alerts" :key="alert.title" :title="alert.title" :description="alert.description" :type="alert.type" show-icon class="alert"></el-alert>
            </div>
            <div id="menu-continue" class="menu-continue">
              <el-switch
                style="display: block"
                id="menu-continue-switch-btn"
                v-model="isHead"
                active-color="#4caf50"
                inactive-color="#ff4949"
                active-text="数据包含列名"
                >
              </el-switch>
              <el-button class="button" type="success" @click="handleNextStep(1)" size="mini">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
            <div id="menu-data-previewer">
              <p v-for="stats of importTableInfo" :key="stats.id">
                <span>{{stats.title}}<template v-if="stats.meaning">({{stats.meaning}})</template></span>
                <span>{{stats.content}}</span>
              </p>
            </div>
          </section>
        </div>
      </el-tab-pane><!-- step 1 end, and step 2 start -->
      <el-tab-pane name="2">
        <span slot="label" style="display:none"></span>
        <div id="step-settings"
          >
          <el-table>

          </el-table>
        </div>
      </el-tab-pane><!-- step 2 end, and step 3 start -->
      <el-tab-pane name="3">
        <span slot="label" style="display:none"></span>
        <div id="step-preview"
        >
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import ImportExcelComponent from '@/components/ImportExcel.vue'

const REQUIRE_STUDENT_COLUMN = '您可能缺少学号列'
const REQUIRE_STUDENT_COLUMN_LEFT = '您的最左侧的列不是最长的列, 您的最左列不是学号吗?'

const calHeight = () => {
  return window.innerHeight - 200
}

// xlsx 的输出模式被制定为 header:1, 与 handsontable 兼容， 不需要转换
const xlsxToHotAdapter = (xlsxData) => {
  return xlsxData
}

export default {
  components: {
    HotTable, ImportExcelComponent
  },
  data() {
    return {
      steps: [
        { title: '引入数据', description: '将您的数据直接粘贴到面板，或导入一个 Excel 文件' },
        { title: '选择要导入系统的数据', description: '选择要导入的列项和学生信息，并且补充一些必要的信息' },
        { title: '校验导入结果', description: '确认您的导入结果' }
      ],
      hotSettings: {
        startRows: 80,
        startCols: 13,
        minCols: 13,
        minRows: 60,
        height: calHeight(),
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
        }, // contextMenu-end
        /** 下面都是 hook
         * @see https://handsontable.com/docs/6.2.0/tutorial-introduction.html
         */
        afterChange: function() {
          let importDataset = this.getData()
          // 返回不是全空的行
          importDataset = importDataset.filter((row, rowIndex, arr) => {
            return !row.every(cell => {
              return cell === null || cell === '' || cell === undefined
            })
          })
          const env = this.rootElement.__vue__
          env.$store.dispatch('saveImportTable', { table: importDataset })
        }
      }, // hotSettings-end
      activeStep: 1,
      isHead: false,
      alerts: []
    }
  }, // data-end
  computed: {
    importTable: {
      get() {
        return this.$store.state.table.importTable
      }
    },
    getActiveStep: {
      get() {
        return String(this.activeStep)
      }
    },
    importTableInfo: {
      get() {
        const importTable = this.$store.state.table.importTable
        let count = 0
        const col_size = importTable[0] && importTable[0].length || 12
        const col_count = Array(col_size).fill(0)
        importTable.forEach(row => {
          row.forEach((cell, idx) => {
            // eslint-disable-next-line
            if (cell === null || cell === '' || cell === undefined) {}// 没有 pass 的第 3024 天, 想它
            else {
              count++
              col_count[idx]++
            }
          })
        })

        const importRows = importTable && importTable.length || 0
        const importCols = col_count.filter(v => v !== 0).length

        if (Math.max(...col_count) < importRows) {
          this.raiseUnalignError(Math.max(...col_count), importRows)
        } else {
          this.closeUnalignError()
        }

        if (col_count.find(item => item !== 0) && Math.max(...col_count) !== col_count.find(item => item !== 0)) {
          this.raiseLeftUnalignWarning()
        } else {
          this.closeLeftUnalignWarning()
        }

        return [
          { id: 1, title: '学生数', meaning: '导入的行数', content: importRows },
          { id: 2, title: '类别数', meaning: '导入的列数', content: importCols },
          { id: 3, title: '共计' + count + '条记录' }
        ]
      }
    }
  },
  methods: {
    raiseUnalignError(expect, actual) {
      this.addAlert({
        title: REQUIRE_STUDENT_COLUMN,
        description: '您的总行数和最大行数不匹配 (最大的行数为 ' + expect + ' 行, 但您共导入了 ' + actual + ' 行)' + ', 这会导致那些没有学号的分数项在导入时丢失',
        type: 'error'
      })
    },
    closeUnalignError() {
      if (this.alerts.find(item => item.title === REQUIRE_STUDENT_COLUMN)) {
        this.alerts = this.alerts.filter(item => item.title !== REQUIRE_STUDENT_COLUMN)
      }
    },
    raiseLeftUnalignWarning() {
      this.addAlert({
        title: REQUIRE_STUDENT_COLUMN_LEFT,
        description: '您的拥有最大行数的列未放置在最左侧, 这不会导致系统导入的问题, 但是您最好确认所有学生的学号已经导入',
        type: 'warning'
      })
    },
    closeLeftUnalignWarning() {
      if (this.alerts.find(item => item.title === REQUIRE_STUDENT_COLUMN_LEFT)) {
        this.alerts = this.alerts.filter(item => item.title !== REQUIRE_STUDENT_COLUMN_LEFT)
      }
    },
    addAlert(alert) {
      // if exist the splice, else execute push statement
      let existAlertIdx
      if ((existAlertIdx = this.alerts.findIndex(item => item.title === alert.title)) !== -1) {
        this.alerts.splice(existAlertIdx, 1, alert)
      } else {
        this.alerts.push(alert)
      }
    },
    onSelectedLocalExcel(data) {
      // console.log(data.results)
      this.$refs.hotTable.hotInstance.loadData(xlsxToHotAdapter(data.results))
    },
    handleNextStep(step) {
      switch (step) {
        case 1:
          this.activeStep = 2
          // this.renderSettingsPage()
          break
        case 2:
          this.activeStep = 3
          // this.renderPreviewPages()
          break
        case 3:
          break
      }
    }
  },
  watch: {

  },
  created() {
    this.$store.dispatch('saveImportTable', { table: [] })
  }
}
</script>

<style lang="scss">
@import '../../../node_modules/handsontable/dist/handsontable.full.min.css';
</style>

<style lang="scss" scoped>
.flex-half {
  float: left;
  width: 50%;
  background: white;
}

.steps {
  background: white;
  padding: 1em;
  height: 150px;
  box-sizing: border-box;
}

#menu-table-board {
  .alert{
    margin: 8px 12px
  }
}

.content-wrapper {
  display: block;
}

.table-wrapper {
  max-width: 55%;
}

.menu-continue {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 12px;
  * {
    margin: 0 12px 0 0;
  }

  .button {
    background: #4caf50
  }
}
</style>

<!-- override element-ui switch button active style -->
<style>
#menu-continue-switch-btn .el-switch__label * {
  color: #BBB;
}
#menu-continue-switch-btn .el-switch__label.is-active * {
  color: #212121;
}
.el-tabs__header.is-hidden {
  display: none
}
</style>
