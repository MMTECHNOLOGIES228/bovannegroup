// stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/api'
import type { User, LoginCredentials, LoginResponse } from '@/types/auth'
import router from '../router'
import type { AxiosResponse } from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isInitialized = ref(false)
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialiser l'état d'authentification
  const init = async (): Promise<void> => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const response = await authService.verify()
        isAuthenticated.value = true
        user.value = response.data.user
      } catch (err) {
        localStorage.removeItem('authToken')
        isAuthenticated.value = false
        user.value = null
      }
    }
    isInitialized.value = true
  }

  // Connexion
  const login = async (credentials: LoginCredentials, redirect: boolean = true): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const response: AxiosResponse<LoginResponse> = await authService.login(credentials)
      const { token, data: userData, role } = response.data
      
      localStorage.setItem('authToken', token)
      isAuthenticated.value = true
      
      // S'assurer que l'utilisateur a bien un rôle
      user.value = {
        ...userData,
        role: role || userData.role || 'Influenceur' // Fallback si le rôle n'est pas fourni
      }

      // Redirection optionnelle
      if (redirect) {
        router.push('/admin')
      }
      
    //   router.push('/admin')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    } finally {
      localStorage.removeItem('authToken')
      isAuthenticated.value = false
      user.value = null
      router.push('/')
    }
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role: string): boolean => {
    return user.value?.role === role
  }

  // Vérifier si l'utilisateur a un des rôles spécifiés
  const hasAnyRole = (roles: string[]): boolean => {
    return user.value?.role ? roles.includes(user.value.role) : false
  }

  // Obtenir le rôle de l'utilisateur
  const getUserRole = (): string | null => {
    return user.value?.role || null
  }

  return {
    isAuthenticated,
    isInitialized,
    user,
    loading,
    error,
    init,
    login,
    logout,
    hasRole,
    hasAnyRole,
    getUserRole
  }
})