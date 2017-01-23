<template>
    <div class="splitter" :style="style"></div>
</template>

<script>
    export default{
        props: {
            weight: {type: Number, default: 1}
        },
        computed: {
            style(){
                return {
                    'transform': `scaleY(${0.5 * this.weight})`
                }
            }
        }
    }
</script>

<style scope>
    .splitter {
        display: block;
        width: 100%;
        height: 1px;
        background-color: rgb(209, 219, 229);
        margin: 10px 5px;
    }
</style>