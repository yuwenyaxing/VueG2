<template>
  <div>
    <div id="map">
      <p>{{mapTitle}}</p>
      <img src="../../static/image/ResetImage.png" style="position: absolute;z-index: 99;width:80px;top:40px;left: 20px;cursor: pointer;" @click="backMap"/>
      <el-select v-model="CurentYear" @change="yearChange">
        <el-option v-for="item in Years" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-card class="box-card" style="top:415px" v-if="parkInfo">
        <div slot="header" class="clearfix">
          <span>园区产值前5</span>
        </div>
        <div v-for="item in this.ParkOutPutValueTop" :key="item.id" class="text item">
          {{item.parkname}}：<label>{{item.outputvalue}}万元</label>
        </div>
      </el-card>
      <el-card class="box-card"  v-if="parkInfo">
        <div slot="header" class="clearfix">
          <span>园区投资前5</span>
        </div>
        <div v-for="item in this.ParkOutPutValueTop" :key="item.id" class="text item">
          {{item.parkname}}：<label>{{item.investvalue}}万元</label>
        </div>
      </el-card>
      <el-card class="box-card" style="min-width: 385px;top:440px" v-if="companyvisible">
        <div slot="header" class="clearfix">
          <span>企业生产及效益信息</span>
        </div>
        <div v-for="item in this.companyBaseInfo" :key="item.id" class="text item">
          {{item.index}}：<label>{{item.value}}</label>
        </div>
      </el-card>
      <el-card class="box-card" v-if="companyvisible">
        <div slot="header" class="clearfix">
          <span>企业基础信息</span>
        </div>
        <div v-for="item in this.companyInfo" :key="item.id" class="text item">
           {{item.index}}：<label>{{item.value}}</label>
        </div>
      </el-card>
      <div class="mapLegend" v-if="parkInfo">
        <el-row><label>总产值</label></el-row>
        <el-row><label>高</label></el-row>
        <el-row><div style="height: 35px;width: 35px;"></div></el-row>
        <el-row><div style="height: 25px;width: 25px;"></div></el-row>
        <el-row><div style="height: 15px;width: 15px;"></div></el-row>
        <el-row><label>底</label></el-row>
      </div>
      <label style="color:white;margin-top: 780px;z-index: 9999999999;position: absolute;text-align: right;margin-left: 220px;font-weight: bold;font-size:20px">总产值（万元）</label>
    </div>
    <div id='OutputValue' class="stas" v-show="parkInfo">
      <p>{{CurentYear}}{{CurrentRegion}}产值占比</p>
    </div>
    <div id='AddedValue' class="stas" v-show="parkInfo">
      <p>{{CurentYear}}{{CurrentRegion}}增加值占比</p>
    </div>
    <div id='InvestValue' class="stas" v-show="parkInfo">
      <p>{{CurentYear}}{{CurrentRegion}}投资占比</p>
    </div>
    <div id='EmploymentValue' class="stas" v-show="parkInfo">
      <p>{{CurentYear}}{{CurrentRegion}}就业占比</p>
    </div>
    <div id='AssetValue' class="stas" v-show="parkInfo">
      <p>{{CurentYear}}{{CurrentRegion}}资产占比</p>
    </div>
    <div id='DebtValue' class="stas" v-show="parkInfo">
      <p>{{CurentYear}}{{CurrentRegion}}负债占比</p>
    </div>
    <div id='CompanyOutPut' class="stas" v-show="!parkInfo">
      <p>{{CurentYear}}园区企业产值排名</p>
    </div>
    <div id='CompanyMain' class="stas" v-show="!parkInfo">
      <p>{{CurentYear}}园区企业主营业务收入排名</p>
    </div>
    <div id='CompanyProfit' class="stas" v-show="!parkInfo">
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
import { Scene, PolygonLayer, LineLayer, PointLayer, Marker, MarkerLayer, Popup, Control } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
export default {
  data () {
    return {
      mapTitle: '临沂市各区县总产值分布图',
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
      mapParkData: [],
      mapcolorLayer: null,
      geoData: [],
      pointLayer: null,
      CompanyLocationData: [],
      parkInfo: true,
      companymarkerLayer: null,
      mapScene: null,
      companyBaseInfo: [],
      companyInfo: [],
      companyvisible: false,
      mapLegend: null
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
          padding: [60, 60, 30, 150]
        })
      }
      this.CompanyOutPutChart.data(this.CompanyOutPutData)
      utils.changeChartAxisForeground(this.CompanyOutPutChart, 'name', 'outputvalue')
      this.CompanyOutPutChart.scale('outputvalue', {nice: true})
      this.CompanyOutPutChart.interaction('active-region')
      this.CompanyOutPutChart.interval().position('name*outputvalue').color('#FF8C00').label('outputvalue', {
        style: {
          fill: '#bddfff'
        }
      })
      this.CompanyOutPutChart.coordinate('rect').transpose()
      this.CompanyOutPutChart.render()
    },
    setCompanyMain () {
      if (!this.CompanyMainChart || this.CompanyMainChart === null) {
        this.CompanyMainChart = new Chart({
          container: 'CompanyMain',
          height: document.getElementById('CompanyMain').clientHeight,
          width: document.getElementById('CompanyMain').clientWidth, // 指定图表宽度
          padding: [60, 60, 30, 150]
        })
      }
      this.CompanyMainChart.data(this.CompanyMainData)
      utils.changeChartAxisForeground(this.CompanyMainChart, 'name', 'mainvalue')
      this.CompanyMainChart.scale('mainvalue', {nice: true})
      this.CompanyMainChart.interaction('active-region')
      this.CompanyMainChart.interval().position('name*mainvalue').color('#7FFFD4').label('mainvalue', {
        style: {
          fill: '#bddfff'
        }
      })
      this.CompanyMainChart.coordinate('rect').transpose()
      this.CompanyMainChart.render()
    },
    setCompanyProfit () {
      if (!this.CompanyProfitChart || this.CompanyProfitChart === null) {
        this.CompanyProfitChart = new Chart({
          container: 'CompanyProfit',
          height: document.getElementById('CompanyProfit').clientHeight,
          width: document.getElementById('CompanyProfit').clientWidth, // 指定图表宽度
          padding: [60, 30, 110, 50]
        })
      }
      this.CompanyProfitChart.data(this.CompanyProfitData)
      utils.changeChartAxisForeground(this.CompanyProfitChart, 'name', 'profit')
      this.CompanyProfitChart.scale('profit', {nice: true})
      this.CompanyProfitChart.interaction('active-region')
      this.CompanyProfitChart.interval().position('name*profit').color('#00BFFF').label('profit', {
        style: {
          fill: '#bddfff'
        }
      })
      // this.CompanyProfitChart.coordinate('rect').transpose()
      this.CompanyProfitChart.render()
    },
    getChartDataByTime () {
      if (this.parkInfo) {
        this.axios.get('/industry/park/data/' + this.CurentYear).then(res => {
          this.colorMapData = res.data.regionData.filter(x => x.part === '0').map(item => ({
            code: item.regioncode,
            name: item.region,
            value: item.value
          }))
          if (this.mapcolorLayer !== null) {
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
          this.ParkOutPutValueTop = []
          this.ParkInvestTop = []
          this.ParkOutPutValueTop = utils.sortByKey(res.data.parkData, 'outputvalue').slice(0, 5)
          this.ParkInvestTop = utils.sortByKey(res.data.parkData, 'investvalue').slice(0, 5)
          this.mapParkData = res.data.parkData
          if (this.pointLayer !== null) {
            this.pointLayer.setData(this.mapParkData, {
              parser: {
                type: 'json',
                x: 'lon',
                y: 'lat'
              }
            })
          }
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
      } else {
        this.axios.get('/industry/park/data/company/' + this.CurentYear).then(res => {
          if (this.companymarkerLayer !== null) {
            this.mapScene.removeMarkerLayer(this.companymarkerLayer)
          }
          this.CompanyLocationData = res.data
          this.companymarkerLayer = new MarkerLayer()
          this.CompanyLocationData.forEach(item => {
            const popup = new Popup({offsets: [ 0, 20 ]}).setText(item.name)
            const marker = new Marker({color: 'red'}).setLnglat([ item.lon, item.lat ]).setPopup(popup)
            marker.setExtData(item)
            marker.on('click', (e) => {
              this.companyvisible = true
              this.companyInfo = []
              this.companyBaseInfo = []
              this.companyInfo.push({index: '企业标准名称', value: item.name})
              this.companyInfo.push({index: '组织机构代码', value: item.organzization_code})
              this.companyInfo.push({index: '成立时间', value: item.start_time})
              this.companyInfo.push({index: '企业规模', value: item.scale})
              this.companyInfo.push({index: '统一社会信用代码', value: item.social_code})
              this.companyInfo.push({index: '企业登记注册类型', value: item.type})
              this.companyBaseInfo.push({index: '填报时间', value: item.report_time})
              this.companyBaseInfo.push({index: '工业总产值(千元)', value: item.outputvalue})
              this.companyBaseInfo.push({index: '工业销售产值(千元)', value: item.salesvalue})
              this.companyBaseInfo.push({index: '企业用电量(万千瓦时)', value: item.elecost})
              this.companyBaseInfo.push({index: '主营业务收入(千元)', value: item.mainvalue})
              this.companyBaseInfo.push({index: '税金(千元)', value: item.taxes})
              this.companyBaseInfo.push({index: '利润总额(千元)', value: item.profit})
              this.companyBaseInfo.push({index: '存货(千元)', value: item.stock})
              this.companyBaseInfo.push({index: '贷款余额(千元)', value: item.loan})
            })
            this.companymarkerLayer.addMarker(marker)
          })
          this.mapScene.addMarkerLayer(this.companymarkerLayer)
          this.CompanyOutPutData = utils.sortFromSmallToLargeByKey(JSON.parse(JSON.stringify(this.CompanyLocationData)), 'outputvalue')
          this.CompanyMainData = utils.sortFromSmallToLargeByKey(JSON.parse(JSON.stringify(this.CompanyLocationData)), 'mainvalue')
          this.CompanyProfitData = utils.sortByKey(JSON.parse(JSON.stringify(this.CompanyLocationData)), 'profit')
          this.setCompanyOutPut()
          this.setCompanyMain()
          this.setCompanyProfit()
        })
      }
    },
    yearChange (item) {
      this.CurentYear = item
      this.getChartDataByTime()
    },
    setMap () {
      this.mapScene = new Scene({
        id: 'map',
        logoVisible: false,
        map: new GaodeMap({
          style: 'light',
          // layers: [],
          center: [ 118.35, 35.35 ],
          zoom: 9
        })
      })
      this.mapLegend = new Control({
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
      this.mapLegend.onAdd = function () {
        var el = document.createElement('div')
        el.className = 'infolegend legend'
        el.style.width = '160px'
        el.style.marginBottom = '20px'
        el.style.marginRight = '60px'
        // el.style.height = '20px'
        var grades = [0, 200000, 400000, 600000, 800000, 1000000, 1500000, 2000000]
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
        const layer1 = new AMap.TileLayer.Satellite()
        // scene.map.setLayers([])
        layer1.setMap(this.mapScene.map)
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
          }).color('value', ['#dadef160', '#323e89ce']).shape('fill').style({opacity: 1})
          //  图层边界
        const layer2 = new LineLayer({
          zIndex: 2
        }).source(this.geoData).color('#fff').size(0.6).style({
          opacity: 1
        })
        const hightLayer = new LineLayer({
          zIndex: 4, // 设置显示层级
          name: 'hightlight'
        }).source({type: 'FeatureCollection', features: [ ]}).shape('line').size(2).color('red').style({opacity: 1})
        this.pointLayer = new PointLayer({})
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
        this.mapScene.addLayer(this.mapcolorLayer)
        this.mapScene.addLayer(layer2)
        this.mapScene.addLayer(this.pointLayer)
        this.mapScene.addLayer(hightLayer)
        // 点击园区查询园区企业打点数据
        this.pointLayer.on('click', (e) => {
          console.log(e, e.feature.parkname)
          this.mapTitle = e.feature.parkname + '企业分布图'
          this.mapScene.setCenter([ 118.33, 35.2 ])
          this.mapScene.setZoom(13)
          this.mapcolorLayer.hide()
          this.pointLayer.hide()
          this.parkInfo = false
          this.CurrentLayer = '企业'
          this.getChartDataByTime()
          if (this.mapLegend !== null) {
            this.mapLegend = null
          }
        })
        // 点击各区县查询各区县指标数据
        this.mapcolorLayer.on('click', feature => {
          this.mapScene.setCenter([ feature.lngLat.lng, feature.lngLat.lat ])
          this.CurrentLayer = '各区县'
          this.CurrentRegion = feature.feature.properties.name
          this.mapTitle = this.CurrentRegion + '园区总产值分布图'
          this.getChartDataByTime()
          hightLayer.setData({
            type: 'FeatureCollection',
            features: [ feature.feature ]
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
          this.mapScene.addLayer(labelLayer)
          this.mapScene.addControl(this.mapLegend)
        })
      })
    },
    backMap () {
      this.mapTitle = '临沂市各区县总产值分布图'
      this.mapScene.setCenter([ 118.35, 35.35 ])
      this.mapScene.setZoom(9)
      this.CurrentRegion = '临沂市'
      this.CurrentLayer = '临沂市各区县'
      this.parkInfo = true
      this.companyvisible = false
      this.getChartDataByTime()
      this.mapcolorLayer.show()
      this.pointLayer.show()
      if (this.companymarkerLayer !== null) {
        this.companymarkerLayer.clear()
      }
      // this.mapScene.addControl(this.mapLegend)
    }
  },
  mounted () {
    this.axios.get('/industry/park/data').then(res => {
      this.Years = res.data.regionData.range
      this.CurentYear = res.data.regionData.first
      this.getChartDataByTime()
      this.setMap()
    })
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
  top:10px;
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
  top:175px;
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
