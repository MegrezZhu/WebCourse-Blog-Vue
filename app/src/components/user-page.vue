<template>
    <my-body>
        <div class="column-flow-flexbox">
            <el-card v-loading="loading">
                <div class="row-flow-flexbox-start">
                    <div class="avatar">
                        <my-avatar></my-avatar>
                    </div>
                    <div class="info-head">
                        <p>
                            <i class="fa fa-user-circle fa-border"></i>
                            <span class="name">{{info.name}}</span>
                        </p>
                        <p>
                            <i class="fa fa-envelope-o fa-border"></i>
                            <span class="mail">{{info.mail}}</span>
                        </p>
                        <div>
                            <el-button v-if="false" type="text" class="edit-button"><i class="fa fa-edit"></i>编辑个人资料
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-card>
            <div v-loading="articlesLoading" style="width: 100%">
                <my-article-list :data="data | reverse" v-loading="articlesLoading"></my-article-list>
                <el-pagination layout="prev,pager,next" :total="total || 0"
                               :page-size="10" @current-change="changePage"></el-pagination>
            </div>
        </div>
    </my-body>
</template>

<script>
    import axios from 'axios';
    import myBody from './body-framework.vue';
    import myAvatar from './avatar.vue';
    import myArticleList from './article-list.vue';
    export default {
        data(){
            return {
                loading: false,
                articlesLoading: false,
                info: {},
                data: [],
                total: 0
            };
        },
        computed: {
            isSelf() {
                return this.$store.state.user.id === this.uid;
            },
            uid() {
                return this.$route.params.uid;
            }
        },
        watch: {
            '$route': function ({params: {uid}}) {
                this.fetchAll();
            }
        },
        methods: {
            fetchAll() {
                this.fetchArtiNum();
                this.fetchUserInfo(this.uid);
                this.fetchUserArti();
            },
            fetchArtiNum() {
                axios
                    .post('/api/articles/count', {param: {'author.id': this.uid}})
                    .then(({data}) => {
                        this.total = data;
                    })
                    .catch(err => this.$notify.error({title: '未知错误', duration: 1000}));
            },
            fetchUserInfo(uid){
                if (!uid) return;
                let vm = this;
                vm.info = {};
                vm.uid = uid;
                let user = vm.$store.state.user;
                if (user && uid === user.id) vm.info = vm.$store.state.user;
                else {
                    vm.loading = true;
                    axios
                        .post('/api/users/info', {
                            id: uid,
                            argNames: ['name', 'mail', 'phone']
                        })
                        .then(({data}) => {
                            if (data)
                                vm.info = data;
                            vm.loading = false;
                        })
                        .catch(() => {
                            console.warn('获取用户信息失败！');
                            vm.$notify.warning({title: '获取用户信息失败', duration: 1000});
                            vm.loading = false;
                        })
                }
            },
            changePage(page) {
                this.fetchUserArti(page);
            },
            fetchUserArti(page = 1) {
                let v = this;
                v.articlesLoading = true;
                axios
                    .post('/api/articles/get', {
                        param: {'author.id': v.uid},
                        keys: ['_id', 'hide']
                    })
                    .then(({data}) => {
                        data.forEach(arti => arti.id = arti._id);
                        v.articlesLoading = false;
                        v.data = data;
                    })
                    .catch(err => {
                        v.articlesLoading = false;
                        v.$notify.error({title: '未知错误', duration: 1000});
                    })
            }
        },
        created() {
            this.fetchAll();
        },
        components: {myBody, myAvatar, myArticleList}
    }
</script>

<style scoped>
    .el-card {
        width: 100%;
    }

    .column-flow-flexbox > * {
        margin-bottom: 10px;
    }

    .row-flow-flexbox-start > * {
        margin-right: 20px;
    }

    .avatar {
        height: 200px;
        width: 200px;
        border: 1px solid rgb(200, 200, 200);
        border-radius: 5px;
    }

    .name {
        font-size: 3em;
    }

    .mail {
        font-size: 1.5em;
    }

    .edit-button {
        border: 1px solid rgb(200, 200, 200);
        border-radius: 5px;
        padding: 10px 15px;
    }
</style>