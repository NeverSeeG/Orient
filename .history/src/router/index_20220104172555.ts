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
        redirect:'/home/homePage',
        component: () => import('../views/home/index.vue'),
        children: [
          {
            path: '/home/homePage',
            component: () =>
              import('@/views/home/homePage.vue'),
            meta: { title: '首页', icon: 'el-icon-s-tools' },
          },
          {
            path: '/home/shipSummary',
            component: () =>
              import('@/views/ship/summary.vue'),
            meta: { title: '船舶汇总', icon: 'el-icon-s-tools' },
          },
          {
            path: '/home/admin',
            component: () =>
              import('@/views/admin/shipAdmin.vue'),
            meta: { title: '船舶管理', icon: 'el-icon-s-tools' },
          },
          {
            path: '/home/companyAdmin',
            component: () =>
              import('@/views/admin/companyAdmin.vue'),
            meta: { title: '单位管理', icon: 'el-icon-s-tools' },
          },
          {
            path: '/home/roleAdmin',
            component: () =>
              import('@/views/admin/roleAdmin.vue'),
            meta: { title: '角色管理', icon: 'el-icon-s-tools' },
          },
          {
            path: '/home/userAdmin',
            component: () =>
              import('@/views/admin/userAdmin.vue'),
            meta: { title: '用户管理', icon: 'el-icon-s-tools' },
          },
        ],
    },
    {
      path: '/state',
      component: () =>
        import('@/views/state/index.vue'),
      meta: { title: '状态监测', icon: 'el-icon-s-tools' },
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