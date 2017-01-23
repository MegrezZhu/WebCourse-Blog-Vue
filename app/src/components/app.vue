<template>
    <div>
        <my-header></my-header>
        <router-view></router-view>
    </div>
</template>

<style>
    body {
        margin: 0;
        background-color: #e5e9f2;
        font-family: 'Source Sans Pro', 'PingFang SC', sans-serif;
    }
</style>

<script>
    import header from './header.vue';
    import colors from '../config/colors';
    export default{
        data: () => ({
            color: colors
        }),
        components: {
            myHeader: header,
        },
        created(){
            let vm = this;

            // try to login with session
            vm.$store.dispatch('login');
            // start sync statis
            setTimeout(function sync() {
                vm.$store
                  .dispatch('syncStatis')
                  .then(() => setTimeout(sync, 60000))
                  .catch(err => console.warn('自动同步数据时出现错误，停止自动同步'));
            }, 0);
        }
    }
</script>
