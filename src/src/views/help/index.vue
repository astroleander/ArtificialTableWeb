<template>
<div>
    <div class="help" style="background-color: white">
      <el-collapse >
        <el-collapse-item title="主界面" style="margin-left: 10px">
          <span>可查看任课班级信息列表，可通过选择相应学期进行筛选</span>
        </el-collapse-item>
        <el-collapse-item title="成绩比较"style="margin-left: 10px">
          <span>选择相应学期，可查看筛选后的班级及格情况</span>
        </el-collapse-item>
        <el-collapse-item title="权重设置"style="margin-left: 10px">
          <span>管理员选择课程组设置成绩大项权重，教师选择相应班级设置成绩小项权重</span>
        </el-collapse-item>
        <el-collapse-item title="课程分析"style="margin-left: 10px">
          <span>选择相应学期查看各项英语测试对提高学位英语成绩的贡献</span>
        </el-collapse-item>
        <el-collapse-item title="导入成绩"style="margin-left: 10px">
          <span>导入学生成绩</span>
        </el-collapse-item>
      </el-collapse>
    </div>
</div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        mainpage: '',
        comparison: '',
        weight: '',
        analyse: '',
        input: '',
        teacher: '',
        lesson: '',
        student: '',
        class: ''
        // 继续加
      }
    },
    computed: {
    },
    created() {
      if (this.is_manager) {
        this.mainpage = '可查看任课班级信息列表，可通过选择相应学期进行筛选'
        this.comparison = '选择相应学期，可查看筛选后的班级及格情况'
        this.weight = '管理员选择课程组设置成绩大项权重，教师选择相应班级设置成绩小项权重'
        this.analyse = '选择相应学期查看各项英语测试对提高学位英语成绩的贡献'
        this.input = '导入学生成绩'
      }
    }
  }
</script>

<style scoped>
  .help{

  }
  .el-scrollbar__wrap {
    height: 100%;
  }

</style>
