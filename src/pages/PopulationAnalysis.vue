<template>
  <div class="pop-main">
      <!-- 人口结构与承载力分析 -->
    <iframe src="http://60.217.33.59:4100/yanan/populationAndBearingCapacity" frameborder="0"  width='100%' height='100%'></iframe>
    <div id='YearPopulationLive' class="stas">
       <p>历年常驻人口与户籍人口对比</p>
       <label>单位（万人）</label>
    </div>
    <div id='RegionPopSex' class="stas">
       <p>临沂市户籍人口性别比</p>
       <label>单位（女性=100）</label>
    </div>
    <div id='YearPopulationTownRate' class="stas">
       <p>临沂市常住人口城镇化率</p>
       <label>单位（%）</label>
    </div>
    <div id='RegionPopDensity' class="stas">
       <p>各区县常住人口密度</p>
       <label>单位（人/平方公里）</label>
    </div>
    <div id='PopAnalysis' class="stas">
       <p>基于土地资源等人口承载力及预警分析</p>
       <div class="top">
         <div class="left">
           <h1>人口承载力是什么？</h1>
           <p class="describe">人口承载力是指一国或地区在可预见的时期内,利用该地区能源和其他自然资源及经济、环境等条件，在保证符合社会文化准则的物质生活水平条件下，所能持续供养的人口数。它实际上是对人口与经济、资源、环境关系研究。</p>
          </div>
         <div class="right">
         </div>
       </div>
       <div class="center"></div>
       <div class="bottom"></div>
    </div>
  </div>
