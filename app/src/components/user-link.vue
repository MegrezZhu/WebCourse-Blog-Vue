<template>
    <el-button @click="toUser" type="text">{{user && user.name}}</el-button>
</template>

<script>
    export default {
        props: {
            user: {require: true, type: Object}
        },
        methods: {
            toUser() {
                this.$router.push(`/user/${this.user.id}`);
            }
        }
    }
</script>