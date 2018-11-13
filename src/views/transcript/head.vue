<!-- Head Tree structure  -->
<!--
div(head)
    |- TODO: cardtitle
    |- TODO: content
        |- TODO: infos dashboard
        |- TODO: analysis
-->

<template>
  <header class="at-card at-card-shadow header">
    <section class="row-frame">
     <!-- 要是嫌写的难看可以自己封装 titles 和 dataset -->
     <div class="row-frame info">
        <p class="info-item"><span>{{titles.id}}</span>：
          <span>{{info.id}}</span></p>
        <p class="info-item"><span>{{titles.className}}</span>：
          <span>{{info.name}}</span></p>
        <p class="info-item"><span>{{titles.cid}}</span>：
          <span>{{info.cid}}</span></p>
        <p class="info-item"><span>{{titles.teacher}}</span>：
          <span>{{info.teacher_id}}</span></p>
        <p class="info-item"><span>{{titles.room}}</span>：
          <span>{{info.room}}</span></p>
        <p class="info-item"><span>{{titles.semester}}</span>：
          <span>{{info.year}}-{{info.month}}</span></p>
        <p class="info-item"><span>{{titles.studentCount}}</span>：
          <span>{{info.studentCount}}</span></p>
        <p class="info-item"><span>{{titles.schedule}}</span>：
          <span>{{info.schedule}}</span></p>
      </div>
      <img class='cover' src="https://via.placeholder.com/200"/>
    </section>

  </header>
</template>

<script>
export default {
  name: 'transcriptHead',
  components: {},
  props: ['info'],
  data() {
    return {
      loading: true,
      titles: {
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
    width: 30%
  }
  .info {
    padding: 24px;
  }
}
</style>
