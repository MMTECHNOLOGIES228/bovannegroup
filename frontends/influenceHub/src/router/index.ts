

// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
// import HomePublic from "@/pages/HomePublic.vue";
// import LoginForm from "@/components/Auth/LoginForm.vue";
// import AdminDashboard from "@/pages/AdminDashboard.vue";
// import InfluencerProfile from "@/pages/InfluencerProfile.vue";
// import InfluencerRegister from "@/components/Auth/InfluencerRegister.vue";
// import { useAuthStore } from "@/stores/auth";
import PublicLayout from "@/layouts/PublicLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";


const routes = [
    {
        path: "/",
        component: PublicLayout,
        // children: [
        //     { path: "", name: "home", component: HomePublic },
        //     { path: "login", name: "login", component: LoginForm },
        //     { path: "register", name: "register", component: InfluencerRegister },
        //     { path: "influencer/:id", name: "influencer.profile", component: InfluencerProfile, props: true },
        // ],
    },
    {
        path: "/admin",
        component: AdminLayout,
        // meta: { requiresAuth: true, requiresAdmin: true },
        // children: [
        //     { path: "", name: "admin", component: AdminDashboard },
        //     { path: "influencer/:id/edit", name: "admin.influencer.edit", component: () => import("@/pages/AdminInfluencerEdit.vue"), meta: { requiresAuth: true } },
        // ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// guard
// router.beforeEach((to, from, next) => {
//     const auth = useAuthStore();
//     if (to.meta.requiresAuth && !auth.isAuthenticated) {
//         return next({ name: "login" });
//     }
//     if (to.meta.requiresAdmin && !auth.isAdmin) {
//         return next({ name: "home" });
//     }
//     next();
// });

export default router;
