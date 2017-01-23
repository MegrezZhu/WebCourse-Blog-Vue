'use strict';

import Vue from 'vue';
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import 'element-ui/lib/theme-default/index.css';
import './style/global.css';

import app from './components/app.vue';
import routers from './routers';
import store from  './store';

Vue.use(ElementUI);
Vue.use(VueRouter);

// small components
import splitter from './components/splitter.vue';
import userLink from './components/user-link.vue';
Vue.component('splitter', splitter);
Vue.component('user-link', userLink);

// assign Vue instance to windows for console debugging
window.Vue = new Vue({
    el: '#app',
    template: '<app/>',
    components: {
        app: app
    },
    router: routers,
    store,
});