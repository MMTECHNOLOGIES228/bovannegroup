// services/api.ts
import type { LoginCredentials, LoginResponse, SignupResponse, User, VerifyResponse } from '@/types/auth'
import axios, { type AxiosResponse } from 'axios'

// Configuration de base de l'API - utiliser le proxy en développement
const API_BASE_URL = 'http://192.168.2.101:9000/api/v1'

console.log('API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Services pour les utilisateurs/influenceurs
export const userService = {
  // Récupérer tous les utilisateurs avec des filtres
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })

      const response = await api.get(`/utilisateur?${params.toString()}`)
      return response

    } catch (error: any) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Récupérer un utilisateur par son ID
  getById: (id: string) => {
    return api.get(`/utilisateur/${id}`)
  },

  // Récupérer un utilisateur par son ID
  // getByMe: () => {
  //   return api.get(`/utilisateur/user/connect/me`)
  // },
  getByMe: (): Promise<AxiosResponse<{ message: string; data: User }>> => {
    return api.get('/utilisateur/user/connect/me')
  },

  // Créer un nouvel utilisateur (influenceur)
  create: (userData: any) => {
    return api.post('/auth/signup', userData)
  },

  // Mettre à jour un utilisateur
  update: (id: string, userData: any) => {
    return api.put(`/utilisateur/${id}`, userData)
  },

  // Supprimer un utilisateur
  delete: (id: string) => {
    return api.delete(`/utilisateur/${id}`)
  }

  
}

// Services pour les réseaux sociaux
export const socialMediaService = {
  // Ajouter/compléter les comptes de réseaux sociaux (requiert authentification)
  createAccounts: (accountsData: any) => {
    return api.post(`/social-media-accounts/add/me`, accountsData)
  },

  // Récupérer les comptes sociaux de l'utilisateur connecté
  getMyAccounts: () => {
    return api.get(`/social-media-accounts/me`)
  },

  // Récupérer les comptes sociaux d'un utilisateur spécifique (admin seulement)
  getByUserId: (userId: string) => {
    return api.get(`/social-media-accounts/user/${userId}`)
  },

  // Mettre à jour un compte social
  updateAccount: (accountId: string, accountData: any) => {
    return api.put(`/social-media-accounts/account/${accountId}`, accountData)
  },

  // Supprimer un compte social
  deleteAccount: (accountId: string) => {
    return api.delete(`/social-media-accounts/account/${accountId}`)
  }
}

// Services d'authentification
export const authService = {
  // Connexion avec email ou téléphone
  login: (credentials: LoginCredentials): Promise<AxiosResponse<LoginResponse>> => {
    return api.post<LoginResponse>('/auth/signin', credentials)
  },

  // Inscription
  signup: (userData: any): Promise<AxiosResponse<SignupResponse>> => {
    return api.post<SignupResponse>('/auth/signup', userData)
  },

  // Déconnexion
  logout: (): Promise<AxiosResponse<void>> => {
    return api.post<void>('/auth/logout')
  },

  // Vérifier le token
  verify: (): Promise<AxiosResponse<VerifyResponse>> => {
    return api.get<VerifyResponse>('/auth/verify')
  }
}

export default api