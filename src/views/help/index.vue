<template>
<div>
    <div class="help">
        <div style="height: 40px"></div>
        <div style="margin-left: 50px; color: #999999">Welcome to </div>
        <div style="margin-left: 80px; margin-top: 10px;font-size: 2em">英语课程智慧管理平台</div>
        <section class="position">
            <span class="help_text">{{role}}</span>
            <el-button v-if="this.is_manager" @click="onSwitchChange" style="margin-left: 50px" type="primary" plain>切换身份</el-button>
            <el-divider></el-divider>
        </section>

        <div class="container" v-if="this.use_manager">
            <at-card
                    :title="Info[4].title"
                    :description="Info[4].description"
                    :background="Info[4].backgroud"
                    :router="Info[4].router">
            </at-card>
            <i style="margin-left: 20px;margin-top: 90px;margin-right: 20px;" class="el-icon-video-play"></i>

            <at-card
                    :title="Info[5].title"
                    :description="Info[5].description"
                    :background="Info[5].backgroud"
                    :router="Info[5].router">
            </at-card>
            <i style="margin-left: 20px;margin-top: 90px;margin-right: 20px"class="el-icon-video-play"></i>

            <at-card
                    :title="Info[6].title"
                    :description="Info[6].description"
                    :background="Info[6].backgroud"
                    :router="Info[6].router">
            </at-card>
            <i style="margin-left: 20px;margin-top: 90px;margin-right: 20px"class="el-icon-video-play"></i>

            <at-card
                    :title="Info[7].title"
                    :description="Info[7].description"
                    :background="Info[7].backgroud"
                    :router="Info[7].router">
            </at-card>

        </div>
        <div class="container" v-else="this.use_manager">
            <at-card
            :title="Info[0].title"
            :description="Info[0].description"
            :background="Info[0].backgroud"
            :router="Info[0].router">
            </at-card>
            <i style="margin-left: 20px;margin-top: 90px;margin-right: 20px;" class="el-icon-video-play"></i>

            <at-card
                    :title="Info[1].title"
                    :description="Info[1].description"
                    :background="Info[1].backgroud"
                    :router="Info[1].router">
            </at-card>
            <i style="margin-left: 20px;margin-top: 90px;margin-right: 20px"class="el-icon-video-play"></i>

            <at-card
                    :title="Info[2].title"
                    :description="Info[2].description"
                    :background="Info[2].backgroud"
                    :router="Info[2].router">
            </at-card>
            <i style="margin-left: 20px;margin-top: 90px;margin-right: 20px"class="el-icon-video-play"></i>
            <at-card
                    :title="Info[3].title"
                    :description="Info[3].description"
                    :background="Info[3].backgroud"
                    :router="Info[3].router">
            </at-card>
        </div>

    </div>


</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AtCard from './actionCard'
export default {
  name: 'index',
  components: { AtCard },
  data() {
    return {
      role: '',
      Info: [
        {
          title: '添加教学班级',
          description: '教师可以添加自己任课班级',
          router: '/manager/class/add',
          backgroud: 'background-image: url("https://picsum.photos/id/131/200/200")'

        },
        {
          title: '教学班级信息',
          description: '教师可以为班级添加学生名单',
          router: '/class/index',
          backgroud: 'background-image: url("https://picsum.photos/id/24/200/200")'

        },
        {
          title: '成绩管理',
          description: '教师可查看、增加、修改、删除任课班级学生成绩',
          router: '/mainpage/index',
          backgroud: 'background-image: url(\'https://picsum.photos/id/213/200/200\')'

        },
        {
          title: '导入成绩',
          description: '教师可以通过导入Excel表格为班级学生添加成绩',
          router: '/input/index/',
          backgroud: 'background-image: url("https://picsum.photos/id/385/200/200")'

        },
        {
          title: '课程组管理',
          description: '教研室主任需要为年级添加课程组，并调整课程组内各项成绩权重占比',
          router: '/manager/lesson/class',
          backgroud: 'background-image: url("https://picsum.photos/id/131/200/200")'

        },
        {
          title: '班级成绩比较',
          description: '教研室主任可以比较各个课程组之间的成绩',
          router: '/comparison/index',
          backgroud: 'background-image: url("https://picsum.photos/id/24/200/200")'
        },
        {
          title: '教师管理',
          description: '教研室主任可查看、添加、删除任课教师信息',
          router: '/manager/user/list',
          backgroud: 'background-image: url("https://picsum.photos/id/385/200/200")'
        },
        {
          title: '学生管理',
          description: '教研室主任可查看学生信息',
          router: '/manager/student/list',
          backgroud: 'background-image: url("https://picsum.photos/id/732/200/200")'
        }

      ]
      // 继续加
    }
  },
  methods: {
    init() {
      if (this.use_manager) {
        this.role = '教研室主任'
      } else {
        this.role = '普通教师'
      }
    },
    onSwitchChange() {
      // this.$router.push({ path: '/' })
      if (this.use_manager) {
        this.$store.dispatch('setUseManager', false)
        this.role = '普通教师'
        this.$message({
          message: '已开启教师身份',
          type: 'success'
        })
      } else {
        this.$store.dispatch('setUseManager', true)
        this.role = '教研室主任'
        this.$message({
          message: '已开启教研室主任身份',
          type: 'success'
        })
      }
      location.reload()
    },
    show() {
      this.$messge({
        message: '1234567',
        type: 'warning'

      })
    }
  },
  computed: {
    ...mapGetters([
      'use_manager',
      'is_manager'
    ])
  },
  created() {
    this.init()
  }
}
</script>

<style scoped>
  .help_text{
      font-family : 微软雅黑,宋体;
      font-size : 2em;
  }
  .help{
      margin-top: 1px;
      height: calc(100vh - 50px);
      background-color: white;
  }
  .position{
      margin-left: 80px;
      margin-top: 100px;
  }
    .container{
        display: flex;
        flex-flow: row;
        margin-left: 80px;
        font-size: 20px;
        margin-top: 20px;
    }
  .text {
      font-size: 14px;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
    .card{
        width: 200px;
        height: 200px;
    }
  i{
      color: orange;
  }

</style>
