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
            axios
                .post('/api/login', info)
                .then(({data}) => {
                    commit('updateUser', data);
                })
                .catch(err => {
                    console.log('err', err);
                });
        },
        logout({state, commit}){
            axios
                .post('/api/logout')
                .then(() => {
                    commit('updateUser', null);
                });
        }
    }
});

export default store;