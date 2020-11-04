<template>
  <div>
    <div id='InvestExecution' class="stas">
      <p>工业投资完成情况</p>
      <div id='IndustryInvest'>
        <label>单位（亿元）</label>
        <label style="left:420px">单位（%）</label>
      </div>
      <div id='IndustryInvestProp'></div>
      <div class="industrydescribe">
        <p >完成投资额较高的行业：<label style="color:red">{{Industryhigh}}</label></p>
        <p style="top:30px">完成投资额较低的行业：<label style="color:red">{{Industrylow}}</label></p>
        <p style="top:80px;font-size: 28px;font-weight: bold;color:#fff">月计划完成率：89.82% </p>
        <p style="top:80px;left:350px;font-size: 28px;font-weight: bold;color:#fff">进度：<label style="color:green">正常</label></p>
      </div>
    </div>
    <div id='InvestRank' class="stas">
      <p>{{MaxYear}}投资额排名</p>
      <div id='InvestRegion'>
        <label>分市州排名</label>
        <label style="left:300px">单位（亿元）</label>
      </div>
      <div id='InvestIndustry'>
        <label>分行业排名</label>
        <label style="left:300px">单位（亿元）</label>
      </div>
    </div>
    <div id='InvestRateRank' class="stas">
       <p>{{MaxYear}}投资额增速排名</p>
       <el-row>
         <el-col :span="12">
           <div id='InvestRegionRate'>
            <label>分市州排名</label>
            <label style="left:300px">单位（%）</label>
          </div>
         </el-col>
         <el-col :span="12">
           <div id='InvestIndustryRate'>
            <label>分行业排名</label>
            <label style="left:300px">单位（%）</label>
          </div>
         </el-col>
       </el-row>
    </div>
    <div id='RegionInvestExecution' class="stas">
      <p>各区县投资完成情况</p>
      <div id='map'>
        <el-select v-model="currentYear" @change="yearChange">
          <el-option v-for="item in Years" :key="item" :value="item" :label="item"></el-option>
        </el-select>
        <label style="color:white;margin-top: 350px;z-index: 9999999999;position: absolute;text-align: right;margin-left: 250px;">工业投资完成额（万元）</label>
      </div>
    </div>
  </div>
