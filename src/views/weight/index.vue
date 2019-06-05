<!-- Tree Structure of Weight Setting -->
<!--
div(head)
    |- text area
    |   |- list
    |       |- grouptitle
    |       |- grouptitle weight-text-fill-field
    |       |- item-type-general
    |       |   |- draggable scrollbar
    |       |- item-type-examine
    |       |   |-  title weight-text-fill-field
    |       |- submit button
    |- charts area
        |- main pie(grouptitle pie)
        |- group pies
-->
<!--  权重设置界面   -->

<!--  create 生命周期开始，判断用户身份 初始数据信息加载
      1、管理员 根据college_id获取该学校课程组信息Lesson
      2、普通教师 根据 teacher_id获取该教师的教学班ClassInfo
      3、返回信息存储到selectData 中    -->

<!--  界面设置与过程操作 -->
<!--  1、选择设置权重的课程 选择后触发函数 selectedCourse  -->
<!--     selectedCourse 判断当前用户身份
         （1）管理员 根据lesson_id获取该课程组的大项信息titleGroup
         （2）普通教师 根据classInfo_id 获取该课程的所有小项信息   -->
<!--  2、 权重设置
        （1）管理员 at-lesson-card 自定义组件 AtLessonCard from @/components/Weight/LessonCard
             handleBigChanged    修改大项
             handleAddTitleGroup 添加大项
             handleDelTitleGroup 删除大项
        （2）普通教师 at-titlegroup-card 自定义组件  AtTitlegroupCard from '@/components/Weight/TitlegroupCard'
             handleTitleChanged  修改小项
             handleAddTitle      增加小项
             handelDelTitle      删除小项          -->

<template>
  <div class="frame">
    <!--选择-->
    <div class="select-box">

      <el-select v-model="value" :placeholder="selectText" @change="selectedCourse">
        <el-option
          v-for="(item,index) in selectData"
          :key="item.id"
          :label="item.name"
          :value="index">
        </el-option>
      </el-select>
    </div>
    <!-- 判断当前是否由任课信息-->
    <div v-if="empty" class="loading-box">
      <p >{{Message}}</p>
    </div>

    <div v-if="!empty">
      <div v-if="this.use_manager">
        <!--自定义组件-->
        <at-lesson-card
          groupName="权重大项"
          :dataSet="titleGroups"
          @notifyChanged="handleBigChanged"
          @notifyAdd="handleAddTitleGroup"
          @notifyDel="handleDelTitleGroup">
        </at-lesson-card>
      </div>
      <div v-else>
        <at-titlegroup-card class="title4_box"
                            v-for="(item, index) in titleGroupsInfo"
                            :key="index"
                            :groupName="item.name"
                            :dataSet="titles[item.id]"
                            :groupId="item.id"
                            @notifyChanged="handleTitleChanged"
                            @notifyAdd="handleAddTitle"
                            @notifyDel="handelDelTitle">
        </at-titlegroup-card>
      </div>
    </div>
  </div>
</template>


