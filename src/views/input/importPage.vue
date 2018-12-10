<template>
  <div>
    <el-steps :active="activeStep" class="steps" finish-status="success">
      <el-step v-for='eachStep in steps' :key='eachStep.title' :title='eachStep.title' :description='eachStep.description'></el-step>
    </el-steps>
    <el-tabs v-model="getActiveStep" tab-position="hidden">
      <!-- contains 3 steps -->

      <!-- STEP - 1 -->
      <el-tab-pane name="1">
        <span slot="label" style="display:none"></span>
        <div id="step-import"
          class="content-wrapper flex-parent">
          <!-- STEP - 1 - 左边的导入表格 -->
          <section class="table-wrapper flex-left flex-half">
            <hot-table :settings="hotSettings" ref="hotTable" class="table"></hot-table>
          </section>
          <!-- STEP - 1 -  右边的统计和控制项 -->
          <section class="menu-wrapper flex-right flex-half">
            <!-- STEP - 1 - 导入工具 -->
            <div id="menu-input-helper">
              <import-excel-component @on-selected-file='onSelectedLocalExcel'></import-excel-component>
            </div>
            <!-- STEP - 1 - 警示公告板 -->
            <div id="menu-table-board">
              <el-alert title="请使用 「Ctrl+V」 进行粘贴" description="出于安全因素的考虑，现代浏览器不允许网页自动从您的剪切板中获取数据。" type="warning" show-icon class="alert"></el-alert>
              <el-alert v-for="alert of alerts" :key="alert.title" :title="alert.title" :description="alert.description" :type="alert.type" show-icon class="alert"></el-alert>
            </div>
            <!-- STEP - 1 - 按钮组 -->
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
              <el-button class="button" type="success" @click="toStep(2)" size="mini">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
            <!-- STEP - 1 - 统计信息 -->
            <div id="menu-data-previewer">
              <p v-for="stats of importTableInfos" :key="stats.id">
                <span>{{stats.title}}<template v-if="stats.meaning">({{stats.meaning}})</template></span>
                <span>{{stats.content}}</span>
              </p>
            </div>
          </section>
        </div>
      </el-tab-pane><!-- step 1 end, and step 2 start -->
       <!-- STEP - 2 -->
      <el-tab-pane name="2">
        <span slot="label" style="display:none"></span>
        <div id="step-settings" slot-scope="pane"
          class="content-wrapper flex-parent">
          <!-- STEP - 2 - 左边的导入表格 -->
          <section class="flex-left flex-70">
          <!-- STEP - 2 -->
          <el-table id='settings-table' ref='settingsTable' :data="settingsPageData.dataset" height="calc(100vh - 200px)"
            >
            <el-table-column
                v-for="title in settingsPageData.titles" :prop="String(title.idx)" :key="title.idx"
                min-width="150px">
                <!-- 自定义表头，用于选择列的属性 -->
                <template slot="header" slot-scope="scope" >
                  <div class="settings-table-header">
                    <label :for='"el-selector-for-type-col-" + title.idx'
                        class="selector-for-hidden-selector" :style='"background:"+getSelectorColorByType(title.type)+";"'>
                    </label>
                    <el-select v-model="title.type" placeholder="请选择"
                      :id='"el-selector-for-type-col-" + title.idx'
                      class="hidden-selector" size="mini">
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <!-- 如果 type === title，渲染选择框 -->
                    <template v-if="title.type === 'title'">
                      <el-input type="text" v-model="title.name"
                        placeholder="列名" size="mini" class="title-name"/>
                      <el-select v-model="title.titleGroup" placeholder="类别"
                      size="mini" class="title-name">
                        <el-option v-for='titleGroup in titleGroupList' :key='titleGroup.id'
                          :label='titleGroup.name' :value='titleGroup.id'>
                        </el-option>
                      </el-select>
                    </template>
                    <!-- 如果 type === sid，渲染学号框 -->
                    <template v-else-if="title.type === 'sid'">
                      学号
                    </template>
                    <!-- 如果 type === default，渲染默认框 -->
                    <template v-else-if="title.type === 'default'">
                      <el-button @click="onTitleTypeClick(title, 'sid')"
                      size='mini' type='primary'>学号</el-button>
                      <el-button @click="onTitleTypeClick(title, 'title')"
                      size='mini' type='success' >成绩</el-button>
                      <el-button @click="onTitleTypeClick(title, 'useless')"
                      size='mini' type='danger'>其它</el-button>
                    </template>
                    <!-- 如果 type !== sid || title || default，则渲染"无用项"框 -->
                    <template v-else-if="title.type === 'useless'">
                      不录入
                    </template>
                  </div>
                </template>
                <template slot-scope="scope">
                  <div class="setting-table-cell" :style='"background:"+getCellColorByType(title.type)+";"'>
                    <el-input v-model="scope.row[title.idx]">
                    </el-input>
                  </div>
                </template>
            </el-table-column>
          </el-table>
          </section>
          <!-- STEP - 2 -  右边的补充项 -->
          <section class="menu-wrapper flex-right flex-30">
            <el-button class="button" type="success" @click="toStep(1)" size="mini"><i class="el-icon-arrow-left el-icon--left"></i>上一步</el-button>
            <el-button class="button" type="success" @click="toStep(3)" size="mini">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </section>
        </div>
      </el-tab-pane><!-- step 2 end, and step 3 start -->
      <el-tab-pane name="3">
        <span slot="label" style="display:none"></span>
        <div id="step-preview"
        >
          <el-button class="button" type="success" @click="toStep(2)" size="mini"><i class="el-icon-arrow-left el-icon--left"></i>上一步</el-button>
          <el-button class="button" type="success" @click="alert('submit')" size="mini">提交<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import ImportExcelComponent from '@/components/ImportExcel.vue'
