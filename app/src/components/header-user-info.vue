<template>
    <el-dropdown @command="handleCommand" type="info">
        <el-button type="text">
            {{isLogged ? user.name : '未登录'}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <template v-if="!isLogged">
                <el-dropdown-item style="text-align: center" command="login">登录</el-dropdown-item>
                <el-dropdown-item style="text-align: center" command="regist" divided>注册</el-dropdown-item>
            </template>
            <template v-else>
                <el-dropdown-item style="text-align: center" command="/detail">详情</el-dropdown-item>
                <el-dropdown-item style="text-align: center" command="logout" divided>登出</el-dropdown-item>
            </template>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    import axios from 'axios';

    export default {
        methods: {
            logout(){
                this.$store.dispatch('logout');
            },
            handleCommand(command){
                if (command[0] == '/')
                    this.$router.push(command);
                else
                    this[command]();
            },
            login(){
                this.$store.commit('dialog', {name: 'login', to: true});
            },
            regist(){
                this.$store.commit('dialog', {name: 'regist', to: true});
            }
        },
        computed: {
            isLogged(){
                return !!this.$store.state.user;
            },
            user() {
                return this.$store.state.user;
            }
        }
    };
</script>

<style scoped>
    .el-dropdown {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        /*padding-right: 5px;*/
    }

    .el-button {
        padding-right: 10px;
    }
</style>