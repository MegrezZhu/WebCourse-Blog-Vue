'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: null,
        dialogs: {
            login: false,
            regist: false
        },
        logging: false,
        statis: {
            userNum: 0,
            articleNum: 0
        }
    },
    mutations: {
        updateUser(state, user){
            state.user = user;
        },
        registDialog(state, name){
            Vue.set(state.dialogs, name, false);
        },
        dialog(state, {name, to}){
            // console.log(`${name} set to ${to}.`);
            state.dialogs[name] = to;
        }
    },
    actions: {
        login({state, commit}, info) {
            state.logging = true;
            axios
                .post('/api/login', info)
                .then(({data}) => {
                    commit('updateUser', data);
                    state.logging = false;
                })
                .catch(err => {
                    state.logging = false;
                    console.log('err', err);
                });
        },
        logout({state, commit}){
            state.logging = true;
            axios
                .get('/api/logout', null)
                .then(() => {
                    commit('updateUser', null);
                    state.logging = false;
                });
        },
        syncStatis({state}){
            let userNumP = axios.get('/api/statis/usercount')
                                .then(({data}) => {
                                    state.statis.userNum = data;
                                });
            let articleNumP = axios.get('/api/statis/articlecount')
                                   .then(({data}) => {
                                       state.statis.articleNum = data;
                                   });
            return axios.all([userNumP, articleNumP]);
        }
    }
});

export default store;