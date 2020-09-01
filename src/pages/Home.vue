<template>
  <div class="wrapper">
    <div @mouseenter="mousrover" class="wrapper-title">
      <div style="border:transparent solid 2px;width:100%;"  @mouseenter="mousrover">
      <el-collapse-transition>
        <div class="main-data-operation"  v-show="showTitle" @mouseleave="mouseout">
          <div class="function-left">
            <el-radio v-model="radio" label="PopulationAnalysis" class="left_radio" @change="titleChange">人口结构与承载力分析</el-radio>
            <el-radio v-model="radio" label="MacroEconomy" class="left_radio" @change="titleChange">宏观经济运行</el-radio>
          </div>
          <div class="function-center">
            临沂市经济运行大数据平台
          </div>
          <div class="function-right">
            <el-dropdown>
              <el-radio v-model="radio" label="3" class="right_radio">工业经济运行分析及预测</el-radio>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-radio v-model="radio" label="IndustrialForecast" class="right_radio" @change="titleChange">工业运行预测</el-radio>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-radio v-model="radio" label="IndustryCheck" class="right_radio" @change="titleChange">工业运行检测</el-radio>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-radio v-model="radio" label="IndustrialTechnology" class="right_radio" @change="titleChange">工业企业科技创新研究</el-radio>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-radio v-model="radio" label="IndustrialTransformation" class="right_radio" @change="titleChange">工业转型升级趋势分析</el-radio>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-radio v-model="radio" label="IndustrialGreen" class="right_radio" @change="titleChange">工业绿色发展检测</el-radio>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-radio v-model="radio" label="IndustrialPark" class="right_radio" @change="titleChange">工业园区发展</el-radio>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-radio v-model="radio" label="IndustrialInvest" class="right_radio" @change="titleChange">工业投资</el-radio>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-radio v-model="radio" label="AgriculturalEconomy" class="right_radio" @change="titleChange">农业经济发展分析</el-radio>
          </div>
        </div>
      </el-collapse-transition>
      <el-collapse-transition>
        <div class="function-center" style="margin-top:10px" v-show="!showTitle">
            {{CurrentTitle}}
          </div>
      </el-collapse-transition>
      </div>
    </div>
    <!-- <router-view></router-view> -->
    <div class="wrapper-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      radio: '',
      showTitle: false,
      CurrentTitle: '人口结构与承载力分析'
    }
  },
  methods: {
    mousrover () {
      this.showTitle = true
    },
    mouseout () {
      this.showTitle = false
    },
    titleChange (title) {
      console.log(title)
      if (title === 'PopulationAnalysis') {
        this.CurrentTitle = '人口结构与承载力分析'
      } else if (title === 'MacroEconomy') {
        this.CurrentTitle = '宏观经济运行'
      } else if (title === 'IndustrialForecast') {
        this.CurrentTitle = '工业运行预测'
      } else if (title === 'IndustryCheck') {
        this.CurrentTitle = '工业运行检测'
      } else if (title === 'IndustrialTechnology') {
        this.CurrentTitle = '工业企业科技创新研究'
      } else if (title === 'IndustrialTransformation') {
        this.CurrentTitle = '工业转型升级趋势分析'
      } else if (title === 'IndustrialGreen') {
        this.CurrentTitle = '工业绿色发展检测'
      } else if (title === 'IndustrialPark') {
        this.CurrentTitle = '工业园区发展'
      } else if (title === 'IndustrialInvest') {
        this.CurrentTitle = '工业投资'
      } else if (title === 'AgriculturalEconomy') {
        this.CurrentTitle = '农业经济发展分析'
      }
      this.$router.push({name: title})
      // router.push({name: title})
    }
  },
  mounted () {
    // this.$router.push({name: 'PopulationAnalysis'})
  }
}
</script>
<style scoped>
.wrapper{
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  /* background-color: rgb(19, 17, 17); */
  background: url('../../static/image/background.png') bottom  no-repeat;
  height: 100%;
  /* border: #d2ff37 solid 3px; */
}
.wrapper-title{
  /* border: 1px solid yellow; */
  height: 80px;
  display: flex;
  border-bottom: 0 solid #fff;
  position: relative;
  z-index: 99;
}
.wrapper-content{
  display: flex;
  flex: 1;
  flex-direction: column;
  position: absolute;
  /* border: blue 4px solid; */
  height: 100%;
  width: 100%;
}
 .el-header{
    color: #333;
    text-align: center;
    /* line-height: 60px; */
    border: red solid 1px;
    background-color: transparent;
  }
  .el-main {
    color: #333;
    text-align: center;
    line-height: 160px;
    border: solid red 1px;
  }
  .el-container{
    flex: 1;
    display: flex;
    height: 100%;
    background: url('../../static/image/background.png') bottom  no-repeat;
  }
.left_radio,.right_radio{
  width: 244px; /* no */
  font-size: 50px; /* no */
  color: yellow;
  font-weight: bold;
  margin:0px;
}
.left_radio{
  background: url('../../static/image/title-left.png') bottom  no-repeat;
}
.right_radio{
  background: url('../../static/image/title-right.png') bottom  no-repeat;
}
.left_radio.is-checked{
  background: url('../../static/image/title-left-select.png') bottom  no-repeat;
}
.right_radio:hover,.right_radio.is-checked{
  background: url('../../static/image/title-right-select.png') bottom  no-repeat;
}
.main-data-operation{
    height: 40px;
    padding: 26px;
    display: flex;
    background-color: transparent;
    background: url('../../static/image/header.png') bottom  no-repeat;
  }
  .function-left{
    /* display: flex; */
  }
  .function-right{
   /* text-align: right; */
   /* border: red solid 1px; */
  }
  .function-center{
    margin: auto;
    margin-top: -20px;
    font-size: 38px;
  letter-spacing: 3px;
  color: #d2ff37;
  width:fit-content;
  text-align: center;
  /* border: solid 2px yellow; */
   }
  .el-dropdown-menu{
    background-color: #19000000;
    border: 0px;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #19000000;
    color: #66b1ff;
}
.el-dropdown-menu__item {
    list-style: none;
    line-height: 0px;
    padding: 0px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    outline: 0;
    text-align: center;
}
</style>
<style >
.el-radio__inner{
  display: none;
}
.el-radio__label {
  font-size: 20px;
}
.el-radio__input.is-checked+.el-radio__label {
    color: yellow;
}
</style>
