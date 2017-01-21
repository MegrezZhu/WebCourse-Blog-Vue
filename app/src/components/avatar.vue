<template>
    <div class="avatar" @mouseenter="cover = true" @mouseleave="cover = false">
        <transition name="fade">
            <div class="cover row-flow-flexbox" v-if="cover">
                <el-button type="info">button!</el-button>
            </div>
        </transition>
        <img :src="url">
    </div>
</template>

<script>
    export default {
        data: () => ({
            cover: false
        }),
        props: {
            url: {type: String, required: true}
        },
        methods: {
            mouseover(){
                console.log('mouseover!');
                this.cover = true;
            },
            mouseout(){
                console.log('mouse out!');
                this.cover = false;
            },
            click(){
                console.log('click');
            }
        }
    }
</script>

<style scoped>
    .avatar {
        display: inline-block;
        position: relative;
    }

    .cover {
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    /*.avatar:hover .cover {*/
        /*display: block;*/
        /*opacity: 1;*/
    /*}*/

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.2s;
    }
</style>