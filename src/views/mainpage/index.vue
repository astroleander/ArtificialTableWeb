<!-- Tree Structure of Mainpage -->
<!--
div(mainpage)
    |- DONE: welcome card
    |- TODO: class list
        |- TODO: semester selected list
        |- DONE: semester list
            |- DONE: class list inside
-->
<template>
  <div>
    <header class="at-card at-card-shadow header">
        <div><!-- 区域1 -->
        </div>
        <at-avatar></at-avatar>
        <div><!-- 区域3 -->
        </div>
        <div class="info-card" v-for="item in this.infos_arrays" :key="item.hint">
          <p>
            <svg-icon :icon-class="item.icon" v-bind:style="{fill:item.color}"></svg-icon>
            <span class="hint">{{item.hint}}</span>
          </p>
          <p><span class="content">{{item.content}}</span></p>
        </div>
      </header>
    <at-semester
      class="semester"
      v-for="(item, index) in semeseterDataset" :key="index"
      :dataset="item"
      >
        {{index}} 学期
    </at-semester>
  </div>
</template>

<script>
import AtSemester from '@/components/Mainpage/Semester'
import AtAvatar from '@/components/Avatar'

import classInfoViewmModel from '@/viewmodel/classinfos'

// const indigo = ''
const cyan = '#00BCD4'
const blue = '#2196F3'
const green = '#4CAF50'
// const light_green = '#4CAF50'

export default {
  components: {
    'AtSemester': AtSemester,
    'AtAvatar': AtAvatar
  },
  data() {
    return {
      infos_arrays: [
        { icon: 'domain', color: cyan, hint: '学校 / 机构', content: '北京交通大学' },
        { icon: 'school', color: blue, hint: '院系', content: '语言与传播学院' },
        { icon: 'user', color: green, hint: '认证', content: '教师' }
      ],
      semeseterDataset: {} // A dictionary, integrate class by year
    }
  },
  methods: {
    buildSemester: function(allClass) {
      for (const eachClass of allClass) {
        if (!this.semeseterDataset[eachClass.year]) {
          this.$set(this.semeseterDataset, eachClass.year, [eachClass])
        } else {
          this.semeseterDataset[eachClass.year].push(eachClass)
        }
      }
      // for (const eachClass of allClass) {
      //   if (!this.semeseterDataset[eachClass.year+'test']) {
      //     this.$set(this.semeseterDataset, eachClass.year+'test', [eachClass])
      //   } else {
      //   }
      // }
    },
    fetchClassInfos: function() {
      classInfoViewmModel
        .requestClassInfos({ teacher_id: this.$store.getters.id })
        .then(responseArray => {
          try {
            this.buildSemester(responseArray)
          } catch (exception) {
            console.error(exception)
          }
        })
    }
  },
  created() {
    this.fetchClassInfos()
  }
}
</script>

<style lang="scss" scoped>
$grey: #999;
$black: #212121;
$white: #FFF;

.header {
  display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
    flex-flow: row wrap;
    justify-content: center;
    align-content: space-between;
    align-items: flex-start;

//   & * {
//       flex: 1 1 auto;
//   }

  & > :first-child,& > :nth-child(3){
    width: 30%;
  }

  & > :nth-child(2){
    width: 40%;
  }
}

.info-card{
    flex-flow: column nowrap;
    min-width: 250px;
    max-width: 400px;
    margin: 12px;
    padding: 8px;
    .svg-icon {
        width: 24px;
        height: 24px;
    }
    p {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        margin: 0;
        .hint {
            margin-left: 4px;
            display: inline-block;
            color: $grey;
            font-size: 0.9em;
            vertical-align: middle;
            text-anchor: middle;
            line-height: 100%;
        }
    }
    p ~ p{
        // padding-left: 24px;
        margin-left: 28px;
   }

  transition: 1s 0.2s cubic-bezier(0.895, 0.03, 0.685, 0.22);
  &:hover{
    background: $black;
    color: $white;
    border-radius: 2px;
    box-shadow: 0 19px 38px rgba(0,0,0,0.30),
                0 15px 12px rgba(0,0,0,0.22);
    position: relative;
  };
}


.at-card-shadow {
    transition: 10s;
    :hover{
        transition: 0.2s;
    }
}

.semester{
    margin: 2rem;
}

</style>
