import axios from 'axios'

// Configuration de base de l'API
const API_BASE_URL = 'http://localhost:3000/api'

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

// Services pour les influenceurs
export const influencerService = {
  // Récupérer tous les influenceurs
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString())
    })
    return api.get(`/influencers?${params.toString()}`)
  },

  // Récupérer un influenceur par son ID
  getById: (id: string) => {
    return api.get(`/influencers/${id}`)
  },

  // Créer un nouvel influenceur
  create: (influencerData: any) => {
    return api.post('/influencers', influencerData)
  },

  // Mettre à jour un influenceur
  update: (id: string, influencerData: any) => {
    return api.put(`/influencers/${id}`, influencerData)
  },

  // Supprimer un influenceur
  delete: (id: string) => {
    return api.delete(`/influencers/${id}`)
  }
}

// Services d'authentification
export const authService = {
  // Connexion
  login: (credentials: { email: string; password: string }) => {
    return api.post('/auth/login', credentials)
  },

  // Déconnexion
  logout: () => {
    return api.post('/auth/logout')
  },

  // Vérifier le token
  verify: () => {
    return api.get('/auth/verify')
  }
}

export default api