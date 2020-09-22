<template>
  <div>
    <listBox :listData='Inds' class="Industrylist" @click='clickIndus'></listBox>
    <div id='CreateValueRate' class="stas">
      <p>规模以上工业增加值同比增速</p>
      <label>单位（%）</label>
    </div>
    <div id='IndCreateValue' class="stas">
      <p>规模以上工业增加值占比</p>
      <label>单位（%）</label>
    </div>
    <div id='hundred' class="stas">
      <p>2019年山东省百强、百高企业分布情况</p>
      <el-row>
        <el-col :span="10">
          <div id='map'>
            <div class="mapLegend">
              <el-row>
                <el-col :span="6"><img src="../../static/image/location_yellow.png" style="height: 25px;width: 25px;"/></el-col>
                <el-col :span="18"><label>百强企业</label></el-col>
              </el-row>
                <el-row>
                <el-col :span="6"><img src="../../static/image/location_blue.png" style="height: 25px;width: 25px;"/></el-col>
                <el-col :span="18"><label>百高企业</label></el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div id='CompanyStrongRatio'>
            <img src='../../static/image/baigaoqiye.png' style="width:250px;margin-top:30px"/>
          </div>
        </el-col>
        <el-col :span="7">
          <div id='CompanyRatio'>
            <img src='../../static/image/baiqiangxian.png' style="width:250px;margin-top:30px"/>
          </div>
        </el-col>
      </el-row>
    </div>
    <div id='TenIndusValueAdd' class="stas">
      <p>十大产业增加值</p>
      <label>单位（亿元）</label>
    </div>
    <div id='HighTechCreateValueRatio' class="stas">
      <p>高技术产业增加值占比</p>
      <label>单位（%）</label>
    </div>
    <div id='IndusSituation' class="stas">
      <p>六大高耗能行业增加值同比增速</p>
      <label>单位（%）</label>
    </div>
    <div id='table' class="stas">
      <p>2019年规模以上工业行业专业化程度分析</p>
       <el-table :data="tableData" border  height="493px">
         <el-table-column prop="Industry" label="行业" width="165"></el-table-column>
         <el-table-column prop="jiaozuo" label="临沂市得分" width="90"></el-table-column>
         <el-table-column prop="jzSpecialized" label="临沂市专业化" width="95"></el-table-column>
         <el-table-column prop="zhejiang" label="山东省得分" width="90"></el-table-column>
         <el-table-column prop="zjSpecialized" label="山东省专业化" width="95"></el-table-column>
         <el-table-column prop="beijing" label="北京市得分" width="90"></el-table-column>
         <el-table-column prop="bjSpecialized" label="北京市专业化" width="95"></el-table-column>
       </el-table>
       <el-row>
         <el-col :span="12"><img src='../../static/image/transformation_bk1.png' style="width:370px;margin-top:30px;margin-left:10px"/></el-col>
         <el-col :span="12"><img src='../../static/image/transformation_bk2.png' style="width:370px;margin-top:30px"/></el-col>
       </el-row>
    </div>
  </div>
