<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuscroll">
            <ul>
                <li v-for="(item,index) in goods" class="menu-item" v-bind:class="{'current': currentIndex===index}" v-on:click="selectMenu(index,$event)">
                    <span class="goods-text">
                        <span v-show="item.type>0" class="goods-icon" v-bind:class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodscroll">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="foods-title">{{item.name}}</h1>
                    <ul>
                        <li v-for="food in item.foods" class="food-item" @click="selectFood(food,$event)">
                            <div class="food-icon">
                                <img width="57" v-bind:src="food.icon" alt="食品图片">
                            </div>
                            <div class="food-content">
                                <h2 class="food-name">{{food.name}}</h2>
                                <div class="food-desc">{{food.description}}</div>
                                <div class="food-extra">
                                    <span class="food-count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="food-price">
                                    <span class="food-now">￥{{food.price}}</span><span class="food-old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol v-bind:food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart v-bind:select-foods="selectFoods" v-bind:delivery-price="seller.deliveryPrice" v-bind:min-price="seller.minPrice" ></shopcart>
        <food v-bind:food="selectedFood" ref="foodComponent"></food>
    </div>
</template>

<script>
    import axios from 'axios';
    import BScroll from 'better-scroll';
    import shopcart from '../shopcart/shopcart';
    import cartcontrol from '../cartcontrol/cartcontrol';
    import food from '../food/food';
    import Bus from '../../common/js/Bus';

    const ERR_OK = 0;
    let config = {
        // 基础url前缀
//        baseURL: 'http://localhost:8080'
      baseURL: 'http://10.6.0.28:8080'
    };

    export default {
        components:{
            shopcart,
            cartcontrol,
            food
        },
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: [],
                listHeight: [],
                scrollY: 0,
                selectedFood: {}
            }
        },
        computed: {
            currentIndex() {
              for(let i=0;i<this.listHeight.length;i++){
                  let height1 = this.listHeight[i];
                  let height2 = this.listHeight[i+1];
                  if(!height2 || (this.scrollY>=height1 && this.scrollY<height2)){
                      return i;
                  }
              }
              return 0;
          },
            selectFoods() {
                let foods = [];

                this.goods.forEach( (good) => {
                    good.foods.forEach( (food) => {
                        if(food.count){
                            foods.push(food);
                        }
                    })
                });
                Bus.$emit('toseller',foods);

                return foods;
          }
        },
        created() {
            this.classMap = ['decrease','discount','special','invoice','guarantee'];

            axios.get('/api/goodsData',config).then(response => {
                let res = response.data;
                if(res.errno === ERR_OK){
                    this.goods = res.data;

                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    });

                }
            });


        },
        methods: {
            _initScroll() {
                this.menuScroll = new  BScroll(this.$refs.menuscroll,{
                    click:true
                });

                this.foodScroll = new BScroll(this.$refs.foodscroll,{
                    click:true,
                    probeType: 3
                });

                this.foodScroll.on('scroll',(pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            _calculateHeight() {
                let foodList = this.$refs.foodscroll.getElementsByClassName("food-list-hook");
                let height =0;
                this.listHeight.push(height);
                for(let i=0; i<foodList.length; i++){
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu(index, event) {
                //阻止浏览器默认提交点击事件
                if(!event._constructed){
                    return;
                }

                let foodList = this.$refs.foodscroll.getElementsByClassName("food-list-hook");
                let el = foodList[index];
                this.foodScroll.scrollToElement(el,300);
            },
            selectFood(food, event) {
                if (!event._constructed){
                    return;
                }
                this.selectedFood = food;
                this.$refs.foodComponent.show();

            }
        },
    };
</script>

<style>
    .goods {
        display: flex;
        position: absolute;
        /*top: 191px;*/
        top: 175px;
        bottom: 46px;
        width: 100%;
        overflow: hidden;
    }
        .goods .menu-wrapper {
            flex: 0 0 80px;
            width: 80px;
            background: #f3f5f7;
        }
            .goods .menu-wrapper .menu-item {
                display: table; /*无论文本一行还是两行都会垂直居中*/
                height: 54px;
                width: 60px;
                line-height: 14px;
                padding: 0 12px;
            }
                .goods .menu-wrapper .menu-item .goods-icon {
                    display: inline-block;
                    vertical-align: top;
                    width: 12px;
                    height: 12px;
                    margin-right: 2px;
                    background-size: 12px 12px;
                    background-repeat: no-repeat;
                }
                .goods .menu-wrapper .menu-item .decrease {
                    background-image: url('../../../static/img/decrease_3@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .goods .menu-wrapper .menu-item .decrease {
                        background-image: url('../../../static/img/decrease_3@3x.png');
                    }
                }
                .goods .menu-wrapper .menu-item .discount {
                    background-image: url('../../../static/img/discount_3@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .goods .menu-wrapper .menu-item .discount {
                        background-image: url('../../../static/img/discount_3@3x.png');
                    }
                }
                .goods .menu-wrapper .menu-item .guarantee {
                    background-image: url('../../../static/img/guarantee_3@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .goods .menu-wrapper .menu-item .guarantee {
                        background-image: url('../../../static/img/guarantee_3@3x.png');
                    }
                }
                .goods .menu-wrapper .menu-item .invoice {
                    background-image: url('../../../static/img/invoice_3@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .goods .menu-wrapper .menu-item .invoice {
                        background-image: url('../../../static/img/invoice_3@3x.png');
                    }
                }
                .goods .menu-wrapper .menu-item .special {
                    background-image: url('../../../static/img/special_3@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .goods .menu-wrapper .menu-item .special {
                        background-image: url('../../../static/img/special_3@3x.png');
                    }
                }

                .goods .menu-wrapper .menu-item .goods-text {
                    display: table-cell;
                    width: 60px;
                    vertical-align: middle;
                    font-size: 12px;
                    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                }
                .goods .current {
                    position: relative;
                    margin-top: -1px;
                    z-index: 10;
                    background: #fff;
                    font-weight: 700;
                }
                .goods .menu-wrapper .current .goods-text {
                     border: none;
                 }
        .goods .foods-wrapper {
            flex: 1;
            -webkit-box-flex: 1;
        }
        .foods-title {
            padding-left: 14px;
            height: 26px;
            line-height: 26px;
            border-left: 2px solid #d9dde1;
            font-size: 12px;
            color: rgb(147, 153, 159);
            background: #f3f5f7;
        }
        .food-item {
            display: flex;
            position: relative;
            margin: 18px;
            padding-bottom: 18px;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        }
        .food-item:last-child {
            border-bottom: none;
        }
        .food-icon {
            flex: 0 0 57px;
            margin-right: 10px;
        }
        .food-content {
            flex: 1;
        }
            .food-name {
                margin: 2px 0 8px 0;
                line-height: 14px;
                height: 14px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .food-desc {
                margin-bottom: 8px;
                line-height: 12px;
                font-size: 10px;
                color: rgb(147, 153, 159);
            }
            .food-extra {
                line-height: 10px;
                font-size: 10px;
                color: rgb(147, 153, 159);
            }
                .food-count {
                    margin-right: 12px;
                }
            .food-price {
                font-weight: 700;
                line-height: 24px;
            }
                .food-now {
                    margin-right: 8px;
                    font-size: 14px;
                    color: rgb(240, 20, 20);
                }
                .food-old {
                    text-decoration: line-through;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
        .cartcontrol-wrapper {
            position: absolute;
            right: 0px;
            bottom: 24px;
        }
</style>