<script lang="ts" setup>
import { defineSlot } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

function logout() {
  auth.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-gray-700">Admin Panel</div>
      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/admin"
          class="block px-4 py-2 rounded hover:bg-gray-700"
          active-class="bg-gray-700"
        >
          Tableau de bord
        </router-link>
        <router-link
          to="/admin/influencer/new"
          class="block px-4 py-2 rounded hover:bg-gray-700"
          active-class="bg-gray-700"
        >
          Créer un influenceur
        </router-link>
      </nav>
      <div class="p-4 border-t border-gray-700">
        <button @click="logout" class="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700">
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6 overflow-auto">
      <slot />
    </main>
  </div>
</template>
