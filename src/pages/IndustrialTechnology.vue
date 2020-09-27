<template>
  <div>
    <div id='Expenditure' class="stas">
       <p>规模以上工业企业R&amp;D经费内部支出</p>
       <label>单位（亿元）</label>
    </div>
    <div id='FundsProp' class="stas">
       <p>企业R&amp;D经费内部支出占GDP比重</p>
       <label>单位（%）</label>
    </div>
    <div id='FullTime' class="stas">
       <p>规模以上工业企业R&amp;D人员折合全时当量</p>
       <label>单位（人年）</label>
    </div>
    <div id='PeopleHavePatents' class="stas">
       <p>万人拥有有效发明专利</p>
       <label>单位（件）</label>
    </div>
    <div id='PatentsNum' class="stas">
       <p>专利授权量情况</p>
       <label>单位（件）</label>
    </div>
    <div id='TechnicalFunds' class="stas">
       <p>技术改造经费支出</p>
       <label>单位（亿元）</label>
    </div>
    <div id='TechIndex' class="stas">
       <p>规模以上工业企业科技创新总指数</p>
       <div  id='TotalIndex'>
        <label>规模以上工业企业科技创新总指数（%）</label>
      </div>
      <el-row>
        <el-col :span="12"><div id='EnvironmentalIndex'></div></el-col>
        <el-col :span="12"><div id='InputIndex'></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div id='OutputIndex'></div></el-col>
        <el-col :span="12"><div id='VitalityIndex'></div></el-col>
      </el-row>
       <timeLine style="margin-top:10px" :pointend="pointend" width="850px" :timeLineList="timeData" @clicktime='clicktime'></timeLine>
    </div>
    <div id='RegionTechIndex' class="stas">
       <p>规模以上工业企业科技创新总指数</p>
       <div id='map'>
         <div class="mapLegend">
           <el-row><label>{{this.currentMapIndex}}</label></el-row>
           <el-row><label>高</label></el-row>
           <el-row><div style="height: 35px;width: 35px;"></div></el-row>
           <el-row><div style="height: 25px;width: 25px;"></div></el-row>
           <el-row><div style="height: 15px;width: 15px;"></div></el-row>
           <el-row><label>底</label></el-row>
         </div>
       </div>
       <el-table :data="tableData" border  height="493px" @header-click='tableHeaderClick'>
         <el-table-column prop="area" label="地区" width="60"></el-table-column>
         <el-table-column prop="totalindex" label="总指数" width="110"></el-table-column>
         <el-table-column prop="environmental" label="创新环境指数" width="113"></el-table-column>
         <el-table-column prop="input" label="创新投入指数" width="113"></el-table-column>
         <el-table-column prop="vitality" label="创新活力指数" width="113"></el-table-column>
         <el-table-column prop="totalindex" label="创新产出指数" width="113"></el-table-column>
       </el-table>
    </div>
  </div>
