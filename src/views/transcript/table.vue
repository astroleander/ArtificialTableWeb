<!-- Tree Structure of Transcript Table of Transcript section -->
<!--
table
  |- section
  |- DONE: menu
  |- DONE: table
  |- ... DONE: row

DONE: 增加一个 [切换至大项视图] 按钮和功能
DONE: post 返回需要 ID
-->
<!-- 成绩表模版 -->
<!-- 1、三个按钮 -->
<!--    （1）第一个按钮，添加新列 onClickedAddTitle =》showAddTitleDialog显示添加新列界面 menuAddTitleDialogVisible为true-->
<!--         此时at-add-title-dialog自定义组件显示 来源于./dialogAddTitle.vue'-->
<!--    （2）其他两个按钮类比即可  -->
<!-- 2、显示一个table，具体学生数据-->

<!-- 整个模版用于定义数据表table的自定义组件 -->
<!--suppress ALL -->
<template>
    <section class="table-wrapper">

        <!-- table menu-->
        <el-row class="menu">
            <el-button @click="onClickedExportTable()" type="primary" icon="el-icon-download" plain>导出文件</el-button>
            <!-- <el-button @click="onClickedRefresh()" type="warning" icon="el-icon-refresh" >刷新页面</el-button> -->
            <el-button @click="onClickedUpload()"
              :type="this.$store.state.table.changed? 'warning' : 'primary'" icon="el-icon-upload" plain>保存修改</el-button>
            <el-button @click="onClickedAddTitle()" type="primary" icon="el-icon-d-arrow-right">添加新成绩项</el-button>
            <!--<el-button @click="reload()" type="primary" icon="">成绩汇总计算</el-button>-->
            <!-- <el-button icon="el-icon-search"></el-button> -->
            <!-- <el-button type="info" icon="el-icon-message" ></el-button> -->
        </el-row>
        <!-- table main container-->
        <el-table
                :data="viewDataset"
                @cell-dblclick='onCellClicked'
                v-loading.body="loading"
                ref="table" id="transcript-table"
                element-loading-text="Loading"
                height="calc(100vh - 145px)"
                class="table"
                :cell-style="getCellColorByType">

            <el-table-column label="学生姓名" prop="student.name"
                             fixed min-width="40px">
            </el-table-column>

            <el-table-column label="学号" prop="student.sid"
                             fixed min-width="50px">
            </el-table-column>

            <el-table-column label="总成绩" prop="totle"
                             fixed min-width="40px">
            </el-table-column>

            <el-table-column
                    v-for="title in titles" :key="title.id"
                    min-width="200">
                <template slot="header" slot-scope="head">
                    <div class="line-container">
                        <el-tooltip class="item" effect="dark" :content="title.titleGroup_message.name" placement="top">
                            <span>{{title.name}}</span>
                        </el-tooltip>
                        <div @click='onDeleteColClicked(head, title)' class="delete"><i class="el-icon-plus"></i></div>
                    </div>
                </template>
                <template slot-scope="scope">
                    <div class="item-wrapper">
                        <div
                             slot="reference"
                             v-if="getPointItem(scope, title)"
                             class="point-div">
                            <!-- using import to excel -->
                            <!--<span style="display:none">{{getPointNumber(scope, title)}}</span>-->
                            <span class="point">
                                <el-form :model="getPointItem(scope, title)">
                                    <template v-if="title.titleGroup_message.name === '出勤'">
                    <el-select
                            v-model="getPointItem(scope, title).pointNumber"
                            placeholder="请选择"
                            @change="onItemChanged(getPointItem(scope, title), title)">
                        <el-option
                                v-for="item in title_map"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                                    <template v-else>
                        <el-input
                              type="number"
                              prop="number"
                              size="mini"
                              ref="input"
                              step=0.1
                              v-model.number="getPointItem(scope, title).pointNumber"
                              placeholder=""
                              @blur="proving($event,getPointItem(scope, title),title)"
                              @change="onItemChanged(getPointItem(scope, title), title)">
                        </el-input>
                  </template>
                                </el-form>
                            </span>
                            <!-- <span class="point">
                              {{getPointNumber(scope, title)}}</span> -->
                        </div>
            <!--            <div  class="point-div-addons">
                            <span class="operator">
                            </span>
                        </div>     -->
                       <div v-else class="point-div-addons">
                              <span class="operator">
                                <label :for='"at-operator-add-button-"+title.id+"-"+scope.row.student.id'><svg-icon class="svg" icon-class="add" /></label>
                                  <input :id='"at-operator-add-button-"+title.id+"-"+scope.row.student.id' type="button"
                                    @click="onAddClicked({scope, title})" class="operator-button"/>
                                </span>
                        </div>
                    </div>

                </template>
            </el-table-column>
        </el-table>

        <!-- Dialog for showing and modifying details -->
        <at-point-dialog
                :v-if="this.pointDialogVisible"
                :visible="this.pointDialogVisible"
                :cell="getTableDataset"
                :titleGroupName="this.selectTitleGroupName"
                @onDialogClose="onDialogClose()"
                @onPointChanged="handlePointChanged"
        ></at-point-dialog>
        <at-student-dialog
                :v-if="this.studentDialogVisible"
                :visible="this.studentDialogVisible"
                :student="this.tableDialogDataset"
                @onDialogClose="onDialogClose()">
        </at-student-dialog>
        <at-add-title-dialog
                :v-if="this.menuAddTitleDialogVisible"
                :visible="this.menuAddTitleDialogVisible"
                :classInfo="this.info"
                @onDialogClose="onDialogClose()"
                @onAddNewTitle="this.handleAddTitle">
        </at-add-title-dialog>
        <at-export-dialog
                :v-if="this.menuExportDialogVisible"
                :visible="this.menuExportDialogVisible"
                @onDialogClose="onDialogClose()"
                @onExport="this.handleExport">
        </at-export-dialog>
    </section>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    import viewmodel from '@/viewmodel/table'
    import titlemodel from '@/viewmodel/title'

    export default {
      name: 'transcriptTable',
      components: {
        AtPointDialog: () => import('./dialogPoint'),
        AtStudentDialog: () => import('./dialogStudent'),
        AtAddTitleDialog: () => import('./dialogAddTitle.vue'),
        AtExportDialog: () => import('./dialogExport')
      },
      props: {
        view: {
          type: Array,
          require: true
        },
        titles: {
          type: Array,
          require: true
        },
        info: {
          type: Object,
          require: false
        },
        classinfoId: {
          type: String,
          require: true
        }
      },
      data: function() {
        return {
          viewDataset: [],
          titleWeight: [],
          // the array is for saving all modified point item,
          // if user click the [upload] button, push all modifies to server
          updatedArray: [],
          // point dialog and student dialog use the same one dataset,
          // every time open the dialog will re-set the dataset
          pointDialogVisible: false,
          studentDialogVisible: false,
          tableDialogDataset: {},
          // "add title" dialog and "export" dialog use the same dataset,
          // every time open the dialog will re-set the dataset
          menuAddTitleDialogVisible: false,
          menuExportDialogVisible: false,
          // 最后成绩
          finalList: [],
          // 暂时不用携带数据
          // menuDialogDataset: {}
          // 载入状态
          loading: true,
          // 成绩是否发生改变
          pointChange: false,
            title_map : [
                { name: '出勤', id: 1 },
                { name: '缺勤', id: 2 },
                { name: '请假', id: 3 },
                { name: '迟到', id: 4 },
                { name: '其他', id: 5 }
            ],
            selectTitleGroupName: null
        }
      },
      computed: {
        getTableDataset() {
          return this.tableDialogDataset
        }
      },
      methods: {
          getCellColorByType({row, column, rowIndex, columnIndex}) {
              if(columnIndex === 0 || columnIndex === 1 || columnIndex === 2){
                  return 'background:#f9f9f9'
              }else return ''
          },
        selectTitle(title_id) {
          this.title_Map.forEach(title => {
            if (title.id === title_id) {
              return title.name
            }
          })
        },
        ListenToChange() {
          // console.log(this.viewDataset)
          const titleWeight = []
          const titleGroupWeight = []
          titlemodel.requestTitles({ classInfo_id: this.classinfoId })
            .then(response => {
              response.forEach(title => {
                console.log(title)
                titleGroupWeight.push(title.titleGroup_message.weight)
                titleWeight.push(title.weight)
              })
              // console.log('44444')
              // console.log(titleWeight)
              // console.log(this.viewDataset)
              this.viewDataset.forEach(view => {
                const pointNumber = []
                const point = view.point
                for (const i of point) {
                  if (i.pointNumber === undefined) {
                    i.pointNumber = 0
                  }
                  pointNumber.push(i.pointNumber)
                }
                let sum = 0
                for (let i = 0; i < pointNumber.length; i++) {
                  sum += pointNumber[i] * titleWeight[i] *titleGroupWeight[i] / 10000
                }
                view.totle = parseFloat(sum).toFixed(2)
              })
            })
          // console.log('77')
          // console.log(this.viewDataset)
        },
        pointIfChange() {
          if (this.pointChange === true) {
            this.pointChange = false
          } else {
            this.pointChange = true
          }
        },
        reload() {
          location.reload()
        },
        proving(e, newItem, title) {
          const sid = newItem.student_id
          var name
          this.viewDataset.forEach(studentItem => {
            if (studentItem.student.id === sid) {
              name = studentItem.student.name
            }
          })
          if (newItem.pointNumber === '') {
            this.$message({
              message: name + '同学的' + title.name + '处成绩未输入或输入数据错误，此时可能无法进行数据更改',
              type: 'warning',
              duration: 8000
            })
          }
          if (newItem.pointNumber < 0 || newItem.pointNumber > 100) {
            this.$message({
              message: name + '同学的' + title.name + '处成绩输入负数或超过100的数，请确认此处为正确操作',
              type: 'warning',
              duration: 8000
            })
          }
        },
        beforeunloadHandler(event) {
          if (this.$store.state.table.changed) {
            event.preventDefault()
            event.returnValue = `直接离开会失去尚未保存修改的分数`
          }
        },
        // shown controller, ensure dataset before
        showPointDialog: function(dataset) {
          this.tableDialogDataset = dataset
          this.pointDialogVisible = true
        },
        showStudentDialog: function(dataset) {
          this.tableDialogDataset = dataset
          this.studentDialogVisible = true
        },
        showAddTitleDialog: function(dataset) {
          // this.menuDialogDataset = dataset
          this.menuAddTitleDialogVisible = true
        },
        showExportDialog: function(dataset) {
          // this.menuDialogDataset = dataset
          this.menuExportDialogVisible = true
        },
        getPointNumber: function(scope, title) {
          const item = scope.row.point.find(point => point.title_id === title.id)
          return item && item.pointNumber
        },
        getPointItem: function(scope, title) {
          const item = scope.row.point.find(point => point.title_id === title.id)
          return item
        },
        // listener
        onDialogClose: function() {
          // reset flag
          this.pointDialogVisible = false
          this.studentDialogVisible = false
          this.menuAddTitleDialogVisible = false
          this.menuExportDialogVisible = false
          // cannot reset dialog data set before dialog close
          // this.tableDialogDataset = {} // cant here
        },
        onAddClicked: function({ scope, title }) {
                // using point prototype to create a point item
                import('@/mock/point').then(mock => {
                  // const pointNewItem = {point:{}, student:{}, title:{} }
                  const pointNewItem = {}
                  // modify standard point card info
                  pointNewItem['point'] = mock.default.getPointPrototype()
                  pointNewItem.point.title_id = title.id
                  pointNewItem.point.student_id = scope.row.student.id
                  pointNewItem.point.date = Date.now()
                  pointNewItem.point.classInfo_id = this.$router.currentRoute.params.id
                  // add some extra info message to help build the dialog
                  pointNewItem['student'] = scope.row.student
                  pointNewItem['title'] = title
                  pointNewItem['info'] = this.info
                  pointNewItem['type'] = 'add' // declear if item is exist
                  this.selectTitleGroupName = title.titleGroup_message.name
                  this.showPointDialog(pointNewItem)
                })
        },
        onModifyClicked: function({ scope, title }) {
          // const pointExistItem = { point:{}, student:{}, title:{} }
          const pointExistItem = {}
          pointExistItem['point'] = this.getPointItem(scope, title)
          // add some extra info to build dialog
          pointExistItem['student'] = scope.row.student
          pointExistItem['title'] = title
          pointExistItem['info'] = this.info
          pointExistItem['type'] = 'modify' // declear if item is exist
          this.showPointDialog(pointExistItem)
        },
        // onDeleteClicked: function({ scope, title }) {
        //   const point = this.getPointItem(scope, title)
        //   if (point) {
        //     viewmodel.deletePoint(point.id).then(res => {
        //       this.$message({
        //         type: 'warning',
        //         message: '您已经成功删除该条分数记录'
        //       })
        //     })
        //   }
        // },
        onDeleteColClicked: function(scope, title) {
          // console.log(title)
          this.$prompt(
            '若要继续, 请在文本框内输入\"确认\"\n此操作将彻底删除该列, 所有分数信息都将丢失！',
            '请确认删除操作', {
              confrimButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /确认/
            }
          ).then(() => {
            viewmodel.deleteTitle(title.id).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.$emit('onDeletedTitle', title)
                // this.handleDeletedTitle()
              // this.pointIfChange()
            })
          })
        },
        onCellClicked: function(row, column, cell, event) {
          if (RegExp('^student.').test(column.property)) {
            this.showStudentDialog(row.student)
          }
          // else {
          // const dataset = row[column.property]
          // dataset.label = column.label
          // this.showPointDialog(dataset)
          // }
        },
        onClickedAddTitle: function() {
          this.showAddTitleDialog({})
        },
        onClickedExportTable: function() {
          if (this.$store.state.table.changed) {
            this.$alert('当前有未保存的分数修改，请保存后再导出')
          } else {
            this.showExportDialog({})
          }
        },
        onClickedRefresh: function() {
          location.reload()
        },
        onClickedUpload: function() {
          viewmodel.modifyPoints(this.updatedArray).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$store.state.table.changed = false
          })
          // console.log('1111111')
          this.pointIfChange()
        },
        onItemChanged: function(newItem, title) {
          this.$store.state.table.changed = true
          // 没做重复校验,对同一个分数改动多次会有多个item (问我为什么? 懒啊!)
          this.updatedArray.push(newItem)
        },
        handlePointChanged: function(dialogResult) {
          const item = dialogResult
          // search table original dataset and replace or add new point item
          this.viewDataset.forEach(row => {
            if (row.student.id === item.student.id) {
              if (item.type === 'modify') {
                for (const pointIdx in row.point) {
                  if (row.point.hasOwnProperty(pointIdx)) {
                    const element = row.point[pointIdx]
                    if (String(item.point.id) === String(element.id)) {
                      this.$set(row.point, pointIdx, item.point)
                    } // end if
                  } // end hasOwnProperty if
                } // end for
              } else {
                row.point.push(item.point)
              }
            }
          })
          this.pointIfChange()
        },
        handleAddTitle: function(dialogResult) {
          this.$emit('onTitleAdded', dialogResult)
          this.pointIfChange()
        },
        handleExport: function(dialogResult) {
          // this.$emit('onExportTable', dialogResult)
          /* generate workbook object from table */
          const wb = XLSX.utils.table_to_book(document.querySelector('#transcript-table'))
          const size = wb.Sheets[wb.SheetNames[0]]['!ref']
          const endNumber = size.match(/\d+$/)
          const newNumber = parseInt(endNumber[0]) / 2
          const newSize = size.slice(0, endNumber.index) + newNumber
          wb.Sheets[wb.SheetNames[0]]['!ref'] = newSize
          /* get binary string as output */
          const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), dialogResult.filename + '.xlsx')
          } catch (e) {
            if (typeof console !== 'undefined') {
              console.log(e, wbout)
            }
          }
          return wbout
        }
      },
      created() {
        this.$store.state.table.changed = false
      },
      mounted() {
        window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))

        setTimeout(() => {
          if (this.loading) this.loading = false
        }, 5000)
      },
      beforeDestroy() {
        window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
      },
      watch: {
        view: function(newView) {
          this.viewDataset = newView
          this.viewDataset.forEach(data => {
            data.totle = parseFloat(data.totle).toFixed(2)
          })
          this.loading = false
        },
        pointChange: function() {
          this.ListenToChange()
        }
      }
    }
