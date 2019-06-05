<!-- 显示学生信息模版 -->
<template>
  <el-dialog
    id="student-card"
    :visible.sync="visible"
    :before-close="onDialogClose">
    <template slot="title">
      <section class="avatar-wrapper">
        <img class="avatar" src="https://picsum.photos/300/300/?random"/>
        <p class="at-text-primary">{{this.student.name}}</p>
      </section>
    </template>
    <slot>
      <section class="info">
        <p class="text-container">
          <span class="at-text-secondary title">姓 名</span>
          <span class="at-text-secondary content">{{this.student.name}}</span>
        </p>
        <p class="text-container">
          <span class="at-text-secondary title">学 号</span>
          <span class="at-text-secondary content">{{this.student.sid}}</span>
        </p>
        <p class="text-container">
          <span class="at-text-secondary title">入学年份</span>
          <span class="at-text-secondary content">{{this.student.year}}</span>
        </p>
      </section>
      <section class="info">
        <p class="text-container">
          <span class="at-text-secondary title">专 业</span>
          <span class="at-text-secondary content">{{readMajor}}</span>
        </p>
      </section>
    </slot>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible', 'student'],
  components: {
    avatar: () => import('@/components/Avatar')
  },
  computed: {
    readMajor: function() {
      return this.student && this.student.major_message && this.student.major_message.name
    }
  },
  methods: {
    onDialogClose: function() {
      this.$emit('onDialogClose', false)
    }
  }
}
</script>

<style lang="scss">
$white: #eee;
$white: #eee;
$grey: #ccc;
$black: #2d2d2d;
#student-card .el-dialog {
  width: 250px;
  display: block;
  background: #4caf50;
  .el-dialog__headerbtn .el-dialog__close {
    color: $white;
  }
  .el-dialog__body {
    padding: 0px;
    background: $grey;
  }
  .info {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: flex-start;
    flex-direction: column;
    .text-container {
      margin: 0;
      padding: 4px;
      background: $white;
    }
    &:last-child {
      margin-top: 4px;
      margin-bottom: 0px;
    }
  }
  .avatar-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: flex-start;
    flex-direction: column;
    padding-top: 0.5em;
    align-content: center;
    align-items: center;
  }
  .avatar {
    border-radius: 50%;
    box-shadow: 0px 0px 0px 2px $white, 4px 4px 30px 6px #2e7d32;
    // outline: 11px #212121;
    width: 120px;
    height: 120px;
    & ~ .at-text-primary {
      margin-top: 12px;
    }
  }

  .at-text-primary,
  .at-text-secondary {
    text-align: center;
  }
  .at-text-primary {
    font-size: 24px;
    margin: 3px;
    margin-top: 10px;
    color: $white;
  }
  .at-text-secondary {
    margin: 3px;
  }
  .text-container {
    display: inline-flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
}
</style>
