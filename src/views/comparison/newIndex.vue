<template>
  <div>
    <el-row :gutter="20">
      <!-- 左半部分布局 -->
      <el-col :span="8">
        <div class="left-container bg-gray">
          <el-row :gutter="5">
            <!-- 下拉选择框-课程组选择 -->
            <el-col :span="15">
              <el-select
                class
                v-model="classGroupName"
                filterable
                placeholder="请选择课程组"
                @change="selectedClassGroup"
              >
                <el-option
                  v-for="item in classGroups"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <!-- 确定 按钮 -->
            <el-col :span="9">
              <div class="btn_content">
                <el-button
                  v-show="!isShowCompareResult"
                  id="btn_show"
                  type="success"
                  round
                  @click="showGraph()"
                >点击查看对比图</el-button>
              </div>
            </el-col>
          </el-row>
          <!-- 教学班级列表展示 -->
          <el-table
            v-loading="classLoading"
            max-height="700"
            :data="classInfoLists"
            id="tabl-classes"
            @selection-change="handleSelectionChangeOfClasses"
          >
            <!-- 数据为空时 -->
            <template slot="empty" style="width:100%,height:800px">
              <div style="text-align:center">
                <img
                  src="../../assets/images/emptyClassOfSemester.png"
                  class
                  height="150px"
                  width="200px"
                  style="margin-top:150px"
                />
                <p style="padding-bottom:240px">请先选择要查询的课程组</p>
              </div>
            </template>
            <!-- 主内容 -->
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="教学班名称" prop="name" align="center"></el-table-column>
          </el-table>
        </div>
      </el-col>
      <!-- 右半部分布局 -->
      <el-col :span="16">
        <!-- 多个班级的对比柱状图 -->
        <el-collapse-transition>
          <div v-show="isShowCompareResult" class="right-top-container bg-gray">
            <h3 style="margin:auto;margin-bottom:20px;">多个班级综合对比数据图</h3>
            <h5 v-if="titleGroups.length==0">该课程组下无“平时”、“期中”、“期末”等相关大项，请在添加大项后再继续查看</h5>
            <el-row v-else :gutter="5">
              <!-- 下拉选择框-课程组选择 -->
              <el-col :span="15">
                <!-- 多选框（选择 计算项） -->
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  @change="handleCheckAllChange"
                >全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group
                  style="margin:auto;margin-bottom:20px;"
                  v-model="checkedTitleGroups"
                  @change="handleCheckedTitleGroupsChange"
                >
                  <!-- <el-checkbox label="平时" key="平时">平时({{titleGroupsWeightOptions[0]}}%)</el-checkbox>
                  <el-checkbox label="期中" key="期中">期中({{titleGroupsWeightOptions[1]}}%)</el-checkbox>
                  <el-checkbox label="期末" key="期末">期末({{titleGroupsWeightOptions[2]}}%)</el-checkbox>-->
                  <el-checkbox
                    v-for="titleGroup in titleGroups"
                    :label="titleGroup.name"
                    :key="titleGroup.name"
                  >{{titleGroup.name}}({{titleGroup.weight}}%)</el-checkbox>
                </el-checkbox-group>
              </el-col>
              <!-- 确定 按钮 -->
              <el-col :span="9">
                <div class="btn_content">
                  <el-button id="btn_result" type="success" round @click="reCompute">重新计算</el-button>
                </div>
              </el-col>

              <!-- 数据对比图 -->
              <compare-graph style="margin-top:100px;" :dataSet="compareResults"></compare-graph>
            </el-row>
          </div>
        </el-collapse-transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CompareGraph from './CompareGraph'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import lessonViewModel from '@/viewmodel/lesson'
import classInfosViewModel from '@/viewmodel/classinfos'
import titleGroupViewModel from '@/viewmodel/titlegroups'
import pointViewModel from '@/viewmodel/point'

