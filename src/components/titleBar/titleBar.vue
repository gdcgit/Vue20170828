<template>
    <div class="bar-title">
        <div class="bar-line"></div>
        <div class="bar-text" v-model="content">{{ content }}</div>
        <div class="bar-line"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            toShow: {
                type: String,
                required: true
            }
        },
        computed:{
            content() {
                return this.toShow;
            }
        }
    };
</script>

<style>
    .bar-title {
        display: flex;
        width: 80%;
        margin: 28px auto 24px auto;
    }
    .bar-line {
        flex: 1;
        position: relative;
        top: -6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    .bar-title .bar-text {
        padding: 0 12px;
        font-size: 14px;
        font-weight: 700;
    }
</style>