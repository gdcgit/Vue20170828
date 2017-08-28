<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" v-bind:src="seller.avatar" alt="logo">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" v-bind:class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div class="support-count" v-if="seller.supports" v-on:click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <div class="bulletin-wrapper" v-on:click="showDetail">
            <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="background">
            <img width="100%" height="100%" v-bind:src="seller.avatar" alt="背景图">
        </div>
        <transition name="fade">
            <div class="detail" v-show="detailShow" v-on:click="hideDetail">
                <div class="detail-wrapper clearfix">  <!--一个牛逼的footer 需要3个层-->
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star v-bind:size="48" v-bind:score="seller.score"></star>
                        </div>
                        <!--<div class="title">-->
                            <!--<div class="line"></div>-->
                            <!--<div class="text">优惠信息</div>-->
                            <!--<div class="line"></div>-->
                        <!--</div>-->

                        <titleBar v-bind:toShow="'优惠信息'"></titleBar>

                        <ul class="supports" v-if="seller.supports">
                            <li class="support-item" v-for="(item, index) in seller.supports">
                                <span class="icon" v-bind:class="classMap[seller.supports[index].type]"></span>
                                <span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>
                        <!--<div class="title">-->
                            <!--<div class="line"></div>-->
                            <!--<div class="text">优惠信息</div>-->
                            <!--<div class="line"></div>-->
                        <!--</div>-->

                        <titleBar v-bind:toShow="'商家公告'"></titleBar>

                        <div class="bulletin">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" v-on:click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>

    </div>
</template>

<script type="text/ecmascript-6">
    import star from '../star/star'
    import titleBar from '../titleBar/titleBar'

export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
      return {
          detailShow: false
      }
    },
    methods: {
        showDetail: function () {
            this.detailShow = true;
        },
        hideDetail: function () {
            this.detailShow = false;
        }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee']
    },
    components: {
        star,
        titleBar
    }
};
</script>

