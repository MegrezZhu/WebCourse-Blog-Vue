<template>
    <el-card v-loading="loading">
        <div class="article-card">
            <div class="row-flow-flexbox main">
                <div :class="{title:true,'row-flow-flexbox':true,'for-admin-hide':data.hide&&$store.state.user&&$store.state.user.isAdmin}">
                    <template v-if="!data.hide || $store.state.user && $store.state.user.isAdmin">
                        <router-link :to="link">{{title}}</router-link>
                    </template>
                    <template v-else>
                        <span class="hided-title">该内容已被管理员隐藏</span>
                    </template>
                </div>
            </div>
            <div class="sub">
                <user-link :user="data.author"></user-link>
                <span class="minor-text">发布于</span>
                <my-time :data="data.date"></my-time>
                <el-popover trigger="hover" placement="top-start" v-if="showEdit">
                    <div class="row-flow-flexbox edit-pop">
                        <el-button type="normal" @click="remove"
                                   v-if="$store.state.user && $store.state.user.id===data.author.id">
                            删除
                        </el-button>
                        <el-button type="normal" @click="toggle"
                                   v-if="$store.state.user && $store.state.user.isAdmin">
                            切换隐藏
                        </el-button>
                    </div>
                    <el-button slot="reference">
                        <i class="fa fa-edit"></i>
                    </el-button>
                </el-popover>
            </div>
        </div>
    </el-card>
</template>

<script>
    import moment from 'moment';
    import axios from 'axios';

    export default {
        data() {
            return {
                data: {title: '', author: {}},
                loading: false
            }
        },
        props: {
            articleId: {require: true, type: String},
        },
        computed: {
            title() {
                let vm = this;
                if (vm.data.title && vm.data.title.length > 15) {
                    return vm.data.title.substr(0, 15) + '...';
                } else {
                    return vm.data.title;
                }
            },
            link(){
                return `/articles/${this.data._id}`;
            },
            showEdit(){
                let vm = this;
                if (!vm.$store.state.user) return false;
                if (vm.$store.state.user.isAdmin) return true;
                return vm.$store.state.user.id === vm.data.author.id;
            }
        },
        methods: {
            toUser(){
                this.$router.push(`/user/${this.data.author}`);
            },
            fetchData(){
                let vm = this;
                vm.loading = true;
                axios
                    .post('/api/articles/getone', {id: vm.articleId, keys: ['title', 'author', 'date', '_id']})
                    .then(({data}) => {
                        vm.data = data;
                        vm.loading = false;
                    })
                    .catch(({err}) => {
                        vm.loading = false;
                    });
            },
            remove() {
                let vm = this;
                vm
                    .$confirm('是否确定删除该文章？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        vm.loading = true;
                        axios
                            .post('/api/articles/delete', {id: vm.articleId})
                            .then(({data}) => {
                                if (data) {
                                    vm.loading = false;
                                    vm.$notify.success({title: '删除成功', duration: 1000});
                                    vm.$emit('removed');
                                } else throw new Error('删除失败');
                            })
                            .catch(err => {
                                vm.loading = false;
                                vm.$notify.error({title: '未知错误', duration: 1000});
                            })
                    })
                    .catch(() => {
                    })
            },
            toggle() {
                let vm = this;
                vm.loading = true;
                let newState = !vm.data.hide;
                axios
                    .post('/api/articles/hide', {id: vm.articleId, hide: newState})
                    .then(({data}) => {
                        if (data) {
                            vm.loading = false;
                            vm.$notify.success({title: '修改隐藏状态成功', duration: 1000});
                            vm.data.hide = newState;
                        } else throw new Error('修改隐藏状态失败');
                    })
                    .catch(err => {
                        vm.loading = false;
                        vm.$notify.error({title: '未知错误', duration: 1000});
                    });
            }
        },
        watch: {
            'articleId'(){
                this.fetchData();
            },
            '$store.state.user'(user) {
                let vm = this;
                if (vm.data.hide) {
                    if (!user || !user.isAdmin) {
                        //not admin
                        vm.data.content = '';
                    } else {
                        if (!vm.loading) {
                            vm.fetchData();
                        }
                    }
                }
            }
        },
        created(){
            this.fetchData();
        }
    }
</script>

<style scoped>
    .main {
        height: 150px;
    }

    .article-card {
        position: relative;
        height: 150px;
    }

    .sub {
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .title {
        font-size: 3em;
    }

    a, a:visited {
        text-decoration: none;
        color: black;
    }

    a:active {
        color: rgb(57, 158, 233);
    }

    .hided-title {
        color: rgb(220, 220, 220);
        font-size: 0.5em;
    }

    .for-admin-hide {
        background-color: rgb(240, 240, 240);
    }
</style>