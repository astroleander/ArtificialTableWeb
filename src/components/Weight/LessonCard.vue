<!-- 管理员通过选择课程组从而设置课程权重-->

<!--  1、groupName：权重大项
      2、一键平均按钮：dealAvg
      3、添加大项按钮：addTitleGroupItem 函数将 dialogFormVisible 变为true；
      4、修改按钮：   openDialog -->

<!--  1、v-for各个大项   title.name
      2、输入权重  绑定title.weight handleInput函数进行权重更改
      3、vue-slide-bar 组件图形化显示权重 handleInput函数进行权重更改
      4、锁定 changeLock 此时无法更改权重数值
      5、删除按钮 删除大项 delTitleGroupItem函数
      6、at-pie 自定义组件，图形化显示当前各个大项占比，来源于 AtPie from '@/components/Weight/Pie'
      7、dialogFormVisible 为true 显示 添加大项组件
         输入名称、权重，点击确认此时触发submitForm函数提交
-->

<template>

  <el-card class="box-card" shadow="hover"  v-if="dataSet">
    <div slot="header" >
      <div class="row-frame1">

        <div class="groupName">
          {{groupName}}
        </div>

        <div class="error-box">
          <el-alert v-show="isError"
                    :title="errorMsg" :type="errorType" :closable="false" show-icon>
          </el-alert>
        </div>

        <div class="button-group">
          <el-button @click="dealAvg"  :disabled="btnDisabled" type="primary" plain>一键平均</el-button>
          <!--<el-button @click="dealLeft" :disabled="btnDisabled">一键分配</el-button>-->
          <el-button @click="addTitleGroupItem" type="primary" plain>添加成绩类别</el-button>
          <!--<el-button @click="dealCancel">还原</el-button>-->
          <el-button type="primary" @click="openDialog" :disabled="modifyDisabled">确认修改</el-button>
        </div>

      </div>
    </div>

    <div class="row-frame2">
      <div  class="titles">
        <div  class="title-box"
              v-for="(title,index) in currentDataSet"
              :key="title.id"
              :idx="index">
          <div class="tag-box">
            <el-tag  >
              {{title.name}}
            </el-tag>
          </div>
          <el-input class="inputBox"
                    type="text"
                    size="small"
                    v-model="title.weight"
                    :disabled="titleDisabled[index]"
                    @change="handleInput(title.weight,index)"/>

          <div  class="slider-box">
            <vue-slide-bar v-model="title.weight"
                           :lineHeight="10"
                           :max="100"
                           :min="0"
                           :draggable="!titleDisabled[index]"
                           :is-disabled="titleDisabled[index]"
                           @input="handleInput(title.weight,index)"/>
          </div>

          <div class="lock-box" :class="{'active':titleDisabled[index]}" @click="changeLock(index)" >锁定</div>
          <el-button size="mini" type="danger" plain @click="delTitleGroupItem(title.id)">删除</el-button>
        </div>
      </div>

  <!--     <div style="width: 50%; display: flex; flex-direction: column; align-items: center">
           <el-button style="width: 50%" type="primary" plain @click="">
               重新计算学生成绩分布
             </el-button>     -->
           <at-pie class="pie-box" :dataSet="currentDataSet" :groupId="groupId"></at-pie>
   <!--    </div>   -->


      <el-dialog
              title="添加成绩类别"
              v-Drag
              :visible.sync="dialogFormVisible">
        <el-form :model="NewTitleGroup" status-icon :rules="rules" ref="ruleForm">
          <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
            <el-input v-model="NewTitleGroup.name"    placeholder="请输入名称" autocomplete="off" maxlength="10" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="权重" prop="weight" :label-width="formLabelWidth">
            <el-input  type="number" v-model.number="NewTitleGroup.weight"   placeholder="请输入权重值（0-100之间）" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>

</template>

