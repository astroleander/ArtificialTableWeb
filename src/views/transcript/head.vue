<!-- Head Tree structure  -->
<!--
div(head)
    |- DONE: cardtitle
    |- DONE: content
        |- DONE: infos dashboard
        |- DONE: analysis
-->
<!-- 任课卡片信息 -->
<template>
  <header class="at-card at-card-shadow header">
    <section class="row-frame">
     <!-- 要是嫌写的难看可以自己封装 head_titles 和 info -->
     <div class="row-frame info">
        <p class="info-item"><span class="info-title">{{head_titles.className}}</span>：
          <span>{{info.name}}</span></p>
        <p class="info-item"><span class="info-title">{{head_titles.cid}}</span>：
          <span>{{info.cid}}</span></p>
        <p class="info-item"><span class="info-title">{{head_titles.teacher}}</span>：
          <span>{{info.teacher_id}}</span></p>
        <p class="info-item"><span class="info-title">{{head_titles.semester}}</span>：
          <span>{{info.year}}</span></p>
        <p class="info-item"><span class="info-title">{{head_titles.studentCount}}</span>：
          <span>{{info.studentCount}}</span></p>
        <p class="info-item"><span class="info-title">{{head_titles.schedule}}</span>：
          <span>{{info.schedule}}</span></p>
        <p class="info-item"><span class="info-title">{{head_titles.room}}</span>：
          <span>{{info.room}}</span></p>
      </div>
      <img class='cover' src="https://via.placeholder.com/120"/>
    </section>

  </header>
</template>

<script>
export default {
  name: 'transcriptHead',
  components: {},
  props: ['info', 'titles', 'table'],
  data() {
    return {
      // 任课班级卡片所有显示信息
      loading: true,
      head_titles: {
        title: '课程名称',
        cid: '课程代码',
        id: '课程编号',
        teacher: '任课教师',
        className: '课程名',
        room: '上课教室',
        semester: '学年度/学期',
        studentCount: '学生人数',
        schedule: '上课时间'
      }
    // head_statistics: [
      // { '平均成绩': comp}
    // ]
    }
  },
  computed: {},
  methods: {},
  created() {

  }
}
</script>

<style lang="scss" scoped>
.row-frame{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  flex-grow: 1;
  align-content: flex-start;
  .row-frame {
    flex-wrap: wrap;
    justify-self: flex-start;
    justify-content: flex-start;
  }
  .info-item {
    width: 30%;
    margin: 6px;
    & .info-title {
      font-weight: bold;
    }
  }
  .info {
    padding: 24px;
  }
}
</style>
