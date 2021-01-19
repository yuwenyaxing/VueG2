<template>
  <div class="wrapper">
    <div id='GDPIndex' class="stas">
      <div class="chartTitle"><div></div>地区生产总值监测</div>
      <div class="lefttop"></div>
      <div class="righttop"></div>
      <div class="leftbottom"></div>
      <div class="rightbottom"></div>
       <label>单位（亿元）</label>
       <div class="GDPIndexRadio">
          <el-radio-group v-model="radio" @change="GDPIndexChange">
            <el-radio label="0" @mouseover.native="GDPIndexChange('0')">生产总值 》</el-radio>
            <el-radio label="1" @mouseover.native="GDPIndexChange('1')">第一产业 》</el-radio>
            <el-radio label="2" @mouseover.native="GDPIndexChange('2')">第二产业 》</el-radio>
            <el-radio label="3" @mouseover.native="GDPIndexChange('3')"> 第三产业 》</el-radio>
          </el-radio-group>
       </div>
       <div id='GDPIndexChart'></div>
    </div>
    <div id='FixedInvestGrowth' class="stas" >
      <div class="chartTitle"><div></div>地区生产总值预测</div>
      <label>单位（亿元）</label>
      <div class="lefttop"></div>
      <div class="righttop"></div>
      <div class="leftbottom"></div>
      <div class="rightbottom"></div>
    </div>
  </div>
