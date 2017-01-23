'use strict';

import VueRouter from 'vue-router';

import index from './components/index.vue';
import about from './components/about.vue';
import userPage from './components/user-page.vue';
import articlePage from './components/article-page.vue';

const routes = [
    {
        path: '/',
        component: index
    },
    {
        path: '/about',
        component: about
    },
    {
        path:'/user/:uid',
        component: userPage
    },
    {
        path:'/articles/:id',
        component: articlePage
    }
];

const router = new VueRouter({routes});

export default router;