// src/router/index.ts
import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import HomePublic from "@/pages/HomePublic.vue";
import LoginForm from "@/components/Auth/LoginForm.vue";
import AdminDashboard from "@/pages/AdminDashboard.vue";
import InfluencerProfile from "@/pages/InfluencerProfile.vue";
import InfluencerRegister from "@/pages/InfluencerRegister.vue";
import { useAuthStore } from "@/stores/auth";
import PublicLayout from "@/layouts/PublicLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

const routes = [
    {
        path: "/",
        component: PublicLayout,
        children: [
            { path: "", name: "home", component: HomePublic },
            { path: "login", name: "login", component: LoginForm },
            { path: "register", name: "register", component: InfluencerRegister },
            { path: "profile/:id", name: "influencer.profile", component: InfluencerProfile, props: true },
        ],
    },
    {
        path: "/admin",
        component: AdminLayout,
        meta: {
            requiresAuth: true,
            requiredRoles: ["Admin", "Moderator"] // Rôles autorisés
        },
        children: [
            { path: "", name: "admin.dashboard", component: AdminDashboard },
            { path: "influencer/new", name: "admin.influencer.new", component: () => import("@/pages/AdminInfluencerEdit.vue") },
            {path: 'influencers/create',name: 'admin.influencer.create',component: () => import('@/pages/AdminInfluencerCreate.vue')}
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Garde de navigation
router.beforeEach(async (to: RouteLocationNormalized, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.isInitialized) {
        await authStore.init();
    }

    // Vérifier l'authentification
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: "login", query: { redirect: to.fullPath } });
        return;
    }

    // Vérifier les rôles de manière sécurisée
    if (to.meta.requiresAuth && to.meta.requiredRoles) {
        const userRole = authStore.getUserRole();
        const requiredRoles = to.meta.requiredRoles as string[];

        if (!userRole || !requiredRoles.includes(userRole)) {
            console.warn(`Accès refusé: rôle ${userRole} non autorisé. Rôles requis:`, requiredRoles);
            next({ name: "home" });
            return;
        }
    }

    next();
});

export default router;