<script>
  import VueSlideBar from 'vue-slide-bar'
  import AtPie from '@/components/Weight/Pie'
  // import pointModel from '@/viewModel/point'
  export default {
    name: 'LessonCard',
    data() {
      // 权重数据规范
      var checkWeight = (rule, value, callback) => {
        if (!value) {
          value = 0
          // return callback(new Error('权重不能为空'))
        }
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value > 100 || value < 0) {
            callback(new Error('请输入0-100之间的数字'))
          } else {
            callback()
          }
        }
      }
      // 名称规范
      var checkName = (rule, value, callback) => {
        if (value.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
          callback(new Error('成绩类别名称不可为空'))
        } else if (this.IsExistName(this.NewTitleGroup.name)) {
          callback(new Error('成绩类别名称已存在'))
        } else {
          callback()
        }
      }
      return {
        isError: true,
        errorMsg: '当前课程组无成绩类别信息',
        errorType: '',
        groupId: 0,
        currentDataSet: [],
        DataForWeightChange: [],
        modifyDisabled: true,
        btnDisabled: false,
        titleDisabled: [],
        dialogFormVisible: false,
        NewTitleGroup: {
          name: '',
          weight: null
        },
        rules: {
          name: [
            { trigger: 'blur', validator: checkName }
          ],
          weight: [
            { validator: checkWeight, trigger: 'blur' }
          ]
        },
        formLabelWidth: '120px',
        test: 0
      }
    },
    components: {
      'AtPie': AtPie,
      'VueSlideBar': VueSlideBar
      // npm install vue-slide-bar --save
    },
    // 自定义模版定义属性
    props: {
      // 名称
      groupName: {
        type: String,
        default: 'loading'
      },
      // 大项的数据集合
      dataSet: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      // 重新计算学生人数分布
      /*   getDataForweightChange() {
        pointModel.requestWeightChange(this.classInfo_id, this.currentDataSet)
          .then(response => {
            this.DataForWeightChange = response
          })
      },    */
      // 打开添加页
      addTitleGroupItem: function() {
        this.dialogFormVisible = true
        this.$refs['ruleForm'].resetFields()
      },
      // 删除大项
      delTitleGroupItem: function(titleGroup_id) {
        this.$confirm('此操作将彻底删除该成绩类别及其权重，请确认是否删除！', '提示', {
          confrimButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('notifyDel', titleGroup_id)
        })
      },
      // 计算权重总和
      weightSum: function() {
        let sum = 0
        for (let i = 0; i < this.currentDataSet.length; i++) {
          sum += this.currentDataSet[i].weight
        }
        return sum
      },
      // 计算已锁定权重信息
      weightLockInfo: function() {
        let sum = 0
        let num = 0
        for (let i = 0; i < this.currentDataSet.length; i++) {
          if (this.titleDisabled[i] === true) {
            sum += this.currentDataSet[i].weight
            num++
          }
        }
        return [sum, num]
      },
      // 计算可分配权重信息
      weightNoLockInfo: function() {
        let sum = 100
        let num = 0
        for (let i = 0; i < this.currentDataSet.length; i++) {
          if (this.titleDisabled[i] === true) {
            sum -= this.currentDataSet[i].weight
          } else {
            num++
          }
        }
        return [sum, num]
      },
      // 点击修改按钮
      openDialog() {
        this.$confirm('此操作将修改权重信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const error = 0
          /* this.currentDataSet.forEach(titleGroup => {
            if (titleGroup.weight === 0) {
              this.$message({
                type: 'error',
                message: '权重值不可为0'
              })
              error++
            }
          })*/
          if (error === 0) {
            this.$emit('notifyChanged', this.currentDataSet)
          }
        }).catch(() => {
          this.dealCancel()
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
      },
      // 改变锁定状态
      changeLock: function(id) {
        this.$set(this.titleDisabled, id, !this.titleDisabled[id])
        const weightLockInfo = this.weightLockInfo()
        // 锁定值大于等于100时，不能一键平均和一键分配
        if (weightLockInfo[0] >= 100) {
          this.btnDisabled = true
          this.$message({
            type: 'info',
            message: '锁定值大于等于100时，不能一键平均'
          })
        } else {
          this.btnDisabled = false
        }
      },
      // (1)处理非法输入，主要是非数字，空值，null，数值前的0等情况
      // (2)根据权重的改变修改状态
      handleInput: function(val, id) {
        let result = 0
        if (isNaN(parseInt(val))) {
          result = ''
        } else if (parseInt(val) < 0) {
          result = 0
        } else if (parseInt(val) > 100) {
          result = 100
        } else {
          // result = parseInt(val)
          result = parseInt(val)
        }
        const title = this.currentDataSet[id]
        title.weight = result
        title.value = result
        this.$set(this.currentDataSet, id, title)
        this.dealAlert()
      },
      dealCancel: function() {
        this.dealDataSet()
      },
      // 判断名称是否存在
      IsExistName: function(name) {
        for (let i = 0; i < this.currentDataSet.length; i++) {
          if (this.currentDataSet[i].name === name) {
            return true
          }
        }
        return false
      },
      // 添加大项
      submitForm: function(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
            this.$emit('notifyAdd', this.NewTitleGroup)
          } else {
            return false
          }
        })
      },
      // 平均分配总权重
      dealAvg: function() {
        const DataSet = this.currentDataSet
        const weightInfo = this.weightNoLockInfo()
        const sum = weightInfo[0]
        const num = weightInfo[1]
        let space = sum % num
        const avg = (sum - space) / num
        // console.log('space = ' + space)
        // console.log('avg = ' + avg)
        for (let i = 0; i < DataSet.length; i++) {
          if (this.titleDisabled[i] !== true) {
            if (space === 0) {
              DataSet[i].weight = avg
            } else {
              DataSet[i].weight = avg + 1
              space--
            }
          }
        }
      },
      // 一键分配剩余
      dealLeft: function() {
        const newDataSet = this.currentDataSet
        if (this.weightSum() < 100 && this.weightSum() >= 0) {
          let space = 100 - this.weightSum()
          const copySpace = space
          while (space > 0) {
            let i = 0
            for (; i < newDataSet.length; i++) {
              if (space === 0) break
              if (this.titleDisabled[i] !== true && newDataSet[i].weight < 100) {
                newDataSet[i].weight++
                newDataSet[i].value++
                space--
              }
            }
            if (space === copySpace) break
          }
        } else if (this.weightSum() > 100) {
          let space = this.weightSum() - 100
          const copySpace = space
          while (space > 0) {
            let i = 0
            for (; i < newDataSet.length; i++) {
              if (space === 0) break
              if (this.titleDisabled[i] !== true && newDataSet[i].weight > 0) {
                newDataSet[i].weight--
                newDataSet[i].value--
                space--
              }
            }
            if (space === copySpace) break
          }
        }
        for (let i = 0; i < newDataSet.length; i++) {
          this.$set(this.currentDataSet, i, newDataSet[i])
        }
      },
      // 数据预处理 初始化锁
      initLocks: function() {
        for (let i = 0; i < this.dataSet.length; i++) {
          if (this.dataSet[i].name === '加分' || this.dataSet[i].name === '分组') {
            this.titleDisabled[i] = true
          } else {
            this.titleDisabled[i] = false
          }
        }
      },
      // 处理变化的数据集
      dealDataSet: function() {
        if (this.currentDataSet.length > 0) this.currentDataSet = []
        for (let i = 0; i < this.dataSet.length; i++) {
          this.currentDataSet.push({
            id: this.dataSet[i].id,
            name: this.dataSet[i].name,
            lesson_id: this.dataSet[i].lesson_id,
            weight: this.dataSet[i].weight,
            value: this.dataSet[i].weight
          })
        }
        this.dealAlert()
      },
      // 处理提示信息
      dealAlert: function() {
        if (this.currentDataSet.length === 0) {
          this.modifyDisabled = false
          this.isError = true
          this.errorType = ''
          this.errorMsg = '当前课程组下无成绩类别信息'
        } else {
          if (this.weightSum() === 100) {
            this.modifyDisabled = false
            this.isError = false
          } else if (this.weightSum() < 100) {
            this.modifyDisabled = true
            this.isError = true
            this.errorType = 'error'
            this.errorMsg = '权重之和不足100'
          } else if (this.weightSum() > 100) {
            this.modifyDisabled = true
            this.isError = true
            this.errorType = 'error'
            this.errorMsg = '权重之和超过100'
          }
        }
      }
    },
    directives: {
      Drag: {
        bind(el, binding, vnode, oldVnode) {
          // 弹框可拉伸最小宽高
          const minWidth = 400
          const minHeight = 300
          // 初始非全屏
          let isFullScreen = false
          // 当前宽高
          let nowWidth = 0
          let nowHight = 0
          // 当前顶部高度
          let nowMarginTop = 0
          // 获取弹框头部（这部分可双击全屏）
          const dialogHeaderEl = el.querySelector('.el-dialog__header')
          // 弹窗

          const dragDom = el.querySelector('.el-dialog')

          // 给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；

          dragDom.style.overflow = 'auto'

          // 清除选择头部文字效果

          // dialogHeaderEl.onselectstart = new Function("return false");

          // 头部加上可拖动cursor

          dialogHeaderEl.style.cursor = 'move'

          // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);

          const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

          const moveDown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离

            const disX = e.clientX - dialogHeaderEl.offsetLeft

            const disY = e.clientY - dialogHeaderEl.offsetTop

            // 获取到的值带px 正则匹配替换

            let styL, styT

            // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px

            if (sty.left.includes('%')) {
              styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)

              styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
            } else {
              styL = +sty.left.replace(/\px/g, '')

              styT = +sty.top.replace(/\px/g, '')
            }
  
            document.onmousemove = function(e) {
              // 通过事件委托，计算移动的距离

              const l = e.clientX - disX

              const t = e.clientY - disY

              // 移动当前元素

              dragDom.style.left = `${l + styL}px`

              dragDom.style.top = `${t + styT}px`

              // 将此时的位置传出去

              // binding.value({x:e.pageX,y:e.pageY})
            }

            document.onmouseup = function(e) {
              document.onmousemove = null

              document.onmouseup = null
            }
          }

          dialogHeaderEl.onmousedown = moveDown

          // 双击头部全屏效果

          dialogHeaderEl.ondblclick = (e) => {
            if (isFullScreen === false) {
              nowHight = dragDom.clientHeight

              nowWidth = dragDom.clientWidth

              nowMarginTop = dragDom.style.marginTop

              dragDom.style.left = 0

              dragDom.style.top = 0

              dragDom.style.height = '100VH'

              dragDom.style.width = '100VW'

              dragDom.style.marginTop = 0

              isFullScreen = true

              dialogHeaderEl.style.cursor = 'initial'

              dialogHeaderEl.onmousedown = null
            } else {
              dragDom.style.height = 'auto'

              dragDom.style.width = nowWidth + 'px'

              dragDom.style.marginTop = nowMarginTop

              isFullScreen = false

              dialogHeaderEl.style.cursor = 'move'

              dialogHeaderEl.onmousedown = moveDown
            }
          }

          dragDom.onmousemove = function(e) {
            const moveE = e

            if (e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 || dragDom.offsetLeft + 10 > e.clientX) {
              dragDom.style.cursor = 'w-resize'
            } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) {
              dragDom.style.cursor = 's-resize'
            } else {
              dragDom.style.cursor = 'default'

              dragDom.onmousedown = null
            }

            dragDom.onmousedown = (e) => {
              const clientX = e.clientX

              const clientY = e.clientY

              const elW = dragDom.clientWidth

              const elH = dragDom.clientHeight

              const EloffsetLeft = dragDom.offsetLeft

              const EloffsetTop = dragDom.offsetTop

              dragDom.style.userSelect = 'none'

              const ELscrollTop = el.scrollTop

              // 判断点击的位置是不是为头部

              if (clientX > EloffsetLeft && clientX < EloffsetLeft + elW && clientY > EloffsetTop && clientY < EloffsetTop + 100) {

                // 如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;

              } else {
                document.onmousemove = function(e) {
                  e.preventDefault() // 移动时禁用默认事件

                  // 左侧鼠标拖拽位置

                  if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
                    // 往左拖拽

                    if (clientX > e.clientX) {
                      dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px'
                    }

                    // 往右拖拽

                    if (clientX < e.clientX) {
                      if (dragDom.clientWidth > minWidth) {
                        dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px'
                      }
                    }
                  }

                  // 右侧鼠标拖拽位置

                  if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
                    // 往左拖拽

                    if (clientX > e.clientX) {
                      if (dragDom.clientWidth > minWidth) {
                        dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px'
                      }
                    }

                    // 往右拖拽

                    if (clientX < e.clientX) {
                      dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px'
                    }
                  }

                  // 底部鼠标拖拽位置

                  if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {
                    // 往上拖拽

                    if (clientY > e.clientY) {
                      if (dragDom.clientHeight > minHeight) {
                        dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px'
                      }
                    }

                    // 往下拖拽

                    if (clientY < e.clientY) {
                      dragDom.style.height = elH + (e.clientY - clientY) * 2 + 'px'
                    }
                  }
                }

                // 拉伸结束

                document.onmouseup = function(e) {
                  document.onmousemove = null

                  document.onmouseup = null
                }
              }
            }
          }
        }
      }
    },
    watch: {
      dataSet: function(val) {
        this.initLocks()
        this.btnDisabled = false
        this.dealDataSet()
      }
    },
    created() {
      this.dealAlert()
      this.initLocks()
      this.dealDataSet()
    },
    updated() {
      this.dealAlert()
    }
  }
