<template>
  <div>
    <div id="map">
      <p>{{mapTitle}}</p>
      <el-select v-model="CurentYear" @change="yearChange">
        <el-option v-for="item in Years" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-card class="box-card" style="top:400px">
        <div slot="header" class="clearfix">
          <span>园区产值前5</span>
        </div>
        <div v-for="item in this.ParkOutPutValueTop" :key="item.id" class="text item">
          {{item.parkname}}：<label>{{item.outputvalue}}万元</label>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>园区投资前5</span>
        </div>
        <div v-for="item in this.ParkOutPutValueTop" :key="item.id" class="text item">
          {{item.parkname}}：<label>{{item.investvalue}}万元</label>
        </div>
      </el-card>
      <div class="mapLegend">
        <el-row><label>总产值</label></el-row>
        <el-row><label>高</label></el-row>
        <el-row><div style="height: 35px;width: 35px;"></div></el-row>
        <el-row><div style="height: 25px;width: 25px;"></div></el-row>
        <el-row><div style="height: 15px;width: 15px;"></div></el-row>
        <el-row><label>底</label></el-row>
      </div>
    </div>
    <div id='OutputValue' class="stas" v-if="ShowChart">
      <p>{{CurentYear}}{{CurrentRegion}}产值占比</p>
    </div>
    <div id='AddedValue' class="stas" v-if="ShowChart">
      <p>{{CurentYear}}{{CurrentRegion}}增加值占比</p>
    </div>
    <div id='InvestValue' class="stas" v-if="ShowChart">
      <p>{{CurentYear}}{{CurrentRegion}}投资占比</p>
    </div>
    <div id='EmploymentValue' class="stas" v-if="ShowChart">
      <p>{{CurentYear}}{{CurrentRegion}}就业占比</p>
    </div>
    <div id='AssetValue' class="stas" v-if="ShowChart">
      <p>{{CurentYear}}{{CurrentRegion}}资产占比</p>
    </div>
    <div id='DebtValue' class="stas" v-if="ShowChart">
      <p>{{CurentYear}}{{CurrentRegion}}负债占比</p>
    </div>
    <div id='CompanyOutPut' class="stas" v-if="!ShowChart">
      <p>{{CurentYear}}园区企业产值排名</p>
    </div>
    <div id='CompanyMain' class="stas" v-if="!ShowChart">
      <p>{{CurentYear}}园区企业主营业务收入排名</p>
    </div>
    <div id='CompanyProfit' class="stas" v-if="!ShowChart">
      <p>{{CurentYear}}园区企业利润排名</p>
    </div>
    <div class="topleft"></div>
    <div class="topright"></div>
    <div class="bottomleft"></div>
    <div class="bottomright"></div>
  </div>
