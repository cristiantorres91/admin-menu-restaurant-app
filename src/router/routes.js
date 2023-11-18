const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "orders",
        name: "orders",
        component: () => import("pages/OrdersPage.vue"),
        meta: { requireAuth: true },
      },
      {
        path: "config",
        name: "config",
        component: () => import("pages/ConfigPage.vue"),
        meta: { requireAuth: true },
      },
    ],
  },

  {
    path: "/Login",
    component: () => import("pages/LoginPage.vue"),
    meta: { requireAuth: false },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
