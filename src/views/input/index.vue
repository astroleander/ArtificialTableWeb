<!--  导入成绩界面用于导入Excel表格   -->
<!--  create 生命周期开始 fetchLesson请求所有课程信息到 remoteLessonList中 -->
<!--  界面设置与过程操作 -->
<!--  el-steps步骤使用, 绑定操作步骤 activeStep（在toStep函数中进行变化0、1、2） ；v-for需要完成操作steps ，包括步骤标题、步骤描述
      el-tabs 创建3个el-tab-pane 每个组成一个页面，其中的name：0、1、2  进行页面之间的区分
      1、step1：<el-tab-pane name="0">   importData
              （1）hot-table 左侧创建表格直接添加或拖拽Excel数据  利用 handsontable 绘制表格导入Excel数据 hotSettings为表格配置属性 具体数据信息在hotSettings.data中之后上传到importTable中
              （2）import-excel-component 右侧自定义组件 导入Excel工具 绑定函数 onSelectedLocalExcel  '@/components/ImportExcel.vue'
              （3）警示公告 v-for  importAlertList 中警告
              （4）数据是否包含列名转换 绑定importDataHasHead
              （5）导入课程组选择 绑定remoteLesson 调用函数 onSelectedLesson
              （6）点击按钮下一步 toStep 跳转到step2
              （7）从importTableAnalysis中读取导入数据状态信息
      2、step2：<el-tab-pane name="1">     settingsTable
              （1）在确认从step1中传入数据，跳转到step2中
              （2）左侧表格强制刷新
                  自定义表头，用于从step1传入数据选择列的属性  getSelectorColorByType由选择类型更换背景颜色
                  a、若选择了列名项（成绩），则需要同时选择类别（主观、客观）
                  b、若选择了默认项，则需要增加学号、成绩、其他选择，点击按钮 onTitleTypeClick 选择类型
                  c、若选择了无用项，则直接显示不录入
              （3）右侧补充项 数据状态信息 settingsTableAnalysis
              （4）按钮进行前后页面跳转
              （5）警示公告板（具体操作提示）
      3、step3：<el-tab-pane name="2">    previewPageData
               (1）从step2成功中传入数据
              （2）左上方放置返回step2按钮、提交数据按钮
              （3）submit函数调用，若成功输出插入成功，若失败，handleSubmitFeedback 则接受返回系列错误原因
              （4）通过错误原因加载下方错误警告
             -->
<!--  1、在第一页中向服务器请求所有的课程，从而select要插入的课程
      2、第一页中导入数据有两种选择：1）在handsontable中直接输入数据
                                 2）通过在左侧拖入Excel表格或上传本地Excel来传数据到handsontable中
      3、将handsontable中数据传到importTable中
      4、跳转到第二页，将importTable中数据拆分成两组：title以及dataset 存储到settingTable中
      5、在第二页选择各个title的选项以及命名
      6、跳转到第三页 将settingTable中数据加以处理，将默认以及无用title丢弃，将具体学号、成绩信息存储到previewPageData中，点击提交
-->

<template>
  <div class="BOX">
    <!--步骤操作 最上面的步骤进度-->
    <div class="steps flex-left flex-15">
    <el-steps :active="activeStep" finish-status="success" direction="vertical" space="35%" style="margin-top: 40px">
      <el-step v-for='eachStep in steps' :key='eachStep.title' :title='eachStep.title' :description='eachStep.description'></el-step>
    </el-steps>
    </div>
    <!--步骤操作绑定 getActiveStep 自动切换成el-tab-pane中name值-->
    <el-tabs v-model="getActiveStep" tab-position="hidden" class="tab flex-half flex-85">
      <!-- contains 3 steps -->
      <!-- STEP - 1 -->
      <!-- 通过变换name来进行table之间的跳转 -->
      <el-tab-pane name="0">
        <!--<span slot="label" style="display:none"></span>-->
        <div class="step1">
            <!-- STEP - 1 - 导入工具 -->
            <div id="menu-input-helper" class="input" style="margin-top: 5px">
            <div id="menu-input-helper" class="input" style="margin-top: 1px">
              <!-- 自定义组件 -->
              <import-excel-component @on-selected-file='onSelectedLocalExcel'></import-excel-component>
            </div>
            <div>
              <el-alert :title="this.ALERT" style="margin: 10px"></el-alert>
            </div>
            <div class="menu-wrapper">
              <el-select v-model="remoteLesson" placeholder="请选择要导入到的课程" @change="onSelectedLesson" style="margin-left: 10px">
                <el-option
                  v-for="item in remoteLessonList"
                  :value="item.id"
                  :label="item.name"
                  :key="item.id"
                >
                </el-option>
              </el-select>
                <el-radio-group v-model="importDataHasHead" style="margin-left: 30px">
                    <el-radio :label="true">数据包含列名</el-radio>
                    <el-radio :label="false">数据不包含列名</el-radio>
                </el-radio-group>
              <el-button style="margin-left: 30px"class="button" type="success" @click="toStep(1, 2)" size="mini">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
          <div class="inputTable">
            <div id="menu-data-previewer" class="menu-data-previewer">
              <p v-for="stats of importTableAnalysis" :key="stats.id" style="margin-right: 20px">
                  <span>{{stats.title}}
                    <template v-if="stats.meaning">({{stats.meaning}}) : </template>
                 </span>
                <span>{{stats.content}}</span>
              </p>
            </div>
            <div id="step-import" class="content-wrapper">
              <!-- STEP - 1 - 左边的导入表格 -->
              <section class="table-wrapper">
                <hot-table :settings="hotSettings" ref="hotTable" class="table"></hot-table>
              </section>
            </div>
          </div>
        </div>
        </div>
      </el-tab-pane>
      <!-- step 1 end, and step 2 start -->
      <!-- STEP - 2 -->
      <el-tab-pane name="1">
        <div id="step-settings" class="step2">
          <el-collapse>
            <el-collapse-item title="信息提示" style="margin-left: 5px">
              <div class="span-title inline-display-block" style="margin-top: 10px">
                <label class="selector-for-hidden-selector sample"
                       :style='"background: #1976D2"'></label>
                <span>学号列，用于标记学生，学号列只能有一列</span>
              </div>
              <div class="span-title inline-display-block" style="margin-top: 10px">
                <label class="selector-for-hidden-selector sample"
                       :style='"background: #FFCC33"'/>
                <span >未填写任何必要信息的小项</span>
              </div>
              <div class="span-title inline-display-block" style="margin-top: 10px">
                <label class="selector-for-hidden-selector sample"
                       :style="'background: linear-gradient(90deg, #4caf50 0px, #4caf50 50%, #FFCC33 50%, #FFCC33 100%);'"/>
                <span >只填写了小项名称，没有选择所属类型大项的小项</span>
              </div>
              <div class="span-title inline-display-block" style="margin-top: 10px">
                <label class="selector-for-hidden-selector sample"
                           :style='"background: #4caf50"'/>
                <span >可通过列项</span>
              </div>
              <div class="span-title inline-display-block" style="margin-top: 10px">
                <label class="selector-for-hidden-selector sample"
                       :style="'background: linear-gradient(90deg, #FFCC33 0px, #FFCC33 50%, #4caf50 50%, #4caf50 100%);'"/>
                <span >只选择了所属类型大项，没有填写名字的小项 </span>
              </div>
              <div class="span-title inline-display-block" style="margin-top: 10px">
                <label class="selector-for-hidden-selector sample"
                       :style="'background:' + headTypeList[0].color +';'"/>
                <span >没有选择类别的一列，这一列的内容将会被舍弃</span>
              </div>
              <div class="span-title inline-display-block" style="margin-top: 10px">
                <label class="selector-for-hidden-selector sample"
                       :style="'background:' + headTypeList[3].color +';'"/>
                <span >选择类别为“无用”的一列，这一列的内容将会被舍弃</span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="警告信息" style="margin-left: 5px" v-if="this.showsettingAlert">
              <div>
                <el-alert v-for="alert of settingsAlertList" :key="alert.id" :title="alert.title" style="margin-top: 1px" type="warning">
                </el-alert>
              </div>
            </el-collapse-item>
          </el-collapse>

          <div id="menu-data-previewer-two" class="menu-data-previewer-two">
            <p v-for="stats of settingsTableAnalysis" :key="stats.id" style="margin-right: 10px">
              <span>{{stats.title}}<template v-if="stats.meaning">({{stats.meaning}})</template></span>
              <span>{{stats.content}}</span>
            </p>
            <div style="display: flex;flex-direction: row;align-items: center;margin-left: 20px">
            <el-button style="max-height: 30px" class="button" type="success" @click="toStep(2, 1)" size="mini"><i class="el-icon-arrow-left el-icon--left"></i>上一步</el-button>
            <el-button style="max-height: 30px"class="button" type="success" @click="toStep(2, 3)" size="mini">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
          </div>
          <el-table v-if="activeStep === 1" id='settings-table' ref='settingsTable' :data="settingsPageData.dataset" height="calc(100vh - 200px)" border
              >
                <el-table-column
                  v-for="title in settingsPageData.titles" :prop="String(title.idx)" :key="title.idx"
                  min-width="150px" width="200px">
                  <!-- 自定义表头，用于选择列的属性 -->
             <template slot="header" slot-scope="scope" >
               <!-- <template slot="header"> -->
                  <div class="settings-table-header">
                    <label :for='"el-selector-for-type-col-" + title.idx'
                           class="selector-for-hidden-selector" :style='"background:" + getSelectorColorByType(title)+";"'>
                    </label>
                    <el-select v-model="title.type" placeholder="请选择"
                               :id='"el-selector-for-type-col-" + title.idx'
                               class="hidden-selector" size="mini">
                      <el-option
                        v-for="item in headTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <!-- 如果 type === title，渲染选择框 -->
                       <template v-if="title.type === 'title'">
                         <div class="select-container">
                         <span class="span-title ">
                         <span>列名: </span>
                         <el-input type="text" v-model="title.name"
                                   placeholder="列名" size="mini" class="title-name"/>
                         </span>
                           <span class="span-title ">
                         <span>类别: </span>
                         <el-select v-model="title.titleGroup" placeholder="类别"
                                    size="mini" class="title-name">
                           <el-option v-for='titleGroup in remoteTitleGroupList' :key='titleGroup.id'
                                      :label='titleGroup.name' :value='titleGroup.id'>
                           </el-option>
                         </el-select>
                         </span>
                         </div>
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
         </div>
     </el-tab-pane>
       <!-- STEP - 2 -  左边的补充项 -->
      <!-- step 2 end, and step 3 start -->
      <el-tab-pane name="2">
        <div id="step-preview" class="step3">
          <!-- STEP - 3 - 步骤操作菜单 -->
          <div style="display: flex;flex-direction: row;align-items: center;height: 60px;margin: 10px">
          <el-button  class="button" type="success" @click="toStep(3, 2)" size="mini"><i class="el-icon-arrow-left el-icon--left"></i>上一步</el-button>
          <el-button class="button" type="success" @click="submit()" size="mini">提交<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          <el-button v-if="submitErrorMessage.responsed" class="button" type="warning" @click="toStep(3, 1)" size="mini">继续上传</el-button>
          </div>
          <!-- CONTAINER 容纳错误信息 -->
          <div v-if="submitErrorMessage.existTitleNameList.length > 0">
            <el-alert v-for="name in submitErrorMessage.existTitleNameList" :key="name" type="warning"
                      :title="'当前列名 [' + name + '] 已被教师使用, 分数的插入操作将会覆盖之前存在的分数'">
            </el-alert>
          </div>

          <div v-if="submitErrorMessage.errorTitleNameList.length > 0">
            <el-alert v-for="name in submitErrorMessage.errorTitleNameList" :key="name" type="error"
                      :title="'[' + name + '] 插入失败'">
            </el-alert>
          </div>

          <div v-if="submitErrorMessage.successPointList.length > 0">
            <el-alert type="success"
                      title="下列分数添加成功">
            </el-alert>
            <el-table :data="submitErrorMessage.successPointList" style="width: 100%">
              <el-table-column prop="student_message.sid" label="学号"></el-table-column>
              <el-table-column prop="student_message.name" label="姓名"></el-table-column>
              <el-table-column prop="pointNumber" label="分数"></el-table-column>
              <el-table-column prop="title_message.name" label="列名"></el-table-column>
              <el-table-column label="大项">
                <template slot-scope="scope">
                  <span>{{ getTitleGroup(scope.row.title_message.titleGroup).name }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="submitErrorMessage.existPointList.length > 0">
            <el-alert type="warning"
                      title="下列分数覆盖了原来的值">
            </el-alert>
            <el-table :data="submitErrorMessage.existPointList" style="width: 100%">
              <el-table-column prop="sid" label="学号"></el-table-column>
              <el-table-column prop="pointNumber" label="分数"></el-table-column>
              <el-table-column prop="title_name" label="列名"></el-table-column>
              <el-table-column label="大项">
                <template slot-scope="scope">
                  <span>{{ getTitleGroup(scope.row.titleGroup_id).name }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="submitErrorMessage.errorPointList.length > 0">
            <el-alert type="error"
                      title="下列分数插入失败">
            </el-alert>
            <el-table :data="submitErrorMessage.errorPointList" style="width: 100%">
              <el-table-column prop="sid" label="学号"></el-table-column>
              <el-table-column prop="pointNumber" label="分数"></el-table-column>
              <el-table-column prop="title_name" label="列名"></el-table-column>
              <el-table-column label="大项">
                <template slot-scope="scope">
                  <span>{{ getTitleGroup(scope.row.titleGroup_id).name }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- STEP - 3 - 预览表格 -->
          <!-- 使用 v-if 重新渲染表格，消耗一定的性能，使得表格强制刷新 -->
          <el-table v-if="activeStep === 2" :key="activeStep" id='preview-table' ref='previewTable'
                    :data="previewPageData.dataset"
                    class="preivew-table"
                    border stripe size="mini"
          >
            <el-table-column label="学号" width="150px">
              <template slot-scope="scope">
                {{ getStudentNumber(scope) }}
              </template>
            </el-table-column>

            <el-table-column
              v-for="title in previewPageData.titles" :key="title.idx"
              :prop="String(title.idx)" :label="title.name"
              min-width="80px" width="120px">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { HotTable } from '@handsontable/vue'
  import Handsontable from 'handsontable'
  import ImportExcelComponent from '@/components/ImportExcel.vue'
  // 引入 viewmodel
  import titleGroupViewModel from '@/viewmodel/titlegroups'
  import lessonViewModel from '@/viewmodel/lesson'
  import pointViewModel from '@/viewmodel/point'
  import PointMock from '@/mock/point'
  import TitleMock from '@/mock/title'
  // 引入常量，全是提示信息字符串
  import { REQUIRED_TITLEGROUP, REQUIRED_TITLE, CLIP_BOARD_ALERT, REQUIRE_STUDENT_COLUMN, REQUIRE_STUDENT_COLUMN_LEFT, DUPLICATE_SID, REQUIRED_SID, REQUIRED_AT_LEAST_A_TITLE, NO_TITLE_GROUP } from '@/utils/alerts'
  const COLOR_SID = '#1976D2'
  const COLOR_UNFINISHED = '#FFCC33'
  const COLOR_TITLE = '#4caf50'
  const CELL_COLOR_SID = 'linear-gradient(135deg, ' + COLOR_SID + ', ' + COLOR_SID + ' 6px , #FFF 10px, #FFF 100%)'
  const CELL_COLOR_TITLE = '#FFF'
  const CELL_COLOR_USELESS = '#DDD'
  const COLOR_LEFT_HALF_TITLE = 'linear-gradient(90deg, ' + COLOR_TITLE + ', ' + COLOR_TITLE + ' 50% ,' + COLOR_UNFINISHED + ' 50%, ' + COLOR_UNFINISHED + ' 100%)'
  const COLOR_RIGHT_HALF_TITLE = 'linear-gradient(90deg, ' + COLOR_UNFINISHED + ', ' + COLOR_UNFINISHED + ' 50% ,' + COLOR_TITLE + ' 50%, ' + COLOR_TITLE + ' 100%)'
  const calHeight = () => {
    return window.innerHeight - 200
  }
  /** // xlsx 的输出模式被制定为 header:1, 与 handsontable 兼容， 不需要转换
   * trim here
   */
// 将xlsx文件数据转换成handsontable数据格式
  const xlsxToHotAdapter = (xlsxData) => {
    // console.log(xlsxData)
    // 去除空数据
    xlsxData.forEach(row => {
      row.forEach(element => {
        if (element.trim() === '') {
          element = null
        }
      })
    })
    // console.log(xlsxData)
    return xlsxData
  }
  /**
   * 将 importPage step1 中的 Handontable 数据转化为 settingsPage step2 中的 Element 需要的数据格式
   * 主要目的是生成和保存列名
   * @return Object
   *           |- titles  // made by hotData idx
   *           |    |- idx: column index
   *           |    |- type: default set to 'title'
   *           |    |- name: set column name
   *           |    |- titlegroup
   *           |
   *           |- dataset // hotData
   */
  const hotToElementAdapter = (hotData, withHeader) => {
    const titleMap = new Map()
    const resDataSet = []
    const colNameList = []
    console.log('我在进行2步')
    console.log(hotData)
    //  获取所有标头
    for (let colIdx = 0; colIdx < hotData[0].length; colIdx++) {
      if (withHeader) {
        colNameList[colIdx] = hotData[0][colIdx]
      }
      hotData.forEach(rowArray => {
        // 仅保留有数据的列
        if (rowArray[colIdx] !== null && rowArray[colIdx] !== '' && rowArray[colIdx] !== undefined) {
          // 初始化 title 项 区分sid 与普通title
          if (!titleMap.get(colIdx)) {
            const newTitle = { idx: colIdx, type: 'default', name: colNameList[colIdx], titleGroup: undefined, total: 100 }
            // 如果包含项名，则自动设置 title.type
            if (withHeader && !(hotData[0][colIdx] === undefined || hotData[0][colIdx] === null || hotData[0][colIdx] === '')) {
              // console.log(hotData[0][colIdx])
              if (RegExp('学号').test(hotData[0][colIdx])) newTitle.type = 'sid'
              else newTitle.type = 'title'
            }
            titleMap.set(colIdx, newTitle)
          }
        }
      })
    }
    // 输出数据集结果
    hotData.forEach((rowArray, rowIdx) => {
      resDataSet[rowIdx] = [];
      [...titleMap.keys()].forEach(colIdx => {
        if (rowArray[colIdx] && rowArray[colIdx].trim() !== '') {
          resDataSet[rowIdx][colIdx] = rowArray[colIdx].trim()
        }
      })
    })
    // 如果是包含项名的输入，则将第一列删除
    if (withHeader) resDataSet.shift()
    return {
      titles: [...titleMap.values()],
      dataset: resDataSet
    }
  }
  /**
   * 将 settingsPage step2 中的 Element 数据过滤，只剩下需要的字段。=>step3
   * @return output: Object
   *           |- sid
   *           |- titles  // made by hotData idx
   *           |    |- idx: column index
   *           |    |- name: set column name
   *           |
   *           |- dataset // hotData
   */
  const previewFilter = (settingsData) => {
    console.log('我又来啦！！！！！')
    const dataset = JSON.parse(JSON.stringify(settingsData.dataset))
    const titles = JSON.parse(JSON.stringify(settingsData.titles))
    let sidColIdx
    const deprecatedColIdx = []
    const sid = []
    const previewDataset = []
    const previewTitles = []
    /** step3中 设置学号列，丢弃列，数据列
     *  对于是学号的数据放入学号数组中
     *  对于title为默认或无用的放入废弃列
     *  最后放入数据 学号的数据放入学号数组中
     *  成绩数据放入数据列
     *  废弃列不作处理
     **/
    titles.forEach((title, idx) => {
      if (title.type === 'sid') {
        sidColIdx = String(idx)
        return
      }
      if (title.type === 'useless' || title.type === 'default') {
        deprecatedColIdx.push(String(idx))
        return
      }
      title.type = 'title'
      previewTitles.push(title)
    })
    dataset.forEach((row, rowIdx) => {
      const sidItem = row[sidColIdx]
      sid.push(sidItem)
      const previewRow = []
      row.forEach((cell, colIdx) => {
        // 被标记的错误: in 取的是 key, 哪怕目标是数组取的也TM是下标
        // if (String(colIdx) in deprecatedColIdx === false && String(colIdx) !== sidColIdx) {
        if (String(colIdx) !== sidColIdx && !deprecatedColIdx.includes(String(colIdx))) {
          // console.log('\t\tadd ' + cell + '\t' + String(colIdx))
          previewRow.push(cell)
        }
      })
      previewDataset.push(previewRow)
    })
    previewTitles.forEach((title, idx) => (title.idx = String(idx)))
    return {
      titles: previewTitles,
      dataset: previewDataset,
      sid
    }
  }
  /**
   * @return submitWrapper contains:
   *         |- titles
   *         |- point
   * @description split into 3 steps
   * 1. get student by sid
   * 2. make title array
   * 3. make point array
   */
// 将第三页数据拆分成：标题列表，成绩列表，学号列表，课程id
  const submitConverter = (previewPageData, lessonId) => {
    console.log('我好像要提交了')
    console.log(previewPageData)
    const newTitleItemArrayArray = []
    // 放置每一个新增的成绩项 初始权重为1
    previewPageData.titles.forEach(title => {
      const item = TitleMock.getTitlePrototype()
      item.name = title.name
      item.titleGroup_id = title.titleGroup
      newTitleItemArrayArray.push(item)
    })
    const newPointItemArray = []
    // 第一层循环的 row 表示第 i 行, sIdx 表示当前录到第 i 个学生的成绩
    // 放置每一个新增的成绩数据 初始成绩为0
    previewPageData.dataset.forEach((row, sIdx) => {
      // console.log(row)
      row.forEach((point, idx) => {
        const item = PointMock.getPointPrototype()
        // console.log(item)
        // 加载数据
        item.pointNumber = point
        item.date = Date.parse(new Date())
        item['sid'] = previewPageData.sid[sIdx]
        item['title_name'] = previewPageData.titles[idx]['name']
        item['titleGroup_id'] = previewPageData.titles[idx]['titleGroup']
        // item['_titleIdx'] = idx
        newPointItemArray.push(item)
      })
    })
    console.log(newPointItemArray)
    console.log(newTitleItemArrayArray)
    const sid_list = previewPageData.sid
    const description = '分为四个部分, title 列表和 point 列表, <br/>' +
      '其中 title 列表需要补充 classInfo_id 字段, 最后创建后创建 id 字段.<br/>' +
      '其中 point 列表需要补充 classInfo_id, student_id, title_id 字段, 最后从创建生成 id 字段.<br/>' +
      '其中 lesson_id 字段包含所在课程 <br/> ' +
      '其中 sid_list 字段包含学生学号列表 <br/> '
    return {
      // 返回 ：新增标题、成绩，课程ID，学号列，描述
      title_list: newTitleItemArrayArray,
      point_list: newPointItemArray,
      lesson_id: lessonId,
      sid_list,
      description
    }
  }
  /**
   * export VUE COMPONENT start here
   *
   */
  export default {
    components: {
      HotTable, ImportExcelComponent
    },
    data() {
      return {
        // 步骤参数
        activeStep: 0,
        steps: [
          { title: '引入数据', description: '导入Excel或输入数据', picture: 'el-icon-edit' },
          { title: '规范数据', description: '筛选并补充导入数据', picture: 'el-icon-upload' },
          { title: '校验数据', description: '校验并确认您的导入结果', picture: 'el-icon-check' }
        ],
        // step2 中左侧表格选择标头数据
        headTypeList: [
          { value: 'default', label: '默认(丢弃)', color: 'repeating-linear-gradient(45deg ,#FFCC33 0, #FFCC33 4px, #665 4px, #665 8px)' },
          { value: 'sid', label: '学号列', color: COLOR_SID },
          { value: 'title', label: '列项名', color: COLOR_UNFINISHED },
          { value: 'useless',
            label: '无用项',
            color: 'linear-gradient(45deg, transparent 0,transparent 45%, #FFCC33 45%, #FFCC33 55%, transparent 55%, transparent 100%),linear-gradient(135deg, #665 0,#665 45%, #FFCC33 45%, #FFCC33 55%, #665 55%, #665 100%)' }
        ],
        // step1中左侧输入表格
        hotSettings: {
          startRows: 80,
          startCols: 30,
          minCols: 30,
          minRows: 60,
          height: calHeight(), // 设置高度
          colHeaders: true,
          rowHeaders: true,
          // 表格右键一层操作设置
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
          // 每次表格中数据改变，此时触发此函数
          afterChange: function() {
            let importDataset = this.getData()
            console.log('我输入了啥？？？')
            console.log(importDataset)
            // 返回不是全空的行
            importDataset = importDataset.filter((row, rowIndex, arr) => {
              return !row.every(cell => {
                return cell === null || cell.trim() === '' || cell === undefined
              })
            })
            console.log('我化简')
            console.log(importDataset)
            const env = this.rootElement.__vue__
            env.$store.dispatch('saveImportTable', { table: importDataset })
            console.log('我好像输入了上面这个')
          }
        }, // hotSettings-end
        importDataHasHead: null,
        DataHasHead: [
          {
            id: 1,
            name: '包含列名',
            value: true
          },
          {
            id: 2,
            name: '不包含列名',
            value: false
          }
        ],
        importAlertList: [],
        settingsAlertList: [],
        // 第二页的数据存储 title + dataset
        settingsPageData: {},
        // 第三页的数据存储
        previewPageData: {},
        // request from remote
        remoteLesson: '',
        // 远程课程信息列表
        remoteLessonList: [],
        // 选择成绩大项分类
        remoteTitleGroupList: [],
        // response after import submit
        submitErrorMessage: {
          existTitleNameList: [],
          errorTitleNameList: [],
          existPointList: [],
          errorPointList: [],
          successPointList: [],
          successTitleList: [],
          responsed: false
        },
        ALERT: CLIP_BOARD_ALERT.title + CLIP_BOARD_ALERT.description,
        showsettingAlert: false
      }
    }, // data-end
    computed: {
      // 导入数据
      importTable: {
        get() {
          return this.$store.state.table.importTable
        }
      },
      // 定位步骤
      getActiveStep: {
        get() {
          if (this.activeStep === 3) {
            return '2'
          }
          return String(this.activeStep)
        },
        set(step) {
          this.activeStep = Number(step)
        }
      },
      // 分析第一页输入数据的行列记录
      importTableAnalysis: {
        get() {
          // 获取存储导入数据
          const importTable = this.$store.state.table.importTable
          console.log('我要干啥？？？ 下面是表')
          console.log(importTable)
          let count = 0
          const col_size = importTable[0] && importTable[0].length || 29
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
          var importRows = importTable && importTable.length || 0
          if (this.importDataHasHead && importRows !== 0) {
            importRows--
          }
          const importCols = col_count.filter(v => v !== 0).length
          console.log('我好像输入了这些行、列')
          console.log(importRows)
          console.log(importCols)
          const alertsRaiseRules = [
            {
              validator: Math.max(...col_count) < importRows,
              action: () => {
                const description = '您的总行数和最大行数不匹配 (最大的行数为 ' + Math.max(...col_count) + ' 行, 但您共导入了 ' + importRows + ' 行)' + ', 这会导致那些没有学号的分数项在导入时丢失'
                this.addAlert(
                  Object.assign(REQUIRE_STUDENT_COLUMN, {
                    type: 'error',
                    description
                  }), this.importAlertList)
              },
              close: () => (this.importAlertList = this.closeAlert(this.importAlertList, REQUIRE_STUDENT_COLUMN))
            },
            {
              validator: col_count.find(item => item !== 0) && Math.max(...col_count) !== col_count.find(item => item !== 0),
              action: () => this.addAlert(Object.assign(REQUIRE_STUDENT_COLUMN_LEFT, { type: 'warning' }), this.importAlertList),
              close: () => (this.importAlertList = this.closeAlert(this.importAlertList, REQUIRE_STUDENT_COLUMN_LEFT))
            }
          ]
          alertsRaiseRules.forEach(matchRule => {
            if (matchRule.validator) matchRule.action()
            else matchRule.close()
          })
          return [
            { id: 1, title: '学生数', meaning: '导入的行数', content: importRows },
            { id: 2, title: '类别数', meaning: '导入的列数', content: importCols },
            { id: 3, title: '共计' + count + '条记录' }
          ]
        }
      },
      // 分析第二页数据记录
      settingsTableAnalysis: {
        get() {
          if (this.settingsPageData.dataset === undefined) return []
          const settingsTable = this.settingsPageData
          // console.log(settingsTable)
          let titleCount = 0
          let sidCount = 0
          let uselessCount = 0
          let defaultCount = 0
          // let undefinedTitles = []
          // switch rules
          const t_rules = [
            { type: 'sid', action: () => sidCount++ },
            { type: 'title', action: () => titleCount++ },
            { type: 'useless', action: () => uselessCount++ },
            { type: 'default', action: () => defaultCount++ }
          ]
          // executing switch by rule
          settingsTable.titles.forEach(title => {
            t_rules.forEach(rule => {
              if (rule.type === title.type) {
                rule.action()
              }
            })
          })
          /**
           * validator 校验规则, 通过则执行 action(), 否则执行 close()
           */
          const alertsRaiseRules = [
            {
              validator: sidCount > 1,
              action: () => this.addAlert(DUPLICATE_SID, this.settingsAlertList),
              close: () => (this.settingsAlertList = this.closeAlert(this.settingsAlertList, DUPLICATE_SID))
            },
            {
              validator: sidCount < 1,
              action: () => this.addAlert(REQUIRED_SID, this.settingsAlertList),
              close: () => (this.settingsAlertList = this.closeAlert(this.settingsAlertList, REQUIRED_SID))
            },
            {
              validator: titleCount < 1,
              action: () => this.addAlert(REQUIRED_AT_LEAST_A_TITLE, this.settingsAlertList),
              close: () => (this.settingsAlertList = this.closeAlert(this.settingsAlertList, REQUIRED_AT_LEAST_A_TITLE))
            },
            {
              validator: (() => {
                // let rets = false
                for (let index = 0; index < settingsTable.titles.length; index++) {
                  const title = settingsTable.titles[index]
                  if (title.type === 'title') {
                    if (title.titleGroup === null || title.titleGroup === '' || title.titleGroup === undefined) {
                      return true
                    }
                  }
                }
              })(),
              action: () => this.addAlert(REQUIRED_TITLEGROUP, this.settingsAlertList),
              close: () => (this.settingsAlertList = this.closeAlert(this.settingsAlertList, REQUIRED_TITLEGROUP))
            },
            {
              validator: (() => {
                // let rets = false
                for (let index = 0; index < settingsTable.titles.length; index++) {
                  const title = settingsTable.titles[index]
                  if (title.type === 'title') {
                    if (title.name === null || title.name === '' || title.name === undefined) {
                      return true
                    }
                  }
                }
              })(),
              action: () => this.addAlert(REQUIRED_TITLE, this.settingsAlertList),
              close: () => (this.settingsAlertList = this.closeAlert(this.settingsAlertList, REQUIRED_TITLE))
            }
          ]
          alertsRaiseRules.forEach(matchRule => {
            if (matchRule.validator) matchRule.action()
            else matchRule.close()
          })
          return [
            // { id: 1, title: '学生数', content: '24' },
            { id: 2, title: '导入的成绩小项数', content: titleCount },
            // { id: 3, title: '学生数', content: '24' },
            { id: 4, title: '目前将有' + (uselessCount + defaultCount) + '列被废弃' }
          ]
        }
      }
    },
    methods: {
      addAlert(alert, alertList) {
        // if exist the splice, else execute push statement
        let existAlertIdx
        if ((existAlertIdx = alertList.findIndex(item => item.title === alert.title)) !== -1) {
          alertList.splice(existAlertIdx, 1, alert)
        } else {
          alertList.push(alert)
        }
      },
      closeAlert(list, toClose) {
        if (list.find(item => item.id === toClose.id)) {
          list = list.filter(item => item.id !== toClose.id)
        }
        return list
      },
      getSelectorColorByType(title) {
        const q = this.headTypeList.find(types => {
          return types.value === title.type
        })
        if (title.type === 'title') {
          if (title.name !== '' && title.name !== undefined && title.name !== null && title.titleGroup !== '' && title.titleGroup !== undefined && title.titleGroup !== null) {
            return COLOR_TITLE
          } else if (title.name !== '' && title.name !== undefined && title.name !== null) {
            return COLOR_LEFT_HALF_TITLE
          } else if (title.titleGroup !== '' && title.titleGroup !== undefined && title.titleGroup !== null) {
            return COLOR_RIGHT_HALF_TITLE
          }
        }
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
      // 不同步骤直接的跳转
      toStep(from, to) {
        switch (to) {
          case 1:
            if (from === 3) {
              this.$router.push('/redirector/index')
            } else {
              this.activeStep = 0
            }
            break
          case 2: {
            if (this.importTable.length > 1 || (!this.importDataHasHead && this.importTable.length > 0)) {
              // 将从step1中数据进行存储以及处理 跳转到step2
              if (from === 1) this.renderSettingsPage()
              this.activeStep = 1
              break
            } else {
              this.$message({
                message: '您首先需要引入数据',
                type: 'warning'
              })
              break
            }
          }
          case 3: {
            let legalRequest = true
            const previewPermission = [
              {
                validator: this.settingsPageData.titles && this.settingsPageData.dataset,
                action: () => {},
                reject: () => {
                  legalRequest = false
                  this.$message({
                    message: '您需要在第一步先引入数据',
                    type: 'warning'
                  })
                }
              },
              {
                validator: this.settingsAlertList.length === 0,
                action: () => {},
                reject: () => {
                  legalRequest = false
                  this.$message({
                    message: '请确认您已经排除了所有错误项',
                    type: 'error'
                  })
                }
              }
            ]
            previewPermission.forEach(rule => {
              rule.validator ? rule.action() : rule.reject()
            })
            if (legalRequest) {
              // 跳转到第三步
              this.activeStep = 2
              this.renderPreviewPage()
            }
            break
          }
        }
      },
      // 进入第二页，将第一页中的标题和数据分开存储到settingsPageData中
      renderSettingsPage() {
        Object.assign(this.$data.settingsPageData, {})
        // 将step1中导入step2 table变换形式
        this.settingsPageData = hotToElementAdapter(this.importTable, this.importDataHasHead)
      },
      // 进入第三页，将第二页中的标题和数据分开存储到settingsPageData中
      renderPreviewPage() {
        // console.log(this.settingsPageData)
        this.previewPageData = {}
        this.previewPageData = previewFilter(this.settingsPageData)
        // console.log(this.previewPageData)
      },
      // 请求所有课程组信息存储到remoteLessonList中
      fetchLesson() {
        lessonViewModel.requestAllLessons().then(res => {
          this.remoteLessonList = res
        })
      },
      // 获取后端权重大项
      fetchTitleGroup(id) {
        titleGroupViewModel.requestByLessonId(id).then(list => {
          if (list === undefined) {
            // this.importAlertList.push(NO_TITLE_GROUP)
            this.addAlert(NO_TITLE_GROUP, this.importAlertList)
          } else {
            this.importAlertList = this.closeAlert(this.importAlertList, NO_TITLE_GROUP)
          }
          // 课程组大项
          this.remoteTitleGroupList = list
        }).catch(err => {
          console.error(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
      },
      // listners 提交
      submit() {
        const submitDataset = submitConverter(this.previewPageData, this.remoteLesson)
        pointViewModel.requestImportPoints(submitDataset).then(res => {
          this.activeStep = 3
          console.log(3)
          // 4037
          console.log(res && String(res.code))
          if ((res && String(res.code) === '2011') || (res && String(res.code) === '2001')) {
            console.log('数据导入成功')
            this.$message({
              message: '数据导入成功',
              type: 'success'
            })
          } else if (res && String(res.code) === '2019') {
            console.log('数据导入失败')
            this.$message({
              message: '数据已经导入, 部分数据存在冲突',
              type: 'warning'
            })
            this.handleSubmitFeedback(res)
          } else {
            console.log('数据导入失败')
            this.$message({
              message: '数据导入失败,请查看错误信息',
              type: 'error'
            })
            this.handleSubmitFeedback(res)
          }
        })
      },
      // 拖入或选中Excel表格，将数据呈现在左侧handsontable中
      onSelectedLocalExcel(data) {
        this.$refs.hotTable.hotInstance.loadData(xlsxToHotAdapter(data.results))
      },
      onTitleTypeClick(title, type) {
        this.handleTitleTypeChange(title, type)
      },
      // 选择课程id获取课程权重大项
      onSelectedLesson(selected) {
        this.fetchTitleGroup(selected)
      },
      handleTitleTypeChange(title, type) {
        title.type = type
      },
      // 处理返回错误数据
      handleSubmitFeedback(response) {
        if (response.code === '4037') {
          console.log(response)

          this.$message({
            message: '数据导入失败,请查看导入成绩的学号是否与课程组匹配',
            type: 'error'
          })
        } else {
          const errorList = response.subjects
          // deleted duplicated
          this.submitErrorMessage.responsed = true
          this.submitErrorMessage.existTitleNameListt = errorList['exists_title_names'] || []
          this.submitErrorMessage.existPointList = errorList['exists_point_message'] || []
          this.submitErrorMessage.errorPointList = errorList['error_point_message'] || []
          this.submitErrorMessage.errorTitleNameList = errorList['error_title_message'] || []
          this.submitErrorMessage.successTitleList = errorList['succeed_title_message'] || []
          this.submitErrorMessage.successPointList = errorList['succeed_point_message'] || []
          console.log(this.submitErrorMessage)
        }
      },
      getStudentNumber(scope) {
        return this.previewPageData.sid[scope.$index]
      },
      getTitleGroup(titleGroup_id) {
        return this.remoteTitleGroupList.find(item => item.id === titleGroup_id)
      }
    },
    watch: {
      importAlertList: function() {
        const len = this.importAlertList.length
        this.$notify({
          title: '警告',
          message: this.importAlertList[len - 1].title + this.importAlertList[len - 1].description,
          type: 'warning',
          duration: 9000
        })
      },
      settingsAlertList: function() {
        const len = this.settingsAlertList.length

        if (len > 0) {
          this.showsettingAlert = true
        } else {
          this.showsettingAlert = false
        }
      }
    },
    created() {
      // 将table获取到的数据存入store中
      this.$store.dispatch('saveImportTable', { table: [] })
      // 请求所有课程组信息
      this.fetchLesson()
    }
  }
</script>

<style lang="scss">
  @import '../../../node_modules/handsontable/dist/handsontable.full.min.css';
</style>

<style lang="scss" scoped>
  .BOX{
    display: flex;
    flex-direction: row;
  }
  .step1{
    display: flex;
    flex-direction: column;
    width: auto;
  }
  .step2{
    display: flex;
    flex-direction: column;
    width: auto;
  }
  .step3{
    display: flex;
    flex-direction: column;
    width: auto;
  }
  .tab{
    background-color: white;
    width: auto;
  }
  .input{
    background-color: white;
  }
  .select-container {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .span-title {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    align-items: center;
    justify-items: center;
    text-align: center;
  }
  .inline-display-block {
    padding: 5px;
    label {
      padding: 5px;
    }
  }
  .flex-half {
    float: left;
    width: 50%;
    background: white;
  }
  .flex-85 {
    float: left;
    width: 85%;
    background: white;
  }
  .flex-15 {
    float: left;
    width: 15%;
    background: white;
  }
  .steps {
    background: white;
    padding: 1em;
    box-sizing: border-box;
    height: 950px;
    justify-content: center;
    margin-right: 1px;
    //border: 20px solid #CCCCCC;
    // margin-bottom: 20px;
  }
  #import-menu-table-board {
    .alert{
      margin: 8px 12px;
      width: 98%;
    }
  }
  .content-wrapper {
    display: block;
  }
  .table-wrapper {
    // max-width: 55%;
  }
  .action-menu{
    display: flex;
    flex-direction: row;
    margin-top: 30px;
  }
  .menu-continue {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

  }
  .menu-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    margin-top: 20px;

  }
  .menu-wrapper-two {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    margin-top: 20px;
  }
  .lesson-memu {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .menu-data-previewer {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    background: white;
    justify-content: flex-start;
  }
  .menu-data-previewer-two{
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    background: white;
    justify-content: flex-start;
  }
  .inputTable{
    display: flex;
    flex-direction: column;
    margin: 10px;
  }
  .data-table{
    width: 67%;
    margin-left: 3%;
  }
  .alert-info {
    margin-top: 20px;
  }
  .Vertical{
    width: 20px;
    margin: 0 auto;
    line-height: 24px;
    font-size: 10px;
  }
  .el-table th div {
    padding: 0px;
  }
  .settings-table-header {
    margin-left: -4px;
    display: flex;
    flex-flow: row;
    justify-content: start;
    align-items: center;
    min-height: 50px;
    // max-height: 100px;
  }
  .row-frame{
    display: flex;
    flex-direction: row;
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
    border: 2px solid #665;
    //border: 1px solid #FFF;
    box-shadow: 0px 0px 0px transparent;
    margin: 2px;
    transition: 0.4s ease-in;
    &:hover {
      border: 0px solid #212121;
      box-shadow: 1px 1px 2px 2px rgba(0,0,0,.5);
      transition: 0.4s ease-in;
    }
    &.sample {
      width: 24px;
      //border: 1px solid #FFF;
      box-shadow: 2px 2px 5px #666;
    }
    // & div {
    //   border-radius: 999px;
    //   width: 24px;
    //   height: 24px;
    // }
  }
  .preivew-table {
    margin: 20px;
    width: calc(100% - 40px);
    border: 10px solid #EEE;
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
  .title-name .el-input__inner, .title-name .el-input {
    min-width: 40px;
    padding: 0 0 0 4px ;
  }
  .title-text .el-input__inner, .title-text .el-input {
    min-width: 40px;
    padding: 0 0 0 4px ;
  }
  .title-select .el-input__inner, .title-select .el-input {
    min-width: 60px;
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
