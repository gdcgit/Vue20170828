<template>
    <div class="seller" ref="seller">
        <div class="seller-content">
            <div class="seller-overview">
                <h1 class="seller-title">{{seller.name}}</h1>
                <div class="seller-desc">
                    <star :size="36" :score="seller.score"></star>
                    <span class="seller-text">({{seller.ratingCount}})</span>
                    <span class="seller-text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="seller-remark">
                    <li class="seller-block">
                        <h2>起送价</h2>
                        <div class="seller-content">
                            <span class="stress">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="seller-block">
                        <h2>商家配送</h2>
                        <div class="seller-content">
                            <span class="stress">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="seller-block">
                        <h2>平均配送时间</h2>
                        <div class="seller-content">
                            <span class="stress">{{seller.deliveryTime}}</span>分钟
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="toggleFavorite">
                    <i class="icon-favorite" :class="{'active':favorite}"></i>
                    <span class="favorite-text">{{favoriteText}}</span>
                </div>
            </div>
            <split></split>
            <div class="seller-bulletin">
                <h1 class="seller-bulletin-title">公告与活动</h1>
                <div class="seller-bulletin-content-wrapper">
                    <p  class="seller-bulletin-content">{{seller.bulletin}}</p>
                </div>
                <ul v-if="seller.supports" class="seller-supports">
                    <li class="seller-support-item" v-for="(item,index) in seller.supports">
                        <span class="seller-bulletin-icon" :class="classMap[seller.supports[index].type]"></span>
                        <span class="seller-bulletin-text">{{seller.supports[index].description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pics">
                <h1 class="pics-title">商家实景</h1>
                <div class="pic-wrapper" ref="picWrapper">
                    <ul class="pic-list" ref="picList">
                        <li class="pic-item" v-for="pic in seller.pics">
                            <img :src="pic" alt="商家实景" width="120" height="120">
                        </li>
                    </ul>
                </div>
            </div>
            <div class="info">
                <h1 class="info-title">商家信息</h1>
                <ul>
                    <li class="info-item" v-for="info in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
        <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ></shopcart>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import star from '../star/star';
    import split from '../split/split';
    import {saveToLocal, loadFromLocal} from '../../common/js/store';
    import shopcart from '../shopcart/shopcart';
    import Bus from '../../common/js/Bus';

    export default {
        props: {
            seller: {
                type: Object
            },
            FoodToSend: {
                type: Array,
                default: function() {
                    return [
                        {}
                    ];
                }
            }
        },
        data() {
            return {
                //立即执行函数
                favorite: (() => {
                    return loadFromLocal(this.seller.id, 'favorite', false);
                })()
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

        },
        computed: {
            favoriteText() {
                return this.favorite ? '已收藏' : '收藏';
            },
            selectFoods() {
                return this.FoodToSend;
            }
        },
        watch: {
            'seller'() {
                this.$nextTick( () => {
                    this._initScroll();
                    this._initPics();
                });
            }
        },
        mounted() {
            this.$nextTick( () => {
                this._initScroll();
                this._initPics();
            });
        },
        methods:{
            toggleFavorite(event) {
                if(!event._constructed) {
                    return;
                }
                this.favorite = !this.favorite;
                saveToLocal(this.seller.id,'favorite',this.favorite);
            },
            _initScroll() {
                if (!this.scroll) {
                    //BScroll需要传入better-scroll的外层容器（wrapper）
                    this.scroll = new BScroll(this.$refs.seller, {
                        click: true
                    });
                } else {
                    this.scroll.refresh();
                }
            },
            _initPics() {
                if (this.seller.pics){
                    let picWidth = 120;
                    let margin = 6;
                    let width = (picWidth + margin) * this.seller.pics.length - margin;
                    this.$refs.picList.style.width = width + 'px';
                    this.$nextTick( () => {
                        if(!this.picScroll){
                            this.picScroll = new BScroll(this.$refs.picWrapper, {
                                scrollX: true,
                                eventPassthrough: 'vertical'
                            });
                        }else{
                            this.picScroll.refresh();
                        }
                    });
                }
            },
        },
        components: {
            star,
            split,
            shopcart,
        }
    };
</script>

<style>
    /*better-scroll结构
        1.外层需要先有一个容器（wrapper），固定视口高度
        2.内层需要一个div,可以被内容自动撑高，内层高度超过视口高度就会滚动
    */
    .seller {
        position: absolute;
        top: 174px;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
    }
        .seller-overview {
            position:relative;
            padding: 18px;
        }
            .seller-title {
                margin-bottom: 8px;
                line-height: 14px;
                color: rgb(7, 17, 27);
                font-size: 14px;
            }
            .seller-desc {
                padding-bottom: 18px;
                border-bottom:rgba(7, 17, 27, 0.1);
                font-size: 0;
            }
                .star {
                    display: inline-block;
                    margin-right: 8px;
                    vertical-align: top;
                }
                .seller-text {
                    display: inline-block;
                    margin-right: 12px;
                    line-height: 18px;
                    vertical-align: top;
                    font-size: 10px;
                    color: rgb(77, 85, 93);
                }
            .seller-remark {
                display: flex;
                padding-top: 18px;
            }
                .seller-block {
                    flex: 1;
                    text-align: center;
                    border-right: 1px solid rgba(7, 17, 27, 0.1);
                }
                .seller-block:last-child {
                    border: none;
                }
                h2 {
                    margin-bottom: 4px;
                    line-height: 10px;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .seller-content {
                    line-height: 24px;
                    font-size: 10px;
                    color: rgb(7, 17, 27);
                }
                .stress {
                    font-size: 24px;
                }
            .favorite {
                position: absolute;
                width: 50px;
                right: 11px;
                top: 18px;
                text-align: center;
            }
                .icon-favorite {
                    display: block;
                    margin-bottom: 4px;
                    line-height: 24px;
                    font-size: 24px;
                    color: #d4d6d9;
                }
                .icon-favorite.active {
                    color: rgb(240, 20, 20);
                }
                .favorite-text {
                    line-height: 10px;
                    font-size: 10px;
                    color: rgb(77, 85, 93);
                }
            .seller-bulletin {
                padding: 18px 18px 0 18px
            }
                .seller-bulletin-title {
                    margin-bottom: 8px;
                    line-height: 14px;
                    color: rgb(7, 17, 27);
                    font-size: 14px;
                }
                .seller-bulletin-content-wrapper {
                    padding: 0 12px 16px 12px;
                    border-bottom: rgba(7, 17, 27, 0.1);
                }
                    .seller-bulletin-content {
                        line-height: 24px;
                        font-size: 12px;
                        color: rgb(240, 20, 20);
                    }
                .seller-supports .seller-support-item{
                    padding: 16px 12px;
                    border-bottom: rgba(7, 17, 27, 0.1);
                    font-size: 0;
                }
                .seller-supports .seller-support-item:last-child {
                    border: none;
                }
                .seller-bulletin-icon {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    vertical-align: top;
                    margin-right: 6px;
                    background-size: 16px 16px;
                    background-repeat: no-repeat;
                }
                .seller-bulletin-icon.decrease {
                    background-image: url('../../../static/img/decrease_4@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .seller-bulletin-icon.decrease {
                        background-image: url('../../../static/img/decrease_4@3x.png');
                    }
                }
                .seller-bulletin-icon.discount {
                    background-image: url('../../../static/img/discount_4@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .seller-bulletin-icon.discount {
                        background-image: url('../../../static/img/discount_4@3x.png');
                    }
                }
                .seller-bulletin-icon.guarantee {
                    background-image: url('../../../static/img/guarantee_4@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .seller-bulletin-icon.guarantee {
                        background-image: url('../../../static/img/guarantee_4@3x.png');
                    }
                }
                .seller-bulletin-icon.invoice {
                    background-image: url('../../../static/img/invoice_4@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .seller-bulletin-icon.invoice {
                        background-image: url('../../../static/img/invoice_4@3x.png');
                    }
                }
                .seller-bulletin-icon.special {
                    background-image: url('../../../static/img/special_4@2x.png');
                }
                @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                    .seller-bulletin-icon.special {
                        background-image: url('../../../static/img/special_4@3x.png');
                    }
                }
                .seller-bulletin-text {
                    line-height: 16px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                }
            .pics {
                padding: 18px;
            }
                .pics-title {
                    margin-bottom: 12px;
                    line-height: 14px;
                    color: rgb(7, 17, 27);
                    font-size: 14px;
                }
                .pic-wrapper {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                }
                    .pic-list {
                        font-size: 0;
                    }
                        .pic-item {
                            display: inline-block;
                            margin-right: 6px;
                            width: 120px;
                            height: 90px;
                        }
                        .pic-item:last-child {
                            margin: 0;
                        }
            .info {
                padding: 18px 18px 0 18px;
                color: rgb(7, 17, 27);
            }
                .info-title {
                    padding-bottom: 12px;
                    line-height: 14px;
                    border-bottom: rgba(7, 17, 27, 0.1);
                    font-size: 14px;
                }
                .info-item {
                    padding: 16px 12px;
                    line-height: 16px;
                    border-bottom: rgba(7, 17, 27, 0.1);
                    font-size: 12px;
                }
                .info-item:last-child {
                    border: none;
                }
</style>