</template>
<script>
import { Chart } from '@antv/g2'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      FixedInvestGrowthData: [],
      radio: '',
      IndexData: [],
      yearData: []
    }
  },
  methods: {
    // 获取生产总值预测数据【问题：toolip文字靠左对齐，例如2009年，实际值与预测值错位】
    setFixedInvestGrowth () {
      let chart = new Chart({
        forceFit: true, // 默认为 false，设置为 true 时表示自动取 dom（实例容器）的宽度
        autoFit: true,
        container: 'FixedInvestGrowth',
        padding: [70, 20, 60, 40]
      })
      chart.data(this.FixedInvestGrowthData)
      // 设置了position: 'left'，没有生效
      chart.tooltip({
        position: 'left',
        showCrosshairs: true,
        shared: true
      })
      chart.legend({
        position: 'top-right',
        offsetY: 35,
        offsetX: -5,
        itemGap: 60,
        itemName: {
          style: {
            fill: '#bddfff'
          }
        }
      })
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('type', ['#24ff00', '#FFD700']).shape('smooth')
      chart.point().position('year*value').color('type', ['#24ff00', '#FFD700']).shape('circle')
      chart.render()
    },
    // 设置地区生产总值监测数据【问题：切换指标时改变图表颜色，但是tooltip中保存了上一个指标的颜色】
    setGDPIndexChart (part) {
      if (this.radio === part) return
      this.radio = part
      if (!this.CityGDPChart || this.CityGDPChart === null) {
        this.CityGDPChart = new Chart({
          container: 'GDPIndexChart',
          forceFit: false,
          height: document.getElementById('GDPIndexChart').clientHeight,
          width: document.getElementById('GDPIndexChart').clientWidth, // 指定图表宽度
          animate: true,
          padding: [10, 50, 80, 30]
        })
      }
      this.CityGDPChart.tooltip({shared: true})
      // 不同的指标设置不同的颜色，切换指标后，tooltip还存在上一个指标的颜色
      let color = 'red'
      if (part === '0') {
        color = '#00FFFF'
      } else if (part === '1') {
        color = '#FF7F50'
      } else if (part === '2') {
        color = '#7B68EE'
      } else if (part === '3') {
        color = '#FFD700'
      }
      this.CityGDPChart.interval().position('year*value').color('type', color)
      utils.changeChartAxisForeground(this.CityGDPChart, 'value', 'year')
      this.CityGDPChart.data(this.indexData)
      this.CityGDPChart.interaction('active-region')
      this.CityGDPChart.removeInteraction('legend-filter')
      this.CityGDPChart.render()
    },
    // 当地区生产总值指标发生变化时触发
    GDPIndexChange (item) {
      this.setIndexData(item)
    },
    // 获取指标数据
    setIndexData (part) {
      this.indexData = []
      this.indexData = this.yearData.filter(x => x.part === part)
      this.setGDPIndexChart(part)
    }
  },
  mounted () {
    this.axios.get('/macro/data').then(res => {
      this.yearData = res.data.yearMacro
      this.FixedInvestGrowthData = res.data.yearMacro.filter(x => x.part === '5')
      this.setIndexData('0')
      this.setFixedInvestGrowth()
    })
  }
}
</script>
<style scoped>
.reportImg{
  position:absolute;
  width: 30px;
  top: 88px;
  left:1250px;
  cursor: pointer;
}
.num{
  /* border: solid 1px red; */
  top:88px;
  left:560px;
  text-align: left;
  position: absolute;
  color: #fff;
  /* width: 600px; */
}
.wrapper{
  /* overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column; */
  /* background-color: rgb(19, 17, 17); */
  width: 100%;
  height: 100%;
  background: url('../../static/image/bj.png') center center no-repeat ;
  /* filter:alpha(opacity=80);
  -moz-opacity:0.8;
  background-color: black;
  opacity: 1; */
  background-size: 100% 100%;
  position: fixed;
  /* height: 100%; */
  /* border: #d2ff37 solid 3px; */
}
.title{
  /* margin: auto; */
  position: absolute;
  top: 10px;
  left:825px;
  font-size: 42px;
  font-weight: bold;
  letter-spacing: 3px;
  /* color: #d2ff37; */
  width:fit-content;
  text-align: center;
  z-index: 99;
  /* background-image:-webkit-linear-gradient(bottom,red,#fd8403,yellow);  */
  background-image:-webkit-linear-gradient(top,#35ffff,#002fff);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}
/* .el-col{border:solid 1px red} */
/* #ThreeNeed{  height: 213px;  left: 15px;  top:88px;  width: 450px;}
.ThreeNeedContent{height: 40px; width:320px; background-color: rgba(66, 63, 63, 0.315); margin-top:10px;margin-left:30px;color:  #bddfff;font-size: 20px;line-height: 40px;}
.ThreeNeedContent>label{color:rgb(231, 216, 6) ;font-weight: bold;font-size: 32px;}
#ConsumerGoodsRate{  height: 350px;  left: 15px;  top: 315px;  width: 450px;}
#IndustryAddValue{ height:375px; left: 15px;  top:682px;  width: 450px;}
#GDPIndex{height: 400px;left: 485px;top: 235px;width: 430px;}
.GDPIndexRadio{  width: 95px;  float: left;  margin-top:50px;  height: 125px;}
#GDPIndexChart{  overflow:auto;  margin-top:30px;  height: 370px;}
#TradeDependence{ height: 405px; left: 485px;  top: 650px;  width: 430px;}
#FixedInvestGrowth{ height: 405px;  left: 932px;  top: 650px;  width: 400px;}
#perGDP{ height: 400px;  left: 932px;  top: 235px;  width: 400px;}
#ThreeIndustry{  height: 450px;  left: 1350px;  top:88px;  width: 550px;}
#Revenue{ height:500px; left: 1350px;  top:555px;  width: 550px; } */
#FristIndustry,#SecondIndustry,#ThirdIndustry{
  /* margin-top:40px; */
  /* height: 270px; */
  margin-top:40px;
  height: 200px;
}

#ThreeNeed{  height: 213px;  left: 15px;  top:88px;  width: 500px;}
.ThreeNeedContent{height: 40px; width:440px; background-color: rgba(66, 63, 63, 0.315); margin-top:10px;margin-left:30px;color:  #bddfff;font-size: 20px;line-height: 40px;}
.ThreeNeedContent>label{color:rgb(231, 216, 6) ;font-weight: bold;font-size: 32px;}
#ConsumerGoodsRate{  height: 330px;  left: 15px;  top: 325px;  width: 500px;}
#IndustryAddValue{ height:375px; left: 15px;  top:682px;  width: 500px;}
#GDPIndex{height: 280px;left: 540px;top: 235px;width: 730px;}
.GDPIndexRadio{  width: 110px;  float: left;  margin-top:46px; margin-right: 15px;  height: 125px;}
#GDPIndexChart{  overflow:auto;  margin-top:30px;  height: 270px;}
#TradeDependence{ height: 300px; left: 1295px;  top: 435px;  width: 600px;}
#FixedInvestGrowth{ height: 260px;  left: 540px;  top: 525px;  width: 730px;}
#perGDP{ height: 260px;  left: 540px;  top: 795px;  width: 730px;}
#ThreeIndustry{  height: 325px;  left: 1295px;  top:88px;  width: 600px;}
#Revenue{ height:300px; left: 1295px;  top:755px;  width: 600px; }

.mapdescribe>p{
  top: 110px;
  left: 320px;
  color: #fff;
  height: 0;
  /* width: 260px; */
  line-height: 30px;
  border-width: 0px;
  border-radius: 0;
  font-size: 17px;
  text-align: left;
}
#map{
  /* top:5px; */
  /* height: 490px; */
  height:534px;
  width: 610px;
  position: relative;
  /* border:red solid 1px */
}
#RegionThreeIndustry{
  height: 490px;
  width: 420px;
  top: 0px;
  /* position: absolute; */
  border: solid 1px red;
}
.centerNewYearGDPIndex{  width: 350px;  height: 40px;  top:80px;  left:560px;}
.centerNewYearGDPRateIndex{  width: 320px;  height: 40px;  top:80px;  left:940px;}
.indexicon{
  /* border:solid 1px red; */
  /* left:10px; */
  float: left;
  margin: 70px 5px 0px 5px;
}
.indextext{
  font-size: 21px;
  /* border: solid 1px red; */
  float: left;
  margin-top:60px;
  color: #d5f4ff;
  font-weight: bold;
}
.indextext > label{
  float: left;
}
.indexunit{
  margin-top:10px
}
.indexvalue{
  color: #00FF05;
  font-size: 40px;
}
.el-select{
  width: 120px;
  height: 30px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 99;
  /* background-color: transparent; */
}
.el-radio {
  color: #6be4ffad;
  cursor: pointer;
  width: 100%;
  margin-right: 0px;
  background-color: #29758275;
  margin-top:10px;
  margin-left: 10px;
  /* margin-top:30px; */
  font-size: 18px;
  line-height: 40px;
  border-top: 1px solid #69d2ff80;
  border-bottom: 1px solid #69d2ff80;
}
.el-radio.is-checked{
  background-color: #b1fc0144;
  border-top: 1px solid #b1fc0162;
  border-bottom: 1px solid #b1fc0162;
}
.report_title{
  background-color: rgb(100, 149, 168);
  text-align: left;
  font-size: 28px;
  /* color: #c8d41e; */
  color: #e9d205;
  padding: 10px;
  height: 40px;
}
.operation{
  font-size: 15px;
  color:white;
  float: left;
  text-align: center;
  margin: 5px 10px;
  cursor: pointer;
}
.operation>p{
  line-height: 20px;
}
.operation:hover{
  color: rgb(0, 255, 13);
}
.title-left{
    float: left;
    line-height: 40px;
    margin-left: 20px;
}
.title-right{
  float:right;
}
.report{
  position: absolute;
  border: solid rgb(202, 170, 170) 1px;
  width: 920px;
  height: 900px;
  /* background-color: rgb(96, 180, 248); */
  background-color: rgb(90, 115, 134);
  z-index: 999;
  top: 88px;
  left: 500px
}
.report_content{
  margin: 0px 50px 30px 50px;
  padding: 30px 70px;
  height: 750px;
  background-color: white;
  border:solid 1px yellow;
  line-height: 30px;
  overflow-y:auto;
}
</style>
