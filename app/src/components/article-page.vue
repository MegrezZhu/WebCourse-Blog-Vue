<template>
    <my-body>
        <div class="column-flow-flexbox">
            <el-card class="main" v-loading="aLoading">
                <div class="title">
                    <div class="row-flow-flexbox" style="height:200px">
                        <span title
                              v-if="!article.hide||$store.state.user&&$store.state.user.isAdmin">{{article.title}}</span>
                        <span title v-else
                              :class="{hided:true,'hided-admin':$store.state.user&&$store.state.user.isAdmin}">已被隐藏</span>
                    </div>
                    <div class="sub">
                        <user-link :user="article.author"></user-link>
                        <span style="font-size:0.8em;color:rgb(180,180,180)">发布于</span>
                        <span>{{time}}</span>
                    </div>
                </div>
                <splitter :weight="2"></splitter>
                <div class="content">
                    <template v-if="!article.hide||$store.state.user&&$store.state.user.isAdmin">
                        <pre>{{article.content}}</pre>
                        <el-button v-if="$store.state.user&&$store.state.user.id===article.author.id"
                                   @click="editArti=true,articleContent=article.content,titleContent=article.title">编辑
                        </el-button>
                    </template>
                    <pre v-else="!article.hide||$store.state.user&&$store.state.user.isAdmin" class="hided">..................</pre>
                    <el-dialog v-model="editArti" title="编辑文章" top="30%" @close="articleContent='',titleContent=''">
                        <div>
                            <el-input v-model="titleContent" :autofocus="true" v-loading="sendingArti"></el-input>
                            <splitter></splitter>
                            <el-input
                                    v-model="articleContent"
                                    type="textarea"
                                    class="comment-input"
                                    :autosize="{minRows:2, maxRows:10}"
                                    v-loading="sendingArti"></el-input>
                            <div class="buttons">
                                <el-button type="primary" size="large" @click="edit" :loading="sendingArti">修改
                                </el-button>
                                <el-button size="large" @click="editArti=false" :disabled="sendingArti">取消</el-button>
                            </div>
                        </div>
                    </el-dialog>
                </div>
            </el-card>
            <el-card class="comments" v-loading="loading">
                <div slot="header" class="comments-header">
                    <span>评论</span>
                    <el-button type="primary" @click="dialog=true">发表评论</el-button>
                    <el-dialog v-model="dialog" size="tiny" title="发表评论" top="30%" @close="commentContent=''">
                        <div>
                            <el-input
                                    v-model="commentContent"
                                    type="textarea"
                                    class="comment-input"
                                    :autosize="{minRows:2, maxRows:10}"
                                    autofocus
                                    v-loading="sending"></el-input>
                            <div class="buttons">
                                <el-button type="primary" size="large" @click="send" :loading="sending">发表</el-button>
                                <el-button size="large" @click="close" :disabled="sending">取消</el-button>
                            </div>
                        </div>
                    </el-dialog>
                </div>
                <my-comment v-for="(commId,index) in comments" :cid="commId" @removed="comments.splice(index,1)"
                            :articleId="articleId" :key="commId"></my-comment>
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
                article: {author: {}},
                comments: [],
                dialog: false,
                sending: false,
                commentContent: '',
                titleContent: '',
                editArti: false,
                sendingArti: false,
                articleContent: ''
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
            close() {
                this.dialog = false;
            },
            send() {
                let vm = this;
                vm.sending = true;
                axios
                    .post('/api/comments/new', {
                        articleId: vm.articleId,
                        date: new Date().valueOf(),
                        content: vm.commentContent
                    })
                    .then(({data}) => {
                        if (data) {
                            vm.comments.push(data);
                            vm.sending = false;
                            vm.$notify.success({title: '发表成功', duration: 1000});
                            vm.dialog = false;
                        } else
                            throw new Error('comment: null');
                    })
                    .catch(err => {
                        vm.$notify.error({title: '未知错误', duration: 1000})
                    });
            },
            edit() {
                let vm = this;
                vm.sendingArti = true;
                axios
                    .post('/api/articles/edit', {
                        id: vm.articleId,
                        content: vm.articleContent,
                        title: vm.titleContent
                    })
                    .then(({data}) => {
                        if (data) {
                            vm.sendingArti = false;
                            vm.$notify.success({title: '修改成功', duration: 1000});
                            vm.editArti = false;
                            vm.article.content = vm.articleContent;
                            vm.article.title = vm.titleContent;
                        } else
                            throw new Error('unknown');
                    })
                    .catch(err => {
                        vm.$notify.error({title: '未知错误', duration: 1000});
                        vm.sendingArti = false;
                    });
            }
        },
        watch: {
            articleId(){
                this.fetchData();
            },
            '$store.state.user'(user) {
                let vm = this;
                if (vm.article.hide) {
                    if (!user || !user.isAdmin) {
                        //not admin
                        vm.article.title = vm.article.content = '';
                    } else {
                        if (!vm.loading) {
                            vm.fetchData();
                        }
                    }
                }
            }
        },
        created(){
            let vm = this;
            vm.fetchData();

            window.addEventListener('keydown', function (e) {
                if (!vm.dialog) return;
                if (e.ctrlKey && (e.keyCode || e.which) === 13) {
                    vm.send();
                }
            });
        },
        components: {myBody, myComment},
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

    .comments-header > .el-button {
        position: absolute;
        right: 0;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }

    .buttons .el-button {
        margin: 10px 0 10px 10px;
        /*padding: 10px 20px;*/
    }

    .hided {
        color: rgb(220, 220, 220);
    }

    .hided-admin {
        background-color: rgb(240, 240, 240);;
    }

</style>