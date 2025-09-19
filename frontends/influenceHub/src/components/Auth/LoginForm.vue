<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

async function submit() {
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push({ name: "admin" });
  } catch (err) {
    alert("Identifiants invalides");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-2xl mb-4">Connexion</h1>
    <form @submit.prevent="submit" class="space-y-3">
      <input v-model="email" type="email" placeholder="Email" required class="w-full p-2 border rounded"/>
      <input v-model="password" type="password" placeholder="Mot de passe" required class="w-full p-2 border rounded"/>
      <button :disabled="loading" class="w-full p-2 bg-blue-600 text-white rounded">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>
  </div>
</template>