</template>
<script>
import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      YearPopulationLiveData: [],
      RegionPopSexData: [],
      YearPopulationTownRateData: [],
      RegionPopDensityData: []
    }
  },
  methods: {
    setYearPopulationLive () {
      let chart = new Chart({
        container: 'YearPopulationLive',
        autoFit: true,
        // height: document.getElementById('YearPopulationLive').clientHeight,
        // width: document.getElementById('YearPopulationLive').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 60]
      })
      chart.tooltip({
        showMarkers: false,
        shared: true
      })
      chart.legend({
        position: 'top-right',
        offsetY: 35,
        offsetX: -5
        // autoWrap: true,
        // attachLast: true,
        // marker: 'square',
        // textStyle: {
        //   fill: '#fff'
        // }
      })
      // chart.coordinate().transpose()
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.source(this.YearPopulationLiveData)
      chart.interval().position('year*value').color('type').adjust([
        {
          type: 'dodge',
          marginRatio: 0
        }
      ])
      chart.render()
    },
    setRegionPopSex () {
      let chart = new Chart({
        container: 'RegionPopSex',
        autoFit: true,
        // height: document.getElementById('RegionPopSex').clientHeight,
        // width: document.getElementById('RegionPopSex').clientWidth, // 指定图表宽度
        animate: true,
        padding: [50, 20, 60, 60]
      })
      chart.tooltip({
        showMarkers: true, // 展示 Tooltip 辅助线
        shared: true
      })
      chart.source(this.RegionPopSexData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('red')
      chart.point().position('year*value')
      chart.render()
    },
    setYearPopulationTownRate () {
      let chart = new Chart({
        container: 'YearPopulationTownRate',
        forceFit: true,
        height: document.getElementById('YearPopulationTownRate').clientHeight,
        width: document.getElementById('YearPopulationTownRate').clientWidth, // 指定图表宽度
        animate: true,
        padding: [110, 20, 60, 40]
      })
      chart.tooltip({
        showMarkers: false,
        shared: true
      })
      chart.legend('value', false)
      chart.legend('year', false)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.source(this.YearPopulationTownRateData)
      chart.point().position('year*value').size('value', [4, 65]).color('year').shape('circle').style('year', (val) => {
        return {
          lineWidth: 1,
          strokeOpacity: 1,
          fillOpacity: 0.6,
          opacity: 0.95,
          stroke: 'rgba(0, 0, 0, .45)'
        }
      })
      chart.render()
    },
    setRegionPopDensityData () {
      const { DataView } = DataSet
      const dv = new DataView().source(this.RegionPopDensityData)
      dv.transform({
        type: 'fold',
        fields: ['value'], // 展开字段集
        key: 'user', // key字段
        value: 'score' // value字段
      })
      const chart = new Chart({container: 'RegionPopDensity', autoFit: true, height: 500})
      chart.data(dv.rows)
      chart.scale('score', {min: 329, max: 1535})
      chart.coordinate('polar', {radius: 0.8})
      chart.tooltip({
        shared: true,
        showCrosshairs: true,
        crosshairs: {
          line: {
            style: {
              lineDash: [4, 4],
              stroke: '#333'
            }
          }
        }
      })
      chart.axis('region', {
        line: null,
        tickLine: null,
        grid: {
          line: {
            style: {
              lineDash: null
            }
          }
        }
      })
      chart.axis('score', {
        line: null,
        tickLine: null,
        grid: {
          line: {
            type: 'line',
            style: {
              lineDash: null
            }
          }
        }
      })
      utils.changeChartAxisForeground(chart, 'region', '')
      chart.line().position('region*score').size(2)
      chart.point().position('region*score').shape('circle').size(4).style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1
      })
      chart.area().position('region*score')
      chart.render()
    },
    initStackBar () {
      // if (!this.stackBarArea || this.stackBarArea === null) {
      let stackBarArea = new Chart({
        container: 'YearPopulationLive',
        height: document.getElementById('YearPopulationLive').clientHeight,
        forceFit: true,
        animate: true,
        render: 'svg',
        padding: [70, 20, 30, 80]
      })
      // }
      stackBarArea.clear()
      stackBarArea.legend({
        position: 'top-right',
        offsetY: -2,
        autoWrap: true,
        attachLast: true,
        marker: 'square',
        textStyle: {
          fill: '#fff'
        }
      })
      stackBarArea.axis('areaValue', {
        line: null,
        label: {
          textStyle: {
            fill: '#fff'
          }
        }
      })
      stackBarArea.axis('year', {
        line: null,
        label: {
          textStyle: {
            fill: '#fff',
            fontSize: 13
          }
        },
        tickLine: null
      })
      stackBarArea.scale('value', {
        formatter: val => {
          return val + '/m2'
        },
        tickCount: 3
      })
      const ds = new DataSet()
      const dv = ds.createView().source(this.YearPopulationLiveData)
      dv.transform({
        type: 'rename',
        map: {
          businessArea: '商用面积',
          homesArea: '住宅面积'
        }
      }).transform({
        type: 'fold',
        fields: ['商用面积', '住宅面积'], // 展开字段集
        key: 'type', // key字段
        value: 'value' // value字段
      })
      stackBarArea.source(dv)
      stackBarArea.intervalStack()
        .position('year*value')
        .color('type')
      stackBarArea.render()
    }
  },
  mounted () {
    this.axios.get('/population/data').then(res => {
      this.YearPopulationLiveData = res.data.yearPopulation.filter(x => x.part === '0')
      this.RegionPopSexData = res.data.yearPopulation.filter(x => x.part === '1')
      this.YearPopulationTownRateData = res.data.yearPopulation.filter(x => x.part === '2')
      this.RegionPopDensityData = res.data.regionPopulation
      this.setYearPopulationLive()
      this.setRegionPopSex()
      this.setYearPopulationTownRate()
      this.setRegionPopDensityData()
      // this.initStackBar()
      // this.setDashData()
      // var result = res.data.yearMacro.filter(x => x.part === '0' && x.unit === '%')
      // this.electrics = result
      // console.log(this.electrics)
      // this.init()
    })
  }
}
</script>
<style scoped>
.pop-main{
 /* border: solid 2px red; */
  height: 100%;
  width: 100%;
}
#YearPopulationLive{
  left:10px;
  top:119px;
  width:400px;
  height:450px;
  border: solid 1px red;
}
#RegionPopSex{
  left:415px;
  top:119px;
  width:400px;
  height:450px;
}
#YearPopulationTownRate{
  left:10px;
  top:576px;
  width:400px;
  height:450px;
}
#RegionPopDensity{
  left:415px;
  top:576px;
  width:400px;
  height:450px;
}
#PopAnalysis{
  left:1300px;
  top:133px;
  width:610px;
  height:900px;
}
.top{
width: 100%;
height: 350px;
position: absolute;
top: 50px;
border: red solid 1px;
}
.center{
width: 100%;
position: absolute;
top: 410px;
bottom: 210px;
border: red solid 1px;
}
.bottom{
width: 100%;
height: 200px;
position: absolute;
border: red solid 1px;
bottom: 0;
}
.right{
/* width: 100px; */
height: 100%;
  /* border:solid #0e                                                                                                         fb5df7 2px; */
/* right: 0px; */
  margin-left: 200px;
}
.left{
height: 100%;
/* margin-right: 100px; */
width: 200px;
position: absolute;
background-color: rgba(0, 128, 0, 0.904);
  border:solid blue 1px;
  left:0px;
}
.describe{
border-color: transparent transparent transparent;
border-width: 0px 0px 0px 0px;
width:200px;
}
</style>
