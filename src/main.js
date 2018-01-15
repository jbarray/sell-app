// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// const Vue =require('vue')
//import Vue from 'vue/dist/vue.common'
//const VueRouter=require('vue-router')
 import Vue from 'vue'
 import App from '../src/App.vue'
 import VueRouter from 'vue-router'
 import VueResource from 'vue-resource'
 import goods from './components/goods/goods.vue'
 import ratings from './components/ratings/ratings.vue'
 import seller from './components/seller/seller.vue'
 import './common/stylus/index.styl'
 const routes=[
   {path: '/goods', component: goods},
   {path: '/ratings', component: ratings},
   {path: '/seller', component: seller}
]
import './common/stylus/index.styl';
Vue.use(VueRouter);
Vue.use(VueResource);
const router = new VueRouter({
  // base:'/dist/',
  routes
})
/* eslint-disable no-new */
new Vue({
  el: '#content',
 // render:(createElement)=>createElement(App),
  // template: '<App/>',
   components: { App },
  router
})
