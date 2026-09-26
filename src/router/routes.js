const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { requiresGuest: true },
    children: [{ path: '', component: () => import('@/pages/auth/AuthPage.vue') }],
  },
  {
    path: '/app',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/app/restaurant' },
      { path: 'restaurant', component: () => import('@/pages/restaurant/RestaurantSetupPage.vue') },
      { path: 'items', component: () => import('@/pages/items/ItemsPage.vue') },
      { path: 'orders', component: () => import('@/pages/orders/OrderPage.vue') },
      { path: 'invoices', component: () => import('@/pages/invoice/InvoicePage.vue') },
      { path: 'invoices/:id', component: () => import('@/pages/invoice/InvoicePage.vue'), props: true },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
