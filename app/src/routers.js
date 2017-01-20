'use strict';

import VueRouter from 'vue-router';

const routes = [
    {
        path: '/',
        component: {
            template: '<p>index!</p>'
        }
    },
    {
        path: '/articles',
        component: {
            template:'<p>articles</p>'
        }
    }
];

const router = new VueRouter({routes});

export default router;