</script>

<style lang="scss" scoped>
  $grey: #999;
  $black: #212121;
  $white: #FFF;
  .column-frame{
    display: flex;
    flex-direction: column;
  }
  .row-frame1{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .row-frame2{
    display: flex;
    flex-direction: row;
  }
  .error-box{
    width: 400px;
    /*border:1px solid #999999;*/
  }
  .titles{
    padding-bottom: 20px;
    margin-left: 10%;
    width: 50%;
  }

  .box-card {
    width: 100%;
    min-width: 800px;
    margin: 5px 0;
  }

  .title-box{
    display: flex;
    align-items:baseline;
    /*margin: 5px;*/
    /*border: 1px solid #999;*/
  }
  .tag-box{
    width: 10%;
    min-width: 100px;
  }
  .slider-box{
    width: 70%;
    /*min-width: 300px;*/
    margin-left: 20px;
    /*border: 1px solid #999;*/
  }
  .lock-box{
    width: 15%;
    color: lightgrey;
    padding: 10px;
    &.active{
      color: #00B2EE;
    }
    /*border: 1px solid #999999;*/
  }
  .inputBox{
    /*width: 15%;*/
    width: 100px;
    margin-left: 5px;
    /*border: 1px solid #999;*/
  }
  .pie-box{
    width: 100%;
    height: 300px;
    /*border: 1px solid #CCCCCC;*/
  }
  .groupName{
    width: 200px;
    padding: 5px;
    font-size: larger;
  }

</style>

