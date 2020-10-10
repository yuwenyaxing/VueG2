import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'PopulationAnalysis',
          component: () => import('@/pages/PopulationAnalysis')
        },
        {
          path: '/MacroEconomy',
          name: 'MacroEconomy',
          component: () => import('@/pages/MacroEconomy')
        },
        {
          path: '/AgriculturalEconomy',
          name: 'AgriculturalEconomy',
          component: () => import('@/pages/AgriculturalEconomy')
        },
        {
          path: '/IndustrialForecast',
          name: 'IndustrialForecast',
          component: () => import('@/pages/IndustrialForecast')
        },
        {
          path: '/IndustrialForecast',
          name: 'IndustrialForecast',
          component: () => import('@/pages/IndustrialForecast')
        },
        {
          path: '/IndustrialGreen',
          name: 'IndustrialGreen',
          component: () => import('@/pages/IndustrialGreen')
        },
        {
          path: '/IndustrialInvest',
          name: 'IndustrialInvest',
          component: () => import('@/pages/IndustrialInvest')
        },
        {
          path: '/IndustrialPark',
          name: 'IndustrialPark',
          component: () => import('@/pages/IndustrialPark')
        },
        {
          path: '/IndustrialTechnology',
          name: 'IndustrialTechnology',
          component: () => import('@/pages/IndustrialTechnology')
        },
        {
          path: '/IndustrialTransformation',
          name: 'IndustrialTransformation',
          component: () => import('@/pages/IndustrialTransformation')
        },
        {
          path: '/IndustryCheck',
          name: 'IndustryCheck',
          component: () => import('@/pages/IndustryCheck')
        }
      ]
    }
  ]
})
