<template>
  <div>
   <div  id='Map'>
     <label style="color:white;margin-top: 750px;z-index: 9999999999;position: absolute;text-align: right;margin-left: 100px;">规模以上工业增加值增速</label>
   </div>
    <div id='TotalValue' class="stas">
       <p>{{currentRegion}}工业总产值</p>
       <label>单位（亿元）</label>
    </div>
    <div id='EnterprisesLoss' class="stas">
       <p>{{currentRegion}}工业企业亏损面</p>
       <label>单位（%）</label>
    </div>
    <div id='EnterprisesNum' class="stas">
       <p>{{currentRegion}}工业企业单位数</p>
       <label>单位（个）</label>
    </div>
    <div id='TotalAssets' class="stas">
       <p>{{currentRegion}}工业企业资产总计</p>
       <label>单位（亿元）</label>
    </div>
    <div id='TotalProfit' class="stas">
       <p>{{currentRegion}}工业企业利润总额</p>
       <label>单位（亿元）</label>
    </div>
    <div id='EmployedNum' class="stas">
       <p>{{currentRegion}}工业企业平均用工人数</p>
       <label>单位（万人）</label>
    </div>
    <div id='RegressionModel' class="stas">
       <p>多元线性回归模型</p>
       <el-table :data="tableData" border  height="487px">
         <el-table-column prop="year" label="年份" width="60"></el-table-column>
         <el-table-column prop="createvalue" label="工业增加值（亿元）" width="83"></el-table-column>
         <el-table-column prop="rdpay" label="R&amp;D经费内部支出合计(亿元)" width="70"></el-table-column>
         <el-table-column prop="roadturnover" label="公路货物周转量（亿吨）" width="80"></el-table-column>
         <el-table-column prop="invest" label="工业固定资产投资完成额（亿元）" width="85"></el-table-column>
         <el-table-column prop="userforeign" label="实际利用外资(万美元)" width="70"></el-table-column>
         <el-table-column prop="urbanization" label="城镇化率(%)" width="60"></el-table-column>
         <el-table-column prop="importsandexports" label="进出口总额(万美元)" width="70"></el-table-column>
       </el-table>
    </div>
    <div  id='IndCreateValue' class="ModelChart">
      <label>工业增加值预测情况 单位（亿元）</label>
    </div>
  </div>
