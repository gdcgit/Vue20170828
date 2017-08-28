<template>
    <transition name="move-food">
        <div v-show="showFlag" class="food" ref="foodToScroll">
            <div class="foodinfo">
                <div class="image-header">
                    <img :src="food.image" alt="食品头图">
                    <div class="back" @click="goback">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="foodinfo-content">
                    <h1 class="foodinfo-title">{{food.name}}</h1>
                    <div class="foodinfo-detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}</span>
                    </div>
                    <div class="foodinfo-price">
                        <span class="foodinfo-now">￥{{food.price}}</span><span class="foodinfo-old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="food-cartcontrol-wrapper">
                        <cartcontrol :food="food"></cartcontrol>
                    </div>
                    <transition name="fade-food">
                        <div class="buy" v-show="!food.count || food.count === 0" @click="addFood($event)">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="info-title">商品信息</h1>
                    <p class="info-text">{{food.info}}</p>
                </div>
                <split v-show="food.rating"></split>
                <div class="goods-rating">
                    <h1 class="goods-rating-title">商品评价</h1>
                    <ratingSelect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingSelect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item">
                                <div class="user">
                                    <span class="username">{{rating.username}}</span>
                                    <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate }}</div>
                                <p class="rating-text">
                                    <i :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}"></i>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import Vue from 'vue';
    import Bus from '../../common/js/Bus';
    import split from '../split/split';
    import cartcontrol from '../cartcontrol/cartcontrol';
    import ratingSelect from '../ratingSelect/ratingSelect';
    import {formatDate} from '../../common/js/date';

    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;


    export default {
        props: {
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: "全部",
                    positive: "推荐",
                    negative: "吐槽"
                }
            }
        },
        created() {
          Bus.$on('select',this.selectRating);
          Bus.$on('toggle',this.toggleContent);
        },
        methods: {
            show() {
                this.showFlag = true;
                this.selectType = ALL;
                this.onlyContent = true;
                this.$nextTick( () => {
                    if(!this.scroll){
                        this.scroll = new BScroll(this.$refs.foodToScroll,{
                            click: true
                        });
                    }else {
                        this.scroll.refresh();
                    }
                });
            },
            goback() {
                this.showFlag = false;
            },
            addFood(event) {
                if(!event._constructed){
                    return;
                }
                Bus.$emit('add',event.target);
                Vue.set(this.food,'count',1);
            },
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
        components: {
            cartcontrol,
            split,
            ratingSelect
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date,'yyyy-MM-dd hh:mm');
            }
        }
    };
</script>

<style>
    .food {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 48px;
        z-index: 30;
        width: 100%;
        background: #fff;
        transform: translate3d(0, 0, 0);
    }
        .move-food-enter-active,.move-food-leave-active {
            transition: all 0.3s linear;
        }
        .move-food-enter,.move-food-leave-to {
            transform: translate3d(100%, 0, 0);
        }
        .image-header {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 100%;
        }
            .image-header img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        .back {
            position: absolute;
            top: 10px;
            left: 0;
        }
        .icon-arrow_lift {
            display: block;
            padding: 10px;
            font-size: 20px;
            color: #fff;
        }
        .foodinfo-content {
            position: relative;
            padding: 18px;
        }
            .foodinfo-title {
                line-height: 14px;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 700;
                color: rgb(7 , 17, 27);
            }
            .foodinfo-detail {
                margin-bottom: 18px;
                line-height: 10px;
                height: 10px;
                font-size: 0;
            }
                .sell-count,.rating {
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .sell-count {
                    margin-right: 12px;
                }
            .foodinfo-price {
            font-weight: 700;
            line-height: 24px;
        }
                .foodinfo-now {
                    margin-right: 8px;
                    font-size: 14px;
                    color: rgb(240, 20, 20);
                }
                .foodinfo-old {
                    text-decoration: line-through;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
            .food-cartcontrol-wrapper {
            position: absolute;
            right: 12px;
            bottom: 10px;
        }
                .buy {
                position: absolute;
                right: 18px;
                bottom: 18px;
                z-index: 10;
                height: 24px;
                line-height: 24px;
                padding: 0 12px;
                box-sizing: border-box;
                border-radius: 12px;
                font-size: 10px;
                color: #fff;
                background: rgb(0, 160, 220);
                font-weight: 600;
            }
        .fade-food-enter-active,.fade-food-leave-active {
            transition: all 0.2s ease;
        }
        .fade-food-enter,.fade-food-leave-active {
            opacity: 0;
            z-index: -1;
        }
        .info {
            padding: 18px;
        }
            .info-title {
                line-height: 14px;
                margin-bottom: 6px;
                font-size: 14px;
                font-weight: 700;
                color: rgb(7, 17, 27);
            }
            .info-text {
                line-height: 24px;
                padding: 0 8px;
                font-size: 12px;
                color: rgb(77, 85, 93);
            }
         .goods-rating {
            padding-top: 18px;
         }
            .goods-rating-title {
                line-height: 14px;
                margin-left: 18px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .rating-wrapper {
                padding: 0 18px;
            }
                .rating-item {
                   position: relative;
                    padding: 16px 0;
                    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                }
                    .user {
                        position: absolute;
                        right: 0;
                        top: 16px;
                        line-height: 12px;
                        font-size: 0;
                    }
                        .username {
                            display: inline-block;
                            margin-right: 6px;
                            vertical-align: top;
                            font-size: 10px;
                            color: rgb(147, 153, 159);
                        }
                        .avatar {
                            display: inline-block;
                            vertical-align: top;
                            border-radius: 50%;
                        }
                    .time {
                        margin-bottom: 6px;
                        line-height: 16px;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .rating-text {
                        line-height: 16px;
                        font-size: 12px;
                        color: rgb(7, 17, 27);
                    }
                        .icon-thumb_up,.icon-thumb_down {
                            margin-right: 4px;
                            line-height: 16px;
                            font-size: 12px;
                        }
                        .icon-thumb_up {
                            color: rgb(0, 160, 220);
                        }
                        .icon-thumb_down {
                            color: rgb(147, 153, 159);
                        }
                .no-rating {
                    padding: 16px 0;
                    font-size: 12px;
                    color: rgb(147, 153, 159);
                }

</style>