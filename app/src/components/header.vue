<template>
    <div>
        <el-row type="flex">
            <el-col :span="3" class="logo-block header-block"> <!--Logo-->
                <div><p>Blog</p></div>
            </el-col>
            <el-col :span="18">
                <el-menu
                        theme="dark"
                        default-active="/"
                        class="el-menu-demo"
                        mode="horizontal"
                        @select="handleSelect"
                        title="blog"
                        :router="true">
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/articles">文章</el-menu-item>
                    <el-menu-item index="/about">About</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="3" class="user-block header-block">
                <my-user-info></my-user-info>
            </el-col>
        </el-row>
        <my-login-dialog></my-login-dialog>
        <my-regist-dialog></my-regist-dialog>
    </div>
</template>

<script>
    import userInfo from './header-user-info.vue';
    import myLoginDialog from './login-dialog.vue';
    import myRegistDialog from './regist-dialog.vue';

    export default {
        data() {
            return {
            };
        },
        methods: {
            handleSelect(key, keyPath) {

            }
        },
        components: {
            myUserInfo: userInfo,
            myLoginDialog,
            myRegistDialog
        },
        computed: {
        }
    }
</script>

<style scoped>
    .header-block {
        background-color: #324057;
    }

    .logo-block div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .logo-block p {
        font-size: 1.5em;
        color: white;
        margin: 0;
    }

    /*.user-block {*/
        /*display: flex;*/
        /*justify-content: flex-end;*/
        /*align-items: center;*/
        /*padding-right: 5px;*/
    /*}*/

    .el-menu {
        border-radius: 0;
    }
</style>