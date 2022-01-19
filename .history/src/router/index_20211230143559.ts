import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home/index.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/index.vue'),
        children: [
          {
            path: '/home/shipSummary',
            component: () =>
              import('@/views/'),
            meta: { title: '知识分类管理', icon: 'el-icon-s-tools' },
          },
        ],

    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(), // 路由模式
    routes // 路由规则
})

router.beforeEach((to, from, next) => {
    // const sessionId = sessionStorage.getItem('sessionId');
    // if (to.path !== '/login' && !sessionId) {
    //     next('/login');
    // } else {
    //     if (to.name === 'login' && sessionId) {
    //         router.push('/')
    //     } else {
    //         next();
    //     }
    // }
    next();
})

// 全局后置守卫
router.afterEach(() => {
})

export default router