</template>
<script>
import timeLine from '../components/TimeLine'
import { Chart, registerShape } from '@antv/g2'
import { Scene, PointLayer } from '@antv/l7'
import { ProvinceLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  components: { timeLine },
  data () {
    return {
      ExpenditureData: [],
      FundsPropData: [],
      FullTimeData: [],
      PeopleHavePatentsData: [],
      PatentsNumData: [],
      TechnicalFundsData: [],
      timeData: [],
      pointend: 0,
      EnvironmentalIndex: [],
      InputIndex: [],
      OutputIndex: [],
      VitalityIndex: [],
      TotalIndexData: [],
      currentYear: '',
      EnvironmentalIndexChart: null,
      InputIndexChart: null,
      OutputIndexChart: null,
      VitalityIndexChart: null,
      color: ['#0086FA', '#FFBF00', '#F5222D'],
      mapData: [],
      currentMapIndex: '总指数',
      tableData: [],
      pointLayer: null
    }
  },
  methods: {
    setExpenditure () {
      let chart = new Chart({
        container: 'Expenditure',
        height: document.getElementById('Expenditure').clientHeight,
        width: document.getElementById('Expenditure').clientWidth, // 指定图表宽度
        padding: [70, 20, 40, 40]
      })
      chart.data(this.ExpenditureData)
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
    setFundsProp () {
      let chart = new Chart({
        container: 'FundsProp',
        height: document.getElementById('FundsProp').clientHeight,
        width: document.getElementById('FundsProp').clientWidth, // 指定图表宽度
        padding: [70, 20, 40, 40]
      })
      chart.data(this.FundsPropData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.area().position('year*value').color('l(96) 0:#24ff00 1:#000000').shape('smooth').tooltip(false)
      chart.line().position('year*value').size(2).color('#24ff00').shape('smooth').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setFullTime () {
      let chart = new Chart({
        container: 'FullTime',
        height: document.getElementById('FullTime').clientHeight,
        width: document.getElementById('FullTime').clientWidth, // 指定图表宽度
        padding: [80, 10, 40, 50]
      })
      chart.data(this.FullTimeData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#FFFF00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    setPeopleHavePatents () {
      let chart = new Chart({
        container: 'PeopleHavePatents',
        height: document.getElementById('PeopleHavePatents').clientHeight,
        width: document.getElementById('PeopleHavePatents').clientWidth, // 指定图表宽度
        padding: [70, 20, 40, 20]
      })
      chart.data(this.PeopleHavePatentsData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {nice: true})
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#DAA520').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setPatentsNum () {
      let chart = new Chart({
        container: 'PatentsNum',
        forceFit: true,
        height: document.getElementById('PatentsNum').clientHeight,
        width: document.getElementById('PatentsNum').clientWidth, // 指定图表宽度
        animate: true,
        padding: [70, 20, 40, 40]
      })
      chart.tooltip({
        showMarkers: false,
        shared: true
      })
      chart.legend({
        position: 'top-right',
        offsetY: 35,
        offsetX: -5,
        valueStyle: {fill: 'red'}
      })
      utils.changeChartAxisForeground(chart, 'value', 'year')
      chart.data(this.PatentsNumData)
      chart.interval().position('year*value').color('type').adjust([
        {
          type: 'dodge',
          marginRatio: 0
        }
      ])
      chart.render()
    },
    setTechnicalFunds () {
      let chart = new Chart({
        container: 'TechnicalFunds',
        height: document.getElementById('TechnicalFunds').clientHeight,
        width: document.getElementById('TechnicalFunds').clientWidth, // 指定图表宽度
        padding: [80, 20, 40, 50]
      })
      chart.data(this.TechnicalFundsData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('#CD5C5C').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.point().position('year*value')
      chart.render()
    },
    clicktime (item) {
      this.currentYear = item
      this.axios.get('/industry/tech/data/' + item).then(res => {
        this.EnvironmentalIndex = []
        this.InputIndex = []
        this.VitalityIndex = []
        this.OutputIndex = []
        this.EnvironmentalIndex.push({value: +res.data.filter(x => x.part === '1')[0].value})
        this.InputIndex.push({value: +res.data.filter(x => x.part === '2')[0].value})
        this.VitalityIndex.push({value: +res.data.filter(x => x.part === '3')[0].value})
        this.OutputIndex.push({value: +res.data.filter(x => x.part === '4')[0].value})
        this.draw(this.EnvironmentalIndexChart, this.EnvironmentalIndex, 100, 125, 108, 116, 125, '创新环境指数')
        this.draw(this.InputIndexChart, this.InputIndex, 100, 128, 108, 116, 128, '创新投入指数')
        this.draw(this.OutputIndexChart, this.OutputIndex, 100, 135, 112, 124, 135, '创新产出指数')
        this.draw(this.VitalityIndexChart, this.VitalityIndex, 100, 135, 112, 124, 135, '创新成效指数')
      })
    },
    setTotalIndex () {
      let chart = new Chart({
        container: 'TotalIndex',
        height: document.getElementById('TotalIndex').clientHeight,
        width: document.getElementById('TotalIndex').clientWidth, // 指定图表宽度
        padding: [70, 20, 40, 40]
      })
      chart.data(this.TotalIndexData)
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.scale('value', {
        min: 90,
        nice: true
      })
      chart.tooltip({showMarkers: false})
      chart.interaction('active-region')
      chart.interval().position('year*value').color('#FF7F50')
      chart.render()
    },
    setEnvironmentalIndex () {
      registerShape('point', 'pointer', {
        draw (cfg, container) {
          const group = container.addGroup({})
          // 获取极坐标系下画布中心点
          const center = this.parsePoint({ x: 0, y: 0 })
          // 绘制指针
          group.addShape('line', {
            attrs: {
              x1: center.x,
              y1: center.y,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 5,
              lineCap: 'round'
            }
          })
          group.addShape('circle', {
            attrs: {
              x: center.x,
              y: center.y,
              r: 9.75,
              stroke: cfg.color,
              lineWidth: 4.5,
              fill: '#fff'
            }
          })
          return group
        }
      })
      this.EnvironmentalIndexChart = new Chart({
        container: 'EnvironmentalIndex',
        autoFit: true
      })
      this.EnvironmentalIndexChart.data(this.EnvironmentalIndex)
      this.EnvironmentalIndexChart.animate(false)
      this.EnvironmentalIndexChart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.80
      })
      this.EnvironmentalIndexChart.scale('value', {
        min: 100,
        max: 125,
        tickInterval: 5
      })
      this.EnvironmentalIndexChart.axis('1', false)
      this.EnvironmentalIndexChart.axis('value', {
        line: null,
        label: {
          offset: -40,
          style: {
            fontSize: 18,
            fill: '#CBCBCB',
            textAlign: 'center',
            textBaseline: 'middle'
          }
        },
        tickLine: {
          length: -24
        },
        grid: null
      })
      this.EnvironmentalIndexChart.legend(false)
      this.EnvironmentalIndexChart.tooltip(false)
      this.EnvironmentalIndexChart.point().position('value*1').shape('pointer').color('value', (val) => {
        if (val < 108) {
          return this.color[0]
        } else if (val <= 116) {
          return this.color[1]
        } else if (val <= 125) {
          return this.color[2]
        }
      })
      this.draw(this.EnvironmentalIndexChart, this.EnvironmentalIndex, 100, 125, 108, 116, 125, '创新环境指数')
    },
    setInputIndex () {
      registerShape('point', 'pointer', {
        draw (cfg, container) {
          const group = container.addGroup({})
          // 获取极坐标系下画布中心点
          const center = this.parsePoint({ x: 0, y: 0 })
          // 绘制指针
          group.addShape('line', {
            attrs: {
              x1: center.x,
              y1: center.y,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 5,
              lineCap: 'round'
            }
          })
          group.addShape('circle', {
            attrs: {
              x: center.x,
              y: center.y,
              r: 9.75,
              stroke: cfg.color,
              lineWidth: 4.5,
              fill: '#fff'
            }
          })
          return group
        }
      })
      this.InputIndexChart = new Chart({
        container: 'InputIndex',
        autoFit: true
        // padding: [0, 0, 30, 0]
      })
      this.InputIndexChart.data(this.InputIndex)
      this.InputIndexChart.animate(false)
      this.InputIndexChart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.80
      })
      this.InputIndexChart.scale('value', {
        min: 100,
        max: 128,
        tickInterval: 5
      })
      this.InputIndexChart.axis('1', false)
      this.InputIndexChart.axis('value', {
        line: null,
        label: {
          offset: -40,
          style: {
            fontSize: 18,
            fill: '#CBCBCB',
            textAlign: 'center',
            textBaseline: 'middle'
          }
        },
        tickLine: {
          length: -24
        },
        grid: null
      })
      this.InputIndexChart.legend(false)
      this.InputIndexChart.tooltip(false)
      this.InputIndexChart.point().position('value*1').shape('pointer').color('value', (val) => {
        if (val < 108) {
          return this.color[0]
        } else if (val <= 116) {
          return this.color[1]
        } else if (val <= 128) {
          return this.color[2]
        }
      })
      this.draw(this.InputIndexChart, this.InputIndex, 100, 128, 108, 116, 128, '创新投入指数')
    },
    setOutputIndex () {
      registerShape('point', 'pointer', {
        draw (cfg, container) {
          const group = container.addGroup({})
          // 获取极坐标系下画布中心点
          const center = this.parsePoint({ x: 0, y: 0 })
          // 绘制指针
          group.addShape('line', {
            attrs: {
              x1: center.x,
              y1: center.y,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 5,
              lineCap: 'round'
            }
          })
          group.addShape('circle', {
            attrs: {
              x: center.x,
              y: center.y,
              r: 9.75,
              stroke: cfg.color,
              lineWidth: 4.5,
              fill: '#fff'
            }
          })
          return group
        }
      })
      this.OutputIndexChart = new Chart({
        container: 'OutputIndex',
        autoFit: true
        // padding: [0, 0, 30, 0]
      })
      this.OutputIndexChart.data(this.OutputIndex)
      this.OutputIndexChart.animate(false)
      this.OutputIndexChart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.80
      })
      this.OutputIndexChart.scale('value', {
        min: 100,
        max: 135,
        tickInterval: 7
      })
      this.OutputIndexChart.axis('1', false)
      this.OutputIndexChart.axis('value', {
        line: null,
        label: {
          offset: -40,
          style: {
            fontSize: 18,
            fill: '#CBCBCB',
            textAlign: 'center',
            textBaseline: 'middle'
          }
        },
        tickLine: {
          length: -24
        },
        grid: null
      })
      this.OutputIndexChart.legend(false)
      this.OutputIndexChart.tooltip(false)
      this.OutputIndexChart.point().position('value*1').shape('pointer').color('value', (val) => {
        if (val < 112) {
          return this.color[0]
        } else if (val <= 124) {
          return this.color[1]
        } else if (val <= 135) {
          return this.color[2]
        }
      })
      this.draw(this.OutputIndexChart, this.OutputIndex, 100, 135, 112, 124, 135, '创新产出指数')
    },
    setVitalityIndex () {
      registerShape('point', 'pointer', {
        draw (cfg, container) {
          const group = container.addGroup({})
          // 获取极坐标系下画布中心点
          const center = this.parsePoint({ x: 0, y: 0 })
          // 绘制指针
          group.addShape('line', {
            attrs: {
              x1: center.x,
              y1: center.y,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 5,
              lineCap: 'round'
            }
          })
          group.addShape('circle', {
            attrs: {
              x: center.x,
              y: center.y,
              r: 9.75,
              stroke: cfg.color,
              lineWidth: 4.5,
              fill: '#fff'
            }
          })
          return group
        }
      })
      this.VitalityIndexChart = new Chart({
        container: 'VitalityIndex',
        autoFit: true
        // padding: [0, 0, 30, 0]
      })
      this.VitalityIndexChart.data(this.VitalityIndex)
      this.VitalityIndexChart.animate(false)
      this.VitalityIndexChart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.80
      })
      this.VitalityIndexChart.scale('value', {
        min: 100,
        max: 135,
        tickInterval: 7
      })
      this.VitalityIndexChart.axis('1', false)
      this.VitalityIndexChart.axis('value', {
        line: null,
        label: {
          offset: -40,
          style: {
            fontSize: 18,
            fill: '#CBCBCB',
            textAlign: 'center',
            textBaseline: 'middle'
          }
        },
        tickLine: {
          length: -24
        },
        grid: null
      })
      this.VitalityIndexChart.legend(false)
      this.VitalityIndexChart.tooltip(false)
      this.VitalityIndexChart.point().position('value*1').shape('pointer').color('value', (val) => {
        if (val < 112) {
          return this.color[0]
        } else if (val <= 124) {
          return this.color[1]
        } else if (val <= 135) {
          return this.color[2]
        }
      })
      this.draw(this.VitalityIndexChart, this.VitalityIndex, 100, 135, 112, 124, 135, '创新成效指数')
    },
    draw (chart, data, min, max, firstRange, secondRange, thirdRange, industry) {
      const val = data[0].value
      const lineWidth = 15
      chart.annotation().clear(true)
      // 绘制仪表盘背景
      chart.annotation().arc({
        top: false,
        start: [min, 1],
        end: [max, 1],
        style: {
          stroke: '#CBCBCB',
          lineWidth,
          lineDash: null
        }
      })
      if (val >= firstRange) {
        chart.annotation().arc({
          start: [min, 1],
          end: [val, 1],
          style: {
            stroke: this.color[0],
            lineWidth,
            lineDash: null
          }
        })
      }
      if (val >= secondRange) {
        chart.annotation().arc({
          start: [firstRange, 1],
          end: [secondRange, 1],
          style: {
            stroke: this.color[1],
            lineWidth,
            lineDash: null
          }
        })
      }
      if (val > secondRange && val <= thirdRange) {
        chart.annotation().arc({
          start: [secondRange, 1],
          end: [val, 1],
          style: {
            stroke: this.color[2],
            lineWidth,
            lineDash: null
          }
        })
      }
      if (val > firstRange && val <= secondRange) {
        chart.annotation().arc({
          start: [firstRange, 1],
          end: [val, 1],
          style: {
            stroke: this.color[1],
            lineWidth,
            lineDash: null
          }
        })
      }
      if (val < firstRange) {
        chart.annotation().arc({
          start: [min, 1],
          end: [val, 1],
          style: {
            stroke: this.color[0],
            lineWidth,
            lineDash: null
          }
        })
      }
      chart.annotation().text({
        position: ['50%', '10%'],
        content: industry,
        style: {
          fontSize: 20,
          fill: '#F0FFFF',
          textAlign: 'center'
        },
        offsetY: 15
      })
      chart.annotation().text({
        position: ['50%', '85%'],
        content: data[0].value,
        style: {
          fontSize: 32,
          fill: 'Orange',
          textAlign: 'center'
        },
        offsetY: 15
      })
      chart.changeData(data)
    },
    getMapDataByType (type) {
      this.axios.get('/industry/tech/databytype/' + type).then(res => {
        this.mapData = res.data
        this.setMapData()
      })
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
          minZoom: 5.8,
          maxZoom: 5.8
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
        const pointLayer = new PointLayer({})
          .source(this.mapData, {
            parser: {
              type: 'json',
              x: 'lon',
              y: 'lat'
            }
          }).shape('circle').size('value', [ 10, 25 ]).active(true).color('yellow').style({
            opacity: 0.3,
            strokeWidth: 2
          })
        scene.addLayer(pointLayer)
      })
    },
    tableHeaderClick (column, event) {
      this.currentMapIndex = column.label
      this.getMapDataByType(this.currentMapIndex)
    }
  },
  mounted () {
    this.axios.get('/industry/tech/data').then(res => {
      this.ExpenditureData = res.data.yearData.filter(x => x.part === '0')
      this.FundsPropData = res.data.yearData.filter(x => x.part === '1')
      this.FullTimeData = res.data.yearData.filter(x => x.part === '2')
      this.PeopleHavePatentsData = res.data.yearData.filter(x => x.part === '3')
      this.PatentsNumData = res.data.yearData.filter(x => x.part === '4')
      this.TechnicalFundsData = res.data.yearData.filter(x => x.part === '5')
      this.TotalIndexData = res.data.yearData.filter(x => x.part === '6')
      this.timeData = res.data.innovateData.range
      this.currentYear = res.data.innovateData.first
      this.EnvironmentalIndex.push({value: +res.data.innovateData.data.filter(x => x.part === '1')[0].value})
      this.InputIndex.push({value: +res.data.innovateData.data.filter(x => x.part === '2')[0].value})
      this.VitalityIndex.push({value: +res.data.innovateData.data.filter(x => x.part === '3')[0].value})
      this.OutputIndex.push({value: +res.data.innovateData.data.filter(x => x.part === '4')[0].value})
      this.pointend = this.timeData.length
      this.tableData = res.data.techData
      this.setExpenditure()
      this.setFundsProp()
      this.setFullTime()
      this.setPeopleHavePatents()
      this.setPatentsNum()
      this.setTechnicalFunds()
      this.setTotalIndex()
      this.setEnvironmentalIndex()
      this.setInputIndex()
      this.setOutputIndex()
      this.setVitalityIndex()
      this.setMapData()
      // this.test2()
      this.getMapDataByType(this.currentMapIndex)
    })
  }
}
</script>
<style scoped>
#Expenditure{
  height: 310px;
  left: 10px;
  top: 99px;
  width: 355px;
}
#FundsProp{
  height: 310px;
  left: 370px;
  top: 99px;
  width: 350px;
}
#FullTime{
  height: 300px;
  left: 10px;
  top: 420px;
  width: 355px;
}
#PeopleHavePatents{
  height: 300px;
  left: 370px;
  top: 420px;
  width: 350px;
}
#PatentsNum{
  height: 310px;
  left: 10px;
  top: 730px;
  width: 355px;
}
#TechnicalFunds{
  height: 310px;
  left: 370px;
  top: 730px;
  width: 350px;
}
#TechIndex{
  height: 943px;
  left: 725px;
  top: 98px;
  width: 550px;
}
#RegionTechIndex{
  height: 943px;
  left: 1280px;
  top: 98px;
  width: 625px;
}
#TotalIndex{
 height: 340px;
 width: 550px;
 margin-top:40px;
}
#TotalIndex > label{
  position: absolute;
  top: 35px;
  left: 0;
  color: #bddfff;
  line-height: 30px;
  padding-left: 10px;
  font-size: 15px;
  text-align: left;
}
#EnvironmentalIndex,#InputIndex,#OutputIndex,#VitalityIndex{
  height: 250px;
}
#map{
  height: 430px;
  width: 625px;
  top: 10px;
  position: relative;
}
.el-table{
  top:15px;
}
.mapLegend{
  height:210px;
  width:120px;
  bottom:10px;
  position: absolute;
  right:10px
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
