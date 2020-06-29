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
            <el-button @click="onClickDifirentOne()" type="primary" icon="el-icon-download" plain>导出文件</el-button>
            <!-- <el-button @click="onClickedRefresh()" type="warning" icon="el-icon-refresh" >刷新页面</el-button> -->
            <el-button @click="onClickedUpload()"
              :type="this.$store.state.table.changed? 'warning' : 'primary'" icon="el-icon-upload" plain>保存修改</el-button>
            <el-button @click="onClickedAddTitle()" type="primary" icon="el-icon-d-arrow-right">添加新成绩项</el-button>
            <!--<el-button @click="reload()" type="primary" icon="">成绩汇总计算</el-button>-->
            <!-- <el-button icon="el-icon-search"></el-button> -->
            <!-- <el-button type="info" icon="el-icon-message" ></el-button> -->
            <el-button @click="onClickDifirentTwo()" type="primary" icon="el-icon-download" plain>导出固定模版文件</el-button>
        </el-row>
        <!-- table main container   id="transcript-table" class="table" :data="viewDataset.slice((currentPage-1)*pagesize,currentPage*pagesize)" element-loading-text="Loading"-->
        <div style="height: 100%; width: 100%">
            <div style="height: calc(100vh - 140px);padding: 10px;">
                <pl-table
                :datas="viewDataset"
                use-virtual
                v-loading.body="loading"
                ref="table"
                height="calc(100vh - 140px)"
                id="transcript-table"
                element-loading-text="Loading"
                class="table"
                :row-height="65"
                :cell-style="getCellColorByType">

            <pl-table-column label="序号" align="center"
                             fixed min-width="60px" prop="index">
            </pl-table-column>

            <pl-table-column label="学生姓名" prop="student.name" align="center"
                             fixed min-width="100px">
            </pl-table-column>

            <pl-table-column label="学号" prop="student.sid" align="center"
                             fixed min-width="100px" sortable>
            </pl-table-column>

            <pl-table-column  label="总成绩" align="center">
                <pl-table-column  :label="this.message" prop="totle" align="center" sortable>
                </pl-table-column>
            </pl-table-column>

            <pl-table-column
                    v-for="title in titles" :key="title.id"
                    min-width="180">
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
                            <span style="display:none">{{getPointNumber(scope, title).pointNumber}}</span>
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
                                                 @change="onItemChanged(getPointItem(scope, title), title)"
                                                 v-limit>
                                             </el-input>
                                    </template>
                                </el-form>
                            </span>
                                 <!-- <span class="point">
                                   {{getPointNumber(scope, title)}}</span> -->
                        </div>
                   <!--         <div  class="point-div-addons">
                                <span class="operator">
                                </span>
                            </div> -->
                        <div v-else class="point-div-addons">
                            <span class="operator">
                                <label :for='"at-operator-add-button-"+title.id+"-"+scope.row.student.id'><svg-icon class="svg" icon-class="add" /></label>
                                      <input :id='"at-operator-add-button-"+title.id+"-"+scope.row.student.id' type="button"
                                        @click="onAddClicked({scope, title})" class="operator-button"/>
                            </span>
                        </div>
                    </div>
                </template>
                </pl-table-column>
            </pl-table>
            </div>
        </div>

            <!--<el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="current_change"
                    :total="row_total"
                    :page-size="pagesize">
            </el-pagination>

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
    // import FileSaver from 'file-saver'
    // import XLSX from 'xlsx'
    // 用于班级成绩导出
    import pointmodel from '@/viewmodel/point'

    import viewmodel from '@/viewmodel/table'
    import titlemodel from '@/viewmodel/title'
    import elTableInfiniteScroll from 'el-table-infinite-scroll'
    // import Export2Excel from '@/excel/Export2Excel.js'
    import Vue from 'vue'

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
        message: {
          type: String,
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
            tableData: Array.from({ length: 10000 }, (_, idx) => ({
                idx: idx + 1,
                date: '2016-05-03',
                name: '王小虎',
                ab: '欢迎使用pl-table',
                address: '上海市普陀区金沙江路 1516 弄'
            })),
            // export to excel
            Export_Excel: 0,
            // show totle
            showTotle: false,
            // 导出文件
            outPutExcel: [],
          // 换页所需参数
          row_total:130,  // 默认数据总数
          pagesize:10,  // 每页的数据条数
          currentPage:1,  // 默认开始页面
          totle_page: this.row_total / this.pagesize, // 总页数
          viewDataset: [],
          loadingDataset: [],
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
          // 是否滚动加载
          loadSign: true,
          // 成绩是否发生改变
          pointChange: false,
          title_map: [
            { name: '出勤', id: 1 },
            { name: '缺勤', id: 2 },
            { name: '请假', id: 3 },
            { name: '迟到', id: 4 },
            { name: '其他', id: 5 }
          ],
          selectTitleGroupName: null,
          color: null
        }
      },
      computed: {
        getTableDataset() {
          return this.tableDialogDataset
        }
        // addDataset: this.viewDataset.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
      },
      methods: {
          onClickTotle(){
             if(this.showTotle === false){
                 this.showTotle = true
             }else {
                 this.showTotle = false
             }

          },
        // 换页
        current_change(currentPage) {
          this.currentPage = currentPage
        },
        getCellColorByType({ row, column, rowIndex, columnIndex }) {
          if(columnIndex === this.color) {
            return 'background: rgba(255, 232, 143, 0.94)'
          } else return ''
        },
          getHeaderColor({ row, rowIndex }){
              return 'background: rgba(255, 232, 143, 0.94)'
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
          // const titleWeight = []
          // const titleGroupWeight = []
          // console.log('监听成绩变化')
          // titlemodel.requestTitles({ classInfo_id: this.classinfoId })
            // .then(response => {
              // console.log('1111111111111111')
           /*   this.titles.forEach(title => {
                titleGroupWeight.push(title.titleGroup_message.weight)
                titleWeight.push(title.weight)
              })*/
              // console.log('44444')
              // console.log(titleWeight)
              // console.log(titleGroupWeight)
              this.viewDataset.forEach(view => {
                // const pointNumber = []
                let sum = 0
                const point = view.point
                for (const i of point) {
                  if (i.pointNumber === undefined) {
                    i.pointNumber = 0
                  }else {
                      this.titles.forEach(title => {
                          // titleGroupWeight.push(title.titleGroup_message.weight)
                          // titleWeight.push(title.weight)
                          if(i.title_id === title.id){
                              sum += i.pointNumber * title.titleGroup_message.weight * title.weight / 10000
                          }
                      })
                  }
                  // pointNumber.push(i.pointNumber)
                }
                // console.log(pointNumber)
                // let sum = 0
                /*for (let i = 0; i < pointNumber.length; i++) {
                  sum += pointNumber[i] * titleWeight[i] * titleGroupWeight[i] / 10000
                }*/
                view.totle = parseFloat(sum).toFixed(2)
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
        proving(e, newItem, title, row, index) {
          const sid = newItem.student_id
          var name
          this.viewDataset.forEach(studentItem => {
            if (studentItem.student.id === sid) {
              name = studentItem.student.name
            }
          })
          if (newItem.pointNumber === '') {
            this.$confirm('warning', {
              message: name + '同学的' + title.name + '处成绩未输入或输入数据错误，此时无法进行数据更改',
              type: 'warning'
            })
          }
          if (newItem.pointNumber < 0 || newItem.pointNumber > 100) {
            this.$confirm('warning', {
              message: name + '同学的' + title.name + '处成绩输入超过100的数值，请确认此处为正确操作',
              type: 'warning'
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
          // console.log(scope.$index)
          this.color = scope.$index
          // this.getCellColorByType(scope.row,scope.column)
            this.$confirm('此操作将彻底删除该列，所有分数信息均被删除，请确认是否删除！', '提示', {
                confrimButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            viewmodel.deleteTitle(title.id).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.$emit('onDeletedTitle', title)
              this.color = null
              // this.handleDeletedTitle()
              // this.pointIfChange()
            })
          }).catch(() => {
            this.color = null
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
        onClickDifirentOne(){
          this.Export_Excel = 1
          this.onClickedExportTable()
        },
        onClickDifirentTwo(){
           this.Export_Excel = 2
           this.onClickedExportTable()
        },
        onClickedExportTable: function(number) {
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

        // export to excel
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => v[j]))
        },

         //              ******************************************               //
        handleExport: function(dialogResult) {
          if(this.Export_Excel === 2){
              // 从后端读取导出数据源
              pointmodel.requestOutPut(this.classinfoId)
                  .then(response => {
                      // console.log('1111111')
                      this.outPutExcel = response
                      require.ensure([], () => {
                          const { export_json_to_excel } = require('../../excel/Export2Excel_multiTitle')
                          const multiHeader = ['北京交通大学']
                          const multiHeader2 = ['姓名']
                          const tHeader = this.outPutExcel.tableHead
                          const merge = ['A1:L1', 'A2:L2'] // ['A1:L1', 'A2: L2']
                          const filterVal = this.outPutExcel.firstVal
                          const list = this.outPutExcel.tableData
                          const data = this.formatJson(filterVal, list)
                          data.map(item => {
                              // console.log(item)
                              item.map((i, index) => {
                                  if (!i) {
                                      item[index] = ''
                                  }
                              })
                          })
                          export_json_to_excel(multiHeader,multiHeader2,merge,tHeader, data, dialogResult.filename)
                      })
                      // this.$emit('onExportTable', dialogResult)
                      /*
                  const wb = XLSX.utils.table_to_book(document.querySelector('#transcript-table'))
                    /* generate workbook object from table */
                      /*    const size = wb.Sheets[wb.SheetNames[0]]['!ref']
                          const endNumber = size.match(/\d+$/)
                          const newNumber = parseInt(endNumber[0]) / 2
                          const newSize = size.slice(0, endNumber.index) + newNumber
                          wb.Sheets[wb.SheetNames[0]]['!ref'] = newSize
                          /* get binary string as output */
                      /*
                  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                  try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), dialogResult.filename + '.xlsx')
                  } catch (e) {
                    if (typeof console !== 'undefined') {
                      console.log(e, wbout)
                    }
                  }
                  return wbout*/
                  })
          }else if(this.Export_Excel === 1){
              // 从后端读取导出数据源
              pointmodel.requestOutPut(this.classinfoId)
                  .then(response => {
                      // console.log('1111111')
                      this.outPutExcel = response
                      require.ensure([], () => {
                          const { export_json_to_excel } = require('../../excel/Export2Excel')
                          const tHeader = this.outPutExcel.tableHead
                          const filterVal = this.outPutExcel.firstVal
                          const list = this.outPutExcel.tableData
                          const data = this.formatJson(filterVal, list)
                          export_json_to_excel(tHeader, data, dialogResult.filename)
                      })
                      // this.$emit('onExportTable', dialogResult)
                      /*
                  const wb = XLSX.utils.table_to_book(document.querySelector('#transcript-table'))
                    /* generate workbook object from table */
                      /*    const size = wb.Sheets[wb.SheetNames[0]]['!ref']
                          const endNumber = size.match(/\d+$/)
                          const newNumber = parseInt(endNumber[0]) / 2
                          const newSize = size.slice(0, endNumber.index) + newNumber
                          wb.Sheets[wb.SheetNames[0]]['!ref'] = newSize
                          /* get binary string as output */
                      /*
                  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                  try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), dialogResult.filename + '.xlsx')
                  } catch (e) {
                    if (typeof console !== 'undefined') {
                      console.log(e, wbout)
                    }
                  }
                  return wbout*/
                  })

          }

        },
        loadMore(){
          if (this.currentPage < this.totle_page ) {
            this.loading = true
            this.currentPage++
            this.loadingDataset = this.loadingDataset.concat(this.viewDataset.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize))
            Vue.nextTick(()=>{
              this.loading = false
            })
          }
        }
      },
      // 自定义指令
      directives: {
        limit: {
          // 指令参数
          inserted(el) {
              let content;
              // 按键按下=>只允许输入 数字/小数点
              el.addEventListener("keypress", event => {
                  let e = event || window.event;
                  let inputKey = String.fromCharCode(typeof e.charCode === 'number' ? e.charCode : e.keyCode);
                  let re = /\d|\./;
                  content = e.target.value;
                  // 定义方法,阻止输入
                  function preventInput(){
                      if (e.preventDefault) {
                          e.preventDefault();
                      } else {
                          e.returnValue = false;
                      }
                  }
                  if (!re.test(inputKey) && !e.ctrlKey) {
                      preventInput();
                  } else if (content.indexOf(".") > 0 && inputKey == ".") {
                      //已有小数点,再次输入小数点
                      preventInput();
                  }
              })
              // 按键弹起=>并限制最大最小
             /* el.addEventListener("keyup",event => {
                  let e = event || window.event;
                  content = parseFloat(e.target.value)
                  if (!content) {
                      content = 0.00
                  }
                  let arg_max = 100.00
                  let arg_min = 0.00
                  if(arg_max && content > arg_max){
                      e.target.value = arg_max;
                      content = arg_max;
                  }
                  if(arg_min && content < arg_min){
                      e.target.value = arg_min;
                      content = arg_min;
                  }
              }) */
              // 失去焦点=>保留指定位小数
              el.addEventListener("focusout",event=>{ // 此处会在 el-input 的 @change 后执行
                  let e = event || window.event;
                  content = parseFloat(e.target.value);
                  if (!content) {
                      content = 0.00
                  }
                  let arg_precision = 0 // 默认保留至整数
                  if (vDir.value.precision) {
                      arg_precision = parseFloat(vDir.value.precision);
                  }
                  e.target.value = content.toFixed(arg_precision);
                  // -- callback写法1
                  // vNode.data.model.callback = ()=>{
                  //     e.target.value = content.toFixed(arg_precision)
                  // }
                  // vNode.data.model.callback();
                  // -- callback 写法2
                  // vNode.data.model.callback(
                  //     e.target.value = content.toFixed(arg_precision)
                  // )
              })
          }
        },
        'el-table-infinite-scroll': elTableInfiniteScroll,
        loadMore: {
            bind(el, binding) {
                const selectWrap = el.querySelector('.el-table__body-wrapper')
                selectWrap.addEventListener('scroll', function() {
                    let sign = 5
                    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
                    if (scrollDistance <= sign) {
                        binding.value()
                    }
                })
            }
        }
      },
      created() {
        this.$store.state.table.changed = false
      },
      mounted() {
        window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
        Vue.$nextTick(()=>{
            this.loading = false
        })
      },
      beforeDestroy() {
        window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
      },
      watch: {
        view: function(newView) {
          // console.log('成绩表传到子组件中')
          this.viewDataset = newView
          this.row_total = this.viewDataset.length
          this.viewDataset.forEach(data => {
            data.totle = parseFloat(data.totle).toFixed(2)
          })
          this.loadingDataset = this.viewDataset.slice((this.currentPage-1)* this.pagesize, this.currentPage* this.pagesize)
          this.currentPage = 1
          this.totle_page = this.row_total / this.pagesize
          this.loading = false
        },
        pointChange: function() {
          this.ListenToChange()
        },
        titles: function (titles) {
            this.pointChange = true
        }
      }
    }
</script>

<style lang="scss" scoped>
    .table {
        // display: none;
        width: 100%;
    }
    .table-wrapper {
        // display: none;
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
