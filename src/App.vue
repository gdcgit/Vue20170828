<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
      <keep-alive>
          <router-view v-bind:seller="seller" :FoodToSend="selectFoods" ></router-view>
      </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
    import axios from 'axios';
    import Header from './components/header/Header';
    import Bus from './common/js/Bus';
    import {urlParse} from './common/js/utils';

    const ERR_OK = 0;

    let config = {
        // 基础url前缀
//        baseURL: 'http://localhost:8080'
        baseURL: 'http://10.6.0.28:8080'
    };

    export default {
        data() {
            return {
              seller: {
                  id: (() => {
                      let queryParam = urlParse();
                      return queryParam.id;
                  })()
              },
              selectFoods: []
            }
          },
        created:function () {
            axios.get('/api/sellerData',config).then((response) => {
                let res = response.data;
                if(res.errno === ERR_OK){

                    this.seller = Object.assign({}, this.seller, res.data);
                }
            });

            this.$nextTick(() => {
                Bus.$on('toseller',(food) => {
                    this.selectFoods = food;
                });
            });


        },
        components: {
            'v-header': Header,
        },
  };
</script>

<style>
#app {

}
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
   }
    .tab .tab-item {
       flex: 1;
       text-align: center;
     }
        .tab a {
          display: block;
          font-size: 14px;
          color: rgb(75, 85, 93);
        }
          .tab .active {
            color: rgb(240, 20, 20);
          }
</style>
