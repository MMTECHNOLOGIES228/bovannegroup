<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Connexion Administrateur</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="credentials.email"
            required
            placeholder="Votre email administrateur"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="credentials.password"
            required
            placeholder="Votre mot de passe"
          >
        </div>
        
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>
        
        <button 
          type="submit" 
          class="btn"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const credentials = ref({
  email: '',
  password: ''
})

onMounted(() => {
  // Réinitialiser les erreurs à chaque affichage du formulaire
  authStore.error = null
})

const handleLogin = async () => {
  try {
    await authStore.login(credentials.value)
    // Redirection après connexion réussie
    const redirectPath = route.query.redirect as string || '/admin'
    router.push(redirectPath)
  } catch (error) {
    // L'erreur est déjà gérée par le store
    console.error('Erreur de connexion:', error)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 0;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
}
</style>