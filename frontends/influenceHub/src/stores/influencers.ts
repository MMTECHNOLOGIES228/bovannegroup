import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService, socialMediaService } from '../services/api'
import { useAuthStore } from './auth';

// Définir le type pour un influenceur basé sur la structure de données réelle
interface Influencer {
    id: string;
    roleId: string;
    email: string;
    nom: string;
    prenom: string;
    phone: string;
    profilePic: string;
    status: string;
    categorie: string;
    biographie: string;
    role: {
        id: string;
        role_name: string;
        role_description: string;
        permissions: any[];
    };
    socialMediaAccounts: {
        id: string;
        utilisateurId: string;
        platform: string;
        accountUrl: string;
        followers: number;
    }[];
    whatsappNumbers: any[];
    profile: any;
}

export const useInfluencerStore = defineStore('influencers', () => {
    const influencers = ref<Influencer[]>([])
    const currentInfluencer = ref<Influencer | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const authStore = useAuthStore()

    const filters = ref({
        category: '',
        followersMin: '',
        followersMax: '',
        engagementRateMin: ''
    })

    // Récupérer tous les influenceurs avec filtres optionnels
    const fetchInfluencers = async (customFilters = {}) => {
        loading.value = true
        error.value = null
        try {
            console.log('Fetching influencers with filters:', customFilters)
            const appliedFilters = { ...filters.value, ...customFilters }
            const response = await userService.getAll(appliedFilters)

            console.log('Raw API response:', response.data)

            // Vérifiez la structure de la réponse
            if (response.data && response.data.data) {
                // Utiliser directement les données de l'API sans transformation excessive
                influencers.value = response.data.data.map((user: any) => ({
                    id: user.id,
                    roleId: user.roleId,
                    email: user.email,
                    nom: user.nom,
                    prenom: user.prenom,
                    phone: user.phone,
                    profilePic: user.profilePic,
                    status: user.status,
                    categorie: user.categorie,
                    biographie: user.biographie,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    role: user.role,
                    socialMediaAccounts: user.socialMediaAccounts || [],
                    whatsappNumbers: user.whatsappNumbers || [],
                    profile: user.profile
                }))

                console.log('Transformed influencers:', influencers.value)
            } else {
                throw new Error('Structure de réponse API invalide')
            }
        } catch (err: any) {
            console.error('Error in fetchInfluencers:', err)
            const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement'
            error.value = errorMessage
            throw err
        } finally {
            loading.value = false
        }
    }

    // Récupérer un influenceur par son ID
    const fetchInfluencerById = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const response = await userService.getById(id)
            const user = response.data.data

            // Utiliser directement les données de l'API
            currentInfluencer.value = {
                id: user.id,
                roleId: user.roleId,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                phone: user.phone,
                profilePic: user.profilePic,
                status: user.status,
                categorie: user.categorie,
                biographie: user.biographie,
                role: user.role,
                socialMediaAccounts: user.socialMediaAccounts || [],
                whatsappNumbers: user.whatsappNumbers || [],
                profile: user.profile
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement'
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchInfluencerByMe = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await userService.getByMe()
            const user = response.data.data

            // Utiliser directement les données de l'API
            currentInfluencer.value = {
                id: user.id,
                roleId: user.roleId,
                email: user.email || '',
                nom: user.nom || '',
                prenom: user.prenom || '',
                phone: user.phone || '',
                profilePic: user.profilePic || '',
                status: user.status,
                categorie: user.categorie || '',
                biographie: user.biographie || ''
,                role: user.role,
                socialMediaAccounts: user.socialMediaAccounts || [],
                whatsappNumbers: user.whatsappNumbers || [],
                profile: user.profile

            }

            return currentInfluencer.value

        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Créer un nouvel influenceur
    const createInfluencer = async (userData: any) => {
        loading.value = true
        error.value = null
        try {
            // 1. Créer l'utilisateur
            const response = await userService.create(userData)

            // 2. Connecter automatiquement l'utilisateur
            await authStore.login({
                login: userData.email || userData.phone,
                password: userData.password
            }, false)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors de la création'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Mettre à jour un influenceur
    const updateInfluencer = async (id: string, influencerData: any) => {
        loading.value = true
        error.value = null
        try {
            const response = await userService.update(id, influencerData)
            const index = influencers.value.findIndex(inf => inf.id === id)
            if (index !== -1) {
                influencers.value[index] = response.data
            }
            if (currentInfluencer.value && currentInfluencer.value.id === id) {
                currentInfluencer.value = response.data
            }
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors de la mise à jour'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Supprimer un influenceur
    const deleteInfluencer = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            await userService.delete(id)
            influencers.value = influencers.value.filter(inf => inf.id !== id)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors de la suppression'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Créer les comptes de réseaux sociaux
    const createSocialAccounts = async (accountsData: any) => {
        loading.value = true
        error.value = null
        try {
            const response = await socialMediaService.createAccounts({
                accounts: accountsData
            })
            console.log('createSocialAccounts API response:', response.data)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors de la création des comptes sociaux'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Mettre à jour les filtres
    const updateFilters = (newFilters: any) => {
        filters.value = { ...filters.value, ...newFilters }
    }

    return {
        influencers,
        currentInfluencer,
        loading,
        error,
        filters,
        fetchInfluencers,
        fetchInfluencerById,
        createInfluencer,
        updateInfluencer,
        deleteInfluencer,
        updateFilters,
        createSocialAccounts,
        fetchInfluencerByMe
    }
})