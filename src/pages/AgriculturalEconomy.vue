<template>
  <div>
    <div class="centerStas centerIndex">
      <p>{{MaxYear}}年临沂市农林牧渔及服务业完成产值<label>{{MaxYearValue}}</label>万元</p>
    </div>
    <div id='TotalValue' class="stas">
       <p>临沂市历年农林牧渔服务业总产值</p>
       <label>单位（万元）</label>
    </div>
    <div id='SeedeArea' class="stas">
       <p>临沂市历年农作物播种面积</p>
       <label>单位（公顷）</label>
    </div>
    <div id='GrainYield' class="stas">
       <p>临沂市历年粮食总产量</p>
       <label>单位（万吨）</label>
    </div>
    <div id='FruitsYield' class="stas">
       <p>2018年临沂市水果产量对比分析</p>
       <label>单位（万吨）</label>
    </div>
    <div id='SeedeRegionArea' class="stas">
       <p>各区县农作物播种面积情况</p>
       <label>单位（千亩）</label>
    </div>
    <div id='GrainRegionYield' class="stas">
       <p>各区县粮食总产量及亩产情况</p>
       <label style="margin-top:25px">单位（吨）</label>
       <label style="margin-top:25px;left:500px">单位（公顷）</label>
    </div>
    <div id='FruitIndex' class="stas">
       <p>各区县粮食总产量及亩产情况</p>
       <el-table :data="tableData" border  height="325px" @row-click='tableRowClick'>
         <el-table-column prop="fruits" label="水果" width="40"></el-table-column>
         <el-table-column prop="lanshan" label="兰山区" width="62"></el-table-column>
         <el-table-column prop="luozhuang" label="罗庄区" width="63"></el-table-column>
         <el-table-column prop="hedong" label="河东区" width="63"></el-table-column>
         <el-table-column prop="yinan" label="沂南县" width="63"></el-table-column>
         <el-table-column prop="tancheng" label="郯城县" width="60"></el-table-column>
         <el-table-column prop="yishui" label="沂水县" width="60"></el-table-column>
         <el-table-column prop="lanling" label="兰陵县" width="60"></el-table-column>
         <el-table-column prop="feixian" label="费县" width="57"></el-table-column>
         <el-table-column prop="pingyi" label="平邑县" width="60"></el-table-column>
         <el-table-column prop="junan" label="莒南县" width="60"></el-table-column>
         <el-table-column prop="mengyin" label="蒙阴县" width="60"></el-table-column>
         <el-table-column prop="linshu" label="临沭县" width="60"></el-table-column>
       </el-table>
       <div class="tableRemarks">备注：规模优势指数如果大于1，说明该水果在当地具有规模优势。临沂市各区县苹果都具有规模优势；兰陵县的梨和桃等都占有规模优势；兰山区、罗庄区等区县的葡萄具有规模优势。</div>
    </div>
    <div id='FruitMap'>
      <p>各区县{{currentFruit}}“规模优势指数”</p>
    </div>
  </div>
