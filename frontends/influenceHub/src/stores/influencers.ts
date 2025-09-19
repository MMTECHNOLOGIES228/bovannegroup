
import { defineStore } from "pinia";
import api from "@/services/api";

export const useInfluencersStore = defineStore("influencers", {
    state: () => ({
        list: [] as any[],
        total: 0,
        loading: false,
    }),
    actions: {
        async fetchList(params = {}) {
            this.loading = true;
            try {
                const res = await api.get("/influencers", { params });
                this.list = res.data.items ?? res.data;
                this.total = res.data.total ?? this.list.length;
            } finally {
                this.loading = false;
            }
        },
        async fetchOne(id: string) {
            const res = await api.get(`/influencers/${id}`);
            return res.data;
        },
        async create(payload: any) {
            return api.post("/influencers", payload);
        },
        async update(id: string, payload: any) {
            return api.put(`/influencers/${id}`, payload);
        },
        async remove(id: string) {
            return api.delete(`/influencers/${id}`);
        },
    }
});
