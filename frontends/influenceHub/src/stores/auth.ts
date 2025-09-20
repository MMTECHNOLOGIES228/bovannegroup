import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false)
    const isInitialized = ref(false) // Nouvelle propriété
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Initialiser l'état d'authentification au chargement de l'application
    // Initialiser l'état d'authentification
    const init = async () => {
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
        isInitialized.value = true // Marquer comme initialisé
    }

    // Connexion
    const login = async (credentials: { email: string; password: string }) => {
        loading.value = true
        error.value = null
        try {
            const response = await authService.login(credentials)
            const { token, user: userData } = response.data

            localStorage.setItem('authToken', token)
            isAuthenticated.value = true
            user.value = userData

            router.push('/admin')
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur de connexion'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Déconnexion
    const logout = async () => {
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

    return {
        isAuthenticated,
        isInitialized, // Exposer la nouvelle propriété
        user,
        loading,
        error,
        init,
        login,
        logout
    }
})