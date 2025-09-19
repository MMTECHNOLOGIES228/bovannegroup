
import { defineStore } from "pinia";
import api from "@/services/api";

type User = { id: string; email: string; role?: string; name?: string };

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as User | null,
        token: localStorage.getItem("token") || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === "admin",
    },
    actions: {
        async login(email: string, password: string) {
            const res = await api.post("/auth/login", { email, password });
            const { token, user } = res.data;
            this.token = token;
            this.user = user;
            localStorage.setItem("token", token);
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem("token");
        },
        setUser(user: User) {
            this.user = user;
        }
    },
});
