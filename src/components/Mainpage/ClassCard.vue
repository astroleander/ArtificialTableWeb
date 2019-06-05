<!-- at-course-card 自制组件-->
<!--
  @author: Astroleander
  @date: 2018 - 10 - 31
  @description: at-card using in mainpage to showing class
  @version: 1.0.0
-->
<!--任课班级卡片操作 -->
<!--1、点击卡片 执行onClick 传入点击卡片的id -->
<!--2、onClick 从store仓库中调用数据-->
<!--3、$router.push跳转页面到成绩表与成绩分析界面 -->
<template>
  <div
    class="at-card at-card-shadow box row-frame"
    @click='onClick(dataset.id)'>
    <aside>
      <slot name="header">

        <!-- DONE: to replace with real image url -->

        <!-- TODO: to replace with real image url -->

        <img class='cover' :src='"https://picsum.photos/150/150/?image=" + dataset.id'/>
      </slot>
    </aside>
    <section class="col-frame info">
      <header>{{showProps}}</header>
      <!-- 要是嫌写的难看可以自己封装 titles 和 dataset -->
      <div class="row-frame">
        <p><span>{{titles.className}}</span>：
          <span>{{dataset.lesson_message && dataset.lesson_message.name}}</span></p>
        <p><span>{{titles.cid}}</span>：
          <span>{{dataset.cid}}</span></p>
        <p><span>{{titles.room}}</span>：
          <span>{{dataset.room}}</span></p>
        <p><span>{{titles.studentCount}}</span>：
          <span>{{dataset.student_count}}</span></p>
        <p><span>{{titles.schedule}}</span>：
          <span>{{dataset.week}}</span></p>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    // at-course-card 确实是更准确的名字，但是这里应该让类别名字和其对应的数据库表单名字尽可能的相同
    name: 'at-class-card',
    props: {
      dataset: {
        type: Object,
        default: () => {
          const defaultProp = ''
          return {
            cid: defaultProp,
            id: 0,
            name: defaultProp,
            room: defaultProp,
            semester: defaultProp,
            date: 0,
            studentCount: 0,
            teacher_id: defaultProp,
            lesson_message: {}
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ]),
      showProps: function() {
        // show loading when dataset doesnot ready yet
        return (this.dataset && this.dataset.name !== '') ? this.dataset.name : this.t_loading
      }
    },
    data() {
      return {
        titles: {
          title: '课程名称',
          cid: '课程编号',
          id: '课程编号',
          teacher: '任课教师',
          className: '课程名',
          room: '上课教室',
          semester: '学年度/学期',
          studentCount: '学生人数',
          schedule: '上课时间'
        },
        t_loading: 'loading....'
      }
    },
    methods: {
      onClick: function(id) {
        this.$store.dispatch('addCourse', { course: this.dataset })
        // console.log(this.$store.getters.course(1))
        this.$router.push({
          path: '/transcript/' + this.dataset.id
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  img.cover{
    min-width: 180px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .row-frame{
    display: flex;
    flex-direction: row;
    & > p{
      text-align: left;
      width: 40%;
    };
    .info &{
      flex-wrap: wrap;
    }
  }
  .col-frame{
    display: flex;
    flex-direction: column;
  }
  .info{
    padding: 8px;
    max-width: 1440px;
    width: 100%;
    height: 100%;
    & header{
      padding: 5px;
      font-size: 1.5em;
      font-weight: bold;
    }
  }
  .box {
    width: 90%;
    min-width: 540px;
    min-height: 180px;
    margin: 1rem;
    cursor: pointer;
  }
  p{
    padding: 4px;
    margin: 0px;
    & span {
      &:first-child{
        color: #444;
      }
      color: #666;
    }
  }
</style>