<script>
  import lessonViewModel from '@/viewmodel/lesson'
  import titleViewModel from '@/viewmodel/title'
  import titleGroupViewModel from '@/viewmodel/titlegroups'
  import classInfoModel from '@/viewmodel/classinfos'
  import AtTitlegroupCard from '@/components/Weight/TitlegroupCard'
  import AtLessonCard from '@/components/Weight/LessonCard'
  import { mapGetters } from 'vuex'
  export default {
    components: { AtTitlegroupCard, AtLessonCard },
    data() {
      return {
        selectData: [], // 课程组列表/教学班列表
        titleGroups: [], // 某一课程组的大类列表（管理员状态下）
        titleGroupsInfo: [], // 某一课程组的大类列表（教师状态下），可能存在某一教学班的大项下无小项的情况
        titles: {}, // 某一课程的全部小类
        value: '', // 选择列表的值
        empty: true, // 页面显示控制
        selectText: '', // 选择列表的placeholder
        Message: '',

        // handle: '管理员',

        select: [{
          id: 1,
          name: '教师',
          value: false
        }, {
          id: 2,
          name: '管理员',
          value: true
        }]
      }
    },
    methods: {
      // 下拉列表数据
      buildSelectData: function(data) {
        // 获取课程组信息存储到selectData中
        this.selectData = data
      },
      // 管理员/教师 大类列表(角色判断)
      buildTitleGroup: function(titlegroups) {
        if (this.use_manager) {
          this.titleGroups = titlegroups // (管理员)
        } else {
          this.titleGroupsInfo = titlegroups // 教师
          if (titlegroups.length === 0) {
            this.$message({
              message: '当前教学班所在的课程组无大项信息',
              type: 'info'
            })
            this.Message = '当前教学班所在的课程组无大项信息'
          } else {
            this.empty = false
          }
        }
      },
      // 教师某一教学班的所有小项（按照titleGroup_id分类）
      buildTitles: function(titles) {
        this.titleGroups = []
        this.titles = {}
        for (const title of titles) {
          if (!this.titles[title.titleGroup_id]) {
            this.$set(this.titles, title.titleGroup_id, [title])
          } else {
            this.titles[title.titleGroup_id].push(title)
          }
        }
      },
      // 小项数据修改(教师)
      handleTitleChanged: function(idx, newDataSet) {
        titleViewModel
          .requestPutTitles(newDataSet).then(response => {
            this.getTitle()
            // this.$set(this.titles, idx, newDataSet)
            this.$message({
              message: '修改小项成功',
              type: 'success'
            })
          })
      },
      // 大项数据修改（管理员）
      handleBigChanged: function(newDataSet) {
        titleGroupViewModel
          .requestPutTitleGroups(newDataSet).then(response => {
            this.getTitleGroup()
            this.$message({
              message: '修改大项成功',
              type: 'success'
            })
          })
      },
      // 添加一条大项记录（管理员）
      handleAddTitleGroup: function(NewTitleGroup) {
        const TitleGroup = {
          name: NewTitleGroup.name,
          lesson_id: this.selectData[this.value].id,
          weight: NewTitleGroup.weight
        }
        titleGroupViewModel
          .requestPostTitleGroup(TitleGroup).then(response => {
            this.getTitleGroup()
            // TitleGroup.id = response[0].id
            // if (!this.titleGroups) { // 若该大项数组下没有大项
            //   this.$set(this.titleGroups, 0, [TitleGroup])
            // } else {
            //   this.titleGroups.push(TitleGroup)
            // }
            this.$message({
              message: '添加大项成功',
              type: 'success'
            })
          })
      },
      // 删除一条大项记录 （管理员）
      handleDelTitleGroup: function(titleGroup_id) {
        titleViewModel.requestTitles({ titleGroup_id: titleGroup_id })
          .then(titles => {
            if (titles) {
            // 若该大项下有小项，不能删除
              this.$message({
                message: '该大项下有小项信息，无法删除',
                type: 'warning'
              })
            } else {
              titleGroupViewModel.requestDelTitleGroup(titleGroup_id)
                .then(reponse => {
                  this.getTitleGroup()
                  this.$message({
                    message: '删除大项成功',
                    type: 'success'
                  })
                })
            }
          }).catch(reject => {
            console.log(reject)
          })
      },
      // 添加一条小项记录（教师）
      handleAddTitle: function(NewTitle, titleGroup_id) {
        // console.log('NewTitle' + NewTitle.name + ' ' + NewTitle.weight)
        // console.log('titleGroup_id' + titleGroup_id)
        const Title = {
          name: NewTitle.name,
          weight: NewTitle.weight,
          titleGroup_id: titleGroup_id,
          classInfo_id: this.selectData[this.value].id
        }
        titleViewModel
          .requestPostTitle(Title).then(response => {
            this.getTitle()
            // Title.id = response[0].id
            // if (!this.titles[titleGroup_id]) { // 若该大项下没有小项
            //   this.$set(this.titles, titleGroup_id, [Title])
            // } else {
            //   this.titles[titleGroup_id].push(Title)
            // }
            this.$message({
              message: '添加小项成功',
              type: 'success'
            })
          })
      },
      // 删除小项
      handelDelTitle(title_id) {
        titleViewModel.requestDelTitle(title_id)
          .then(reponse => {
            this.getTitle()
            this.$message({
              message: '删除小项成功',
              type: 'success'
            })
          }).catch(reject => {
            console.log(reject)
          })
      },
      // 根据college_id获取该学校课程组信息Lesson（管理员）
      fetchLessonData(college_id) {
        console.log('123456789')
        console.log(this.use_manager)
        lessonViewModel
          .requestByCollegeId(college_id)
          .then(response => {
            if (response !== undefined) {
              this.buildSelectData(response)
            } else {
              this.$message({
                message: '当前学校无课程组信息',
                type: 'info'
              })
              this.Message = '当前学校无课程组信息'
            }
          })
      },
      // 根据lesson_id获取该课程组的大项信息titleGroup（管理员）
      fetchTitleGroup(data_id) {
        // console.log('lesson_id = ' + data_id)
        titleGroupViewModel
          .requestByLessonId(data_id)
          .then(response => {
            if (response !== undefined) {
              this.buildTitleGroup(response)
            }
          })
      },
      // 根据 teacher_id获取该教师的教学班ClassInfo（教师）
      fetchClassInfoData(teacher_id) {
        console.log('987654321')
        console.log(this.use_manager)
        console.log(this.handle)
        console.log(this.use_manager)
        classInfoModel
          .requestByTeacherId(teacher_id)
          .then(response => {
            if (response !== undefined) {
              this.buildSelectData(response)
            } else {
              this.$message({
                message: '当前教师无课程信息',
                type: 'info'
              })
              this.Message = '当前教师无课程信息'
            }
          })
      },
      // 根据classInfo_id 获取该课程的所有小项信息（教师）
      fetchTitlesData(cid) {
        titleViewModel
          .requestTitles({
            classInfo_id: cid
          })
          .then(response => {
            this.buildTitles(response)
          })
      },
      init() {
        this.titles = {}
        this.titleGroups = []
        this.titleGroupsInfo = []
      },
      // 小项新建或者修改后重新获取
      getTitle() {
        this.init()
        this.fetchTitleGroup(this.selectData[this.value].lesson_id)// 当前角色是教师
        this.fetchTitlesData(this.selectData[this.value].id)
      },
      // 大项新建或者修改后重新获取
      getTitleGroup() {
        this.init()
        this.fetchTitleGroup(this.selectData[this.value].id)
      },
      // 列表选中值改变时  (角色判断)
      selectedCourse: function(index) {
        // 初始化数据
        this.init()
        // console.log(index)
        // 开启管理员权限时
        if (this.use_manager) {
          // console.log('课程组id = ' + this.selectData[index].id)
          this.fetchTitleGroup(this.selectData[index].id) // 当前角色是管理员
          this.empty = false
        } else {
          // console.log('班级id = ' + this.selectData[index].id)
          this.fetchTitleGroup(this.selectData[index].lesson_id)// 当前角色是教师
          this.fetchTitlesData(this.selectData[index].id) // 当前角色是教师
        }
      },
      initWeight() {
        this.value = ''
        this.selectData = []
        this.empty = true
      },
      onSwitchChange(newValue) {
        this.$store.dispatch('setUseManager', newValue)
      }
    },
    computed: {
      ...mapGetters([
        'user_collegeId',
        'use_manager',
        'id'
      ])
    },
    watch: {
      use_manager: function() {
        if (this.use_manager) {
          this.init()
          this.selectText = '请选择课程组'
          this.Message = '请选择调整的课程组'
          this.fetchLessonData(this.user_collegeId)
        } else {
          this.selectText = '请选择教学班'
          this.Message = '请选择调整的教学班'
          this.fetchClassInfoData(this.id)
        }
      }
    },
    // (角色判断) 初始加载数据
    created() {
      // 当前角色是管理员
      if (this.use_manager) {
        this.initWeight()
        this.init()
        this.selectText = '请选择课程组'
        this.Message = '请选择调整的课程组'
        // 由院系ID获取课程组信息
        this.fetchLessonData(this.user_collegeId)
      } else { // 当前角色是教师
        this.initWeight()
        this.init()
        this.selectText = '请选择教学班'
        this.Message = '请选择调整的教学班'
        this.fetchClassInfoData(this.id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  $grey: #999;
  $black: #212121;
  $white: #FFF;
  .frame{
    display: flex;
    flex-direction: column;
  }
  .switch{
    display: flex;
    padding-left: 10px;
    align-items: center;
    background: white;
    height: 40px;
  }
  .select-box{
    display: flex;
    padding-left: 10px;
    align-items: center;
    background: white;
    height: 60px;
    /*border: 1px solid #CCCCCC;*/
  }
  .primary-card{
    background-color: #d3dce6;
    z-index: -100;
  }

  .loading-box{
    display: flex;
    height: 400px;
    background: white;
    margin-top: 1px;
    font-size: 20px;
    font-weight: bold;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    color: #999999;
    /*border: 1px solid #CCCCCC;*/
    align-items: center;
    justify-content: center;
  }

</style>
