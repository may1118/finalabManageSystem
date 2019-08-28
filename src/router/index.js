import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
      path: '/Members',
      component: Layout,
      redirect: '/Members/table',
      name: 'Members',
      meta: { title: '凡路成员', icon: 'peoples' },
    children: [
      {
      path: 'index',
      name: 'index',
      component: () => import('@/views/members/index'),
      meta: { title: '全部成员', icon: 'user' }
      },
      {
          path: 'Leader',
          name: 'Leader',
          component: () => import('@/views/members/indexLeader'),
          meta: { title: '理事会成员', icon: 'tree' }
      }]
  },
  {
    path: '/Employment',
    component: Layout,
    redirect: '/Employment',
    children: [{
      path: 'index',
      name: 'employment',
      component: () => import('@/views/employment/index'),
      meta: { title: '凡路就业', icon: 'guide' }
    }]
  },
  {
    path: '/Memory',
    component: Layout,
    redirect: '/Memory',
    children: [{
      path: 'index',
      name: 'memory',
      component: () => import('@/views/memory/index'),
      meta: { title: '凡路记忆', icon: 'message' }
    }]
  },
  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Project',
        component: () => import('@/views/project/index'),
        meta: { title: '凡路项目', icon: 'example' }
      }
    ]
  },

  {
    path: '/winning',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Winning',
        component: () => import('@/views/winning/index'),
        meta: { title: '凡路荣誉', icon: 'star' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
