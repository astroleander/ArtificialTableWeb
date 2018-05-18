<!--<template>-->
  <!--&lt;!&ndash; $t is vue-i18n global function to translate lang &ndash;&gt;-->
  <!--<div class="app-container">-->

    <!--<label class="radio-label" style="padding-left:0;">Filename: </label>-->
    <!--<el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>-->
    <!--<label class="radio-label">Cell Auto Width: </label>-->
    <!--<el-radio-group v-model="autoWidth">-->
      <!--<el-radio :label="true" border>True</el-radio>-->
      <!--<el-radio :label="false" border>False</el-radio>-->
    <!--</el-radio-group>-->
    <!--<el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.export')}} excel</el-button>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import { getPoint } from '@/api/point'-->
  <!--import { parseTime } from '@/utils'-->
  <!--import PointList from '@/components/Table/pointList';-->
  <!--export default {-->
    <!--components: { PointList },-->
    <!--name: 'exportExcel',-->
    <!--data() {-->
      <!--return {-->
        <!--list: null,-->
        <!--listLoading: true,-->
        <!--downloadLoading: false,-->
        <!--filename: '',-->
        <!--autoWidth: true-->
      <!--}-->
    <!--},-->
    <!--created() {-->
    <!--},-->
    <!--methods: {-->
      <!--handleDownload() {-->
        <!--this.downloadLoading = true-->
        <!--import('@/vendor/Export2Excel').then(excel => {-->
          <!--const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']-->
          <!--const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']-->
          <!--const list = this.list-->
          <!--const data = this.formatJson(filterVal, list)-->
          <!--excel.export_json_to_excel({-->
            <!--header: tHeader,-->
            <!--data,-->
            <!--filename: this.filename,-->
            <!--autoWidth: this.autoWidth-->
          <!--})-->
          <!--this.downloadLoading = false-->
        <!--})-->
      <!--},-->
      <!--formatJson(filterVal, jsonData) {-->
        <!--return jsonData.map(v => filterVal.map(j => {-->
          <!--if (j === 'timestamp') {-->
            <!--return parseTime(v[j])-->
          <!--} else {-->
            <!--return v[j]-->
          <!--}-->
        <!--}))-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style>-->
  <!--.radio-label {-->
    <!--font-size: 14px;-->
    <!--color: #606266;-->
    <!--line-height: 40px;-->
    <!--padding: 0 12px 0 30px;-->
  <!--}-->
<!--</style>-->