<style>
    /*给conten的父元素的font设置为0，可以消除content和图片中间的间距*/
    .header {
        position: relative;
        width: 100%;
        overflow: hidden;
        color: #fff;
        background: rgba(7, 17, 27, 0.5);
    }
            .header .content-wrapper {
            position: relative;
            padding: 24px 12px 18px 24px;
            font-size: 0;
        }
            .avatar {
                display: inline-block;
                vertical-align: top;
            }
                img {
                    border-radius: 2px;
                }
            .header .content-wrapper .content {
                display: inline-block;
                margin-left: 16px;
            }
                .content .title {
                    margin: 2px 0 8px 0;
                }
                .content .brand {
                        display: inline-block;
                        vertical-align: top;
                        width: 30px;
                        height: 18px;
                        background-image: url('../../../static/img/brand@2x.png');
                        background-size: 30px 18px;
                        background-repeat: no-repeat;
                    }
                    @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                        .brand {
                            background-image: url('../../../static/img/brand@3x.png');
                        }
                    }
                .content .name {
                        margin-left: 6px;
                        font-size: 16px;
                        line-height: 18px;
                        font-weight: bold;
                    }
                .content .description {
                    margin-bottom: 10px;
                    line-height: 12px;
                    font-size: 12px;
                }
                .support .text {
                        line-height: 12px;
                        font-size: 10px;
                    }
                .support .icon {
                        display: inline-block;
                        vertical-align: top;
                        width: 12px;
                        height: 12px;
                        margin-right: 4px;
                        background-size: 12px 12px;
                        background-repeat: no-repeat;
                    }
                .support .decrease {
                            background-image: url('../../../static/img/decrease_1@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .decrease {
                                background-image: url('../../../static/img/decrease_1@3x.png');
                            }
                        }
                .support .discount {
                            background-image: url('../../../static/img/discount_1@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .discount {
                                background-image: url('../../../static/img/discount_1@3x.png');
                            }
                        }
                .support .guarantee {
                            background-image: url('../../../static/img/guarantee_1@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .guarantee {
                                background-image: url('../../../static/img/guarantee_1@3x.png');
                            }
                        }
                .support .invoice {
                            background-image: url('../../../static/img/invoice_1@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .invoice {
                                background-image: url('../../../static/img/invoice_1@3x.png');
                            }
                        }
                .support .special {
                            background-image: url('../../../static/img/special_1@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .special {
                                background-image: url('../../../static/img/special_1@3x.png');
                            }
                        }
            .support-count {
                position: absolute;
                right: 12px;
                bottom: 14px;
                padding: 0 8px;
                width: 36px;
                height: 24px;
                line-height: 24px;
                border-radius: 14px;
                background-color: rgba(0,0,0,0.2);
                text-align: center;
            }
                .support-count .count {
                    vertical-align: top;
                    font-size: 10px;
                }
                .support-count .icon-keyboard_arrow_right {
                    line-height: 24px;
                    margin-left: 2px;
                    font-size: 10px;
                }
        .bulletin-wrapper {
            position: relative;
            height: 28px;
            line-height: 28px;
            padding: 0 22px 0 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background: rgba(7, 17, 27, 0.2);
        }
            .bulletin-title {
                display: inline-block;
                vertical-align: top;
                margin-top: 8px;
                width: 22px;
                height: 12px;
                background-image: url('../../../static/img/bulletin@2x.png');
                background-size: 22px 12px;
                background-repeat: no-repeat;
            }
            @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                .bulletin-title {
                    background-image: url('../../../static/img/bulletin@3x.png');
                }
            }
            .bulletin-text {
                vertical-align: top;
                margin: 0 4px;
                font-size: 10px;
            }
            .bulletin-wrapper .icon-keyboard_arrow_right {
            position: absolute;
            font-size: 10px;
            right: 12px;
            top: 12px;
        }
        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            filter: blur(2px)
        }

        /* 可以设置不同的进入和离开动画 */
        /* 设置持续时间和动画函数 */
        .fade-enter-active {
            transition: all .3s ease;
        }
        .fade-leave-active {
            transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }
        .fade-enter, .fade-leave-to
            /* .slide-fade-leave-active for below version 2.1.8 */ {
            transform: translateX(10px);
            opacity: 0;
        }
        .detail {
            position: fixed;
            z-index: 100;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background: rgba(7, 17, 27, 0.8);
            -webkit-backdrop-filter: blur(10px);
        }
            .detail-wrapper {
                min-height: 100%;
                width: 100%;
            }
                .detail-main {
                    margin-top: 64px;
                    padding-bottom: 64px;
                }
                    .detail-main .name {
                        line-height: 16px;
                        text-align: center;
                        font-size: 16px;
                        font-weight: 700;
                    }
                    .star-wrapper {
                        margin-top: 18px;
                        padding: 2px 0;
                        text-align: center;
                    }
                    .detail-main .title {
                        display: flex;
                        width: 80%;
                        margin: 28px auto 24px auto;
                    }
                        .detail-main .line {
                                                flex: 1;
                                                position: relative;
                                                top: -6px;
                                                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                                            }
                        .detail-main .title .text {
                                                padding: 0 12px;
                                                font-size: 14px;
                                                font-weight: 700;
                                            }
                    .supports {
                        width: 80%;
                        margin: 0 auto;
                    }
                        .support-item {
                            padding: 0 12px;
                            margin-bottom: 12px;
                            font-size: 0;
                        }
                        .support-item:last-child {
                            margin-bottom: 0;
                        }
                        .supports .icon {
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                                vertical-align: top;
                                margin-right: 6px;
                                background-size: 16px 16px;
                                background-repeat: no-repeat;
                            }

                        .supports .decrease {
                            background-image: url('../../../static/img/decrease_2@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .decrease {
                                background-image: url('../../../static/img/decrease_2@3x.png');
                            }
                        }
                        .supports .discount {
                            background-image: url('../../../static/img/discount_2@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .discount {
                                background-image: url('../../../static/img/discount_2@3x.png');
                            }
                        }
                        .supports .guarantee {
                            background-image: url('../../../static/img/guarantee_2@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .guarantee {
                                background-image: url('../../../static/img/guarantee_2@3x.png');
                            }
                        }
                        .supports .invoice {
                            background-image: url('../../../static/img/invoice_2@2x.png');
                        }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .invoice {
                                background-image: url('../../../static/img/invoice_2@3x.png');
                            }
                        }
                        .supports .special {
                             background-image: url('../../../static/img/special_2@2x.png');
                         }
                        @media screen and (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
                            .special {
                                background-image: url('../../../static/img/special_2@3x.png');
                            }
                        }
                        .support-item .text {
                            line-height: 16px;
                            font-size: 12px;
                        }
                        .bulletin {
                            width: 80%;
                            margin: 0 auto;
                        }
                        .bulletin .content {
                            padding: 0 12px;
                            line-height: 24px;
                            font-size: 12px;
                        }
            .detail-close {
                position: relative;
                width: 32px;
                height: 32px;
                margin: -64px auto;
                clear: both;
                font-size: 32px;
            }
</style>