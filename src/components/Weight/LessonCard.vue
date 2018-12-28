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
          <el-button @click="dealAvg"  :disabled="btnDisabled">一键平均</el-button>
          <!--<el-button @click="dealLeft" :disabled="btnDisabled">一键分配</el-button>-->
          <el-button @click="addLessonItem">添加大项</el-button>
          <!--<el-button @click="dealCancel">还原</el-button>-->
          <el-button type="primary" @click="openDialog" :disabled="modifyDisabled">修改</el-button>
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
                    :maxlength="3"
                    :disabled="titleDisabled[index]"
                    @change="handleInput(title.weight,index)"/>
          <div  class="slider-box">
            <vue-slide-bar v-model="title.weight"
                           :lineHeight="10"
                           :min="0"
                           :max="100"
                           :draggable="!titleDisabled[index]"
                           :is-disabled="titleDisabled[index]"
                           @input="handleInput(title.weight,index)"/>
          </div>
          <div class="lock-box" :class="{'active':titleDisabled[index]}" @click="changeLock(index)" >锁定</div>
        </div>
      </div>
      <at-pie class="pie-box" :dataSet="currentDataSet" :groupId="groupId"></at-pie>
      <el-dialog title="添加大项" :visible.sync="dialogFormVisible">
        <el-form :model="NewTitleGroup" status-icon :rules="rules" ref="ruleForm">
          <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
            <el-input v-model="NewTitleGroup.name"    placeholder="请输入名称" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权重" prop="weight" :label-width="formLabelWidth">
            <el-input  v-model.number="NewTitleGroup.weight"   placeholder="请输入权重值（0-100之间）" ></el-input>
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
  export default {
    name: 'LessonCard',
    data() {
      var checkWeight = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('权重不能为空'))
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
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('大项名称不能为空'))
        }
        if (this.IsExistName(this.NewTitleGroup.name)) {
          callback(new Error('大项名称已存在'))
        } else {
          callback()
        }
      }
      return {
        isError: true,
        errorMsg: '当前课程组无大项信息',
        errorType: '',
        groupId: 0,
        currentDataSet: [],
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
            { validator: checkName, trigger: 'blur' }
          ],
          weight: [
            { validator: checkWeight, trigger: 'blur' }
          ]
        },
        formLabelWidth: '120px'
      }
    },
    components: {
      'AtPie': AtPie,
      'VueSlideBar': VueSlideBar
      // npm install vue-slide-bar --save
    },
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
      // 打开添加页
      addLessonItem: function() {
        this.dialogFormVisible = true
        this.$refs['ruleForm'].resetFields()
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
          this.$emit('notifyChanged', this.currentDataSet)
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
          result = 0
        } else if (parseInt(val) < 0) {
          result = 0
        } else if (parseInt(val) > 100) {
          result = 100
        } else {
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
        for (let i = 0; i < this.currentDataSet.length; i++) {
          this.titleDisabled[i] = false
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
          this.errorMsg = '当前课程组下无大项信息'
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
    watch: {
      dataSet: function(val) {
        // console.log('this.dataSet watch = ' + this.dataSet)
        // console.log('this.dataSet watch = ' + this.dataSet.length)
        this.initLocks()
        this.btnDisabled = false
        this.dealDataSet()
      }
    },
    created() {
      // console.log('this.dataSet created = ' + this.dataSet)
      // console.log('this.dataSet created = ' + this.dataSet.length)
      this.dealAlert()
      this.initLocks()
      this.dealDataSet()
    },
    updated() {
      // console.log('this.dataSet updated = ' + this.dataSet)
      // console.log('this.dataSet updated = ' + this.dataSet.length)
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
    margin: 10px 0;
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
    width: 80px;
    margin-left: 5px;
    /*border: 1px solid #999;*/
  }
  .pie-box{
    width: 40%;
    /*border: 1px solid #CCCCCC;*/
  }
  .groupName{
    width: 100px;
    padding: 5px;
    font-size: larger;
  }

</style>

