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
                            <el-button type="text" class="edit-button"><i class="fa fa-edit"></i>编辑个人资料</el-button>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card v-loading="loading"></el-card>
        </div>
    </my-body>
</template>

<script>
    import axios from 'axios';
    import myBody from './body-framework.vue';
    import myAvatar from './avatar.vue';
    export default {
//        props: {
//            uid: {type: String}
//        },
        data(){
            return {
                loading: false,
                info: {},
                uid: ''
            };
        },
        computed: {
            isSelf() {
                return this.$store.state.user.id === this.uid;
            }
        },
        watch: {
            '$route': function ({params: {uid}}) {
                console.log(`changed to ${uid}`);
                this.fetchInfo(uid);
            }
        },
        methods: {
            fetchInfo(uid){
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

            }
        },
        created() {
            this.fetchInfo(this.$route.params.uid);
        },
        components: {myBody, myAvatar}
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