<template>
    <el-dialog
            :title="title"
            v-model="open"
            @close="handleClose">
        <slot>
            这里放对话框的内容
        </slot>
    </el-dialog>
</template>

<script>
    export default{
        props: {
            vuexName: {type: String, required: true},
            title: {type: String, required: true}
        },
        computed: {
            open(){
                return this.$store.state.dialogs[this.vuexName];
            }
        },
        methods: {
            handleClose(){
                this.$store.commit('dialog', {name: this.vuexName, to: false});
            }
        }
    }
</script>

<style scoped>
</style>