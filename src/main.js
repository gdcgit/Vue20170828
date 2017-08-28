// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '@/App';
import Goods from '@/components/goods/Goods';
import Ratings from '@/components/ratings/Ratings';
import Seller from '@/components/seller/Seller';

Vue.use(VueRouter);
// Vue.use(axios);

// 1.定义路由组件
// 可以从其他文件 import 进来
// const goods = { component: Goods };

// 2.定义路由
const routes = [
    { path: '/goods', component: Goods },
    { path: '/ratings', component: Ratings },
    { path: '/seller', component: Seller },
];

// 3.创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes,
    linkActiveClass: 'active'
});

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
// const app = new Vue({
//   router,
//   template: '<App/>',
//   components: { App },
// }).$mount('#app');

new Vue({
    el:"#app",
    router,
    render: h => h(App)
});

// 页面默认加载进来的路由
// router.push('/goods');
