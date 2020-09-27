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
      <div id='ContianPop'>
        <label>临沂市适度人口测算  单位（万人）</label>
      </div>
      <div id='Pressure'>
        <label>临沂市压力指数</label>
      </div>
      <el-table :data="tableData">
        <el-table-column label="一级指标">
          <el-table-column prop="index" label="二级指标" width="40"> </el-table-column>
        </el-table-column>
        <el-table-column label="资源承载力">
          <el-table-column prop="water" label="水资源" width="55"> </el-table-column>
          <el-table-column prop="construction" label="建设用地" width="70"> </el-table-column>
          <el-table-column prop="food" label="粮食" width="50"> </el-table-column>
        </el-table-column>
        <el-table-column label="经济承载力">
          <el-table-column prop="economy" label="经济" width="50"> </el-table-column>
          <el-table-column prop="job" label="就业" width="50"> </el-table-column>
        </el-table-column>
        <el-table-column label="社会承载力">
          <el-table-column prop="house" label="住房" width="55"> </el-table-column>
          <el-table-column prop="medical" label="医疗" width="55"> </el-table-column>
          <el-table-column prop="traffic" label="交通" width="50"> </el-table-column>
        </el-table-column>
        <el-table-column label="生态承载力">
          <el-table-column prop="encironment" label="环境治理" width="70"> </el-table-column>
          <el-table-column prop="forest" label="森林资源" width="70"> </el-table-column>
        </el-table-column>
      </el-table>
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
      RegionPopDensityData: [],
      ContianPopData: [],
      PressureData: [],
      tableData: []
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
      chart.scale('value', { // 右侧坐标轴
        min: 1000
      })
      // chart.coordinate().transpose()
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.data(this.YearPopulationLiveData)
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
      chart.data(this.RegionPopSexData)
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
      chart.data(this.YearPopulationTownRateData)
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
    },
    setContianPop () {
      let chart = new Chart({
        container: 'ContianPop',
        height: document.getElementById('ContianPop').clientHeight,
        width: document.getElementById('ContianPop').clientWidth, // 指定图表宽度
        padding: [80, 20, 60, 40]
      })
      chart.data(this.ContianPopData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('type', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#7CFC00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.annotation().line({
        start: ['min', 1062.4],
        end: ['max', 1062.4],
        style: {
          stroke: 'yellow',
          lineWidth: 1
        },
        text: {
          position: 'end',
          style: {
            fill: 'yellow',
            fontSize: 20
          },
          content: '常住人口1062.4万人',
          offsetY: -5,
          offsetX: -80
        }
      })
      chart.render()
    },
    setPressure () {
      let chart = new Chart({
        container: 'Pressure',
        height: document.getElementById('Pressure').clientHeight,
        width: document.getElementById('Pressure').clientWidth, // 指定图表宽度
        padding: [80, 20, 60, 40]
      })
      chart.data(this.PressureData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('type', {nice: true})
      chart.legend('value', false)
      chart.interaction('active-region')
      chart.scale('value', { 
        min: -0.6
      })
      chart.interval().position('type*value').color('value', (val) => {
        if (val > 0) { return 'Green' } else if (val > -0.2) { return '#7CFC00' }  else if (val > -0.4) { return '#FFD700' } else { return 'red' }
      }).label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.annotation().line({
        start: ['min', 0],
        end: ['max', 0],
        style: {
          stroke: 'Green',
          lineWidth: 1
        },
        text: {
          position: 'end',
          style: {
            fill: 'Green',
            fontSize: 20
          },
          content: '预警线 85%',
          offsetY: -5,
          offsetX: -80
        }
      })
      chart.annotation().line({
        start: ['min', -0.2],
        end: ['max', -0.2],
        style: {
          stroke: '#7CFC00',
          lineWidth: 1
        },
        text: {
          position: 'end',
          style: {
            fill: '#7CFC00',
            fontSize: 20
          },
          content: '预警线 85%',
          offsetY: -5,
          offsetX: -80
        }
      })
      chart.annotation().line({
        start: ['min', -0.4],
        end: ['max', -0.4],
        style: {
          stroke: '#FFD700',
          lineWidth: 1
        },
        text: {
          position: 'end',
          style: {
            fill: '#FFD700',
            fontSize: 20
          },
          content: '预警线 85%',
          offsetY: -5,
          offsetX: -80
        }
      })
      chart.annotation().line({
        start: ['min', -0.6],
        end: ['max', -0.6],
        style: {
          stroke: 'red',
          lineWidth: 1
        },
        text: {
          position: 'end',
          style: {
            fill: 'red',
            fontSize: 20
          },
          content: '预警线 85%',
          offsetY: -5,
          offsetX: -80
        }
      })
      chart.render()
    }
  },
  mounted () {
    this.axios.get('/population/data').then(res => {
      this.YearPopulationLiveData = res.data.yearPopulation.filter(x => x.part === '0')
      this.RegionPopSexData = res.data.yearPopulation.filter(x => x.part === '1')
      this.YearPopulationTownRateData = res.data.yearPopulation.filter(x => x.part === '2')
      this.RegionPopDensityData = res.data.regionPopulation
      this.ContianPopData = res.data.contianPop
      this.tableData = res.data.popPressure
      let data = this.tableData.filter(x => x.index === '压力指数')[0]
      this.PressureData.push({year: data.year, type: '水资源', value: parseFloat(data.water)})
      this.PressureData.push({year: data.year, type: '建设用地', value: parseFloat(data.construction)})
      this.PressureData.push({year: data.year, type: '粮食', value: parseFloat(data.food)})
      this.PressureData.push({year: data.year, type: '经济', value: parseFloat(data.economy)})
      this.PressureData.push({year: data.year, type: '就业', value: parseFloat(data.job)})
      this.PressureData.push({year: data.year, type: '住房', value: parseFloat(data.house)})
      this.PressureData.push({year: data.year, type: '医疗', value: parseFloat(data.medical)})
      this.PressureData.push({year: data.year, type: '交通', value: parseFloat(data.traffic)})
      this.PressureData.push({year: data.year, type: '环境治理', value: parseFloat(data.encironment)})
      this.PressureData.push({year: data.year, type: '森林资源', value: parseFloat(data.forest)})
      this.setYearPopulationLive()
      this.setRegionPopSex()
      this.setYearPopulationTownRate()
      this.setRegionPopDensityData()
      this.setContianPop()
      this.setPressure()
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
#ContianPop,#Pressure{
  height: 325px;
  width: 610px;
  position: relative;
}
#ContianPop > label,#Pressure>label{
  position: absolute;
  top: 35px;
  left: 0;
  color: #bddfff;
  line-height: 30px;
  padding-left: 10px;
  font-size: 15px;
  text-align: left;
}
.el-table{
  top:10px;
  height: 220px;
}
</style>
