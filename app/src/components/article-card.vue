<template>
    <el-card v-loading="loading">
        <div class="article-card">
            <template v-if="hide">
                该文章已被管理员隐藏
            </template>
            <template v-else>
                <div class="row-flow-flexbox main">
                    <div class="title">
                        <router-link :to="link">{{title || 'loading...'}}</router-link>
                    </div>
                </div>
                <div class="sub">
                    <user-link :user="data.author"></user-link>
                    <span style="font-size:0.8em;color:rgb(180,180,180)">发布于</span>
                    <span>{{time}}</span>
                </div>
            </template>
        </div>
    </el-card>
</template>

<script>
    import moment from 'moment';
    import axios from 'axios';

    export default {
        data() {
            return {
                data: {title: '', author: {}},
                loading: false
            }
        },
        props: {
            articleId: {require: true, type: String},
            hide: {type: Boolean, default: false}
        },
        computed: {
            time(){
                if (this.data.date) {
                    let _moment = moment(this.data.date);
                    return _moment.format(`${_moment.year() !== moment().year() ? 'YYYY.' : ''}MM.DD HH:mm`);
                }
                else
                    return '';
            },
            title() {
                let vm = this;
                if (vm.data.title.length > 15) {
                    return vm.data.title.substr(0, 15) + '...';
                } else {
                    return vm.data.title;
                }
            },
            link(){
                return `/articles/${this.data._id}`;
            }
        },
        methods: {
            toUser(){
                this.$router.push(`/user/${this.data.author}`);
            },
            fetchData(){
                let vm = this;
                vm.loading = true;
                axios
                    .post('/api/articles/getone', {id: vm.articleId, keys: ['title', 'author', 'date', '_id']})
                    .then(({data}) => {
                        console.log(data);
                        vm.data = data;
                        vm.loading = false;
                    })
                    .catch(({err}) => {
                        vm.loading = false;
                    });
            }
        },
        watch: {
            'articleId'(){
                this.fetchData();
            }
        },
        created(){
            this.fetchData();
        }
    }
</script>

<style scoped>
    .main {
        height: 150px;
    }

    .article-card {
        position: relative;
        height: 150px;
    }

    .sub {
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .title {
        font-size: 3em;
    }

    a, a:visited {
        text-decoration: none;
        color: black;
    }

    a:active {
        color: rgb(57, 158, 233);
    }
</style>