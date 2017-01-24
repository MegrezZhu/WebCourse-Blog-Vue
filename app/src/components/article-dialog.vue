<template>
    <c-dialog vuex-name="article" title="发布">
        <el-form ref="articleForm" :model="form" label-width="80px" label-position="top" v-loading="loading"
                 :rules="rules">
            <el-form-item>
                <el-input v-model="form.title" size="large" class="title-input" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.content" type="textarea" :rows="20" class="content-input"
                          placeholder="正文"></el-input>
            </el-form-item>
            <el-form-item>
                <div class="row-flow-flexbox">
                    <el-button type="primary" @click="submit">发布</el-button>
                    <el-button @click="close">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
    </c-dialog>
</template>

<script>
    import cDialog from './vuex-controlled-dialog.vue';
    import axios from 'axios';

    export default{
        data: () => ({
            form: {},
            loading: false,
            rules: {
                id: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                pw: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            }
        }),
        components: {cDialog},
        methods: {
            close(){
                this.$store.commit('dialog', {
                    name: 'article', to: false
                });
            },
            submit(){
                let vm = this;
                if (!vm.form.title || !vm.form.content) return;
                vm.loading = true;
                axios
                    .post('/api/articles/new', {
                        date: new Date().valueOf(),
                        title: vm.form.title,
                        content: vm.form.content
                    })
                    .then(({data}) => {
                        vm.$notify.success({title: '发布成功', duration: 1000});
//                        vm.$refs.articleForm.reset();
                        vm.$store.commit('dialog', {name: 'article', to: false});
                        vm.loading = false;
                        vm.$emit('newArticle', data);
                    })
                    .catch(() => {
                        vm.$notify.error({title: '未知错误', duration: 1000});
                        vm.loading = false;
                    })
            }
        }
    }
</script>

<style scoped>
    .title-input {
        font-size: 1.5em;
    }

    .row-flow-flexbox {
        justify-content: flex-end;
    }

    .el-button {
        min-width: 100px;
    }
</style>