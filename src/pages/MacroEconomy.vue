<template>
  <div>
    <div class="centerStas centerNewYearGDPIndex">
      <p>{{MaxYear}}年GDP完成<label>{{NewYearGDP}}</label>亿元</p>
    </div>
    <div class="centerStas centerNewYearGDPRateIndex">
      <p>{{MaxYear}}年GDP增速比上年增长<label>{{NewYearGDPRate}}</label>%</p>
    </div>
    <div id='LeadingIndicator' class="stas">
       <p>临沂市先行指标</p>
       <el-row>
         <img class="indexicon" src="../../static/image/icon_lock.png"/>
          <div class="indextext">
              <label class="indexvalue">{{PMI}}</label>
              <label class="indexunit">%</label>
              <br/>
              <label>PMI</label>
          </div>
       </el-row>
       <el-row>
         <img class="indexicon" src="../../static/image/icon_car.png"/>
         <div class="indextext">
            <label class="indexvalue">{{GoodsAmount}}</label>
            <label class="indexunit">万吨</label>
            <br/>
            <label>货运量</label>
         </div>
       </el-row>
       <el-row>
         <img class="indexicon" src="../../static/image/icon_electricity.png"/>
         <div class="indextext">
          <label class="indexvalue">{{PowerConsum}}</label>
          <label class="indexunit">亿千瓦时</label>
          <br/>
          <label>工业用电量</label>
         </div>
       </el-row>
    </div>
    <div id='ThreeNeed' class="stas">
       <p>临沂市三大需求</p>
       <label>单位（亿元）</label>
    </div>
    <div id='CityGDP' class="stas">
       <p>各市地区生产总值对比情况</p>
       <label>单位（亿元）</label>
       <el-select v-model="currentYear" @change="yearChange">
         <el-option v-for="item in Years" :key="item" :value="item" :label="item"></el-option>
       </el-select>
    </div>
    <div id='GDPIndex' class="stas">
       <p>临沂市历年地区生产总值及指数</p>
       <label style="left:175px;top:70px">单位（亿元）</label>
       <label style="left:580px;top:70px">单位（%）</label>
       <div class="GDPIndexRadio">
          <el-radio-group v-model="radio" @change="GDPIndexChange">
            <el-radio label="0">生产总值 》</el-radio>
            <el-radio label="1">第一产业增加值 》</el-radio>
            <el-radio label="2">第二产业增加值 》</el-radio>
            <el-radio label="3">第三产业增加值 》</el-radio>
          </el-radio-group>
       </div>
       <div id='GDPIndexChart'></div>
    </div>
    <div id='FixedInvestGrowth' class="stas">
       <p>临沂市地区生产总值预测</p>
       <label>单位（亿元）</label>
    </div>
    <div id='ThreeIndustry' class="stas">
       <p>三次产业对经济增长贡献率</p>
       <label>单位（%）</label>
       <el-row>
         <el-col :span="8"><div id='FristIndustry'></div></el-col>
         <el-col :span="8"><div id='SecondIndustry'></div></el-col>
         <el-col :span="8"><div id='ThirdIndustry'></div></el-col>
       </el-row>
       <el-row>
         <el-radio-group style="margin-right:10px" v-model="ThreeIndustryTime" v-for="item in threeIndustryYears" :key="item" @change="ThreeIndustryTimeChange">
            <el-radio style="margin-top:0px" :label="item">{{item}}</el-radio>
          </el-radio-group>
       </el-row>
    </div>
    <div id='RegionGDP' class="stas">
       <p>各区县地区生产总值对比分析</p>
       <label>单位（万人）</label>
    </div>
  </div>