import { mapGetters } from 'vuex'
export default {
  components: { CompareGraph, CollapseTransition },
  data() {
    return {
      classGroupName: '', // 选中课程组名称
      classGroups: [
        // 课程组列表数据（用于下拉框）
      ],
      classLoading: false, // 课程组数据加载的判断
      classInfoLists: [
        // 选中课程组下的班级信息（用于tab图表展示）
        // { id: 1,  name: "一班"  },
        // { id: 2,  name: "二班"  },
        // { id: 3,  name: "三班"  },
        // { id: 4,  name: "四班"  },
        // { id: 5,  name: "五班"  },
        // { id: 6,  name: "六班"  },
        // { id: 7,  name: "七班"  },
        // { id: 8,  name: "八班"  },
        // { id: 9,  name: "九班"  },
        // { id: 10, name: "十班"  },
      ],
      selectedClassIdsLists: [
        // 选中的班级列表（用于给后台传送需要查询的班级id数组）
      ],
      isShowCompareResult: false, // 是否展示右侧对比图的判断
      checkAll: false, // 是否全选
      isIndeterminate: true, // 为true表示 只选中了一部分
      checkedTitleGroups: [],
      titleGroups: [],
      // titleGroupsWeightOptions: [33.33, 33.33, 33.33], //[平时大项的权重,期中大项的权重,期末大项的权重]
      lessonId: -1,
      compareResults: []
    }
  },

  methods: {
    // 初始化页面。请求数据拿到所有课程组信息
    initPage() {
      // 获取课程组信息,
      this.fetchLessonInfo(this.user_collegeId)

      // 模拟网络请求
      // setTimeout(() => {
      //   var lessonResponse = [
      //     { id: 1, college_id: 1,  name: "C语言" },
      //     { id: 2, college_id: 1,  name: "数据结构" },
      //     { id: 3, college_id: 1,  name: "算法" },
      //     { id: 4, college_id: 1,  name: "java语言设计" },
      //     { id: 5, college_id: 1,  name: "python基础" },
      //     { id: 6, college_id: 1,  name: "软件工程" },
      //     { id: 7, college_id: 1,  name: "UML建模" },
      //     { id: 8, college_id: 1,  name: "软件测试" }
      //   ];
      //   this.classGroups = lessonResponse;
      // }, 1000);
    },
    // 下拉框，选中课程组后展示班级 (需要接入网络请求)
    selectedClassGroup(data_id) {
      this.isShowCompareResult = false
      this.classLoading = true
      this.lessonId = data_id
      this.fetchclassInfosByLessonId({ lesson_id: data_id })
      this.fetchTitleGroupInfo({ lesson_id: data_id })

      // //模拟网络请求
      // setTimeout(() => {
      //   var classResponse = [
      //     { id: 1, name: "一班" },
      //     { id: 2, name: "二班" },
      //     { id: 3, name: "三班" },
      //     { id: 4, name: "四班" },
      //     { id: 5, name: "五班" },
      //     { id: 6, name: "六班" },
      //     { id: 7, name: "七班" },
      //     { id: 8, name: "八班" },
      //     { id: 9, name: "九班" },
      //     { id: 10, name: "十班" }
      //   ];
      //   this.classInfoLists = classResponse;
      //   this.classLoading = false;
      // }, 1000);
    },
    // 监控 班级列表的多选
    handleSelectionChangeOfClasses(val) {
      this.isShowCompareResult = false
      this.selectedClassIdsLists = []
      val.forEach(item => {
        this.selectedClassIdsLists.push(item.id)
      })
      // console.log("selectedClassIdsLists:");
      // console.log(this.selectedClassIdsLists);
    },
    // “点击查看对比图”按钮点击事件 (需要接入网络请求)
    showGraph() {
      if (this.lessonId == -1) {
        this.showMessage('请先选择所要查询的课程组', 'warning')
      } else if (this.selectedClassIdsLists.length == 0) {
        this.showMessage('请至少选择一个要查看的教学班级', 'warning')
      } else {
        this.showMessage('稍等片刻，可查看右边数据图表', 'success')

        // 多个班级成绩对比图展示 逻辑

        this.isShowCompareResult = false
        if (this.titleGroups.length > 0) {
          this.checkedTitleGroups = [this.titleGroups[0].name] // 默认每次最先开始查询时，只查询 第一项
          this.fetchCompareData()
        } else {
          this.checkedTitleGroups = []
          this.isShowCompareResult = true
        }

        // 模拟网络请求，获取需要展示的数据
        // setTimeout(() => {
        //   var compareResultResponse = {
        //     //请求的对比结果的数据
        //     code: 200,
        //     message: "OK",
        //     data: [
        //       {
        //         name: "一班",
        //         people: [10, 20, 5, 40, 25], //假定一班有100个学生的话
        //         //people[0]表示0~60的学生有10人
        //         //people[1]表示60~70的学生有10人
        //         //people[2]表示70~80的学生有10人
        //         //people[3]表示80~90的学生有10人
        //         //people[4]表示90~100的学生有60人
        //         avgPonint: 85, //表示 班级平均分为85分
        //         passRate: 90 //表示 及格率为80%
        //       },
        //       {
        //         name: "二班",
        //         people: [5, 50, 5, 30, 10], //假定100个学生
        //         avgPonint: 66,
        //         passRate: 95
        //       },
        //       {
        //         name: "三班",
        //         people: [20, 5, 50, 15, 10], //假定100个学生
        //         avgPonint: 74,
        //         passRate: 80
        //       },
        //       {
        //         name: "四班",
        //         people: [0, 15, 15, 50, 20], //假定100个学生
        //         avgPonint: 80,
        //         passRate: 100
        //       }
        //     ]
        //   };
        //   this.compareResults = this.recombineResponse(
        //     compareResultResponse.data
        //   );
        //   // console.log("compareResults:");
        //   // console.log(this.compareResults);
        //   this.isShowCompareResult = true; //填充好数据后，展开右侧对比图
        // }, 1000);
      }
    },
    // 重新计算 按钮的点击事件(需要接入网络请求)
    reCompute() {
      if (this.checkedTitleGroups.length == 0) {
        this.showMessage('请至少选择一个大项进行计算', 'warning')
      } else {
        this.showMessage('稍等片刻，可查看重新计算后的数据图表', 'success')
        this.fetchCompareData()
      }
    },
    // 对请求回的班级对比数据进行重新组织，以便图表的展示
    recombineResponse(originalData) {
      var temp = [
        // temp[0]表示 饼状图的数据；temp[1]表示 柱状图的数据
        {
          source: [
            ['classes'],
            ['0~60'],
            ['60~70'],
            ['70~80'],
            ['80~90'],
            ['90~100']
          ]
        },
        {
          source: [['classes'], ['及格率'], ['平均分']]
        }
      ]
      originalData.forEach(item => {
        temp[0].source[0].push(item.name + '')
        temp[0].source[1].push(item.people[0])
        temp[0].source[2].push(item.people[1])
        temp[0].source[3].push(item.people[2])
        temp[0].source[4].push(item.people[3])
        temp[0].source[5].push(item.people[4])

        temp[1].source[0].push(item.name + '')
        temp[1].source[1].push(item.passRate)
        temp[1].source[2].push(item.avgPoint)
      })
      return temp
    },
    // 处理全选和全取消
    handleCheckAllChange(val) {
      this.checkedTitleGroups = []
      if (val) {
        this.titleGroups.forEach(item => {
          this.checkedTitleGroups.push(item.name)
        })
        this.isIndeterminate = false
      }
    },
    // 判断是否在全选或者全取消
    handleCheckedTitleGroupsChange(value) {
      console.log('value:' + value)
      const checkedCount = value.length
      var optionLength = this.titleGroups.length
      this.checkAll = checkedCount === optionLength
      this.isIndeterminate = checkedCount > 0 && checkedCount < optionLength
    },
    // 获取课程组信息(网络请求)
    fetchLessonInfo(college_id) {
      // console.log(`college_id: ${college_id}`);
      lessonViewModel.requestByCollegeId(college_id).then(response => {
        if (response !== undefined) {
          // console.log(`课程组信息为: `);
          // console.log(response);

          this.classGroups = response
        } else {
          this.showMessage('当前学校无课程组信息')
        }
      })
    },
    // 根据lesson_id查询课程信息classInfos
    fetchclassInfosByLessonId(params) {
      // console.log(`lesson_id: ${params.lesson_id}`);
      return classInfosViewModel
        .requestClassInfos(params)
        .then(response => {
          if (response !== undefined) {
            // console.log(`班级信息为: `);
            // console.log(response);
            this.classInfoLists = response
          } else {
            this.showMessage('当前课程组无教学班信息')
          }
          this.classLoading = false
        })
        .catch(reject => {
          this.showMessage('当前课程组无教学班信息')
          this.classLoading = false
          this.classInfoLists = []
        })
    },
    // 根据lesson_id查询大项信息titleGroup
    fetchTitleGroupInfo(params) {
      return titleGroupViewModel
        .requestTitleGroups(params)
        .then(response => {
          console.log('TitleGroup:')
          console.log(response)
          this.titleGroups = []
          this.checkedTitleGroups = []
          if (response !== undefined) {
            response.forEach(item => {
              if (
                item.name.indexOf('平时') != -1 ||
                item.name.indexOf('期中') != -1 ||
                item.name.indexOf('期末') != -1
              ) {
                this.titleGroups.push(item)
              }
            })
            if (this.titleGroups.length > 0) {
              console.log('第一项：' + this.titleGroups[0].name)
              this.checkedTitleGroups = [this.titleGroups[0].name]
            } else {
              this.showMessage('当前课程组无平时、期中、期末等相关大项信息')
              this.checkedTitleGroups = []
            }
          } else {
            this.showMessage('当前课程组无大项信息')
          }
        })
        .catch(reject => {
          this.showMessage('请求获取该课程组下的大项列表失败')
        })
    },
    // 根据 选中的班级列表，获取班级对比信息
    fetchCompareData() {
      console.log('requestParams:')
      console.log(this.requestParams)
      return pointViewModel
        .requestCompareData(this.requestParams)
        .then(response => {
          if (response !== undefined) {
            console.log(`班级对比信息数据为: `)
            console.log(response)
            this.compareResults = this.recombineResponse(response)
            console.log('compareResults:')
            console.log(this.compareResults)
            this.isShowCompareResult = true // 填充好数据后，展开右侧对比图
          } else {
            this.showMessage('计算结果为空，请核对请求项')
          }
          this.classLoading = false
        })
        .catch(reject => {
          this.showMessage('后台计算失败，请核对请求项')
        })
    },
    // 消息提示
    showMessage(Message, type = 'info') {
      this.$message({
        message: Message,
        type: type
      })
    }
  },
  computed: {
    ...mapGetters(['user_collegeId', 'use_manager', 'id']),
    requestParams: function() {
      return {
        lesson_id: this.lessonId,
        classInfo_ids: this.selectedClassIdsLists,
        titleGroup_names: this.checkedTitleGroups
      }
    }
  },
  created() {
    this.initPage()
  }
}
</script>


<style scoped>
/* 整题布局 */
.el-row {
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 8px;
}
.el-col {
  border-radius: 4px;
}
.left-container {
  border-radius: 4px;
  min-height: 36px;
  background-color: #f9fafc;
  padding: 20px;
  height: 760px;
}
.right-top-container {
  border-radius: 4px;
  min-height: 36px;
  background-color: #f9fafc;
  padding: 20px;
  height: 760px;
}

/* 表格 */
#tabl-classes {
  width: 100%;
  margin-top: 40px;
  height: 560px;
}
.tabl-expand {
  font-size: 0;
}
.tabl-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

/* 确定按钮 */
.btn_content {
  text-align: center;
}

/* 多选框 */
</style>
