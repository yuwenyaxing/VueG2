<template>
  <div>
    <div id='InvestExecution' class="stas">
      <p>工业投资完成情况</p>
      <div id='IndustryInvest'>
        <label>单位（亿元）</label>
        <label style="left:420px">单位（%）</label>
      </div>
      <div id='IndustryInvestProp'></div>
      <div class="industrydescribe">
        <p >完成投资额较高的行业：<label style="color:red">{{Industryhigh}}</label></p>
        <p style="top:30px">完成投资额较低的行业：<label style="color:red">{{Industrylow}}</label></p>
        <p style="top:80px;font-size: 28px;font-weight: bold;color:#fff">月计划完成率：89.82% </p>
        <p style="top:80px;left:350px;font-size: 28px;font-weight: bold;color:#fff">进度：<label style="color:green">正常</label></p>
      </div>
    </div>
    <div id='InvestRank' class="stas">
       <p>{{MaxYear}}投资额排名</p>
       <div id='InvestRegion'>
        <label>分市州排名</label>
        <label style="left:300px">单位（亿元）</label>
      </div>
      <div id='InvestIndustry'>
        <label>分行业排名</label>
        <label style="left:300px">单位（亿元）</label>
      </div>
    </div>
    <div id='InvestRateRank' class="stas">
       <p>{{MaxYear}}投资额增速排名</p>
       <el-row>
         <el-col :span="12">
           <div id='InvestRegionRate'>
            <label>分市州排名</label>
            <label style="left:300px">单位（%）</label>
          </div>
         </el-col>
         <el-col :span="12">
           <div id='InvestIndustryRate'>
            <label>分行业排名</label>
            <label style="left:300px">单位（%）</label>
          </div>
         </el-col>
       </el-row>
    </div>
    <div id='RegionInvestExecution' class="stas">
      <p>各区县投资完成情况</p>
      <div id='map'>
        <el-select v-model="currentYear" @change="yearChange">
          <el-option v-for="item in Years" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
