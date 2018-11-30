<!-- at-course-card -->
<!--
  @author: Astroleander
  @date: 2018 - 10 - 31
  @description: at-card using in mainpage to showing class
  @version: 1.0.0
-->
<template>
  <div
    class="at-card at-card-shadow box row-frame"
    @click='onClick(dataset.id)'>
    <aside>
      <slot name="header">
        <!-- TODO: to replace with real image url -->
       <img class='cover' src="https://via.placeholder.com/150"/>
      </slot>
    </aside>
    <section class="col-frame info">
     <header>{{showProps}}</header>
     <!-- 要是嫌写的难看可以自己封装 titles 和 dataset -->
     <div class="row-frame">
        <p><span>{{titles.className}}</span>：
          <span>{{dataset.name}}</span></p>
        <p><span>{{titles.cid}}</span>：
          <span>{{dataset.cid}}</span></p>
        <p><span>{{titles.teacher}}</span>：
          <span>{{dataset.teacher_id}}</span></p>
        <p><span>{{titles.room}}</span>：
          <span>{{dataset.room}}</span></p>
        <!-- <p><span>{{titles.semester}}</span>：
          <span>{{dataset.year}}-{{dataset.month}}</span></p> -->
        <p><span>{{titles.studentCount}}</span>：
          <span>{{dataset.studentCount}}</span></p>
        <p><span>{{titles.schedule}}</span>：
          <span>{{dataset.schedule}}</span></p>
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
          year: defaultProp,
          month: defaultProp,
          date: 0,
          studentCount: 0,
          teacher_id: defaultProp
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