</template>
<script>
// import DataSet from '@antv/data-set'
import { Chart } from '@antv/g2'
import { Scene } from '@antv/l7'
import { CityLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      TotalValueData: [],
      SeedeAreaData: [],
      GrainYieldData: [],
      FruitsYieldData: [],
      SeedeRegionAreaData: [],
      GrainRegionYieldData: [],
      MaxYear: '',
      MaxYearValue: '',
      tableData: [],
      mapData: [],
      currentFruit: '苹果',
      MapColorLayer: null
    }
  },
  methods: {
    setTotalValue () {
      let chart = new Chart({
        container: 'TotalValue',
        forceFit: true,
        height: document.getElementById('TotalValue').clientHeight,
        width: document.getElementById('TotalValue').clientWidth, // 指定图表宽度
        animate: true,
        padding: [70, 20, 60, 70]
      })
      chart.tooltip({
        showMarkers: false,
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
      utils.changeChartAxisForeground(chart, 'value', 'year')
      chart.data(this.TotalValueData)
      chart.interval().position('year*value').color('type').adjust([
        {
          type: 'dodge',
          marginRatio: 0
        }
      ])
      chart.render()
    },
    setSeedeArea () {
      const chart = new Chart({
        container: 'SeedeArea',
        autoFit: true,
        height: document.getElementById('TotalValue').clientHeight,
        width: document.getElementById('TotalValue').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 70]
      })
      chart.data(this.SeedeAreaData)
      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })
      chart.scale('value', {
        nice: false,
        min: 950000,
        max: 1100000,
        formatter: val => {
          return (+val / 10000).toFixed(1) + 'k公顷'
        }
      })
      utils.changeChartAxisForeground(chart, 'value', 'year')
      chart.area().position('year*value')
      chart.line().position('year*value')
      chart.render()
    },
    setGrainYield () {
      const chart = new Chart({
        container: 'GrainYield',
        autoFit: true,
        height: document.getElementById('GrainYield').clientHeight,
        width: document.getElementById('GrainYield').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.GrainYieldData)
      chart.tooltip({
        showMarkers: false
      })
      chart.axis('value', {
        label: {
          nice: false,
          min: 370,
          max: 430,
          formatter: (val) => {
            return val + '万吨'
          }
        }
      })
      utils.changeChartAxisForeground(chart, 'value', 'year')
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#DAA520').label('value', {
        // position: 'middle',
        style: {
          fill: '#bddfff'
        },
        offset: 10
      })
      chart.render()
    },
    setFruitsYield () {
      const chart = new Chart({
        container: 'FruitsYield',
        height: document.getElementById('TotalValue').clientHeight,
        width: document.getElementById('TotalValue').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40],
        autoFit: true
      })
      chart.data(this.FruitsYieldData)
      chart.scale('value', {
        nice: true
      })
      chart.tooltip({
        showMarkers: false
      })
      utils.changeChartAxisForeground(chart, 'value', 'type')
      chart.legend('type', false)
      chart.interaction('active-region')
      chart.interval().position('type*value').color('type')
      chart.render()
    },
    setSeedeRegionArea () {
      let chart = new Chart({
        container: 'SeedeRegionArea',
        forceFit: true,
        height: document.getElementById('SeedeRegionArea').clientHeight,
        width: document.getElementById('SeedeRegionArea').clientWidth, // 指定图表宽度
        animate: true,
        padding: [70, 20, 60, 40]
      })
      chart.tooltip({
        showMarkers: false,
        shared: true
      })
      chart.legend({
        position: 'top-right',
        offsetY: 35,
        offsetX: -5,
        attachLast: true,
        itemName: {
          style: {
            fill: '#bddfff'
          }
        }
      })
      utils.changeChartAxisForeground(chart, 'value', 'region')
      chart.data(this.SeedeRegionAreaData)
      // chart.interval().position('region*value').color('type').adjust([
      //   {
      //     type: 'dodge',
      //     marginRatio: 0
      //   }
      // ])
      chart.area().position('region*value').color('type')
      chart.line().position('region*value').color('type')
      chart.render()
    },
    setGrainRegionYield () {
      let chart = new Chart({
        container: 'GrainRegionYield',
        forceFit: false,
        height: document.getElementById('GrainRegionYield').clientHeight,
        width: document.getElementById('GrainRegionYield').clientWidth, // 指定图表宽度
        animate: true,
        padding: [70, 40, 60, 50]
      })
      chart.scale('粮食亩产', { // 右侧坐标轴
        min: 350,
        max: 510,
        tickCount: 4, // 左右坐标轴刻度数量保持一致 好看点
        range: [0, 1 - 1 / 5 / 2]
      })
      chart.legend({
        custom: true,
        position: 'top-right',
        offsetY: 35,
        offsetX: -5,
        flipPage: false,
        items: [
          {
            name: '粮食产量',
            marker: {
              symbol: 'square',
              style: {
                fill: '#3182bd'
              },
              clickable: false
            }
          },
          {
            name: '粮食亩产',
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
      chart.axis('ratevalue', {
        grid: null,
        label: {
          textStyle: {
            fill: '#fdae6b'
          }
        }
      })
      chart.tooltip({shared: true})
      utils.changeChartAxisForeground(chart, '粮食产量', 'region')
      utils.changeChartAxisForeground(chart, '粮食亩产', '')
      chart.data(this.GrainRegionYieldData)
      chart.interval().position('region*粮食产量').color('#3182bd')
      chart.line().position('region*粮食亩产').color('#fdae6b').size(3).shape('smooth')
      chart.point().position('region*粮食亩产').color('#fdae6b').size(3).shape('circle')
      chart.render()
    },
    setMapChartData () {
      const scene = new Scene({
        id: 'FruitMap',
        logoVisible: false,
        map: new Mapbox({
          // center: [ 118.35, 35.35 ],
          style: 'blank',
          zoom: 5,
          // minZoom: 7.3,
          // maxZoom: 7.3,
          // pitch: 45,
        })
      })
      const data = this.mapData
      scene.on('loaded', () => {
        /* eslint-disable no-new */
        this.MapColorLayer =  new CityLayer(scene, {
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
      })
    },
    setMapData (data) {
      this.currentFruit = data.fruits
      this.mapData = []
      this.mapData.push({code: '371302', name: '兰山区', value: data.lanshan})
      this.mapData.push({code: '371311', name: '罗庄区', value: data.luozhuang})
      this.mapData.push({code: '371312', name: '河东区', value: data.hedong})
      this.mapData.push({code: '371321', name: '沂南县', value: data.yinan})
      this.mapData.push({code: '371322', name: '郯城县', value: data.tancheng})
      this.mapData.push({code: '371323', name: '沂水县', value: data.yishui})
      this.mapData.push({code: '371324', name: '兰陵县', value: data.lanling})
      this.mapData.push({code: '371325', name: '费县', value: data.feixian})
      this.mapData.push({code: '371326', name: '平邑县', value: data.pingyi})
      this.mapData.push({code: '371327', name: '莒南县', value: data.junan})
      this.mapData.push({code: '371328', name: '蒙阴县', value: data.mengyin})
      this.mapData.push({code: '371329', name: '临沭县', value: data.linshu})
      console.log(this.MapColorLayer)
      if (this.MapColorLayer !== null) {
        this.MapColorLayer.setData(this.mapData)
      } else {
        this.setMapChartData()
      }
    },
    updateMapData () {
      this.MapColorLayer.setData(this.mapData)
    },
    tableRowClick (row, column, event) {
      console.log(row)
      this.setMapData(row)
    }
  },
  mounted () {
    this.axios.get('/agricultural/data').then(res => {
      this.TotalValueData = res.data.yearAgricu.filter(x => x.part === '0')
      this.MaxYear = Math.max.apply(Math, this.TotalValueData.map(item => { return item.year }))
      this.MaxYearValue = this.TotalValueData.filter(x => x.type === '总产值' && x.year === 2018 + '')[0].value
      this.SeedeAreaData = res.data.yearAgricu.filter(x => x.part === '1')
      this.GrainYieldData = res.data.yearAgricu.filter(x => x.part === '2')
      this.FruitsYieldData = res.data.yearAgricu.filter(x => x.part === '3')
      this.SeedeRegionAreaData = res.data.regionAgricu.filter(x => x.part === '0')
      let data = res.data.regionAgricu.filter(x => x.part === '1' && x.unit === '吨')
      let ratedata = res.data.regionAgricu.filter(x => x.part === '1' && x.unit !== '吨')
      for (var i = 0; i < data.length; i++) {
        this.GrainRegionYieldData.push({
          region: data[i].region,
          粮食产量: data[i].value,
          粮食亩产: ratedata.filter(x => x.region === data[i].region)[0].value
        })
      }
      this.tableData = res.data.regionFruits
      this.setMapData(this.tableData[0])
      this.RegionPopDensityData = res.data.yearAgricu
      this.setTotalValue()
      this.setSeedeArea()
      this.setGrainYield()
      this.setSeedeRegionArea()
      this.setGrainRegionYield()
      this.setFruitsYield()
    })
  }
}
</script>
<style scoped>
#TotalValue{
  left: 20px;
  top:100px;
  width:500px;
  height:315px
}
#SeedeArea{
  left: 20px;
  top:420px;
  width:500px;
  height:310px
}
#GrainYield{
  left: 20px;
  top:735px;
  width:500px;
  height:310px
}
#FruitsYield{
  left: 530px;
  top:155px;
  width:600px;
  height:275px
}
#SeedeRegionArea{
  left: 530px;
  top:437px;
  width:600px;
  height:280px
}
#GrainRegionYield{
  left: 530px;
  top:724px;
  width:600px;
  height:335px
}
#FruitIndex{
  left:1140px;
  top:114px;
  width:770px;
  height:950px
}
#FruitMap{
 left:1140px;
  top:494px;
  width:770px;
  height:550px;
  position: absolute;
  z-index: 99;
 /* border: red solid 1px; */
}
#FruitMap > P{
  color: white;
  line-height: 30px;
  font-size: 24px;
}
.tableRemarks{
  color: #bddfff;
  text-align: left;
  padding:12px;
}
/* .map{
 border: red solid 1px;
   width: 100%;
  height: 500px;
    left:1140px;
  top:514px;
  width:770px;
  height:550px
} */
.centerIndex{
  width: 550px;
  height: 40px;
  top:100px;
  left:550px;
}
.el-table{
  top:50px;
}
</style>