</template>
<script>
import listBox from '../components/ListBox'
import { Chart } from '@antv/g2'
import { Scene, PointLayer } from '@antv/l7'
import { ProvinceLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  components: { listBox },
  data () {
    return {
      CreateValueRateChart: null,
      IndCreateValueChart: null,
      CreateValueRateData: [],
      IndCreateValueData: [],
      CompanyRatioData: [],
      CompanyStrongRatioData: [],
      TenIndusValueAddData: [],
      HighTechCreateValueRatioData: [],
      IndusSituationData: [],
      tableData: [],
      mapData: [],
      Inds: [],
      CurentIndustry: []
    }
  },
  methods: {
    clickIndus (item) {
      this.axios.get('/industry/transformation/data/' + item).then(res => {
        this.CreateValueRateData = utils.sortFromSmallToLargeByKey(res.data.filter(x => x.part === '0'), 'year')
        this.IndCreateValueData = utils.sortFromSmallToLargeByKey(res.data.filter(x => x.part === '1'), 'year')
        this.setCreateValueRate()
        this.setIndCreateValue()
      })
    },
    setCreateValueRate () {
      if (!this.CreateValueRateChart || this.CreateValueRateChart === null) {
        this.CreateValueRateChart = new Chart({
          container: 'CreateValueRate',
          height: document.getElementById('CreateValueRate').clientHeight,
          width: document.getElementById('CreateValueRate').clientWidth, // 指定图表宽度
          padding: [70, 40, 60, 50]
        })
      }
      this.CreateValueRateChart.data(this.CreateValueRateData)
      utils.changeChartAxisForeground(this.CreateValueRateChart, 'year', 'value')
      this.CreateValueRateChart.line().position('year*value').color('#1aa3ff').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.CreateValueRateChart.point().position('year*value')
      this.CreateValueRateChart.render()
    },
    setIndCreateValue () {
      if (!this.IndCreateValueChart || this.IndCreateValueChart === null) {
        this.IndCreateValueChart = new Chart({
          container: 'IndCreateValue',
          height: document.getElementById('IndCreateValue').clientHeight,
          width: document.getElementById('IndCreateValue').clientWidth, // 指定图表宽度
          padding: [70, 40, 60, 50]
        })
      }
      this.IndCreateValueChart.source(this.IndCreateValueData)
      utils.changeChartAxisForeground(this.IndCreateValueChart, 'year', 'value')
      this.IndCreateValueChart.area().position('year*value').color('l(96) 0:#cc00ff 1:#000000').shape('smooth').tooltip(false)
      this.IndCreateValueChart.line().position('year*value').size(2).color('#cc00ff').shape('smooth').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.IndCreateValueChart.render()
    },
    setCompanyRatio () {
      let chart = new Chart({
        container: 'CompanyRatio',
        height: document.getElementById('CompanyRatio').clientHeight,
        width: document.getElementById('CompanyRatio').clientWidth, // 指定图表宽度
        padding: [0, 0, 80, 0]
      })
      chart.data(this.CompanyRatioData)
      chart.legend('type', false)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.coordinate('theta', {radius: 0.9, innerRadius: 0.6})
      chart.interval().adjust('stack').position('value').color('type').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.type}: ${value}个`
          }
        }
      },
      {
        style: {
          fill: '#fff'
        },
        offset: -0
      }).tooltip('type*value', (type, value) => {
        value = value + '个'
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
    setCompanyStrongRatio () {
      let chart = new Chart({
        container: 'CompanyStrongRatio',
        height: document.getElementById('CompanyStrongRatio').clientHeight,
        width: document.getElementById('CompanyStrongRatio').clientWidth, // 指定图表宽度
        padding: [0, 0, 80, 0]
      })
      chart.data(this.CompanyStrongRatioData)
      chart.legend('type', false)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.coordinate('theta', {radius: 0.9})
      chart.interval().adjust('stack').position('value').color('type').label('value', (value) => {
        return {
          content: (data) => {
            return `${data.type}: ${value}个`
          }
        }
      },
      {
        style: {
          fill: '#fff'
        },
        offset: -0
      }).tooltip('type*value', (type, value) => {
        value = value + '个'
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
    setTenIndusValueAdd () {
      let chart = new Chart({
        container: 'TenIndusValueAdd',
        height: document.getElementById('TenIndusValueAdd').clientHeight,
        width: document.getElementById('TenIndusValueAdd').clientWidth, // 指定图表宽度
        padding: [80, 20, 30, 40]
      })
      chart.data(this.TenIndusValueAddData)
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
    setHighTechCreateValueRatio () {
      let chart = new Chart({
        container: 'HighTechCreateValueRatio',
        height: document.getElementById('HighTechCreateValueRatio').clientHeight,
        width: document.getElementById('HighTechCreateValueRatio').clientWidth, // 指定图表宽度
        padding: [70, 20, 40, 40]
      })
      chart.source(this.HighTechCreateValueRatioData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.area().position('year*value').color('l(96) 0:#24ff00 1:#000000').shape('smooth').tooltip(false)
      chart.line().position('year*value').size(2).color('#24ff00').shape('smooth').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setIndusSituation () {
      let chart = new Chart({
        container: 'IndusSituation',
        height: document.getElementById('IndusSituation').clientHeight,
        width: document.getElementById('IndusSituation').clientWidth, // 指定图表宽度
        padding: [80, 10, 40, 50]
      })
      chart.data(this.IndusSituationData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#FFFF00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    setMapData () {
      const scene = new Scene({
        id: 'map',
        logoVisible: false,
        map: new Mapbox({
          // center: [ 116.2825, 39.9 ],
          pitch: 0,
          style: 'blank',
          zoom: 5,
          minZoom: 5.3,
          maxZoom: 5.3
        })
      })
      scene.on('loaded', () => {
        /* eslint-disable no-new */
        new ProvinceLayer(scene, {
          joinBy: [ 'adcode', 'code' ],
          adcode: [ '370000' ],
          depth: 3,
          label: {
            field: 'NAME_CHN',
            textAllowOverlap: false
          },
          fill: {
            color: {
              field: 'pop',
              values: [
                '#feedde',
                '#fdd0a2',
                '#fdae6b',
                '#fd8d3c',
                '#e6550d',
                '#a63603'
              ]
            }
          },
          popup: {
            enable: true,
            Html: props => {
              return `<span>${props.NAME_CHN}:</span><span>${props.pop}</span>`
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
    this.axios.get('/industry/transformation/data').then(res => {
      console.log(res.data.yearData)
      this.Inds = res.data.indusData.range
      this.CurentIndustry = res.data.indusData.first
      this.tableData = res.data.tableData
      this.mapData = res.data.companyData
      console.log(this.mapData)
      this.TenIndusValueAddData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '0'), 'year')
      this.HighTechCreateValueRatioData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '1'), 'year')
      this.IndusSituationData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '2'), 'year')
      this.CompanyRatioData = res.data.yearData.filter(x => x.part === '3')
      this.CompanyStrongRatioData = res.data.yearData.filter(x => x.part === '4')
      this.CreateValueRateData = utils.sortFromSmallToLargeByKey(res.data.indusData.data.filter(x => x.part === '0'), 'year')
      this.IndCreateValueData = utils.sortFromSmallToLargeByKey(res.data.indusData.data.filter(x => x.part === '1'), 'year')
      this.setCreateValueRate()
      this.setIndCreateValue()
      this.setCompanyRatio()
      this.setCompanyStrongRatio()
      this.setTenIndusValueAdd()
      this.setHighTechCreateValueRatio()
      this.setIndusSituation()
      // this.setTable()
      this.setMapData()
    })
  }
}
</script>
<style scoped>
.Industrylist{
  position:absolute;height: 960px;left:5px;top:88px;
}
#CreateValueRate{
  height: 251px;left:240px;top:88px;width:450px;
}
#IndCreateValue{
  height: 251px;left:695px;top:88px;width:450px;
}
#hundred{
  height: 441px;left:240px;top:345px;width:905px;
}
#map{
  height: 441px;width:420px; position: relative;
}
#CompanyRatio,#CompanyStrongRatio{
  height: 441px;
}
#TenIndusValueAdd{
  height: 250px;left:240px;top:795px;width:540px;
}
#HighTechCreateValueRatio{
  height: 250px;left:790px;top:795px;width:540px;
}
#IndusSituation{
  height: 250px;left:1340px;top:795px;width:550px;
}
#table{
  height: 700px;left:1150px;top:88px;width:745px;
}
.el-table{
  top:25px;
  margin:10px;
  width:725px;
}
.mapLegend{
  height:80px;
  width:150px;
  bottom:10px;
  position: absolute;
  right:40px
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