import tableViewmodel from '@/viewmodel/transcript/'

const REQUIRE_STUDENT_COLUMN = '您可能缺少学号列'
const REQUIRE_STUDENT_COLUMN_LEFT = '您的最左侧的列不是最长的列, 您的最左列不是学号吗?'

const COLOR_SID = '#1976D2'
const CELL_COLOR_SID = 'linear-gradient(135deg, ' + COLOR_SID + ', ' + COLOR_SID + ' 6px , #FFF 10px, #FFF 100%)'
const CELL_COLOR_TITLE = '#FFF'
const CELL_COLOR_USELESS = '#DDD'

const calHeight = () => {
  return window.innerHeight - 200
}

/** xlsx 的输出模式被制定为 header:1, 与 handsontable 兼容， 不需要转换
 */
const xlsxToHotAdapter = (xlsxData) => {
  return xlsxData
}

/**
 * 主要目的是生成和保存列名
 * @return Object
 *           |- titles  // made by hotData idx
 *           |    |- idx: column index
 *           |    |- type: default set to 0
 *           |    |- name: set column name
 *           |
 *           |- dataset // hotData
 */
const hotToElementAdapter = (hotData, withHeader) => {
  const titleMap = new Map()
  const resDataSet = []
  const colNameList = []
  for (let colIdx = 0; colIdx < hotData[0].length; colIdx++) {
    if (withHeader) {
      colNameList[colIdx] = hotData[0][colIdx]
    }
    hotData.forEach(rowArray => {
      // 仅保留有数据的列
      if (rowArray[colIdx] !== null && rowArray[colIdx] !== '' && rowArray[colIdx] !== undefined) {
        // 初始化 title 项
        if (!titleMap.get(colIdx)) {
          const newTitle = { idx: colIdx, type: 'default', name: colNameList[colIdx], titleGroup: undefined }
          // 自动设置 title.type
          if (withHeader && !(hotData[0][colIdx] === undefined || hotData[0][colIdx] === null || hotData[0][colIdx] === '')) {
            // console.log(hotData[0][colIdx])
            if (RegExp('^学').test(hotData[0][colIdx])) newTitle.type = 'sid'
            else newTitle.type = 'title'
          }
          titleMap.set(colIdx, newTitle)
        }
      }
    })
  }

  hotData.forEach((rowArray, rowIdx) => {
    resDataSet[rowIdx] = [];
    [...titleMap.keys()].forEach(colIdx => (resDataSet[rowIdx][colIdx] = rowArray[colIdx]))
  })

  if (withHeader) resDataSet.shift()

  return {
    titles: [...titleMap.values()],
    dataset: resDataSet
  }
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
      typeOptions: [
        { value: 'default', label: '默认(丢弃)', color: 'repeating-linear-gradient(45deg ,#FFCC33 0, #FFCC33 4px, #665 4px, #665 8px)' },
        { value: 'sid', label: '学号列', color: COLOR_SID },
        { value: 'title', label: '列项名', color: '#4CAF50' },
        { value: 'useless',
          label: '无用项',
          color: 'linear-gradient(45deg, transparent 0,transparent 45%, #FFCC33 45%, #FFCC33 55%, transparent 55%, transparent 100%),linear-gradient(135deg, #665 0,#665 45%, #FFCC33 45%, #FFCC33 55%, #665 55%, #665 100%)' }
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
      alerts: [],
      settingsPageData: {},
      titleGroupList: []
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
      },
      set(step) {
        this.activeStep = Number(step)
      }
    },
    importTableInfos: {
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
    },
    getSettingsPagesDataset: function() {
      return this.settingsPageData.dataset
    },
    getSettingsPagesTitles() {
      return this.settingsPageData.titles
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
    getSelectorColorByType(type) {
      const q = this.typeOptions.find(title => title.value === type)
      // console.log(q)
      return q.color
    },
    getCellColorByType(type) {
      if (type === 'title') {
        return CELL_COLOR_TITLE
      } else if (type === 'sid') {
        return CELL_COLOR_SID
      } else {
        return CELL_COLOR_USELESS
      }
    },
    onSelectedLocalExcel(data) {
      // console.log(data.results)
      this.$refs.hotTable.hotInstance.loadData(xlsxToHotAdapter(data.results))
    },
    onTitleTypeClick(title, type) {
      this.handleTitleTypeChange(title, type)
    },
    handleTitleTypeChange(title, type) {
      title.type = type
    },
    toStep(step) {
      switch (step) {
        case 1:
          this.activeStep = 1
          break
        case 2: {
          this.activeStep = 2
          this.settingsPageData = {}
          this.renderSettingsPage()
          break
        }
        case 3:
          this.activeStep = 3
          this.renderPreviewPage()
          break
      }
    },
    fetchTitleGroup: function() {
      // TODO: Add request params
      tableViewmodel.requestTitleGroup({ classInfo_id: 1 }).then(list => {
        this.titleGroupList = list
      }).catch(err => {
        console.error(err)
        this.$message({
          message: err,
          type: 'error'
        })
      })
    },
    renderSettingsPage() {
      this.settingsPageData = {}
      this.settingsPageData = hotToElementAdapter(this.importTable, this.isHead)
    },
    renderPreviewPage() {
      this.$router.push({ path: 'input/preview' })
    }
  },
  // watch: {
  //   activeStep: function(newStep) {
  //     switch (newStep) {
  //       case 1:
  //         // 没有操作
  //         break
  //       case 2:
  //         break
  //       case 3:
  //         break
  //     }
  //   }
  // },
  created() {
    this.$store.dispatch('saveImportTable', { table: [] })
    this.fetchTitleGroup()
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
.flex-70 {
  float: left;
  width: 70%;
  background: white;
}
.flex-30 {
  float: left;
  width: 30%;
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

.el-table th div {
  padding: 0px;
}

.settings-table-header {
  margin-left: -10px;
  display: flex;
  flex-flow: row;
  justify-content: start;
  align-items: center;
  min-height: 50px;
  max-height: 100px;
}

.hidden-selector {
  left: -40px;
  top: -20px;
  float: right top;
  width: 0px;
  height: 0px;
  display: hidden;
  box-sizing: border-box;
}

.selector-for-hidden-selector {
  display: block;
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 4px solid #665;
  box-shadow: 0px 0px 0px transparent;
  margin: 2px;
  transition: 0.4s ease-in;
  &:hover {
    border: 0px solid #212121;
    box-shadow: 1px 1px 2px 2px rgba(0,0,0,.5);
    transition: 0.4s ease-in;
  }

  // & div {
  //   border-radius: 999px;
  //   width: 24px;
  //   height: 24px;
  // }
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
  display: none;
}

.title-name .el-input__inner {
  min-width: 40px;
  padding: 0 0 0 4px ;
}

.title-name .el-input {
  min-width: 40px;
  padding: 0 0 0 4px ;
}

.settings-table-header .el-button {
  min-width: 20px;
  padding: 2px 4px;
  margin: 1px;
}
.settings-table-header .el-button span {
  font-size: 6px;
}

#settings-table td {
  padding: 0px;
  border: none;
}
#settings-table td .cell{
  padding: 0px;
  border: none;
}
#settings-table td .setting-table-cell {
  /* background: #DDD; */
  border: none;
}
#settings-table .el-input__inner {
  border: none;
  background: transparent;
}
</style>
