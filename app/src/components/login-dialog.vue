<template>
    <c-dialog vuex-name="login" title="登录">
        <p style="text-align: center; font-size: 3em; margin-top: 0;">Blog</p>
        <el-row>
            <el-col :span="12" :offset="6">
                <el-form ref="loginForm" :model="form" label-width="80px" label-position="top" v-loading="loading"
                         :rules="rules">
                    <el-form-item label="账号" prop="id">
                        <el-input v-model="form.id" size="large" :autofocus="true"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pw">
                        <el-input v-model="form.pw" size="large" type="password"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-top: 20px">
                        <el-row :gutter="50">
                            <el-col :span="12">
                                <el-button
                                        type="primary"
                                        size="large"
                                        style="width: 100%"
                                        @click.prevent="login"
                                        native-type="submit">登录
                                </el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button size="large" style="width: 100%" @click="close">取消</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </c-dialog>
</template>

<script>
    import cDialog from './vuex-controlled-dialog.vue';
    import crypto from 'crypto-js';
    import axios from 'axios';

    export default{
        data: () => ({
            form: {id: '', pw: ''},
            loading: false,
            rules: {
                id: [
                    {required: true, message: '请输入用户名', trigger: 'none'}
                ],
                pw: [
                    {required: true, message: '请输入密码', trigger: 'none'}
                ]
            }
        }),
        components: {cDialog},
        methods: {
            login(){
                this.$refs['loginForm']
                    .validate(valid => {
                        if (!valid) return;
                        let vm = this;
                        vm.loading = true;
                        axios
                            .post('/api/login', {
                                id: vm.form.id,
                                pw: crypto.MD5(vm.form.pw).toString()
                            })
                            .then(({data}) => {
                                vm.loading = false;
                                if (data) {
                                    vm.$notify.success({title: '登录成功', duration: 1000});
                                    vm.$store.commit('updateUser', data);
                                    vm.close();
                                } else {
                                    vm.$notify.warning({title: '账号或密码错误', duration: 1000});
                                }
                            })
                            .catch(err => {
                                vm.loading = false;
                            })
                    });
            },
            close(){
                this.$store.commit('dialog', {
                    name: 'login', to: false
                });
            }
        },
        created(){
            this.$store
                .watch(state => state.dialogs.login, (newV, oldV) => {
                    if (newV === false) {
                        this.$refs
                            .loginForm
                            .resetFields();
                    }
                });
        }
    }
</script>

<style scoped>
    .el-button {
        margin-top: 30px;
    }

    .el-dialog {
        width: 500px;
    }
</style>