</template>
<script>
import { Chart } from '@antv/g2'
import { Scene, PolygonLayer, LineLayer, PointLayer, Marker, MarkerLayer, Control } from '@antv/l7'
import { Mapbox } from '@antv/l7-maps'
import * as utils from '@/utils/commonUtils.js'
export default {
  data () {
    return {
      IndustryInvestData: [],
      InvestRegionData: [],
      InvestIndustryData: [],
      InvestRegionRateData: [],
      InvestIndustryRateData: [],
      MaxYear: '',
      IndustryInvestPropData: [],
      Industryhigh: '',
      Industrylow: '',
      colorMapData: '',
      locationMapData: [],
      currentYear: '',
      Years: [],
      mapcolorLayer: null,
      geoData: [],
      markerLayer: null,
      mapScene: null
    }
  },
  methods: {
    setIndustryInvest () {
      let chart = new Chart({
        container: 'IndustryInvest',
        forceFit: false,
        height: document.getElementById('IndustryInvest').clientHeight,
        width: document.getElementById('IndustryInvest').clientWidth, // 指定图表宽度
        animate: true,
        padding: [70, 40, 20, 70]
      })
      chart.scale('累计投资完成额同比增速', { // 右侧坐标轴
        min: 10.5,
        max: 12.5,
        tickCount: 4, // 左右坐标轴刻度数量保持一致 好看点
        range: [0, 1 - 1 / 11 / 2]
      })
      chart.legend({
        custom: true,
        position: 'top-right',
        offsetY: 35,
        offsetX: -5,
        flipPage: false,
        items: [
          {
            name: '累计投资完成额',
            marker: {
              symbol: 'square',
              style: {
                fill: '#3182bd'
              },
              clickable: false
            }
          },
          {
            name: '累计投资完成额同比增速',
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
      chart.axis('累计投资完成额同比增速', {
        grid: null,
        label: {
          textStyle: {
            fill: '#fdae6b'
          }
        }
      })
      chart.tooltip({shared: true})
      utils.changeChartAxisForeground(chart, '累计投资完成额', 'year')
      utils.changeChartAxisForeground(chart, '累计投资完成额同比增速', '')
      chart.data(this.IndustryInvestData)
      chart.interval().position('year*累计投资完成额').color('#3182bd')
      chart.line().position('year*累计投资完成额同比增速').color('#fdae6b').size(3).shape('smooth')
      chart.point().position('year*累计投资完成额同比增速').color('#fdae6b').size(3).shape('circle')
      chart.render()
    },
    setIndustryInvestProp () {
      let chart = new Chart({
        container: 'IndustryInvestProp',
        height: document.getElementById('IndustryInvestProp').clientHeight,
        width: document.getElementById('IndustryInvestProp').clientWidth, // 指定图表宽度
        padding: [0, 40, 60, 40]
      })
      chart.data(this.InvestIndustryData)
      chart.legend('type', false)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.coordinate('theta', {radius: 0.75, innerRadius: 0.6})
      chart.interval().adjust('stack').position('value').color('type',
        ['#00FFFF', '#7CFC00', '#D2691E', '#FF7F50', '#6495ED', '#FF4500', '#9932CC', '#FF1493', '#FFD700', '#008000', '#F08080'])
        .label('value', (value) => {
          return {
            content: (data) => {
              return `${data.type}: ${value}`
            }
          }
        },
        {
          style: {
            fill: '#bddfff'
          }
        }).tooltip('type*value', (type, value) => {
          value = value + ''
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
    setInvestRegion () {
      let chart = new Chart({
        container: 'InvestRegion',
        height: document.getElementById('InvestRegion').clientHeight,
        width: document.getElementById('InvestRegion').clientWidth, // 指定图表宽度
        padding: [70, 40, 0, 70]
      })
      chart.data(this.InvestRegionData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#FF8C00').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.coordinate('rect').transpose()
      chart.render()
    },
    setInvestIndustry () {
      let chart = new Chart({
        container: 'InvestIndustry',
        height: document.getElementById('InvestIndustry').clientHeight,
        width: document.getElementById('InvestIndustry').clientWidth, // 指定图表宽度
        padding: [70, 50, 0, 90]
      })
      chart.data(this.InvestIndustryData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#7FFFD4').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.coordinate('rect').transpose()
      chart.render()
    },
    setInvestRegionRate () {
      let chart = new Chart({
        container: 'InvestRegionRate',
        height: document.getElementById('InvestRegionRate').clientHeight,
        width: document.getElementById('InvestRegionRate').clientWidth, // 指定图表宽度
        padding: [70, 50, 20, 70]
      })
      chart.data(this.InvestRegionRateData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#00BFFF').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.coordinate('rect').transpose()
      chart.render()
    },
    setInvestIndustryRate () {
      let chart = new Chart({
        container: 'InvestIndustryRate',
        height: document.getElementById('InvestIndustryRate').clientHeight,
        width: document.getElementById('InvestIndustryRate').clientWidth, // 指定图表宽度
        padding: [70, 30, 20, 80]
      })
      chart.data(this.InvestIndustryRateData)
      utils.changeChartAxisForeground(chart, 'type', 'value')
      chart.scale('value', {nice: true})
      chart.interaction('active-region')
      chart.interval().position('type*value').color('#FFD700').label('value', {
        style: {
          fill: '#bddfff'
        }
      })
      chart.coordinate('rect').transpose()
      chart.render()
    },
    setMapData () {
      this.mapScene = new Scene({
        id: 'map',
        logoVisible: false,
        map: new Mapbox({
          // pitch: 0,
          style: 'blank',
          center: [118.35, 35.35],
          zoom: 7.5
        })
      })
      const legend = new Control({
        position: 'bottomright'
      })
      const color = [
        '#eceef8',
        '#dadef1',
        '#c7cdea',
        '#b4bce4',
        '#a2acdd',
        '#8f9bd6',
        '#7d8acf',
        '#6a7ac8',
        '#5769c1'
      ]
      legend.onAdd = function () {
        var el = document.createElement('div')
        el.className = 'infolegend legend'
        el.style.width = '160px'
        el.style.marginBottom = '60px'
        el.style.marginRight = '60px'
        // el.style.height = '20px'
        var grades = [0, 30000, 50000, 80000, 100000, 500000, 1000000, 5000000, 1000000]
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
      this.mapScene.on('loaded', async () => {
        this.geoData = await (await fetch('./static/shp/linyi.json')).json()
        this.mapcolorLayer = new PolygonLayer({})
          .source(this.geoData, {
            parser: {type: 'geojson'},
            transforms: [
              {
                type: 'join',
                sourceField: 'name',
                targetField: 'name',
                data: this.colorMapData
              }
            ]
          }).color('value', ['#eceef8', '#323E89']).shape('fill').style({opacity: 1})
        const layer2 = new LineLayer({
          zIndex: 2
        }).source(this.geoData).color('#fff').size(0.6).style({
          opacity: 1
        })
        // if (this.markerLayer !== null) {
        //   this.mapScene.removeMarkerLayer(this.markerLayer)
        // }
        this.markerLayer = new MarkerLayer()
        this.locationMapData.forEach(item => {
          let endHtml = '</div>'
          if (item.value < 100) {
            endHtml = '<img style="width:22px;height:22px" src="../../static/image/warn.png"/></div>'
          }
          const el = document.createElement('div')
          el.style = 'width:185px'
          el.innerHTML +=
          '<div style="width:150px;height:30px;background:#515151;width:150px;float:left"><span style="position:relative;float:left;height:30px;line-height:30px;background: #F78A09;min-width:30px;width:' + item.value + '%;"><span>' + item.region + '完成' + item.value + '%</span></span></div>' + endHtml
          // item.value < 100 ? '<img style="width:30px;height:30px" src="../../static/image/warn.png"/></div>': '</div>'
          // '<img style="width:30px;height:30px" src="../../static/image/warn.png"/></div>'
          const marker = new Marker({
            element: el
          }).setLnglat
          ({ lng: item.lon * 1, lat: item.lat })
          this.markerLayer.addMarker(marker)
        })
        this.mapScene.addLayer(this.mapcolorLayer)
        this.mapScene.addLayer(layer2)
        this.mapScene.addMarkerLayer(this.markerLayer)
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
          this.mapScene.addLayer(labelLayer)
          this.mapScene.addControl(legend)
        })
      })
    },
    yearChange (item) {
      this.currentYear = item
      this.getMapData()
    },
    getMapData () {
      this.axios.get('/industry/invest/data/' + this.currentYear).then(res => {
        this.colorMapData = res.data.filter(x => x.type === '投资额').map(item => ({
          code: item.regioncode,
          name: item.region,
          value: item.value
        }))
        this.locationMapData = res.data.filter(x => x.type === '投资完成')
        if (this.mapcolorLayer === null) {
          this.setMapData()
        } else {
          this.mapScene.removeMarkerLayer(this.markerLayer) 
          this.markerLayer = new MarkerLayer()
          this.locationMapData.forEach(item => {
            let endHtml = '</div>'
            if (item.value < 100) {
              endHtml = '<img style="width:22px;height:22px" src="../../static/image/warn.png"/></div>'
            }
            const el = document.createElement('div')
            el.style = 'width:185px'
            el.innerHTML +=
            '<div style="width:150px;height:30px;background:#515151;width:150px;float:left"><span style="position:relative;float:left;height:30px;line-height:30px;background: #F78A09;min-width:30px;width:' + item.value + '%;"><span>' + item.region + '完成' + item.value + '%</span></span></div>' + endHtml
            // item.value < 100 ? '<img style="width:30px;height:30px" src="../../static/image/warn.png"/></div>': '</div>'
            // '<img style="width:30px;height:30px" src="../../static/image/warn.png"/></div>'
            const marker = new Marker({
              element: el
            }).setLnglat
            ({ lng: item.lon * 1, lat: item.lat })
            this.markerLayer.addMarker(marker)
          })
          this.mapScene.addMarkerLayer(this.markerLayer)
          this.mapcolorLayer.setData(this.geoData, {
            parser: {type: 'geojson'},
            transforms: [
              {
                type: 'join',
                sourceField: 'name',
                targetField: 'name',
                data: this.colorMapData
              }
            ]
          })
        }
      })
    }
  },
  mounted () {
    this.axios.get('/industry/invest/data').then(res => {
      let data = res.data.yearData.filter(x => x.part === '0')
      let ratedata = res.data.yearData.filter(x => x.part === '1')
      for (var i = 0; i < data.length; i++) {
        this.IndustryInvestData.push({
          year: data[i].year,
          累计投资完成额: data[i].value,
          累计投资完成额同比增速: ratedata.filter(x => x.year === data[i].year)[0].value
        })
      }
      this.InvestIndustryData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '2'), 'value')
      this.InvestRegionData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '3'), 'value')
      this.InvestRegionRateData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '4'), 'value')
      this.InvestIndustryRateData = utils.sortFromSmallToLargeByKey(res.data.yearData.filter(x => x.part === '5'), 'value')
      this.Industrylow = this.InvestIndustryData[0].type + '、' + this.InvestIndustryData[1].type + '、' + this.InvestIndustryData[2].type
      this.Industryhigh = this.InvestIndustryData[this.InvestIndustryData.length - 1].type + '、' + this.InvestIndustryData[this.InvestIndustryData.length - 2].type + '、' + this.InvestIndustryData[this.InvestIndustryData.length - 3].type
      this.Years = res.data.regionData.range
      this.currentYear = this.Years[0]
      this.getMapData()
      this.setIndustryInvest()
      this.setIndustryInvestProp()
      this.setInvestRegion()
      this.setInvestIndustry()
      this.setInvestRegionRate()
      this.setInvestIndustryRate()
    })
  }
}
</script>
<style scoped>
.progress {
height:30px;
background:#515151;
/* text-align: center; */
/* border-left:1px solid transparent;
border-right:1px solid transparent; */
/* border-radius:10px; */
}
.progress > span {
position:relative;
float:left;
/* margin:0 -1px; */
min-width:30px;
height:30px;
line-height:30px;
/* text-align:right; */
/* background:#F78A09; */
/* border:1px solid; */
/* border-color:#bfbfbf #b3b3b3 #9e9e9e; */
/* border-radius:10px; */
/* background-image:-webkit-linear-gradient(top,#f0f0f0 0%,#dbdbdb 70%,#cccccc 100%);
background-image:-moz-linear-gradient(top,#f0f0f0 0%,#dbdbdb 70%,#cccccc 100%);
background-image:-o-linear-gradient(top,#f0f0f0 0%,#dbdbdb 70%,#cccccc 100%);
background-image:linear-gradient(to bottom,#f0f0f0 0%,#dbdbdb 70%,#cccccc 100%); */
/* -webkit-box-shadow:inset 0 1px rgba(255,255,255,0.3),0 1px 2px rgba(0,0,0,0.2);
box-shadow:inset 0 1px rgba(255,255,255,0.3),0 1px 2px rgba(0,0,0,0.2); */
}
.progress > label{
  text-align: center;
  color: white;
  width: 200px;
  border: solid 1px red
}
.progress > span > span {
padding:0 8px;
font-size:11px;
font-weight:bold;
text-align: center;
color:white
/* color:#404040;
color:rgba(0,0,0,0.7);
text-shadow:0 1px rgba(255,255,255,0.4); */
}
/* .progress > span:before {
content:'';
position:absolute;
top:0;
bottom:0;
left:0;
right:0;
z-index:1;
height:18px;
border-radius:10px;
} */
.progress .green {
background:#85c440;
border-color:#78b337 #6ba031 #568128;
background-image:-webkit-linear-gradient(top,#b7dc8e 0%,#99ce5f 70%,#85c440 100%);
background-image:-moz-linear-gradient(top,#b7dc8e 0%,#99ce5f 70%,#85c440 100%);
background-image:-o-linear-gradient(top,#b7dc8e 0%,#99ce5f 70%,#85c440 100%);
background-image:linear-gradient(to bottom,#b7dc8e 0%,#99ce5f 70%,#85c440 100%);
}
.progress .red {
background: #F78A09;
/* border-color:#c73321 #b12d1e #8e2418; */
/* background-image:-webkit-linear-gradient(top,#ea8a7e 0%,#e15a4a 70%,#db3a27 100%);
background-image:-moz-linear-gradient(top,#ea8a7e 0%,#e15a4a 70%,#db3a27 100%);
background-image:-o-linear-gradient(top,#ea8a7e 0%,#e15a4a 70%,#db3a27 100%);
background-image:linear-gradient(to bottom,#ea8a7e 0%,#e15a4a 70%,#db3a27 100%); */
}
/* .progress .orange {
background:#f2b63c;
border-color:#f0ad24 #eba310 #c5880d;
background-image:-webkit-linear-gradient(top,#f8da9c 0%,#f5c462 70%,#f2b63c 100%);
background-image:-moz-linear-gradient(top,#f8da9c 0%,#f5c462 70%,#f2b63c 100%);
background-image:-o-linear-gradient(top,#f8da9c 0%,#f5c462 70%,#f2b63c 100%);
background-image:linear-gradient(to bottom,#f8da9c 0%,#f5c462 70%,#f2b63c 100%);
}
.progress .blue {
background:#5aaadb;
border-color:#459fd6 #3094d2 #277db2;
background-image:-webkit-linear-gradient(top,#aed5ed 0%,#7bbbe2 70%,#5aaadb 100%);
background-image:-moz-linear-gradient(top,#aed5ed 0%,#7bbbe2 70%,#5aaadb 100%);
background-image:-o-linear-gradient(top,#aed5ed 0%,#7bbbe2 70%,#5aaadb 100%);
background-image:linear-gradient(to bottom,#aed5ed 0%,#7bbbe2 70%,#5aaadb 100%);
} */
#InvestExecution{
  height: 961px;left:15px;top:88px;width: 520px;
}
#InvestRank{
  height: 961px;left:543px;top:88px;width: 400px;
}
#InvestRateRank{
  height: 357px;left:950px;top:88px;width: 956px;
}
#RegionInvestExecution{
  height: 600px;left:950px;top:450px;width: 956px;
}
#IndustryInvest{
 height: 400px;
 width: 520px;
 margin-top:40px;
}
#InvestRegion{
  height: 460px;
  width: 400px;
  position: relative;
}
#InvestIndustry{
  height: 460px;
  width: 400px;
  position: relative;
}
#InvestRegionRate,#InvestIndustryRate{
  height: 357px;width: 475px;position: relative;
}
#IndustryInvest > label,#InvestRegion>label,#InvestIndustry>label,#InvestIndustryRate>label,#InvestRegionRate>label{
  position: absolute;
  top: 35px;
  left: 0;
  color: #bddfff;
  line-height: 30px;
  padding-left: 10px;
  font-size: 15px;
  text-align: left;
}
#IndustryInvestProp{
  height: 420px;
  width: 520px;
  margin-top:10px
}
.industrydescribe{
  height: 340px;
  width: 520px;
  margin-top:-50px;
}
.industrydescribe> p{
  position: relative;
  color: #bddfff;;
  border-style: none;
  font-size: 20px;
  /* text-align: left; */
}
.el-select{
  width: 130px;
  height: 30px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 99999;
  /* background-color: transparent; */
}
</style>
