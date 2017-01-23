<template>
    <div class="comment">

    </div>
</template>

<script>
    export default {
        props: {
            cid: {require: true, type: String},
            hide: {type: Boolean, default: false}
        }
    }
</script>

<style scoped>
    .comment {
        width: 100%;
    }
</style>