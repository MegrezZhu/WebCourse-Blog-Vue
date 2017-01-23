<template>
    <my-body>
        <div class="column-flow-flexbox">
            <el-card>
                <p slot="header" class="header">About</p>
                <div class="column-flow-flexbox">
                    <div class="row-flow-flexbox">
                        <img src="http://cn.vuejs.org/images/logo.png" class="logo">
                        <div class="description">
                            <p>Vue.js</p>
                            <p>element-ui</p>
                        </div>
                    </div>
                    <div class="row-flow-flexbox">
                        <img src="https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/github-512.png" class="logo">
                        <div class="description">
                            <p>GitHub</p>
                            <a href="https://github.com/MegrezZhu/WebCourse-Blog-Vue" target="_blank">
                                <el-button type="info" size="large">Repository</el-button>
                            </a>
                        </div>
                    </div>
                    <splitter :weight="1"></splitter>
                    <div>{{userNum}}</div>
                    <p>已注册用户数量：<span>{{$store.state.statis.userNum}}</span></p>
                    <p>文章数量：<span>{{$store.state.statis.articleNum}}</span></p>
                </div>
            </el-card>
        </div>
    </my-body>
</template>

<script>
    import myBody from './body-framework.vue';
    export default {
        computed: {
            userNum() {
                return this.$store.state.userNum;
            }
        },
        components: {
            myBody
        }
    }
</script>

<style scoped>
    .el-card {
        width: 100%;
    }

    .logo {
        max-width: 200px;
    }

    p.header {
        font-size: 2em;
        margin: 0;
    }

    p {
        font-size: 1.5em;
        text-align: center;
    }
    
    p span {
        font-size: 2.5em;
    }

    .description {
        min-width: 150px;
    }
</style>