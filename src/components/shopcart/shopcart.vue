<template>
    <div>
        <div class="shopcart">
            <div class="shop-content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="shop-logo" v-bind:class="{'shop-logo-highlight':totalCount>0}">
                            <i class="icon-shopping_cart" v-bind:class="{'icon-highlight':totalCount>0}"></i>
                        </div>
                        <div class="shop-num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="shop-price" v-bind:class="{'shop-price-highlight':totalCount>0}">{{totalPrice | formatTotal }}</div>
                    <div class="shop-desc" v-bind:class="{'shop-desc-highlight':totalCount>0}">另需配送费￥{{deliveryPrice}}元</div>
                </div>
                <div class="content-right">
                    <div class="shop-pay" v-bind:class="payClass" v-text="payDesc" @click.stop.prevent="pay"></div>
                </div>
            </div>
            <div class="ball-container">
                <div v-for="ball in balls">
                    <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                        <div v-show="ball.show" class="ball">
                            <div class="ball-inner ball-inner-hook"></div>
                        </div>
                    </transition>
                </div>
            </div>
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="shop-title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="shop-list-food" v-for="food in selectFoods">
                                <span class="shop-list-name">{{food.name}}</span>
                                <div class="shop-list-price">
                                    <span>￥{{food.price * food.count}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol v-bind:food="food"></cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="mask">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';
    import Bus from '../../common/js/Bus';
    import cartcontrol from '../cartcontrol/cartcontrol';
    import BScroll from 'better-scroll';

    export default {
        props:{
            selectFoods: {
                type: Array,
                default() {
                    return [];
                }
            },
            deliveryPrice:{
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                balls: [
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }
                ],
                dropBalls: [],
                fold: true
            }
        },
        filters:{
            formatTotal(value) {
                return "￥" + value.toFixed(2) + "元";
            }
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count =0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if(this.totalPrice === 0){
                    return `￥${this.minPrice}元起送`;
                }else if(this.totalPrice < this.minPrice){
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                }else{
                    return '去结算';
                }
            },
            payClass() {
                if(this.totalPrice < this.minPrice){
                    return 'not-enough';
                }else{
                    return 'enough';
                }
            },
            listShow() {
                if(!this.totalCount){
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;

                if(show){
                    this.$nextTick( () => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent,{
                                click: true
                            });
                        }else{
                            this.scroll.refresh();
                        }
                    });
                }

                return show;
            }
        },
        created: function () {
            this.$nextTick(function () {
                this.drop();
            });

        },
        methods: {
            drop() {
                Bus.$on('add', (el) => {
                    for (let i = 0; i<this.balls.length; i++) {
                        let ball = this.balls[i];
                        if(!ball.show){
                            ball.show = true;
                            ball.el = el;
                            this.dropBalls.push(ball);
                            return;
                        }
                    }
                });
            },
            beforeDrop(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if(ball.show){
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left - 32;
                        let y = - (window.innerHeight - rect.top -22);
                        el.style.display = '';
                        el.style.transform = `translate3d(0, ${y}px, 0)`;
                        el.style.webkitTransform = `translate3d(0,  ${y}px, 0)`;
                        let inner = el.getElementsByClassName('ball-inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px, 0 , 0)`;
                        inner.style.transform = `translate3d(${x}px, 0 , 0)`;
                    }
                }
            },
            dropping(el, done) {
                let rf = el.offsetHeight;
                this.$nextTick( () => {
                    el.style.display = '';
                    el.style.transform = 'translate3d(0, 0, 0)';
                    el.style.webkitTransform = 'translate3d(0, 0, 0)';
                    let inner = el.getElementsByClassName('ball-inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                    el.addEventListener('transitionend',done)
                });
            },
            afterDrop(el) {
                let ball = this.dropBalls.shift();
                if(ball){
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList() {
                if(!this.totalCount){
                    return;
                }
                this.fold = !this.fold;
            },
            empty() {
                this.selectFoods.forEach( (food) => {
                    food.count = 0;
                });
            },
            hideList() {
                this.fold = true;
            },
            pay() {
                if(this.totalPrice < this.minPrice){
                    return;
                }
                window.alert(`支付${this.totalPrice}元`)
            }
        },
        components: {
            cartcontrol
        }
    };
</script>

<style>
    .shopcart {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 50;
        width: 100%;
        height: 48px;
        background: #2b333b;
    }
     .shop-content {
         display: flex;
         background: #141d27;
         font-size: 0;
         color: rgba(255, 255, 255, 0.4);
     }
        .content-left {
            flex: 1;
        }
            .logo-wrapper {
                display: inline-block;
                vertical-align: top;
                position: relative;
                top: -10px;
                margin: 0 12px;
                padding: 6px;
                width: 56px;
                height: 56px;
                box-sizing: border-box;
                border-radius: 50%;
                background: #141d27;
            }
                .shop-num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 24px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    border-radius: 16px;
                    font-size: 9px;
                    font-weight: 700;
                    color: #fff;
                    background: rgb(240, 20, 20);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
                }
                .shop-logo {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2b343c;
                    text-align: center;
                }
                .shop-logo-highlight {
                    background: rgb(0, 160, 220);
                }
                .icon-shopping_cart {
                    line-height: 44px;
                    font-size: 24px;
                    color: #80858a;
                }
                .icon-highlight {
                    color: #fff;

                }
            .shop-price {
                display: inline-block;
                vertical-align: top;
                line-height: 24px;
                margin-top: 8px;
                box-sizing: border-box;
                padding-right: 12px;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 12px;
                font-weight: 700;
            }
            .shop-price-highlight {
                color: #fff;
            }
            .shop-desc {
                display: inline-block;
                vertical-align: top;
                line-height: 24px;
                margin: 12px 0 0 6px;
                font-size: 12px;
            }
        .content-right {
            flex:  0 0 105px;
            width: 105px;
        }
            .shop-pay {
                height: 48px;
                line-height: 48px;
                text-align: center;
                font-size: 12px;
                font-weight: 700;
            }
            .not-enough {
                background: #2b333b;
            }
            .enough {
                background: #00b43c;
                color: #fff;
            }
        .ball-container .ball{
            position: fixed;
            left: 32px;
            bottom: 22px;
            z-index: 200;
        }
            .ball-inner {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: rgb(0, 160, 220);
                transition: all 0.4s linear;
            }
        .drop-enter-active {
            transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
        }
        .shopcart-list {
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            transform: translate3d(0, -100%, 0);
        }
        .fold-enter-active,.fold-leave-active {
            transition: all 0.5s linear;
        }
        .fold-enter,.fold-leave-to {
            transform: translate3d(0, 0, 0);
        }


            .list-header {
                height: 40px;
                line-height: 40px;
                padding: 0 18px;
                background: #f3f5f7;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            }
                .shop-title {
                    float: left;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }
                .empty {
                    float: right;
                    font-size: 12px;
                    color: rgb(0, 160, 220);
                }
            .list-content {
                padding: 0 18px;
                max-height: 217px;
                background: #fff;
                overflow: hidden;
            }
        .shop-list-food {
            position: relative;
            padding: 12px 0;
            box-sizing: border-box;
            border: 1px solid rgba(7, 17, 27, 0.1);
        }
            .shop-list-name {
                line-height: 24px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .shop-list-price {
                position: absolute;
                right: 90px;
                bottom: 12px;
                line-height: 24px;
                font-size: 14px;
                font-weight: 700;
                color: rgb(240, 20, 20);
            }
            .cartcontrol-wrapper {
                position: absolute;
                top: 6px;
                right: 0;
                bottom: 6px;
            }
    .list-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 40;
        opacity: 1;
        background: rgba(7 ,17, 27, 0.6);
        backdrop-filter: blur(10px)
    }
    .mask-enter-active,.mask-leave-active {
        transition: all 0.5s
    }
    .mask-enter,.mask-leave-to {
        opacity: 0;
        background: rgba(7, 17, 27, 0);
    }
</style>