</template>
<script>
import { Chart } from '@antv/g2'
import { Scene, PolygonLayer, LineLayer, PointLayer, Control } from '@antv/l7'
// import { CityLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      TotalValueChart: null,
      TotalValueData: [],
      EnterprisesLossChart: null,
      EnterprisesLossData: [],
      EnterprisesNumChart: null,
      EnterprisesNumData: [],
      TotalAssetsChart: null,
      TotalAssetsData: [],
      TotalProfitChart: null,
      TotalProfitData: [],
      EmployedNumChart: null,
      EmployedNumData: [],
      IndCreateValueChart: null,
      IndCreateValueData: [],
      currentRegion: '',
      tableData: [],
      mapData: [],
      regionData: [],
      mapLayer: [],
      datakeys: [],
      geoData: [],
      covidGroupbyDate: {}
    }
  },
  methods: {
    changemapData () {
      let dateIndex = 1
      const date = this.datakeys[dateIndex++ % 30]
      this.mapLayer.setData(this.geoData, {
        parser: {
          type: 'geojson'
        },
        transforms: [
          {
            type: 'join',
            sourceField: 'name',
            targetField: 'name',
            data: this.covidGroupbyDate[date]
          }
        ]
      })
    },
    getMapColorData (data) {
      data.features.forEach(element => {
        element.properties.value = this.mapData.filter(x => x.name === element.properties.name)[0].value
      })
      return data
    },
    setMapData () {
      const scene = new Scene({
        id: 'Map',
        logoVisible: false,
        map: new Mapbox({
          // center: [ 118.35, 35.35 ],
          style: 'blank',
          zoom: 5,
          minZoom: 7.8,
          maxZoom: 7.8
        })
      })
      const legend = new Control({
        position: 'bottomright'
      })
      const color = [
        '#b3d1ff',
        '#99c1ff',
        '#80b2ff',
        '#66a2ff',
        '#4d93ff',
        '#3384ff',
        '#007acc'
      ]
      legend.onAdd = function () {
        var el = document.createElement('div')
        el.className = 'infolegend legend'
        el.style.width = '90px'
        el.style.marginBottom = '65px'
        el.style.marginRight = '40px'
        // el.style.height = '20px'
        var grades = [3, 5, 8, 10, 12, 14]
        for (var i = 0; i < grades.length; i++) {
          el.innerHTML +=
            '<div style="width:30px;height:10px;float:left;background:' +
            color[i] +
            '"></div> <lable  style="color:white;">' +
            grades[i] +
            (grades[i + 1] ? '–' + grades[i + 1] + '</label><br>' : '+')
        }
        return el
      }
      // const data = this.mapData
      scene.on('loaded', () => {
        fetch('./static/shp/linyi.json').then(res => res.json())
          .then(data => {
            const chinaPolygonLayer = new PolygonLayer({
              autoFit: true
            }).source(this.getMapColorData(data))
              .color(
                'value',
                [
                  '#b3d1ff',
                  '#007acc'
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
            }).source({type: 'FeatureCollection', features: []}).shape('line').size(2).color('red').style({opacity: 1})
            scene.addLayer(chinaPolygonLayer)
            scene.addLayer(layer2)
            scene.addLayer(hightLayer)
            chinaPolygonLayer.on('click', feature => {
              this.currentRegion = feature.feature.properties.name
              this.getSelectRegionData()
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
          scene.addControl(legend)
        })
      })
    },
    setTotalValue () {
      if (!this.TotalValueChart || this.TotalValueChart === null) {
        this.TotalValueChart = new Chart({
          container: 'TotalValue',
          height: document.getElementById('TotalValue').clientHeight,
          width: document.getElementById('TotalValue').clientWidth, // 指定图表宽度
          padding: [70, 20, 60, 40]
        })
      }
      this.TotalValueChart.data(this.TotalValueData)
      utils.changeChartAxisForeground(this.TotalValueChart, 'year', 'value')
      this.TotalValueChart.scale('value', {nice: true})
      this.TotalValueChart.tooltip({showMarkers: false})
      this.TotalValueChart.interaction('active-region')
      this.TotalValueChart.interval().position('year*value').color('#00CED1').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.TotalValueChart.render()
    },
    setEnterprisesLoss () {
      if (!this.EnterprisesLossChart || this.EnterprisesLossChart === null) {
        this.EnterprisesLossChart = new Chart({
          container: 'EnterprisesLoss',
          height: document.getElementById('EnterprisesLoss').clientHeight,
          width: document.getElementById('EnterprisesLoss').clientWidth, // 指定图表宽度
          padding: [70, 20, 60, 40]
        })
      }
      this.EnterprisesLossChart.data(this.EnterprisesLossData)
      utils.changeChartAxisForeground(this.EnterprisesLossChart, 'year', 'value')
      this.EnterprisesLossChart.area().position('year*value').color('l(96) 0:#24ff00 1:#000000').shape('smooth').tooltip(false)
      this.EnterprisesLossChart.line().position('year*value').size(2).color('#24ff00').shape('smooth').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.EnterprisesLossChart.render()
    },
    setEnterprisesNum () {
      if (!this.EnterprisesNumChart || this.EnterprisesNumChart === null) {
        this.EnterprisesNumChart = new Chart({
          container: 'EnterprisesNum',
          height: document.getElementById('EnterprisesNum').clientHeight,
          width: document.getElementById('EnterprisesNum').clientWidth, // 指定图表宽度
          padding: [70, 20, 60, 40]
        })
      }
      this.EnterprisesNumChart.data(this.EnterprisesNumData)
      utils.changeChartAxisForeground(this.EnterprisesNumChart, 'year', 'value')
      this.EnterprisesNumChart.scale('value', {nice: true})
      this.EnterprisesNumChart.tooltip({showMarkers: false})
      this.EnterprisesNumChart.interaction('active-region')
      this.EnterprisesNumChart.interval().position('year*value').color('#FFD700').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.EnterprisesNumChart.render()
    },
    setTotalAssets () {
      if (!this.TotalAssetsChart || this.TotalAssetsChart === null) {
        this.TotalAssetsChart = new Chart({
          container: 'TotalAssets',
          height: document.getElementById('TotalAssets').clientHeight,
          width: document.getElementById('TotalAssets').clientWidth, // 指定图表宽度
          padding: [70, 20, 60, 40]
        })
      }
      this.TotalAssetsChart.data(this.TotalAssetsData)
      utils.changeChartAxisForeground(this.TotalAssetsChart, 'year', 'value')
      this.TotalAssetsChart.scale('value', {nice: true})
      this.TotalAssetsChart.tooltip({showMarkers: false})
      this.TotalAssetsChart.interaction('active-region')
      this.TotalAssetsChart.interval().position('year*value').color('#7CFC00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.TotalAssetsChart.render()
    },
    setTotalProfit () {
      if (!this.TotalProfitChart || this.TotalProfitChart === null) {
        this.TotalProfitChart = new Chart({
          container: 'TotalProfit',
          height: document.getElementById('TotalProfit').clientHeight,
          width: document.getElementById('TotalProfit').clientWidth, // 指定图表宽度
          padding: [80, 20, 60, 30]
        })
      }
      this.TotalProfitChart.data(this.TotalProfitData)
      utils.changeChartAxisForeground(this.TotalProfitChart, 'year', 'value')
      this.TotalProfitChart.line().position('year*value').color('#FFFF00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.TotalProfitChart.point().position('year*value')
      this.TotalProfitChart.render()
    },
    setEmployedNum () {
      if (!this.EmployedNumChart || this.EmployedNumChart === null) {
        this.EmployedNumChart = new Chart({
          container: 'EmployedNum',
          height: document.getElementById('EmployedNum').clientHeight,
          width: document.getElementById('EmployedNum').clientWidth, // 指定图表宽度
          padding: [70, 20, 60, 40]
        })
      }
      this.EmployedNumChart.data(this.EmployedNumData)
      utils.changeChartAxisForeground(this.EmployedNumChart, 'year', 'value')
      this.EmployedNumChart.scale('value', {nice: true})
      this.EmployedNumChart.tooltip({showMarkers: false})
      this.EmployedNumChart.interaction('active-region')
      this.EmployedNumChart.interval().position('year*value').color('#7B68EE').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.EmployedNumChart.render()
    },
    setIndCreateValue () {
      let chart = new Chart({
        container: 'IndCreateValue',
        autoFit: true,
        padding: [70, 20, 60, 60]
      })
      chart.data(this.IndCreateValueData)
      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })
      chart.legend({
        position: 'top-right',
        offsetY: 35,
        offsetX: -5,
        itemName: {
          style: {
            fill: '#bddfff'
          }
        }
      })
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('type').shape('smooth')
      chart.point().position('year*value').color('type').shape('circle')
      chart.render()
    },
    getSelectRegionData () {
      this.TotalValueData = this.regionData.filter(x => x.part === '1' && x.region === this.currentRegion)
      this.EnterprisesLossData = this.regionData.filter(x => x.part === '3' && x.region === this.currentRegion)
      this.EnterprisesNumData = this.regionData.filter(x => x.part === '2' && x.region === this.currentRegion)
      this.TotalAssetsData = this.regionData.filter(x => x.part === '4' && x.region === this.currentRegion)
      this.TotalProfitData = this.regionData.filter(x => x.part === '5' && x.region === this.currentRegion)
      this.EmployedNumData = this.regionData.filter(x => x.part === '6' && x.region === this.currentRegion)
      this.setTotalValue()
      this.setEnterprisesLoss()
      this.setEnterprisesNum()
      this.setTotalAssets()
      this.setTotalProfit()
      this.setEmployedNum()
    }
  },
  mounted () {
    this.axios.get('/industry/check/data').then(res => {
      this.tableData = res.data.investData
      this.IndCreateValueData = res.data.yearData.filter(x => x.part === '0')
      this.regionData = res.data.regionData
      this.mapData = res.data.regionData.filter(x => x.part === '0').map(item => ({
        code: item.regioncode,
        name: item.region,
        value: item.value
      }))
      this.currentRegion = this.mapData[0].name
      this.setIndCreateValue()
      this.setMapData()
      this.getSelectRegionData()
    })
  }
}
</script>
<style scoped>
#Map{
  width: 560px;
  height: 945px;
  top:99px;
  position: absolute;
}
#TotalValue{
  height: 310px;
  left:560px;
  top:99px;
  width:380px
}
#EnterprisesLoss{
  height: 310px;
  left:945px;
  top:99px;
  width:380px
}
#EnterprisesNum{
  height: 310px;
  left:560px;
  top:415px;
  width:380px
}
#TotalAssets{
  height: 310px;
  left:560px;
  top:730px;
  width:380px
}
#TotalProfit{
  height: 310px;
  left:945px;
  top:415px;
  width:380px
}
#EmployedNum{
  height: 310px;
  left:945px;
  top:730px;
  width:380px
}
#RegressionModel{
  height: 945px;
  left:1330px;
  top:99px;
  width:580px
}
#IndCreateValue{
  height: 405px;
  left:1330px;
  top:640px;
  width:580px;
  position: absolute;
  z-index: 99;
}
.ModelChart > label{
  position: absolute;
  top: 15px;
  left: 0;
  color: #bddfff;
  line-height: 30px;
  padding-left: 10px;
  font-size: 15px;
  text-align: left;
}
.el-table{
  top:50px;
}
</style>
