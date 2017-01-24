<template>
    <my-body>
        <div>
            <my-article-list :data="data" v-loading="loading" @removed="removed"></my-article-list>
            <el-pagination layout="prev,pager,next" :total="$store.state.statis.articleNum"
                           :page-size="pageSize" @current-change="change"></el-pagination>
        </div>
    </my-body>
</template>

<script>
    import myBody from './body-framework.vue';
    import myArticleList from './article-list.vue';
    import axios from 'axios';

    export default{
        data() {
            return {
                artiNum: 0,
                data: [],
                page: 1,
                pageSize: 10,
                loading: true
            }
        },
        components: {myArticleList, myBody},
        created(){
            this.fetchData();
        },
        methods: {
            fetchData() {
                let vm = this;
                vm.loading = true;
                axios
                    .post('/api/articles/get', {
                        param: {},
                        keys: ['_id', 'hide'],
                        from: vm.pageSize * (vm.page - 1) + 1,
                        to: vm.pageSize * vm.page
                    })
                    .then(({data}) => {
                        vm.loading = false;
                        vm.data = [];
                        data.forEach(arti => vm.data.push({id: arti._id, hide: arti.hide}));
                    })
                    .catch(err => {
                        vm.loading = false;
                        vm.$notify.error({title: '未知错误', duration: 1000})
                    });
            },
            change(newPage) {
                this.page = newPage;
                this.fetchData();
            },
            removed(index) {
                this.data.splice(index, 1);
            }
        }
    }
</script>

<style scoped>
    .my-article-list {
        margin-top: 30px;
    }
</style>