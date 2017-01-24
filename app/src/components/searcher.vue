<template>
    <div class="my-searcher row-flow-flexbox">
        <el-autocomplete
                v-model="input"
                :fetch-suggestions="search"
                placeholder="请输入搜索内容"
                @select="handleSelect"
        ></el-autocomplete>
    </div>
</template>

<script>
    import axios from 'axios';
    import lodash from 'lodash';

    const search = function (query, callback) {
        let v = this;
        if (query.length) {
            axios
                .post('/api/articles/search', {query})
                .then(({data}) => {
                    data.forEach(res => {
                       res.value = res.title;
                    });
                    callback(data);
                })
                .catch(err => {
                    v.$notify.error({title: '未知错误', duration: 1000});
                    callback([]);
                })
        } else callback([]);
    }

    export default {
        data() {
            return {
                input: ''
            }
        },
        methods: {
            handleSelect(what) {
                let vm = this;
                this.input = '';
                vm.$router.push(`/articles/${what._id}`);
            },
            search: lodash.debounce(search, 500),
        }
    }
</script>

<style scoped>
    .my-searcher {
        background-color: #324057;
    }

    * {
        margin: 0;
        padding: 0;
    }
</style>