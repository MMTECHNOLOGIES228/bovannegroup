<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Connexion</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login">Email ou Téléphone</label>
          <input
            type="text"
            id="login"
            v-model="credentials.login"
            required
            placeholder="Email ou numéro de téléphone"
            @input="detectInputType"
          >
          <div v-if="inputType" class="input-type-indicator">
            <small>Vous utilisez: {{ inputType === 'email' ? 'Email' : 'Téléphone' }}</small>
          </div>
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

        <div class="login-help">
          <p>Vous pouvez vous connecter avec :</p>
          <ul>
            <li>Votre adresse email</li>
            <li>Votre numéro de téléphone</li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const credentials = ref<LoginCredentials>({
  login: '',
  password: ''
})

const inputType = ref<'email' | 'phone' | null>(null)

onMounted(() => {
  // Réinitialiser les erreurs à chaque affichage du formulaire
  authStore.error = null
})

const detectInputType = () => {
  const loginValue = credentials.value.login.trim()
  
  if (!loginValue) {
    inputType.value = null
    return
  }

  // Détection de l'email
  if (loginValue.includes('@')) {
    inputType.value = 'email'
    return
  }

  // Détection du téléphone (supprime tous les caractères non numériques)
  const numericValue = loginValue.replace(/\D/g, '')
  
  // Considère comme téléphone si c'est principalement des chiffres
  if (numericValue.length >= 8 && numericValue.length <= 15) {
    inputType.value = 'phone'
    return
  }

  inputType.value = null
}

const handleLogin = async (): Promise<void> => {
  try {
    await authStore.login(credentials.value)
    const redirectPath = route.query.redirect as string || '/admin'
    router.push(redirectPath)
  } catch (error) {
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.input-type-indicator {
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.8rem;
}

.error-message {
  color: #dc3545;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover:not(:disabled) {
  background: #0056b3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-help {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.login-help p {
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  color: #2c3e50;
}

.login-help ul {
  margin: 0;
  padding-left: 1.2rem;
  color: #666;
}

.login-help li {
  margin-bottom: 0.25rem;
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
    margin: 0 1rem;
  }
}
</style>