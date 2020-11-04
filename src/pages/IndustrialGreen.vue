<template>
  <div>
    <div class="webpage stas">
      <iframe :src="iframeUrl" frameborder="0"  width='100%' height='100%'></iframe>
      <div class="webpagedescribe">
        <p style="top:140px;">无植被覆盖率占比：{{Novegetation}}%</p>
        <p style="top:180px;">底植被覆盖率占比：{{Lowvegetation}}%</p>
        <p style="top:220px;">中等植被覆盖率占比：{{Mediumvegetation}}%</p>
        <p style="top:260px;">中高植被覆盖率占比：{{Mediumhighvegetation}}%</p>
        <p style="top:300px;">高植被覆盖率占比：{{Highvegetation}}%</p>
      </div>
    </div>
    <div id='environmentalQuality' class="stas">
       <p>临沂市环境质量情况</p>
       <div id='ForestCoverage'>
        <label>森林覆盖率</label>
        <label style="left:260px">单位（%）</label>
      </div>
      <div id='WastewaterTreatmentRate'>
        <label>污水处理集中处理率</label>
        <label style="left:260px">单位（%）</label>
      </div>
       <div id='AirQuality'>
        <label>空气质量优良天数</label>
      </div>
      <div id='WasteUtilization'>
        <label>工业固体废物综合利用率</label>
        <label style="left:260px">单位（%）</label>
      </div>
    </div>
    <div id='carCharge' class="stas">
      <p>2019年新能源汽车公共充电桩分布情况</p>
      <el-row>
        <el-col :span="10">
          <div id='map'>
            <div class="mapLegend">
              <el-row>
                <el-col :span="6"><img src="../../static/image/location_yellow.png" style="height: 25px;width: 25px;"/></el-col>
                <el-col :span="18"><label>快速充电桩</label></el-col>
              </el-row>
                <el-row>
                <el-col :span="6"><img src="../../static/image/location_blue.png" style="height: 25px;width: 25px;"/></el-col>
                <el-col :span="18"><label>公共充电桩</label></el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <el-table :data="tableData" border  height="320px">
            <el-table-column prop="area" label=" " width="60"></el-table-column>
            <el-table-column prop="oneyear" label="2016年" width="110"></el-table-column>
            <el-table-column prop="twoyear" label="2017年" width="70"></el-table-column>
            <el-table-column prop="threeyear" label="2018年" width="70"></el-table-column>
            <el-table-column prop="fouryear" label="2019年" width="70"></el-table-column>
            <el-table-column prop="fiveyear" label="2020年" width="70"></el-table-column>
          </el-table>
          <div class="tableRemarks">注：2017-2020年以2016年推广数为基数按2%、3%、4%、5%比例增加</div>
        </el-col>
      </el-row>
    </div>
    <div id='energyConsumeAndIndustryCreate' class="stas">
      <p>能源消耗与工业增加值变动关系</p>
      <el-row>
        <el-col :span="8">
          <div id ='CreateValueCost'>
            <label>单位工业增加值能耗降低率</label>
          </div>
        </el-col>
        <el-col :span="8">
          <div id ='Tpio'>
            <label>能源Tpio脱钩指标分布图</label>
          </div>
        </el-col>
        <el-col :span="8">
          <div id ='ElasticIndex'>
            <label>能源消耗脱钩弹性指数</label>
          </div>
        </el-col>
      </el-row>
    </div>
    <div id='threeWastes' class="stas">
      <p>工业三废排放情况</p>
      <el-row>
        <el-col :span="12">
          <div id ='SO2SootDust'>
            <label>工业二氧化硫和烟粉尘排放量</label>
            <label style="left:280px">单位（吨）</label>
          </div>
        </el-col>
        <el-col :span="12">
          <div id ='WasteDischarge'>
            <label>工业废水排放总量</label>
            <label style="left:270px">单位（万吨）</label>
          </div>
        </el-col>
      </el-row>
    </div>
    <div id='threeWastesAndIndustryCreate' class="stas">
      <p>2019年工业三废排放量与工业增加值变动关系图</p>
      <el-row>
        <el-col :span="8">
          <div id ='IndusWasteWater'>
            <label>工业增加值与工业废水排放总量</label>
          </div>
        </el-col>
        <el-col :span="8">
          <div id ='IndusTobaccoPowder'>
            <label>工业增加值与废气排放量</label>
          </div>
        </el-col>
        <el-col :span="8">
          <div id ='IndusSolidWaste'>
            <label>工业增加值与一般工业固体废物量</label>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as api from '@/api.js'
