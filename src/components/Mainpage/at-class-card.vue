<!-- at-course-card -->
<!--
  @author: Astroleander
  @date: 2018 - 10 - 31
  @description: at-card using in mainpage to showing class
  @version: 1.0.0
-->
<template>
  <div class="at-card at-card-shadow box row-frame">
    <aside>
      <slot name="header">
        <!-- TODO: to replace with real image url -->
       <img class='cover' src="https://via.placeholder.com/300"/>
      </slot>
    </aside>
    <section class="col-frame info">
     <header>{{showProps}}</header>
     <div class="row-frame">
        <p><span>{{titles.id}}</span>：
          <span>{{dataset.id}}</span></p>
        <p><span>{{titles.className}}</span>：
          <span>{{dataset.className}}</span></p>
        <p><span>{{titles.room}}</span>：
          <span>{{dataset.room}}</span></p>
        <p><span>{{titles.semester}}</span>：
          <span>{{dataset.semester}}</span></p>
        <p><span>{{titles.studentCount}}</span>：
          <span>{{dataset.studentCount}}</span></p>
        <p><span>{{titles.schedule}}</span>：
          <span>{{dataset.schedule}}</span></p>
        </div>
    </section>
  </div>
</template>

<script>
export default {
  // at-course-card 确实是更准确的名字，但是这里应该让类别名字和其对应的数据库表单名字尽可能的相同
  name: 'at-class-card',
  props: {
    dataset: {
      type: Object,
      default: ()=>{
        const dafault = '';
        return {
          title: dafault,
          id: dafault,
          className: dafault,
          room: dafault,
          semester: dafault,
          studentCount: dafault,
          schedule: dafault
        }
      }
    }
  },
  computed:{
    showProps: function(){
      // show loading when dataset doesnot ready yet
      return (this.dataset && this.dataset.id !== '') ? this.dataset.title:this.t_loading
    }
  },
  data(){
    return{
      titles: {
        title: '课程名称',
        id: '课程编号',
        className: '课程名',
        room: '上课教室',
        semester: '学年度/学期',
        studentCount: '学生人数',
        schedule: '上课时间',
      },
      t_loading: 'loading....',
    }
  },
}
</script>

<style lang="scss" scoped>
img.cover{
  width: 150px; 
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
  min-height: 150px;
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
