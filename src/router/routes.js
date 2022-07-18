const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },
  {
    path: "/login",
    component: () => import("layouts/BlankLayout"),
    children: [{ path: "", component: () => import("pages/login/login") }],
  },
  {
    path: "/dashboard",
    secure: true,
    component: () => import("layouts/MainLayout"),
    children: [
      { path: "", component: () => import("pages/dashboard/dashboard") },
    ],
  },
  {
    path: "/questions",
    secure: true,
    component: () => import("layouts/MainLayout"),
    children: [
      { path: "", component: () => import("pages/questions/questions") },
      {
        path: "new",
        component: () => import("pages/questions/new"),
      },
      {
        path: ":questionID/show",
        component: () => import("pages/questions/show"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
