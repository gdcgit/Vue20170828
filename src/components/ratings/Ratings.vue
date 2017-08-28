<template>
    <div class="ratings" ref="ratings">
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="right-title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="right-score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="right-title">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="right-score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="delivery-right-title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingSelect :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingSelect>
            <div class="rating-wrapper">
                <ul>
                    <li v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)" class="rating-item">
                        <div class="rating-avatar">
                            <img width="28" height="28" :src="rating.avatar">
                        </div>
                        <div class="rating-content">
                            <h1 class="rating-name">{{rating.username}}</h1>
                            <div class="rating-star-wrapper">
                                <star :size="24" :score="rating.score"></star>
                                <span class="rating-delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="rating-text">{{rating.text}}</p>
                            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                                <i class="icon-thumb_up"></i>
                                <span class="item" v-for="item in rating.recommend">{{item}}</span>
                            </div>
                            <div class="time">
                                {{rating.rateTime | formatDate}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ></shopcart>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import axios from 'axios';
    import star from '../star/star';
    import split from '../split/split';
    import ratingSelect from '../ratingSelect/ratingSelect';
    import {formatDate} from '../../common/js/date';
    import Bus from '../../common/js/Bus';
    import shopcart from '../shopcart/shopcart';

    let config = {
        // 基础url前缀
//        baseURL: 'http://localhost:8080'
      baseURL: 'http://10.6.0.28:8080'
    };

    const ERR_OK = 0;
    const ALL = 2;


    export default {
        props: {
            seller: {
                type: Object
            },
            FoodToSend: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                ratings: [],
                selectType: ALL,
                onlyContent: true
            };
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        created() {
            axios.get('/api/ratingsData',config).then( (response) => {
                let res = response.data;
                if(res.errno === ERR_OK){
                    this.ratings = res.data;

                    this.$nextTick( () => {
                        this.scroll = new BScroll(this.$refs.ratings, {
                            click: true
                        });
                    });
                }
            });

            Bus.$on('select',this.selectRating);
            Bus.$on('toggle',this.toggleContent);
        },
        methods: {
            needShow(type, text) {
                if(this.onlyContent && !text) {
                    return false;
                }
                if(this.selectType === ALL) {
                    return true;
                }else{
                    return type === this.selectType;
                }
            },
            selectRating(type) {
                this.selectType = type;
                this.$nextTick( () => {
                    this.scroll.refresh();
                });
            },
            toggleContent() {
                this.onlyContent = !this.onlyContent;
                this.$nextTick( () => {
                    this.scroll.refresh();
                });
            }
        },
        computed:{
            selectFoods() {
                return this.FoodToSend;
            }
        },
        components: {
            star,
            split,
            ratingSelect,
            shopcart
        }
    };
</script>

<style>
    .ratings {
        position: absolute;
        top: 174px;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
    }
        .overview {
            display: flex;
            padding: 18px 0;
        }
            .overview-left {
                flex: 0 0 137px;
                padding: 6px 0;
                width: 137px;
                border-right: 1px solid rgba(7, 17, 27, 0.1);
                text-align: center;
            }
            .overview-left>.score {
                    margin-bottom: 6px;
                    line-height: 28px;
                    font-size: 24px;
                    color: rgb(255, 153, 0);
                }
            .overview-left>.title {
                    margin-bottom: 8px;
                    line-height: 12px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                }
            .overview-left>.rank {
                    line-height: 10px;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
            @media only screen and (max-width: 320px){
                .overview-left {
                    flex: 0 0 120px;
                    width: 120px;
                }
                .overview-right {
                    padding-left: 6px;
                }
            }
            .overview-right {
                flex: 1;
                padding:6px 0 6px 24px;
            }
                .score-wrapper {
                    margin-bottom: 8px;
                    font-size: 0;
                }
                    .right-title {
                        display: inline-block;
                        line-height: 18px;
                        vertical-align: top;
                        font-size: 12px;
                        color: rgb(7, 17, 27);
                    }
                    .score-wrapper>.star {
                        display: inline-block;
                        vertical-align: top;
                        margin: 0 6px;
                    }
                    .right-score {
                        display: inline-block;
                        line-height: 18px;
                        vertical-align: top;
                        font-size: 12px;
                        color: rgb(255, 153, 0);
                    }
                .delivery-wrapper {
                    font-size: 0;
                }
                    .delivery-right-title {
                        line-height: 18px;
                        font-size: 12px;
                        color: rgb(7, 17, 27);
                    }
                    .delivery {
                        margin-left: 12px;
                        font-size: 12px;
                        color: rgb(147, 153, 159);
                    }
                .rating-wrapper {
                    padding: 0 18px;
                }
                    .rating-item {
                        display: flex;
                        padding: 18px 0;
                        border-bottom: rgba(7, 17, 27, 0.1);
                    }
                    .rating-avatar {
                        flex: 0 0 28px;
                        width: 28px;
                        margin-right: 12px;
                    }
                        .rating-avatar>img {
                            border-radius: 50%;
                        }
                    .rating-content {
                        position: relative;
                        flex: 1;
                    }
                        .rating-name {
                            margin-bottom: 4px;
                            line-height: 12px;
                            font-size: 10px;
                            color: rgb(7, 17, 27);
                        }
                        .rating-star-wrapper {
                            margin-bottom: 6px;
                            font-size: 0;
                        }
                        .rating-star-wrapper>.star {
                                display: inline-block;
                                margin-right: 6px;
                                vertical-align: top;
                            }
                            .rating-delivery {
                                display: inline-block;
                                vertical-align: top;
                                line-height: 12px;
                                font-size: 10px;
                                color: rgb(147, 153, 159);
                            }
                            .rating-text {
                                margin-bottom: 8px;
                                line-height: 18px;
                                color: rgb(7, 17, 27);
                                font-size: 12px;
                            }
                            .recommend {
                                line-height: 16px;
                                font-size: 0;
                            }
                                .icon-thumb_up, .item{
                                    display: inline-block;
                                    margin: 0 8px 4px 0;
                                    font-size: 9px;
                                }
                                .icon-thumb_up {
                                    color: rgb(0, 160, 220);
                                }
                                .item {
                                    padding: 0 6px;
                                    border: 1px solid rgba(7, 17, 27, 0.1);
                                    border-radius: 1px;
                                    color: rgb(147, 153, 159);
                                    background: #fff;
                                }
                                .time {
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    line-height: 12px;
                                    font-size: 10px;
                                    color: rgb(147, 153, 159);
                                }
</style>