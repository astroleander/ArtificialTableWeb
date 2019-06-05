   <!-- 导入成绩中的直接导入Excel文件-->

<template>
  <div>
    <input id="excel-upload-input"
           ref="excel-upload-input"
           type="file" accept=".xlsx, .xls" class="c-hide"
           @change="handleFileChange">
    <div
      id="drop"
      @drop="handleDrop"
      @dragover="handleDragover" @dragenter="handleDragover">
      拖拽 Excel 文件到此处或者
      <el-button style="margin-left:16px;" size="mini" type="primary" icon="el-icon-upload" @click="handleUpload">浏览文件夹</el-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  data() {
    return {
      loading: false,
      excelData: {
        results: null
      }
    }
  },
  methods: {
    generateData({ results }) {
      this.excelData.results = results
      this.$emit('on-selected-file', this.excelData)
    },
    // 松开鼠标后进行数据处理
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('一次仅能选择一个文件!')
        return
      }
      const itemFile = files[0] // only use files[0]
      this.readerData(itemFile)
      e.stopPropagation()
      e.preventDefault()
    },
    // 鼠标拖入时监听
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    // 点击上传读取本地数据，调用input组件功能
    handleUpload() {
      document.getElementById('excel-upload-input').click()
    },
    // 点击上传
    handleFileChange(e) {
      const files = e.target.files
      const itemFile = files[0] // only use files[0]
      if (!itemFile) return
      this.readerData(itemFile)
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
    },
    // 读取上传数据文件
    readerData(itemFile) {
      const reader = new FileReader()
      reader.onload = e => {
        const data = e.target.result
        const fixedData = this.fixData(data)
        const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
        // load sheet 0
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        /**
         * @see https://docs.sheetjs.com/#json
         */
        const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        this.generateData({ results })
      }
      reader.readAsArrayBuffer(itemFile)
    },
    fixData(data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let col
      const R = range.s.r /* start in the first row */
      for (col = range.s.c; col <= range.e.c; ++col) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: col, r: R })] /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + col // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    }
  }
}
</script>

<style scoped>
  #excel-upload-input{
    display: none;
    z-index: -9999;
  }
  #drop{
    box-sizing: border-box;
    border: 2px dashed #bbb;
    width: 98%;
    height: 100px;
    line-height: 100px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 2px;
    text-align: center;
    color: #bbb;
    position: relative;
    background: repeating-linear-gradient(45deg, #FFF 0, #FFF 15px, #EEE 15px, #EEE 30px)
  }
  #drop * {
    background: #242;
  }
</style>
