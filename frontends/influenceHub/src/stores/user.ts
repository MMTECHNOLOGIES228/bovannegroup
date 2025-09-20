// src/stores/user.ts
import { defineStore } from "pinia";
import axios from "axios";
import { userService } from "@/services/api";

export interface Permission {
  id: string;
  name?: string;
  description?: string;
}

export interface Role {
  id: string;
  role_name: string;
  role_description: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}

export interface SocialMediaAccount {
  id: string;
  utilisateurId: string;
  platform: string;
  accountUrl: string;
  followers: number;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsappNumber {
  id: string;
  utilisateurId: string;
  number: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  roleId: string;
  email: string | null;
  password: string;
  nom: string | null;
  prenom: string | null;
  phone: string | null;
  profilePic: string | null;
  status: string;
  categorie: string | null;
  biographie: string | null;
  createdAt: string;
  updatedAt: string;
  role: Role;
  socialMediaAccounts: SocialMediaAccount[];
  whatsappNumbers: WhatsappNumber[];
  profile: any | null;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const res = await userService.getAll(); 
        // ← adapte l’URL selon ton API
        this.users = res.data.data;
      } catch (err: any) {
        this.error = err.message || "Erreur lors du chargement des utilisateurs";
      } finally {
        this.loading = false;
      }
    },

    getUserById(id: string): User | undefined {
      return this.users.find((u) => u.id === id);
    },

    addUser(user: User) {
      this.users.push(user);
    },

    updateUser(updated: User) {
      const index = this.users.findIndex((u) => u.id === updated.id);
      if (index !== -1) {
        this.users[index] = updated;
      }
    },

    removeUser(id: string) {
      this.users = this.users.filter((u) => u.id !== id);
    },
  },

  
});
