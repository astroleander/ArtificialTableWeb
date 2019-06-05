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
<template>
    <section class="table-wrapper">

        <!-- table menu-->
        <el-row class="menu">
            <el-button @click="onClickedAddTitle()" type="success" icon="el-icon-d-arrow-right">添加新列</el-button>
            <el-button @click="onClickedExportTable()" type="success" icon="el-icon-download">导出文件</el-button>
            <!-- <el-button @click="onClickedRefresh()" type="warning" icon="el-icon-refresh" >刷新页面</el-button> -->
            <el-button @click="onClickedUpload()" type="success" icon="el-icon-upload">保存修改</el-button>
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
                class="table">

            <el-table-column label="学生姓名" prop="student.name"
                             fixed min-width="100px">
            </el-table-column>

            <el-table-column label="学号" prop="student.sid"
                             fixed min-width="100px">
            </el-table-column>

            <el-table-column
                    v-for="title in titles" :key="title.id"
                    min-width="120px">
                <template slot="header" slot-scope="head">
                    <div class="line-container">
                        <span>{{title.name}}</span>
                        <div @click='onDeleteColClicked(head, title)' class="delete"><i class="el-icon-plus"></i></div>
                    </div>
                </template>
                <template slot-scope="scope">
                    <div class="item-wrapper">
                        <div slot="reference" v-if="getPointItem(scope, title)"
                             class="point-div">
                            <!-- using import to excel -->
                            <span style="display:none">{{getPointNumber(scope, title)}}</span>
                            <span class="point">
              <el-form
                      :model="getPointItem(scope, title)"
                      :rules="[
                      { type: 'number', message: '分数必须为数字值'}]"
              >
                <el-input
                        type="number"
                        prop="number"
                        size="mini"
                        v-model.number="getPointItem(scope, title).pointNumber"
                        placeholder=""
                        @change="onItemChanged(getPointItem(scope, title))">
                </el-input>
              </el-form>
            </span>
                            <!-- <span class="point">
                              {{getPointNumber(scope, title)}}</span> -->

                        </div>

                        <div v-if="getPointItem(scope, title)" class="point-div-addons">
            <span class="operator">
              <!-- <label :for='"at-operator-delete-button-"+title.id+"-"+scope.row.student.id'><svg-icon icon-class="trash" /></label>
              <input :id='"at-operator-delete-button-"+title.id+"-"+scope.row.student.id' type="button"
                @click="onDeleteClicked({scope, title})" class="operator-button"/>
              <label :for='"at-operator-modify-button-"+title.id+"-"+scope.row.student.id'><svg-icon icon-class="pencil" /></label>
              <input :id='"at-operator-modify-button-"+title.id+"-"+scope.row.student.id' type="button"
                @click="onModifyClicked({scope, title})" class="operator-button"/> -->
            </span>
                        </div>
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
        }
      },
      data() {
        return {
          viewDataset: [],
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
          // 暂时不用携带数据
          // menuDialogDataset: {}
          // 载入状态
          loading: true
        }
      },
      computed: {
        getTableDataset() {
          return this.tableDialogDataset
        }
      },
      methods: {
        proving1(e, scope, title) {
          const boolean = new RegExp('^[1-9][0-9]*$').test(e.target.value)
          if (!boolean) {
            this.$message.warning(scope.name + '的' + title + '处禁止输入小数及负数')
            e.target.value = 0
          }
          if (e.target.value > 100) {
            this.$message.warning('禁止输入超过100满分数')
            e.target.value = 0
            e.target.color = 'red'
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
            '若要继续, 请在文本框内输入\"确认\"\n此操作将彻底删除该班级, 所有分数信息都将丢失！',
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
          this.showExportDialog({})
        },
        onClickedRefresh: function() {
          location.reload()
        },
        onClickedUpload: function() {
          console.log(this.updatedArray)
          viewmodel.modifyPoints(this.updatedArray).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        },
        onItemChanged: function(newItem) {
          // 没做重复校验,对同一个分数改动多次会有多个item (问我为什么? 懒啊!)
          if (newItem.pointNumber === '') {
            newItem.pointNumber = 0
          }
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
        },
        handleAddTitle: function(dialogResult) {
          this.$emit('onTitleAdded', dialogResult)
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
      created() {},
      mounted() {
        setTimeout(() => {
          if (this.loading) this.loading = false
        }, 5000)
      },
      watch: {
        view: function(newView) {
          this.viewDataset = newView
          this.loading = false
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
        justify-content: flex-start;
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
        border: none;
    }
</style>