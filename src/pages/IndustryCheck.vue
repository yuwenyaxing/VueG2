<template>
  <div>
   <div  id='Map'></div>
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
import { Scene } from '@antv/l7'
import { CityLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      TotalValueData: [],
      EnterprisesLossData: [],
      EnterprisesNumData: [],
      TotalAssetsData: [],
      TotalProfitData: [],
      EmployedNumData: [],
      IndCreateValueData: [],
      currentRegion: '',
      tableData: [],
      mapData: [],
      regionData: []
    }
  },
  methods: {
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
      const data = this.mapData
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
                '#b3d1ff',
                '#007acc'
              ]
            }
          },
          popup: {
            enable: true
            // Html: props => {
            //   return `<span>${props.NAME_CHN}:</span><span>${props.value}</span>`
            // }
          }
        })
      })
      scene.on('click', (ev) => {
        console.log(ev)
      })
    },
    setTotalValue () {
      let chart = new Chart({
        container: 'TotalValue',
        height: document.getElementById('TotalValue').clientHeight,
        width: document.getElementById('TotalValue').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.TotalValueData)
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
    setEnterprisesLoss () {
      let chart = new Chart({
        container: 'EnterprisesLoss',
        height: document.getElementById('EnterprisesLoss').clientHeight,
        width: document.getElementById('EnterprisesLoss').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.EnterprisesLossData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.area().position('year*value').color('l(96) 0:#24ff00 1:#000000').shape('smooth').tooltip(false)
      chart.line().position('year*value').size(2).color('#24ff00').shape('smooth').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setEnterprisesNum () {
      let chart = new Chart({
        container: 'EnterprisesNum',
        height: document.getElementById('EnterprisesNum').clientHeight,
        width: document.getElementById('EnterprisesNum').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.EnterprisesNumData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#FFD700').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setTotalAssets () {
      let chart = new Chart({
        container: 'TotalAssets',
        height: document.getElementById('TotalAssets').clientHeight,
        width: document.getElementById('TotalAssets').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.TotalAssetsData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#7CFC00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setTotalProfit () {
      let chart = new Chart({
        container: 'TotalProfit',
        height: document.getElementById('TotalProfit').clientHeight,
        width: document.getElementById('TotalProfit').clientWidth, // 指定图表宽度
        padding: [80, 20, 60, 30]
      })
      chart.data(this.TotalProfitData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#FFFF00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    setEmployedNum () {
      let chart = new Chart({
        container: 'EmployedNum',
        height: document.getElementById('EmployedNum').clientHeight,
        width: document.getElementById('EmployedNum').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.EmployedNumData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#7B68EE').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
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
