<template>
    <my-body>
        <div class="column-flow-flexbox">
            <el-card class="main" v-loading="aLoading">
                <div class="title">
                    <div class="row-flow-flexbox" style="height:200px">
                        <span title>{{article.title}}</span>
                    </div>
                    <div class="sub">
                        <user-link :user="article.author"></user-link>
                        <span style="font-size:0.8em;color:rgb(180,180,180)">发布于</span>
                        <span>{{time}}</span>
                    </div>
                </div>
                <splitter :weight="2"></splitter>
                <div class="content">
                    <pre>{{article.content}}</pre>
                </div>
            </el-card>
            <el-card class="comments" v-loading="loading">
                <div slot="header" class="comments-header">
                    <span>评论</span>
                    <el-button type="primary" @click="newComment">发表评论</el-button>
                </div>
                <my-comment v-for="commId in comments" :cid="commId"></my-comment>
            </el-card>
        </div>
    </my-body>
</template>

<script>
    import myBody from './body-framework.vue';
    import myComment from './comment.vue';
    import moment from 'moment';
    import axios from 'axios';

    export default {
        data() {
            return {
                loading: false,
                aLoading: false,
                article: {},
                comments: [],
            }
        },
        computed: {
            time(){
                if (this.article.date) {
                    let _moment = moment(this.article.date);
                    return _moment.format(`${_moment.year() !== moment().year() ? 'YYYY.' : ''}MM.DD HH:mm`);
                }
                else
                    return '';
            },
            articleId() {
                return this.$route.params.id;
            }
        },
        methods: {
            fetchData() {
                let vm = this;
                vm.aLoading = true;
                axios
                    .post('/api/articles/getOne', {
                        id: vm.articleId,
                        keys: ['author', 'content', 'date', 'comments', 'title']
                    })
                    .then(({data}) => {
                        vm.article = data;
                        vm.comments = data.comments;
                        vm.aLoading = false;
                    })
                    .catch(err => {
                        vm.aLoading = false;
                        vm.$notify.error({title: '未知错误', duration: 1000});
                    })
            },
            newComment() {
                let vm = this;
                vm.$prompt(' ', '发表评论', {
                    confirmButtonText: '发表',
                    cancelButtonText: '取消',
                    inputPattern: /./,
                    inputErrorMessage: '不能为空'
                }).then(({value}) => {

                }).catch(() => {
                });
            }
        },
        watch: {
            articleId(){
                this.fetchData();
            }
        },
        created(){
            this.fetchData();
        },
        components: {myBody, myComment}
    }
</script>

<style scoped>
    .el-card {
        width: 100%;
    }

    .title {
        position: relative;
        height: 200px;
    }

    .title *[title] {
        font-size: 3em;
        width: 100%;
        word-break: break-all;
        text-align: center;
    }

    .sub {
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .content {
        min-height: 400px;
    }

    .content pre {
        font-size: 1.3em;
        word-wrap: break-word;
        white-space: pre-wrap;
        width: 100%;
    }

    .comments-header {
        width: 100%;
        position: relative !important;
        min-height: 40px;
    }

    .comments-header .el-button {
        position: absolute;
        right: 0;
    }

    /*.comments-header {*/
    /*width: 100%;*/
    /*display: flex;*/
    /*flex-direction: column;*/
    /*align-content: center;*/
    /*}*/

    /*.comments-header .el-button {*/
    /*align-self: flex-end;*/
    /*}*/
</style>