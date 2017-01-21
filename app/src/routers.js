'use strict';

import VueRouter from 'vue-router';

import about from './components/about.vue';
import userPage from './components/userpage.vue';

const routes = [
    {
        path: '/',
        component: {
            template: '<p>index</p>'
        }
    },
    {
        path: '/articles',
        component: {
            template: '<p>articles</p>'
        }
    },
    {
        path: '/about',
        component: about
    },
    {
        path:'/userdetail',
        component: userPage
    }
];

const router = new VueRouter({routes});

export default router;