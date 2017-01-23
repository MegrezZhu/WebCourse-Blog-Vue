<template>
    <div class="my-article-list">
        <my-article-card v-for="info in data" :articleId="info.id" :hide="info.hide"></my-article-card>
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

</style>