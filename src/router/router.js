import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/search',
      component: () => import('@/views/Search/Search.vue'),
      children:[
        {
          path: ':id',
          component: ()=> import('@/components/SingerDetail/SingerDetail.vue')
        }
      ]
    },
    {
      path: '/recommend',
      component: () => import('@/views/Recommend/Recommend.vue'),
      children:[
        {
          name: 'search-singer',
          path: ':id',
          component: () => import('@/components/DiscDetail/DiscDetail.vue')
        }
      ]
    },
    {
      path: '/singer',
      component: () => import('@/views/Singer/Singer.vue'),
      children:[
        {
          path: ':id',
          component: () => import('@/components/SingerDetail/SingerDetail.vue')
        }
      ]
    },
    {
      path: '/rank',
      component: () => import('@/views/Rank/Rank.vue'),
      children:[
        {
          path: ':id',
          component: () => import('@/components/BangDetail/BangDetail.vue')
        }
      ]
    },
    {
      path: '/mv',
      component: () => import('@/views/MV/MV.vue'),
      children:[
        {
          path: ':id',
          component: () => import('@/components/MVList/MVList.vue'),
        },
        {
          path: '',
          redirect: '236682871'
        }
      ]
    },
    {
      path: '/mine',
      component: () => import('@/views/Mine/Mine.vue')
    },
    {
      path: '',
      redirect: '/recommend'
    }
  ]
})
