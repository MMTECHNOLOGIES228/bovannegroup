import { defineStore } from 'pinia'
import { ref } from 'vue'
import { influencerService } from '../services/api'

export const useInfluencerStore = defineStore('influencers', () => {
    const influencers = ref<any[]>([])
    const currentInfluencer = ref(null)
    const loading = ref(false)
    const error = ref(null)
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
            const appliedFilters = { ...filters.value, ...customFilters }
            const response = await influencerService.getAll(appliedFilters)
            influencers.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement'
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
            const response = await influencerService.getById(id)
            currentInfluencer.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors du chargement'
            throw err
        } finally {
            loading.value = false
        }
    }

    // Créer un nouvel influenceur
    const createInfluencer = async (influencerData: any) => {
        loading.value = true
        error.value = null
        try {
            const response = await influencerService.create(influencerData)
            influencers.value.push(response.data)
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
            const response = await influencerService.update(id, influencerData)
            const index = influencers.value.findIndex((inf: any) => inf._id === id)
            if (index !== -1) {
                influencers.value[index] = response.data
            }
            if (currentInfluencer.value && (currentInfluencer.value as any)._id === id) {
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
            await influencerService.delete(id)
            influencers.value = influencers.value.filter((inf: any) => inf._id !== id)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Erreur lors de la suppression'
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
        updateFilters
    }
})