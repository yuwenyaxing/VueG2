<template>
  <div class="main">
    <!-- <page-header title="黄陵新区精细化管理系统"></page-header> -->
      <!-- <div class="hl-title">
        <el-row>
            <el-col :span="8">
              <el-radio v-model="radio" label="1" class="left_radio">人口结构与承载力分析</el-radio>
              <el-radio v-model="radio" label="2" class="left_radio">宏观经济运行</el-radio>
            </el-col>
            <el-col :span="10" class="hl-page-header-title">
              <div >
                临沂市经济运行大数据平台
              </div>
            </el-col>
            <el-col :span="8">
              <el-radio v-model="radio" label="1" class="left_radio">人口结构与承载力分析</el-radio>
              <el-radio v-model="radio" label="2" class="left_radio">宏观经济运行</el-radio>
            </el-col>
        </el-row>
      </div> -->
  </div>
</template>
<script>
// import PageHeader from '@/components/PageHeader.vue'
export default {
//   components: {
//     PageHeader: PageHeader
//   }
}
</script>
<style>
.main{
  width: 100%;
  height: 100%;
  background: url('../../static/image/background.png') bottom  no-repeat;
  background-size:100%;
  border: red solid 1px;
  overflow: hidden;
}
.hl-title{
    /* border: solid red 1px; */
    height: 80px;
    width: 100%;
    padding: 0px;background: url('../../static/image/header.png') bottom  no-repeat;
  }
  
.el-col {
  border: solid 1px red;
  height: 80px;
}
.el-row{
    border: solid 1px yellow;
}
.hl-page-header-title {
  font-size: 40px;
  letter-spacing: 3px;
  color: #d2ff37;
  width:fit-content;
  text-align: center;
  border: solid 2px yellow;
}
</style>
