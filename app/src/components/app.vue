<template>
    <div>
        <my-header></my-header>
        <router-view></router-view>
    </div>
</template>

<style>
    body {
        margin: 0;
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
            this.$store.dispatch('login');
        }
    }
</script>
