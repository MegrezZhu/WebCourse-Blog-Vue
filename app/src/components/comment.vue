<template>
    <div class="comment" v-loading="loading">
        <splitter></splitter>
        <template v-if="data.hide && (!$store.state.user || !$store.state.user.isAdmin)">
            <div class="row-flow-flexbox hide-cover">
                该评论已被管理员隐藏
            </div>
        </template>
        <template v-else>
            <pre :class="{hided:data.hide}">{{data.content}}</pre>
        </template>
        <div class="info">
            <div class="user">
                <user-link :user="data.author"></user-link>
                <span class="minor-text">发表于</span>
                <my-time :data="data.date"></my-time>
                <el-popover trigger="hover" placement="top-start" v-if="showEdit">
                    <div class="row-flow-flexbox edit-pop">
                        <el-button type="normal" @click="editing=true,editingContent=data.content"
                                   v-if="$store.state.user && $store.state.user.id===data.author.id">编辑
                        </el-button>
                        <el-button type="normal" @click="remove"
                                   v-if="$store.state.user && $store.state.user.id===data.author.id">删除
                        </el-button>
                        <el-button type="normal" @click="toggle" v-if="$store.state.user && $store.state.user.isAdmin">
                            切换隐藏
                        </el-button>
                    </div>
                    <el-button slot="reference">
                        <i class="fa fa-edit"></i>
                    </el-button>
                </el-popover>
            </div>
        </div>
        <el-dialog v-model="editing" size="tiny" title="修改" top="30%">
            <div>
                <el-input
                        v-model="editingContent"
                        type="textarea"
                        :autosize="{minRows:2, maxRows:10}"
                        autofocus
                        v-loading="sendingEdit"></el-input>
                <div class="buttons">
                    <el-button type="primary" size="large" @click="edit" :loading="sendingEdit">修改</el-button>
                    <el-button size="large" @click="editing=false" :disabled="sendingEdit">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                loading: false,
                data: {author: {}, content: '', hide: false},
                editing: false,
                editingContent: '',
                sendingEdit: false
            }
        },
        props: {
            cid: {require: true, type: String},
            articleId: {require: true, type: String}
        },
        methods: {
            fetchData() {
                let vm = this;
                vm.loading = true;
                axios
                    .post('/api/comments/get', {id: vm.cid, keys: ['content', 'author', 'date', 'hide']})
                    .then(({data}) => {
                        if (!data) throw new Error('null respond');
                        vm.data = data;
                        vm.loading = false;
                    })
                    .catch(err => {
                        vm.loading = false;
                        vm.$notify.error({title: '未知错误', duration: 1000});
                    })
            },
            edit() {
                let vm = this;
                vm.sendingEdit = true;
                axios
                    .post('/api/comments/edit', {id: vm.cid, content: vm.editingContent})
                    .then(({data}) => {
                        if (data) {
                            vm.sendingEdit = false;
                            vm.$notify.success({title: '修改成功', duration: 1000});
                            vm.data.content = vm.editingContent;
                            vm.editing = false;
                        } else
                            throw new Error('修改失败');
                    })
                    .catch(err => {
                        vm.sendingEdit = false;
                        vm.$notify.error({title: '未知错误', duration: 1000});
                        vm.editing = false;
                    });
            },
            remove(){
                let vm = this;
                vm
                    .$confirm('是否确定删除该条评论？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        vm.loading = true;
                        axios
                            .post('/api/comments/delete', {id: vm.cid, articleId: vm.articleId})
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
                    .post('/api/comments/hide', {id: vm.cid, hide: newState})
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
            'cid'(){
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
        computed: {
            showEdit(){
                let vm = this;
                if (!vm.$store.state.user) return false;
                if (vm.$store.state.user.isAdmin) return true;
                return vm.$store.state.user.id === vm.data.author.id;
            }
        },
        created() {
            this.fetchData();
        }
    }
</script>

<style scoped>
    .comment {
        width: 100%;
        clear: both;
    }

    pre {
        /*font-size: 1.3em;*/
        word-wrap: break-word;
        white-space: pre-wrap;
        padding-left: 20px;
        margin-bottom: 0;
    }

    .info {
        min-height: 1px;
        width: 100%;
    }

    .info .user {
        float: right;
    }

    .info .edit {
        float: left;
    }

    .info .el-button {
        padding: 5px;
    }

    .edit-pop .el-button {
        padding: 5px 10px;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
    }

    .buttons .el-button {
        margin: 10px 0 10px 10px;
        /*padding: 10px 20px;*/
    }

    .hide-cover {
        height: 50px;
        color: rgb(220, 220, 220);
    }

    .hided {
        background-color: rgb(250, 250, 250);
    }
</style>