import { Chart } from '@antv/g2'
import { Scene } from '@antv/l7'
import { CityLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      IndustryInvestData: [],
      InvestRegionData: [],
      InvestIndustryData: [],
      InvestRegionRateData: [],
      InvestIndustryRateData: [],
      MaxYear: '',
      IndustryInvestPropData: [],
      Industryhigh: '',
      Industrylow: '',
      colorMapData: '',
      currentYear: '',
      Years: []
    }
  },
  methods: {
    setIndustryInvest () {
      let chart = new Chart({
        container: 'IndustryInvest',
        forceFit: false,
        height: document.getElementById('IndustryInvest').clientHeight,
        width: document.getElementById('IndustryInvest').clientWidth, // 指定图表宽度
        animate: true,
        padding: [70, 40, 20, 70]
      })
      chart.scale('累计投资完成额同比增速', { // 右侧坐标轴
        min: 10.5,
        max: 12.5,
        tickCount: 4, // 左右坐标轴刻度数量保持一致 好看点
        range: [0, 1 - 1 / 11 / 2]
      })
      chart.legend({
        custom: true,
        position: 'top-right',
        offsetY: 35,
        offsetX: -5,
        flipPage: false,
        items: [
          {
            name: '累计投资完成额',
            marker: {
              symbol: 'square',
              style: {
                fill: '#3182bd'
              },
              clickable: false
            }
          },
          {
            name: '累计投资完成额同比增速',
            marker: {
              symbol: 'circle',
              style: {
                fill: '#fdae6b'
              },
              clickable: false
            }
          }
        ]
      })
      chart.axis('累计投资完成额同比增速', {
        grid: null,
        label: {
          textStyle: {
            fill: '#fdae6b'
          }
        }
      })
      chart.tooltip({shared: true})
      utils.changeChartAxisForeground(chart, '累计投资完成额', 'year')
      utils.changeChartAxisForeground(chart, '累计投资完成额同比增速', '')
      chart.source(this.IndustryInvestData)
      chart.interval().position('year*累计投资完成额').color('#3182bd')
      chart.line().position('year*累计投资完成额同比增速').color('#fdae6b').size(3).shape('smooth')
      chart.point().position('year*累计投资完成额同比增速').color('#fdae6b').size(3).shape('circle')
      chart.render()
    },
    setIndustryInvestProp () {
      let chart = new Chart({
        container: 'IndustryInvestProp',
        height: document.getElementById('IndustryInvestProp').clientHeight,
        width: document.getElementById('IndustryInvestProp').clientWidth, // 指定图表宽度
        padding: [0, 40, 60, 40]
      })
      chart.data(this.InvestIndustryData)
      chart.legend('type', false)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.coordinate('theta', {radius: 0.75, innerRadius: 0.6})
      chart.interval().adjust('stack').position('value').color('type',
        ['#00FFFF', '#7CFC00', '#D2691E', '#FF7F50', '#6495ED', '#FF4500', '#9932CC', '#FF1493', '#FFD700', '#008000', '#F08080'])
        .label('value', (value) => {
          return {
            content: (data) => {
              return `${data.type}: ${value}`
            }
          }
        },
        {
          style: {
            fill: '#bddfff'
          }
        }).tooltip('type*value', (type, value) => {
          value = value + ''
          return {
            name: type,
            value: value
          }
        })
      chart.axis('value', {
        label: null
      })
      chart.interaction('element-active')
      chart.render()
    },
    setInvestRegion () {
      let chart = new Chart({
        container: 'InvestRegion',
        height: document.getElementById('InvestRegion').clientHeight,
        width: document.getElementById('InvestRegion').clientWidth, // 指定图表宽度
        padding: [70, 40, 0, 70]
      })
      chart.data(this.InvestRegionData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#FF8C00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.coordinate('rect').transpose()
      chart.render()
    },
    setInvestIndustry () {
      let chart = new Chart({
        container: 'InvestIndustry',
        height: document.getElementById('InvestIndustry').clientHeight,
        width: document.getElementById('InvestIndustry').clientWidth, // 指定图表宽度
        padding: [70, 50, 0, 90]
      })
      chart.data(this.InvestIndustryData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#7FFFD4').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.coordinate('rect').transpose()
      chart.render()
    },
    setInvestRegionRate () {
      let chart = new Chart({
        container: 'InvestRegionRate',
        height: document.getElementById('InvestRegionRate').clientHeight,
        width: document.getElementById('InvestRegionRate').clientWidth, // 指定图表宽度
        padding: [70, 50, 20, 70]
      })
      chart.data(this.InvestRegionRateData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#00BFFF').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.coordinate('rect').transpose()
      chart.render()
    },
    setInvestIndustryRate () {
      let chart = new Chart({
        container: 'InvestIndustryRate',
        height: document.getElementById('InvestIndustryRate').clientHeight,
        width: document.getElementById('InvestIndustryRate').clientWidth, // 指定图表宽度
        padding: [70, 30, 20, 80]
      })
      chart.data(this.InvestIndustryRateData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#FFD700').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.coordinate('rect').transpose()
      chart.render()
    },
    setMapData () {
      const scene = new Scene({
        id: 'map',
        logoVisible: false,
        map: new Mapbox({
          style: 'blank',
          zoom: 5,
          minZoom: 7.3,
          maxZoom: 7.3
        })
      })
      const data = this.colorMapData
      scene.on('loaded', () => {
        /* eslint-disable no-new */
        new CityLayer(scene, {
          data,
          joinBy: [ 'adcode', 'code' ],
          adcode: [ '371300', '539' ],
          depth: 3,
          label: {
            field: 'NAME_CHN',
            textAllowOverlap: false
          },
          fill: {
            color: { field: 'value',
              values: [
                '#eceef8',
                '#323E89'
              ]
            }
          },
          popup: {
            enable: true,
            Html: props => {
              return `<span>${props.NAME_CHN}:</span><span>${props.value}</span>`
            }
          }
        })
      })
    },
    yearChange (item) {
      console.log(item)
    },
    getMapData () {
      this.axios.get('/industry/invest/data/' + this.currentYear).then(res => {
        console.log(res)
        this.colorMapData = res.data.filter(x => x.type === '投资额').map(item => ({
          code: item.regioncode,
          name: item.region,
          value: item.value
        }))
        this.setMapData()
      })
    }
  },
  mounted () {
    this.axios.get('/industry/invest/data').then(res => {
      let data = res.data.yearData.filter(x => x.part === '0')
      let ratedata = res.data.yearData.filter(x => x.part === '1')
      for (var i = 0; i < data.length; i++) {
        this.IndustryInvestData.push({
          year: data[i].year,
          累计投资完成额: data[i].value,
          累计投资完成额同比增速: ratedata.filter(x => x.year === data[i].year)[0].value
        })
      }
      this.InvestIndustryData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '2'), 'value')
      this.InvestRegionData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '3'), 'value')
      this.InvestRegionRateData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '4'), 'value')
      this.InvestIndustryRateData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '5'), 'value')
      this.Industrylow = this.InvestIndustryData[0].type + '、' + this.InvestIndustryData[1].type + '、' + this.InvestIndustryData[2].type
      this.Industryhigh = this.InvestIndustryData[this.InvestIndustryData.length - 1].type + '、' + this.InvestIndustryData[this.InvestIndustryData.length - 2].type + '、' + this.InvestIndustryData[this.InvestIndustryData.length - 3].type
      this.Years = res.data.regionData.range
      this.currentYear = this.Years[0]
      this.getMapData()
      // this.MaxYear = Math.max.apply(Math, this.TotalValueData.map(item => { return item.year }))
      // this.MaxYearValue = this.TotalValueData.filter(x => x.type === '总产值' && x.year === 2018 + '')[0].value
      // this.SeedeAreaData = res.data.yearAgricu.filter(x => x.part === '1')
      // this.GrainYieldData = res.data.yearAgricu.filter(x => x.part === '2')
      // this.FruitsYieldData = res.data.yearAgricu.filter(x => x.part === '3')
      // this.SeedeRegionAreaData = res.data.regionAgricu.filter(x => x.part === '0')
      // this.tableData = res.data.regionFruits
      // this.setMapData(this.tableData[0])
      // this.RegionPopDensityData = res.data.yearAgricu
      this.setIndustryInvest()
      this.setIndustryInvestProp()
      this.setInvestRegion()
      this.setInvestIndustry()
      this.setInvestRegionRate()
      this.setInvestIndustryRate()
    })
  }
}
</script>
<style scoped>
#InvestExecution{
  height: 961px;left:15px;top:88px;width: 520px;
}
#InvestRank{
  height: 961px;left:543px;top:88px;width: 400px;
}
#InvestRateRank{
  height: 357px;left:950px;top:88px;width: 956px;
}
#RegionInvestExecution{
  height: 600px;left:950px;top:450px;width: 956px;
}
#IndustryInvest{
 height: 400px;
 width: 520px;
 margin-top:40px;
}
#InvestRegion{
  height: 460px;
  width: 400px;
  position: relative;
}
#InvestIndustry{
  height: 460px;
  width: 400px;
  position: relative;
}
#InvestRegionRate,#InvestIndustryRate{
  height: 357px;width: 475px;position: relative;
}
#IndustryInvest > label,#InvestRegion>label,#InvestIndustry>label,#InvestIndustryRate>label,#InvestRegionRate>label{
  position: absolute;
  top: 35px;
  left: 0;
  color: #bddfff;
  line-height: 30px;
  padding-left: 10px;
  font-size: 15px;
  text-align: left;
}
#IndustryInvestProp{
  height: 420px;
  width: 520px;
  margin-top:10px
}
.industrydescribe{
  height: 340px;
  width: 520px;
  margin-top:-50px;
}
.industrydescribe> p{
  position: relative;
  color: #bddfff;;
  border-style: none;
  font-size: 20px;
  /* text-align: left; */
}
.el-select{
  width: 130px;
  height: 30px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 99999;
  /* background-color: transparent; */
}
</style>