</template>
<script>
import { Chart } from '@antv/g2'
import * as utils from '@/utils/commonUtils.js'
import { Scene, PolygonLayer, LineLayer, PointLayer } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
export default {
  data () {
    return {
      mapTitle: '临沂市各区县总产值分布图',
      ShowChart: true,
      CurrentLayer: '临沂市',
      Years: [],
      CurentYear: '2019年10月',
      CurrentRegion: '临沂市各区县',
      OutputValueChart: null,
      OutputValueData: [],
      AddedValueChart: null,
      AddedValueData: [],
      InvestValueChart: null,
      InvestValueData: [],
      EmploymentValueChart: null,
      EmploymentValueData: [],
      AssetValueChart: null,
      AssetValueData: [],
      DebtValueChart: null,
      DebtValueData: [],
      CompanyOutPutChart: null,
      CompanyOutPutData: [],
      CompanyMainChart: null,
      CompanyMainData: [],
      CompanyProfitChart: null,
      CompanyProfitData: [],
      colorMapData: [],
      ParkOutPutValueTop: [],
      ParkInvestTop: [],
      mapParkData: []
    }
  },
  methods: {
    setOutputValue () {
      if (!this.OutputValueChart || this.OutputValueChart === null) {
        this.OutputValueChart = new Chart({
          container: 'OutputValue',
          height: document.getElementById('OutputValue').clientHeight,
          width: document.getElementById('OutputValue').clientWidth, // 指定图表宽度
          padding: [60, 20, 20, 20]
        })
      }
      this.OutputValueChart.data(this.OutputValueData)
      this.OutputValueChart.legend('region', false)
      utils.changeChartAxisForeground(this.OutputValueChart, 'region', 'value')
      this.OutputValueChart.coordinate('theta', {radius: 0.95, innerRadius: 0.6})
      this.OutputValueChart.interval().adjust('stack').position('value').color('region').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.region}: ${value}`
          }
        }
      },
      {
        style: {
          fill: '#bddfff'
        }
      }).tooltip('region*value', (region, value) => {
        value = value + ''
        return {
          name: region,
          value: value
        }
      })
      this.OutputValueChart.axis('value', {
        label: null
      })
      this.OutputValueChart.interaction('element-active')
      this.OutputValueChart.render()
    },
    setAddedValue () {
      if (!this.AddedValueChart || this.AddedValueChart === null) {
        this.AddedValueChart = new Chart({
          container: 'AddedValue',
          height: document.getElementById('AddedValue').clientHeight,
          width: document.getElementById('AddedValue').clientWidth, // 指定图表宽度
          padding: [60, 20, 20, 20]
        })
      }
      this.AddedValueChart.data(this.AddedValueData)
      this.AddedValueChart.legend('region', false)
      utils.changeChartAxisForeground(this.AddedValueChart, 'region', 'value')
      this.AddedValueChart.coordinate('theta', {radius: 0.95, innerRadius: 0.6})
      this.AddedValueChart.interval().adjust('stack').position('value').color('region').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.region}: ${value}`
          }
        }
      },
      {
        style: {
          fill: '#bddfff'
        }
      }).tooltip('region*value', (region, value) => {
        value = value + ''
        return {
          name: region,
          value: value
        }
      })
      this.AddedValueChart.axis('value', {
        label: null
      })
      this.AddedValueChart.interaction('element-active')
      this.AddedValueChart.render()
    },
    setInvestValue () {
      if (!this.InvestValueChart || this.InvestValueChart === null) {
        this.InvestValueChart = new Chart({
          container: 'InvestValue',
          height: document.getElementById('InvestValue').clientHeight,
          width: document.getElementById('InvestValue').clientWidth, // 指定图表宽度
          padding: [60, 20, 20, 20]
        })
      }
      this.InvestValueChart.data(this.InvestValueData)
      this.InvestValueChart.legend('region', false)
      utils.changeChartAxisForeground(this.InvestValueChart, 'region', 'value')
      this.InvestValueChart.coordinate('theta', {radius: 0.95, innerRadius: 0.6})
      this.InvestValueChart.interval().adjust('stack').position('value').color('region').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.region}: ${value}`
          }
        }
      },
      {
        style: {
          fill: '#bddfff'
        }
      }).tooltip('region*value', (region, value) => {
        value = value + ''
        return {
          name: region,
          value: value
        }
      })
      this.InvestValueChart.axis('value', {
        label: null
      })
      this.InvestValueChart.interaction('element-active')
      this.InvestValueChart.render()
    },
    setEmploymentValue () {
      if (!this.EmploymentValueChart || this.EmploymentValueChart === null) {
        this.EmploymentValueChart = new Chart({
          container: 'EmploymentValue',
          height: document.getElementById('EmploymentValue').clientHeight,
          width: document.getElementById('EmploymentValue').clientWidth, // 指定图表宽度
          padding: [60, 20, 20, 20]
        })
      }
      this.EmploymentValueChart.data(this.EmploymentValueData)
      this.EmploymentValueChart.legend('region', false)
      utils.changeChartAxisForeground(this.EmploymentValueChart, 'region', 'value')
      this.EmploymentValueChart.coordinate('theta', {radius: 0.95, innerRadius: 0.6})
      this.EmploymentValueChart.interval().adjust('stack').position('value').color('region').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.region}: ${value}`
          }
        }
      },
      {
        style: {
          fill: '#bddfff'
        }
      }).tooltip('region*value', (region, value) => {
        value = value + ''
        return {
          name: region,
          value: value
        }
      })
      this.EmploymentValueChart.axis('value', {
        label: null
      })
      this.EmploymentValueChart.interaction('element-active')
      this.EmploymentValueChart.render()
    },
    setAssetValue () {
      if (!this.AssetValueChart || this.AssetValueChart === null) {
        this.AssetValueChart = new Chart({
          container: 'AssetValue',
          height: document.getElementById('AssetValue').clientHeight,
          width: document.getElementById('AssetValue').clientWidth, // 指定图表宽度
          padding: [60, 20, 20, 20]
        })
      }
      this.AssetValueChart.data(this.AssetValueData)
      this.AssetValueChart.legend('region', false)
      utils.changeChartAxisForeground(this.AssetValueChart, 'region', 'value')
      this.AssetValueChart.coordinate('theta', {radius: 0.95, innerRadius: 0.6})
      this.AssetValueChart.interval().adjust('stack').position('value').color('region').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.region}: ${value}`
          }
        }
      },
      {
        style: {
          fill: '#bddfff'
        }
      }).tooltip('region*value', (region, value) => {
        value = value + ''
        return {
          name: region,
          value: value
        }
      })
      this.AssetValueChart.axis('value', {
        label: null
      })
      this.AssetValueChart.interaction('element-active')
      this.AssetValueChart.render()
    },
    setDebtValue () {
      if (!this.DebtValueChart || this.DebtValueChart === null) {
        this.DebtValueChart = new Chart({
          container: 'DebtValue',
          height: document.getElementById('DebtValue').clientHeight,
          width: document.getElementById('DebtValue').clientWidth, // 指定图表宽度
          padding: [60, 20, 20, 20]
        })
      }
      this.DebtValueChart.data(this.DebtValueData)
      this.DebtValueChart.legend('region', false)
      utils.changeChartAxisForeground(this.DebtValueChart, 'region', 'value')
      this.DebtValueChart.coordinate('theta', {radius: 0.95, innerRadius: 0.6})
      this.DebtValueChart.interval().adjust('stack').position('value').color('region').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.region}: ${value}`
          }
        }
      },
      {
        style: {
          fill: '#bddfff'
        }
      }).tooltip('region*value', (region, value) => {
        value = value + ''
        return {
          name: region,
          value: value
        }
      })
      this.DebtValueChart.axis('value', {
        label: null
      })
      this.DebtValueChart.interaction('element-active')
      this.DebtValueChart.render()
    },
    setCompanyOutPut () {
      if (!this.CompanyOutPutChart || this.CompanyOutPutChart === null) {
        this.CompanyOutPutChart = new Chart({
          container: 'CompanyOutPut',
          height: document.getElementById('CompanyOutPut').clientHeight,
          width: document.getElementById('CompanyOutPut').clientWidth, // 指定图表宽度
          padding: [60, 20, 20, 20]
        })
      }
    },
    setCompanyMain () {
      if (!this.CompanyMainChart || this.CompanyMainChart === null) {
        this.CompanyMainChart = new Chart({
          container: 'CompanyMain',
          height: document.getElementById('CompanyMain').clientHeight,
          width: document.getElementById('CompanyMain').clientWidth, // 指定图表宽度
          padding: [70, 40, 60, 50]
        })
      }
    },
    setCompanyProfit () {
      if (!this.CompanyProfitChart || this.CompanyProfitChart === null) {
        this.CompanyProfitChart = new Chart({
          container: 'CompanyProfit',
          height: document.getElementById('CompanyProfit').clientHeight,
          width: document.getElementById('CompanyProfit').clientWidth, // 指定图表宽度
          padding: [70, 40, 60, 50]
        })
      }
    },
    getChartDataByTime () {
      this.axios.get('/industry/park/data/' + this.CurentYear).then(res => {
        this.colorMapData = res.data.regionData.filter(x => x.part === '0').map(item => ({
          code: item.regioncode,
          name: item.region,
          value: item.value
        }))
        this.ParkOutPutValueTop = []
        this.ParkInvestTop = []
        this.ParkOutPutValueTop = utils.sortByKey(res.data.parkData, 'outputvalue').slice(0, 5)
        this.ParkInvestTop = utils.sortByKey(res.data.parkData, 'investvalue').slice(0, 5)
        this.mapParkData = res.data.parkData
        console.log(this.mapParkData)
        if (this.CurrentLayer === '临沂市') {
          this.OutputValueData = res.data.regionData.filter(x => x.part === '0')
          this.AddedValueData = res.data.regionData.filter(x => x.part === '1')
          this.InvestValueData = res.data.regionData.filter(x => x.part === '2')
          this.EmploymentValueData = res.data.regionData.filter(x => x.part === '3')
          this.AssetValueData = res.data.regionData.filter(x => x.part === '4')
          this.DebtValueData = res.data.regionData.filter(x => x.part === '5')
        } else if (this.CurrentLayer === '各区县') {
          this.OutputValueData = []
          this.AddedValueData = []
          this.InvestValueData = []
          this.EmploymentValueData = []
          this.AssetValueData = []
          this.DebtValueData = []
          let regiondata = res.data.parkData.slice(0, 5)
          regiondata.forEach(element => {
            this.OutputValueData.push({
              year: element.year,
              region: element.parkname,
              value: element.outputvalue
            })
            this.AddedValueData.push({
              year: element.year,
              region: element.parkname,
              value: element.addedvalue
            })
            this.InvestValueData.push({
              year: element.year,
              region: element.parkname,
              value: element.investvalue
            })
            this.EmploymentValueData.push({
              year: element.year,
              region: element.parkname,
              value: element.employmentvalue
            })
            this.AssetValueData.push({
              year: element.year,
              region: element.parkname,
              value: element.assetvalue
            })
            this.DebtValueData.push({
              year: element.year,
              region: element.parkname,
              value: element.debtvalue
            })
          })
        }
        this.setOutputValue()
        this.setAddedValue()
        this.setInvestValue()
        this.setEmploymentValue()
        this.setAssetValue()
        this.setDebtValue()
      })
    },
    yearChange (item) {
      this.CurentYear = item
      this.getChartDataByTime()
    },
    getMapColorData (data) {
      data.features.forEach(element => {
        element.properties.value = this.colorMapData.filter(x => x.name === element.properties.name)[0].value
      })
      return data
    },
    setMap () {
      const scene = new Scene({
        id: 'map',
        logoVisible: false,
        map: new GaodeMap({
          pitch: 0,
          style: 'light',
          layers: [],
          // center: [ 118.35, 35.35 ],
          zoom: 12
        })
      })
      scene.on('loaded', () => {
        const layer1 = new AMap.TileLayer.Satellite()
        scene.map.setLayers([])
        layer1.setMap(scene.map)
        fetch(
          './static/shp/linyi.json'
        ).then(res => res.json())
          .then(data => {
            const chinaPolygonLayer = new PolygonLayer({
              autoFit: true
            })
              .source(this.getMapColorData(data))
              .color(
                'value',
                [
                  '#eceef860',
                  '#323e89ce'
                ]
              )
              .shape('fill')
              .style({
                opacity: 1
              })
              //  图层边界
            const layer2 = new LineLayer({
              zIndex: 2
            }).source(data).color('#fff').size(0.6).style({
              opacity: 1
            })
            const hightLayer = new LineLayer({
              zIndex: 4, // 设置显示层级
              name: 'hightlight'
            })
              .source({
                type: 'FeatureCollection',
                features: [ ]
              })
              .shape('line')
              .size(2)
              .color('red')
              .style({
                opacity: 1
              })
            const pointLayer = new PointLayer({})
              .source(this.mapParkData, {
                parser: {
                  type: 'json',
                  x: 'lon',
                  y: 'lat'
                }
              }).shape('circle').size('outputvalue', [ 10, 25 ]).active(true).color('yellow').style({
                opacity: 0.3,
                strokeWidth: 2
              })
            scene.addLayer(chinaPolygonLayer)
            scene.addLayer(layer2)
            scene.addLayer(pointLayer)
            scene.addLayer(hightLayer)
            chinaPolygonLayer.on('click', feature => {
              console.log(feature, feature.feature.properties.name)
              this.CurrentLayer = '各区县'
              this.CurrentRegion = feature.feature.properties.name
              this.getChartDataByTime()
              hightLayer.setData({
                type: 'FeatureCollection',
                features: [ feature.feature ]
              })
            })
          })
        fetch('./static/shp/linyi_name.json' // 标注数据
        ).then(res => res.json()).then(data => {
          const labelLayer = new PointLayer({
            zIndex: 5
          }).source(data, {
            parser: {
              type: 'json',
              coordinates: 'center'
            }
          }).color('#fff').shape('name', 'text').size(18).style({
            opacity: 1,
            stroke: '#fff',
            strokeWidth: 0,
            padding: [ 5, 5 ],
            textAllowOverlap: false
          })
          scene.addLayer(labelLayer)
        })
      })
    }
  },
  mounted () {
    this.axios.get('/industry/park/data').then(res => {
      this.Years = res.data.regionData.range
      this.CurentYear = res.data.regionData.first
      this.getChartDataByTime()
      this.setMap()
      // this.test()
      // this.test2()
    })
    // this.test()
    // this.colorMapData = res.data.filter(x => x.type === '投资额').map(item => ({
    //   code: item.regioncode,
    //   name: item.region,
    //   value: item.value
    // }))
  }
}
</script>
<style scoped>
.topleft{position: absolute; width: 40px; height: 40px; left:11px; top:84px;border:#165af5 solid 4px;border-right: 0;border-bottom: 0;}
.topright{position: absolute; width: 40px; height: 40px; left:11px; top:1014px;border:#165af5 solid 4px;border-right: 0;border-top: 0;}
.bottomleft{position: absolute; width: 40px; height: 40px; left:859px; top:84px;border:#165af5 solid 4px;border-left: 0;border-bottom: 0;}
.bottomright{position: absolute; width: 40px; height: 40px; left:859px; top:1014px;border:#165af5 solid 4px;border-left: 0;border-top: 0;}
#map{position:absolute;height: 970px;width:885px;top:88px;left:15px;}
#OutputValue{height: 320px;left: 910px;top:88px;width: 495px;}
#AddedValue{height: 320px;left: 1410px;top:88px;width: 495px;}
#InvestValue{height: 320px;left: 910px;top:415px;width: 495px;}
#EmploymentValue{height: 320px;left: 1410px;top:415px;width: 495px;}
#AssetValue{height: 320px;left: 910px;top:740px;width: 495px;}
#DebtValue{height: 320px;left: 1410px;top:740px;width: 495px;}
#CompanyOutPut{height: 545px;left: 910px;top:88px;width: 495px;}
#CompanyMain{height: 545px;left: 1410px;top:88px;width: 495px;}
#CompanyProfit{height: 420px;left: 910px;top:640px;width: 995px;}
.el-select{
  width: 120px;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 50px;
  z-index: 99;
  /* background-color: transparent; */
}
#map>p{
  position: absolute;
  color: white;
  z-index: 99;
  font-size: 40px;
  width:885px;
  font-weight: bold;
  top:10px
}
.box-card{
  position: absolute;
  z-index: 99;
  background-color: #00000053;
  border:0;
  color:white;
  font-size: 18px;
  line-height: 26px;
  text-align: left;
  top:200px;
  right: 5px;
  min-width: 290px;
}
.mapLegend{
  height:210px;
  width:120px;
  bottom:80px;
  position: absolute;
  left:10px;
  z-index: 999;
}
.mapLegend>.el-row>label{
  font-size: 20px;
  color: white;
  font-weight: bold;
}
.mapLegend>.el-row>div{
  background: rgba(255, 255, 0, 0.226);
  border:solid 2px yellow;
  border-radius: 50%;
  margin:auto;
}
.mapLegend>.el-row{
  margin-top:10px
}
</style>
<style>
.el-card__header {
  padding: 10px;
  border-bottom: 0px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #515151;
  color: orange;
  font-size: 20px;
}
.el-card__body {
  padding: 10px;
}
.text>label{
  color: yellow;
}
</style>
