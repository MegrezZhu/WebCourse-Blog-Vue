<template>
    <c-dialog vuex-name="regist" title="注册">
        <p style="text-align: center; font-size: 3em; margin-top: 0;">Blog</p>
        <el-row>
            <el-col :span="12" :offset="6">
                <el-form ref="registForm" :model="form" label-width="80px" label-position="top" v-loading="loading"
                         :rules="rules">
                    <el-form-item label="账号" prop="id">
                        <el-input v-model="form.id" size="large" autofocus></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pw">
                        <el-input v-model="form.pw" size="large" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="重复密码" prop="checkpw">
                        <el-input v-model="form.checkpw" size="large" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="mail">
                        <el-input v-model="form.mail" size="large"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="form.phone" size="large"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-top: 20px">
                        <el-row :gutter="50">
                            <el-col :span="12">
                                <el-button
                                        type="primary"
                                        size="large"
                                        style="width: 100%"
                                        @click.prevent="regist"
                                        native-type="submit">注册
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

    import Rules from './registChecker';

    export default{
        data(){
            return {
                form: {id: '', pw: '', checkpw: '', mail: '', phone: ''},
                loading: false,
                rules: new Rules(this)
            }
        },
        components: {cDialog},
        methods: {
            regist(){
                this.$refs['registForm']
                    .validate(valid => {
                        let vm = this;
                        if (!valid) return;
                        let data = Object.assign({}, vm.form);
                        data.pw = crypto.MD5(data.pw).toString();
                        data.checkpw = crypto.MD5(data.checkpw).toString();
                        vm.loading = true;
                        axios
                            .post('/api/regist', data)
                            .then(({data}) => {
                                vm.loading = false;
                                if (data) {
                                    vm.$notify.success({title: '注册成功', duration: 1000});
                                    vm.$store.commit('updateUser', data);
                                    vm.close();
                                } else {
                                    vm.loading = false;
                                    vm.$notify.error({title: '未知错误'});
                                }
                            })
                            .catch(err => {
                                    vm.loading = false;
                                vm.$notify.error({title: '未知错误'});
                            })
                    });
            },
            close(){
                this.$store.commit('dialog', {
                    name: 'regist', to: false
                });
            }
        },
        created(){
            this.$store
                .watch(state => state.dialogs.regist, (newV, oldV) => {
                    if (newV === false) {
                        this.$refs
                            .registForm
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