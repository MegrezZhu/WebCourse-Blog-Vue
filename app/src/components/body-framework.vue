<template>
    <div class="body-framework">
        <el-row>
            <el-col :span="6">
                <slot name="left">
                </slot>
            </el-col>
            <el-col :span="12">
                <slot>
                </slot>
            </el-col>
            <el-col :span="6">
                <slot name="right">
                </slot>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default{
    }
</script>

<style scoped>
    .body-framework {
        padding: 10px;
    }

    .el-col {
        min-height: 1px;
    }
</style>