</script>

<style lang="scss" scoped>
    .table {
        width: 100%;
    }
    .table-wrapper {
        height: 100%;
        // height: 200px;
    }
    .menu {
        margin: 12px 10px;
    }
    .operator {
        height: 14px;
        .svg-icon {
            cursor: pointer;
            fill: #999;
            &:hover {
                fill: #212121;
            }
        }
    }
    .operator-button {
        display: none;
    }
    .item-wrapper {
        cursor: pointer;
        user-select: none;
        display: flex;
        flex-direction: row;
        align-content: center;
        // justify-content: flex-start;
        justify-content: center;
        // background: #e3fcf9;
        // height: 30px;
    }
    .point-div-addons {
        .operator {
            margin: 8px;
            white-space: nowrap;
            display: inline-flex;
            opacity: 0.3;
            transition: all 0.1s 0.4s ease;
        }
        &:hover .operator {
            opacity: 1;
            transition: all 0.2s ease;
        }
    }
    .delete {
        padding: 0px;
        box-shadow: 2px 2px 3px #999;
        text-align: center;
        line-height: 20px;
        color: white;
        margin: 5px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #DE3316;
        transform: rotate(45deg);
        opacity: 0.35;
        transition: 0.15s ease-in all;
        &:hover {
            opacity: 1;
            transition: 0.15s ease-in all;
        }
        &:active {
            background: #333;
        }
    }
    .line-container {
        display: flex;
        align-content: center;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        padding: 0px;
    }
</style>

<style lang="scss">
    .point-div {
        .el-input .el-input--mini {
            .el-input__inner {
                padding: 0 0 0 0;
                margin: 0 0 0 0;
            }
        }
    }
    #transcript-table .el-input__inner {
        padding: 0 0 0 4px;
        // border: none;
        text-align: center;
    }
</style>
