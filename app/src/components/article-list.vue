<template>
    <div class="my-article-list">
        <my-article-card v-for="(info,index) in data" :articleId="info.id" :hide="info.hide" :key="info.id"
            @removed="$emit('removed', index)"></my-article-card>
        <el-card v-if="data.length===0">文章列表为空</el-card>
    </div>
</template>

<script>
    import myArticleCard from './article-card.vue';
    import axios from 'axios';

    export default {
        data() {
            return {
                loading: false,
            }
        },
        props: {
            data: {require: true, type: Array},
        },
        components: {myArticleCard},
    }
</script>

<style scoped>
    .el-card {
        color: rgb(220, 220, 220);
        width: 100%;
    }
</style>