import { Chart } from '@antv/g2'
import { Scene, PointLayer } from '@antv/l7'
import { CityLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      Novegetation: '',
      Lowvegetation: '',
      Mediumvegetation: '',
      Mediumhighvegetation: '',
      Highvegetation: '',
      ForestCoverageData: [],
      WastewaterTreatmentRateData: [],
      AirQualityData: [],
      WasteUtilizationData: [],
      CreateValueCostData: [],
      TpioData: [],
      ElasticIndexData: [],
      SO2SootDustData: [],
      WasteDischargeData: [],
      IndusWasteWaterData: [],
      IndusTobaccoPowderData: [],
      IndusSolidWasteData: [],
      tableData: [],
      greenData: [],
      mapData: [],
      iframeUrl: ''
    }
  },
  methods: {
    setForestCoverage () {
      let chart = new Chart({
        container: 'ForestCoverage',
        height: document.getElementById('ForestCoverage').clientHeight,
        width: document.getElementById('ForestCoverage').clientWidth, // 指定图表宽度
        padding: [80, 20, 20, 40]
      })
      chart.data(this.ForestCoverageData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#00CED1').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setWastewaterTreatmentRate () {
      let chart = new Chart({
        container: 'WastewaterTreatmentRate',
        height: document.getElementById('WastewaterTreatmentRate').clientHeight,
        width: document.getElementById('WastewaterTreatmentRate').clientWidth, // 指定图表宽度
        padding: [80, 20, 20, 40]
      })
      chart.data(this.WastewaterTreatmentRateData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.area().position('year*value').color('l(96) 0:#24ff00 1:#000000').shape('smooth').tooltip(false)
      chart.line().position('year*value').size(2).color('#24ff00').shape('smooth').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setAirQuality () {
      let chart = new Chart({
        container: 'AirQuality',
        forceFit: false,
        height: document.getElementById('AirQuality').clientHeight,
        width: document.getElementById('AirQuality').clientWidth, // 指定图表宽度
        animate: true,
        padding: [70, 40, 20, 50]
      })
      chart.scale('达标率', { // 右侧坐标轴
        min: 20,
        max: 100,
        tickCount: 4, // 左右坐标轴刻度数量保持一致 好看点
        range: [0, 1 - 1 / 10 / 2]
      })
      chart.legend({
        custom: true,
        position: 'top-right',
        offsetY: 35,
        offsetX: -5,
        flipPage: false,
        items: [
          {
            name: '空气质量优良天数(天)',
            marker: {
              symbol: 'square',
              style: {
                fill: '#3182bd'
              },
              clickable: false
            }
          },
          {
            name: '达标率(%)',
            marker: {
              symbol: 'circle',
              style: {
                fill: '#fdae6b'
              },
              clickable: false
            }
          }
        ],
        itemName: {
          style: {
            fill: '#bddfff'
          }
        }
      })
      chart.axis('达标率', {
        grid: null,
        label: {
          textStyle: {
            fill: '#fdae6b'
          }
        }
      })
      chart.tooltip({shared: true})
      utils.changeChartAxisForeground(chart, '空气质量优良天数', 'year')
      utils.changeChartAxisForeground(chart, '达标率', '')
      chart.data(this.AirQualityData)
      chart.interval().position('year*空气质量优良天数').color('#3182bd')
      chart.line().position('year*达标率').color('#fdae6b').size(3).shape('smooth')
      chart.point().position('year*达标率').color('#fdae6b').size(3).shape('circle')
      chart.render()
    },
    setWasteUtilization () {
      let chart = new Chart({
        container: 'WasteUtilization',
        height: document.getElementById('WasteUtilization').clientHeight,
        width: document.getElementById('WasteUtilization').clientWidth, // 指定图表宽度
        padding: [80, 20, 40, 30]
      })
      chart.data(this.WasteUtilizationData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#FFFF00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    setCreateValueCost () {
      let chart = new Chart({
        container: 'CreateValueCost',
        height: document.getElementById('CreateValueCost').clientHeight,
        width: document.getElementById('CreateValueCost').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.CreateValueCostData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#D2691E')
      chart.render()
    },
    setTpio () {
      let chart = new Chart({
        container: 'Tpio',
        height: document.getElementById('Tpio').clientHeight,
        width: document.getElementById('Tpio').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.legend('year', false)
      chart.data(this.TpioData)
      chart.point().position('year*value').color('year').shape('circle').size(8).tooltip('year*value').style({
        fillOpacity: 0.85
      })
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.interaction('legend-highlight')
      chart.render()
    },
    setElasticIndex () {
      let chart = new Chart({
        container: 'ElasticIndex',
        height: document.getElementById('ElasticIndex').clientHeight,
        width: document.getElementById('ElasticIndex').clientWidth, // 指定图表宽度
        padding: [80, 20, 60, 30]
      })
      chart.data(this.ElasticIndexData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#9370DB')
      chart.point().position('year*value')
      chart.render()
    },
    setIndusWasteWater () {
      let chart = new Chart({
        container: 'IndusWasteWater',
        height: document.getElementById('IndusWasteWater').clientHeight,
        width: document.getElementById('IndusWasteWater').clientWidth, // 指定图表宽度
        padding: [80, 20, 60, 30]
      })
      chart.data(this.IndusWasteWaterData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#7FFF00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    setIndusTobaccoPowder () {
      let chart = new Chart({
        container: 'IndusTobaccoPowder',
        height: document.getElementById('IndusTobaccoPowder').clientHeight,
        width: document.getElementById('IndusTobaccoPowder').clientWidth, // 指定图表宽度
        padding: [80, 20, 60, 30]
      })
      chart.data(this.IndusTobaccoPowderData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#FFA07A').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    setIndusSolidWaste () {
      let chart = new Chart({
        container: 'IndusSolidWaste',
        height: document.getElementById('IndusSolidWaste').clientHeight,
        width: document.getElementById('IndusSolidWaste').clientWidth, // 指定图表宽度
        padding: [80, 20, 60, 30]
      })
      chart.data(this.IndusSolidWasteData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#4169E1').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    setSO2SootDust () {
      let chart = new Chart({
        container: 'SO2SootDust',
        forceFit: true,
        height: document.getElementById('SO2SootDust').clientHeight,
        width: document.getElementById('SO2SootDust').clientWidth, // 指定图表宽度
        animate: true,
        padding: [80, 20, 30, 70]
      })
      chart.tooltip({
        showMarkers: false,
        shared: true
      })
      chart.legend({
        position: 'top-right',
        offsetY: 60,
        offsetX: -10,
        itemName: {
          style: {
            fill: '#bddfff'
          }
        }
      })
      utils.changeChartAxisForeground(chart, 'value', 'year')
      chart.data(this.SO2SootDustData)
      chart.interval().position('year*value').color('type').adjust([
        {
          type: 'dodge',
          marginRatio: 0
        }
      ])
      chart.render()
    },
    setWasteDischarge () {
      let chart = new Chart({
        container: 'WasteDischarge',
        height: document.getElementById('WasteDischarge').clientHeight,
        width: document.getElementById('WasteDischarge').clientWidth, // 指定图表宽度
        padding: [70, 20, 30, 40]
      })
      chart.data(this.WasteDischargeData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#1E90FF').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    getGreenDataByYear (year) {
      this.Novegetation = this.greenData.filter(x => x.year === year)[0].novegetation
      this.Lowvegetation = this.greenData.filter(x => x.year === year)[0].lowvegetation
      this.Mediumvegetation = this.greenData.filter(x => x.year === year)[0].mediumvegetation
      this.Mediumhighvegetation = this.greenData.filter(x => x.year === year)[0].mediumhighvegetation
      this.Highvegetation = this.greenData.filter(x => x.year === year)[0].highvegetation
    },
    setMapChartData () {
      const scene = new Scene({
        id: 'map',
        logoVisible: false,
        map: new Mapbox({
          // center: [ 118.35, 35.35 ],
          style: 'blank',
          zoom: 5,
          minZoom: 6.8,
          maxZoom: 6.8
        })
      })
      scene.on('loaded', () => {
        /* eslint-disable no-new */
        new CityLayer(scene, {
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
                '#b8ff21',
                '#00d8ff'
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
        scene.addImage(
          '0',
          '../../static/image/location_blue.png'
        )
        scene.addImage(
          '1',
          '../../static/image/location_yellow.png'
        )
        const imageLayer = new PointLayer()
          .source(this.mapData, {
            parser: {
              type: 'json',
              x: 'lon',
              y: 'lat'
            }
          }).shape('type', ['0', '1']).size(12)
        scene.addLayer(imageLayer)
      })
    }
  },
  mounted () {
    this.iframeUrl = api.GREEN_URL
    this.axios.get('/industry/green/data/').then(res => {
      this.ForestCoverageData = res.data.yearData.filter(x => x.part === '0')
      this.WastewaterTreatmentRateData = res.data.yearData.filter(x => x.part === '1')
      let data = res.data.yearData.filter(x => x.part === '2' && x.type === '空气质量优良天数')
      let ratedata = res.data.yearData.filter(x => x.part === '2' && x.type === '达标率')
      for (var i = 0; i < data.length; i++) {
        this.AirQualityData.push({
          year: data[i].year,
          空气质量优良天数: data[i].value,
          达标率: ratedata.filter(x => x.year === data[i].year)[0].value
        })
      }
      this.WasteUtilizationData = res.data.yearData.filter(x => x.part === '11')
      this.CreateValueCostData = res.data.yearData.filter(x => x.part === '3')
      this.TpioData = res.data.yearData.filter(x => x.part === '7')
      this.ElasticIndexData = res.data.yearData.filter(x => x.part === '4')
      this.SO2SootDustData = res.data.yearData.filter(x => x.part === '5')
      this.WasteDischargeData = res.data.yearData.filter(x => x.part === '6')
      this.IndusWasteWaterData = res.data.yearData.filter(x => x.part === '8')
      this.IndusTobaccoPowderData = res.data.yearData.filter(x => x.part === '9')
      this.IndusSolidWasteData = res.data.yearData.filter(x => x.part === '10')
      this.tableData = res.data.tableData
      this.greenData = res.data.greenData
      this.mapData = res.data.mapData
      this.setForestCoverage()
      this.setWastewaterTreatmentRate()
      this.setAirQuality()
      this.setWasteUtilization()
      this.setCreateValueCost()
      this.setTpio()
      this.setElasticIndex()
      this.setIndusWasteWater()
      this.setIndusTobaccoPowder()
      this.setIndusSolidWaste()
      this.setSO2SootDust()
      this.setWasteDischarge()
      this.getGreenDataByYear('2006')
      this.setMapChartData()
    })
  }
}
</script>
<style scoped>
#environmentalQuality{
  height: 985px;left: 10px;top:80px;width:350px
}
#carCharge{
  height: 400px;left: 366px;top:664px;width:800px
}
#energyConsumeAndIndustryCreate{
  height: 320px;left: 1170px;top:80px;width:740px
}
#threeWastes{
  height: 310px;left: 1170px;top:405px;width:740px
}
#threeWastesAndIndustryCreate{
  height: 340px;left: 1170px;top:720px;width:740px
}
.webpage{
  height: 578px;left: 366px;top:80px;width:800px
}
.webpagedescribe >p{
  border-style: none;color: #bddfff;font-size: 18px;left:520px;
}
#ForestCoverage,#WastewaterTreatmentRate,#AirQuality,#WasteUtilization{
  height:240px; width: 350px;position: relative;
}
#CreateValueCost,#Tpio,#ElasticIndex,#IndusWasteWater,#IndusTobaccoPowder,#IndusSolidWaste{
  height: 320px;width: 246px;position: relative;
}
#SO2SootDust,#WasteDischarge{
  height: 310px;width:370px;position: relative;
}
#ForestCoverage > label,#WastewaterTreatmentRate>label,#AirQuality>label,#WasteUtilization>label,
#CreateValueCost>label,#Tpio>label,#ElasticIndex>label,#IndusWasteWater>label,#IndusTobaccoPowder>label,#IndusSolidWaste>label,
#SO2SootDust>label,#WasteDischarge>label{
  position: absolute;
  top: 30px;
  left: 0;
  color: #bddfff;
  line-height: 30px;
  padding-left: 10px;
  font-size: 15px;
  text-align: left;
}
.tableRemarks{
  color: #bddfff;
  text-align: left;
  margin-top:60px
}
.el-table{
  top:50px;
  width: 455px;
}
#map{
  width: 330px;
  height: 400px;
  position: relative;
}
.mapLegend{
  height:80px;
  width:150px;
  bottom:10px;
  position: absolute;
  right:0px
}
.mapLegend>.el-row>.el-col>label{
  font-size: 20px;
  color: white;
  font-weight: bold;
}
.mapLegend>.el-row{
  margin-top:10px
}
</style>