</template>
<script>
import { Chart, registerShape } from '@antv/g2'
import { Scene } from '@antv/l7'
import { CityLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      NewYearGDP: '',
      NewYearGDPRate: '',
      PMI: '',
      GoodsAmount: '',
      PowerConsum: '',
      ThreeNeedData: [],
      CityGDPData: [],
      FixedInvestGrowthData: [],
      GDPIndexChart: null,
      currentYear: '',
      Years: '',
      CityGDPChart: null,
      radio: '',
      IndexData: [],
      IndexDataRate: [],
      yearData: [],
      threeIndustryYears: [],
      ThreeIndustryTime: '',
      FristIndustry: [],
      SecondIndustry: [],
      ThirdIndustry: [],
      FristIndustryChart: null,
      SecondIndustryChart: null,
      ThirdIndustryChart: null,
      color: ['#0086FA', '#FFBF00', '#F5222D'],
      MaxYear: ''
    }
  },
  methods: {
    setThreeNeed () {
      let chart = new Chart({
        container: 'ThreeNeed',
        height: document.getElementById('ThreeNeed').clientHeight,
        width: document.getElementById('ThreeNeed').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 40]
      })
      chart.data(this.ThreeNeedData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#FF8C00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.render()
    },
    setCityGDP () {
      if (!this.GDPIndexChart || this.GDPIndexChart === null) {
        this.GDPIndexChart = new Chart({
          container: 'CityGDP',
          height: document.getElementById('CityGDP').clientHeight,
          width: document.getElementById('CityGDP').clientWidth, // 指定图表宽度
          padding: [70, 20, 60, 50]
        })
      }
      this.GDPIndexChart.scale('value', {tickCount: 3})
      this.GDPIndexChart.data(this.CityGDPData)
      utils.changeChartAxisForeground(this.GDPIndexChart, 'region', 'value')
      this.GDPIndexChart.interaction('active-region')
      // this.CityGDPChart.interval().position('region*value').color('#7FFFD4').label('value', {
      //   style: {
      //     fill: '#bddfff'
      //   }
      // })
      this.GDPIndexChart.legend(false)
      this.GDPIndexChart.interval().position('region*value').color('region', (val) => {
        if (val === '临沂市') { return '#ff5957' } return '#7FFFD4'
      }).label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      this.GDPIndexChart.render()
    },
    setFixedInvestGrowth () {
      let chart = new Chart({
        container: 'FixedInvestGrowth',
        height: document.getElementById('FixedInvestGrowth').clientHeight,
        width: document.getElementById('FixedInvestGrowth').clientWidth, // 指定图表宽度
        padding: [70, 20, 60, 30]
      })
      chart.data(this.FixedInvestGrowthData)
      chart.tooltip({
        showCrosshairs: true,
        shared: true
      })
      chart.legend({
        position: 'top-right',
        offsetY: 35,
        offsetX: -5
      })
      utils.changeChartAxisForeground(chart, 'year', 'value')
      chart.line().position('year*value').color('type').shape('smooth')
      chart.point().position('year*value').color('type').shape('circle')
      chart.render()
    },
    setGDPIndexChart () {
      if (!this.CityGDPChart || this.CityGDPChart === null) {
        this.CityGDPChart = new Chart({
          container: 'GDPIndexChart',
          forceFit: false,
          height: document.getElementById('GDPIndexChart').clientHeight,
          width: document.getElementById('GDPIndexChart').clientWidth, // 指定图表宽度
          animate: true,
          padding: [70, 40, 60, 50]
        })
      }
      this.CityGDPChart.scale('ratevalue', { // 右侧坐标轴
        min: -10,
        max: 11.2,
        tickCount: 5, // 左右坐标轴刻度数量保持一致 好看点
        range: [0, 1 - 1 / 5 / 2],
        line: null,
        tickLine: null,
        grid: {
          lineDash: null,
          stroke: 'red',
          lineWidth: 0
        }
      })
      this.CityGDPChart.legend({
        custom: true,
        position: 'top-right',
        offsetY: 20,
        offsetX: -5,
        flipPage: false,
        items: [
          {
            name: '生产总值',
            marker: {
              symbol: 'square',
              style: {
                fill: '#3182bd'
              },
              clickable: false
            }
          },
          {
            name: '生产总值增速',
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
      this.CityGDPChart.axis('ratevalue', {
        grid: null,
        label: {
          textStyle: {
            fill: '#fdae6b'
          }
        }
      })
      this.CityGDPChart.tooltip({shared: true})
      utils.changeChartAxisForeground(this.CityGDPChart, 'value', 'year')
      utils.changeChartAxisForeground(this.CityGDPChart, 'ratevalue', '')
      this.CityGDPChart.data(this.indexData)
      this.CityGDPChart.interval().position('year*value').color('#3182bd')
      this.CityGDPChart.line().position('year*ratevalue').color('#fdae6b').size(3).shape('smooth')
      this.CityGDPChart.point().position('year*ratevalue').color('#fdae6b').size(3).shape('circle')
      this.CityGDPChart.interaction('active-region')
      this.CityGDPChart.removeInteraction('legend-filter')
      this.CityGDPChart.render()
    },
    yearChange (item) {
      this.axios.get('/macro/data/getRegionTotalValue/' + this.currentYear).then(res => {
        this.CityGDPData = res.data
        this.setCityGDP()
      })
    },
    GDPIndexChange (item) {
      this.setIndexData(item)
    },
    setIndexData (part) {
      this.radio = part
      let data = this.yearData.filter(x => x.part === part && x.unit !== '%')
      let dataRate = this.yearData.filter(x => x.part === part && x.unit === '%')
      this.indexData = []
      for (var i = 0; i < data.length; i++) {
        this.indexData.push({
          year: data[i].year,
          value: data[i].value,
          ratevalue: dataRate.filter(x => x.year === data[i].year)[0].value
        })
      }
      this.setGDPIndexChart()
    },
    ThreeIndustryTimeChange (time) {
      this.ThreeIndustryTime = time
      this.FristIndustry = []
      this.SecondIndustry = []
      this.ThirdIndustry = []
      this.axios.get('/macro/data/getTheeIndustry/' + time).then(res => {
        console.log(res.data.filter(x => x.type === '第二产业')[0].value, res.data.filter(x => x.type === '第三产业')[0].value)
        this.FristIndustry.push({value: +res.data.filter(x => x.type === '第一产业')[0].value})
        this.SecondIndustry.push({value: +res.data.filter(x => x.type === '第二产业')[0].value})
        this.ThirdIndustry.push({value: +res.data.filter(x => x.type === '第三产业')[0].value})
        this.draw(this.FristIndustryChart, this.FristIndustry, 0, 6, 2, 4, 6, '第一产业')
        this.draw(this.SecondIndustryChart, this.SecondIndustry, 38, 60, 45, 52, 60, '第二产业')
        this.draw(this.ThirdIndustryChart, this.ThirdIndustry, 38, 56, 44, 50, 56, '第三产业')
      })
    },
    createDashboard (chart, id, data, min, max, firstRange, secondRange, thirdRange) {
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
      chart = new Chart({
        container: id,
        autoFit: true,
        height: 500,
        width: 500
        // padding: [0, 0, 30, 0]
      })
      chart.data(data)
      chart.animate(false)
      chart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.85
      })
      if (id === 'FristIndustry') {
        chart.scale('value', {
          min: min,
          max: max,
          tickInterval: 1
        })
      } else {
        chart.scale('value', {
          min: min,
          max: max,
          tickInterval: 4
        })
      }
      chart.axis('1', false)
      chart.axis('value', {
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
      chart.legend(false)
      chart.tooltip(false)
      chart.point().position('value*1').shape('pointer').color('value', (val) => {
        if (val < firstRange) {
          return this.color[0]
        } else if (val <= secondRange) {
          return this.color[1]
        } else if (val <= thirdRange) {
          return this.color[2]
        }
      })
      this.draw(chart, data, min, max, firstRange, secondRange, thirdRange)
    },
    setFristIndustry () {
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
      this.FristIndustryChart = new Chart({
        container: 'FristIndustry',
        autoFit: true
        // padding: [0, 0, 30, 0]
      })
      this.FristIndustryChart.data(this.FristIndustry)
      this.FristIndustryChart.animate(false)
      this.FristIndustryChart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.88
      })
      this.FristIndustryChart.scale('value', {
        min: 0,
        max: 6,
        tickInterval: 1
      })
      this.FristIndustryChart.axis('1', false)
      this.FristIndustryChart.axis('value', {
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
      this.FristIndustryChart.legend(false)
      this.FristIndustryChart.tooltip(false)
      this.FristIndustryChart.point().position('value*1').shape('pointer').color('value', (val) => {
        if (val < 2) {
          return this.color[0]
        } else if (val <= 4) {
          return this.color[1]
        } else if (val <= 6) {
          return this.color[2]
        }
      })
      this.draw(this.FristIndustryChart, this.FristIndustry, 0, 6, 2, 4, 6, '第一产业')
    },
    // setFristIndustry () {
    //   this.createDashboard(this.FristIndustryChart, 'FristIndustry', this.FristIndustry, 0, 6, 2, 4, 6)
    // },
    // setSecondIndustry () {
    //   this.createDashboard(this.SecondIndustryChart, 'SecondIndustry', this.SecondIndustry, 38, 60, 45, 52, 60)
    // },
    // setThirdIndustry () {
    //   this.createDashboard(this.ThirdIndustryChart, 'ThirdIndustry', this.ThirdIndustry, 38, 56, 44, 50, 56)
    // },
    setSecondIndustry () {
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
      this.SecondIndustryChart = new Chart({
        container: 'SecondIndustry',
        autoFit: true,
        padding: [0, 0, 30, 0]
      })
      this.SecondIndustryChart.data(this.SecondIndustry)
      this.SecondIndustryChart.animate(false)
      this.SecondIndustryChart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.75
      })
      this.SecondIndustryChart.scale('value', {
        min: 38,
        max: 60,
        tickInterval: 4
      })
      this.SecondIndustryChart.axis('1', false)
      this.SecondIndustryChart.axis('value', {
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
      this.SecondIndustryChart.legend(false)
      this.SecondIndustryChart.tooltip(false)
      this.SecondIndustryChart.point().position('value*1').shape('pointer').color('value', (val) => {
        if (val < 45) {
          return this.color[0]
        } else if (val <= 52) {
          return this.color[1]
        } else if (val <= 60) {
          return this.color[2]
        }
      })
      this.draw(this.SecondIndustryChart, this.SecondIndustry, 38, 60, 45, 52, 60, '第二产业')
    },
    setThirdIndustry () {
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
      this.ThirdIndustryChart = new Chart({
        container: 'ThirdIndustry',
        autoFit: true
        // padding: [0, 0, 30, 0]
      })
      this.ThirdIndustryChart.data(this.ThirdIndustry)
      this.ThirdIndustryChart.animate(false)
      this.ThirdIndustryChart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.88
      })
      this.ThirdIndustryChart.scale('value', {
        min: 38,
        max: 56,
        tickInterval: 4
      })
      this.ThirdIndustryChart.axis('1', false)
      this.ThirdIndustryChart.axis('value', {
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
      this.ThirdIndustryChart.legend(false)
      this.ThirdIndustryChart.tooltip(false)
      this.ThirdIndustryChart.point().position('value*1').shape('pointer').color('value', (val) => {
        if (val < 44) {
          return this.color[0]
        } else if (val <= 50) {
          return this.color[1]
        } else if (val <= 56) {
          return this.color[2]
        }
      })
      this.draw(this.ThirdIndustryChart, this.ThirdIndustry, 38, 56, 44, 50, 56, '第三产业')
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
        position: ['50%', '70%'],
        content: data[0].value,
        style: {
          fontSize: 36,
          fill: 'Orange',
          textAlign: 'center'
        },
        offsetY: 15
      })
      chart.changeData(data)
    },
    setMapChartData () {
      const scene = new Scene({
        id: 'RegionGDP',
        logoVisible: false,
        map: new Mapbox({
          // center: [ 118.35, 35.35 ],
          style: 'blank',
          zoom: 5,
          minZoom: 7.3,
          maxZoom: 7.3
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
            color: '#001e8a48'
          },
          popup: {
            enable: true,
            Html: props => {
              // return `<span>${props.NAME_CHN}:</span><span>${props.value}</span>`
            }
          }
        })
      })
    }
  },
  mounted () {
    this.axios.get('/macro/data').then(res => {
      this.yearData = res.data.yearMacro
      let indexData = res.data.yearMacro.filter(x => x.part === '7')
      this.PMI = utils.sortByKey(indexData.filter(x => x.type === 'PMI'), 'year')[0].value
      this.GoodsAmount = utils.sortByKey(indexData.filter(x => x.type === '工业用电量'), 'year')[0].value
      this.PowerConsum = utils.sortByKey(indexData.filter(x => x.type === '货运量'), 'year')[0].value
      this.ThreeNeedData = res.data.yearMacro.filter(x => x.part === '6')
      this.CityGDPData = res.data.regionTotalValue.data
      this.Years = res.data.regionTotalValue.range
      this.currentYear = res.data.regionTotalValue.first
      this.FixedInvestGrowthData = res.data.yearMacro.filter(x => x.part === '5')
      this.threeIndustryYears = res.data.threeIndustry.range
      this.ThreeIndustryTime = res.data.threeIndustry.first
      this.MaxYear = utils.sortByKey(res.data.yearMacro.filter(x => x.part === '8'), 'year')[0].year
      this.NewYearGDPRate = res.data.yearMacro.filter(x => x.part === '8' && x.year === this.MaxYear && x.unit === '%')[0].value
      this.NewYearGDP = res.data.yearMacro.filter(x => x.part === '8' && x.year === this.MaxYear && x.unit === '亿元')[0].value
      this.FristIndustry.push({value: +res.data.threeIndustry.data.filter(x => x.year === this.ThreeIndustryTime && x.type === '第一产业')[0].value})
      this.SecondIndustry.push({value: +res.data.threeIndustry.data.filter(x => x.year === this.ThreeIndustryTime && x.type === '第二产业')[0].value})
      this.ThirdIndustry.push({value: +res.data.threeIndustry.data.filter(x => x.year === this.ThreeIndustryTime && x.type === '第三产业')[0].value})
      this.setThreeNeed()
      this.setCityGDP()
      this.setIndexData('0')
      this.setFixedInvestGrowth()
      this.setFristIndustry()
      this.setSecondIndustry()
      this.setThirdIndustry()
      this.setMapChartData()
    })
  }
}
</script>
<style scoped>
#LeadingIndicator{
  height: 473px;
  left: 10px;
  top:99px;
  width: 270px;
}
#ThreeNeed{
  height: 473px;
  left: 285px;
  top:99px;
  width: 340px;
}
#CityGDP{
  height: 468px;
  left: 10px;
  top:576px;
  width: 615px;
}
#GDPIndex{
  height: 405px;
  left: 628px;
  top:168px;
  width: 665px;
}
#FixedInvestGrowth{
  height: 468px;
  left: 628px;
  top:576px;
  width: 665px;
}
#ThreeIndustry{
  height: 438px;
  left: 1300px;
  top:114px;
  width: 610px;
}
#RegionGDP{
  height: 490px;
  left: 1300px;
  top:555px;
  width: 610px;
  /* background-color: #001e8a48; */
}
.centerNewYearGDPIndex{
  width: 330px;
  height: 40px;
  top:100px;
  left:630px;
}
.centerNewYearGDPRateIndex{
  width: 320px;
  height: 40px;
  top:100px;
  left:970px;
}
.indexicon{
  /* border:solid 1px red; */
  /* left:10px; */
  float: left;
  margin: 70px 5px 0px 5px;
}
.indextext{
  font-size: 21px;
  /* border: solid 1px red; */
  float: left;
  margin-top:60px;
  color: #d5f4ff;
  font-weight: bold;
}
.indextext > label{
  float: left;
}
.indexunit{
  margin-top:10px
}
.indexvalue{
  color: #00FF05;
  font-size: 40px;
}
.el-select{
  width: 100px;
  height: 30px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 99999;
  /* background-color: transparent; */
}
.GDPIndexRadio{
  width: 165px;
  float: left;
  margin-top:30px;
  height: 375px;
}
#GDPIndexChart{
  overflow:auto;
  margin-top:30px;
  height: 375px;
}
.el-radio {
  color: #6be4ffad;
  cursor: pointer;
  width: 100%;
  margin-right: 0px;
  background-color: #29758275;
  margin-top:40px;
  font-size: 18px;
  line-height: 40px;
  border-top: 1px solid #69d2ff80;
  border-bottom: 1px solid #69d2ff80;
}
.el-radio.is-checked{
  background-color: #b1fc0144;
  border-top: 1px solid #b1fc0162;
  border-bottom: 1px solid #b1fc0162;
}
#FristIndustry,#SecondIndustry,#ThirdIndustry{
  margin-top:60px;
  height: 300px;
}
</style>
