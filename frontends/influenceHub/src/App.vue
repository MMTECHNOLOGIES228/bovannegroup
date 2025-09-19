<script lang="ts" setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

onMounted(async () => {
  if (auth.token) {
    await auth.fetchUser(); // récupère l'utilisateur si token
  }
});
</script>

<template>
  <!-- Toutes les pages seront affichées ici via le router -->
  <router-view />
</template>
