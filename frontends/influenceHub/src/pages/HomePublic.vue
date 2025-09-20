<template>
  <div class="home-public">
    <section class="hero">
      <div class="container">
        <h1>Découvrez les meilleurs influenceurs</h1>
        <p>Une plateforme pour connecter les marques avec les influenceurs les plus pertinents</p>
        <router-link to="/register" class="btn btn-large">Devenir influenceur</router-link>
      </div>
    </section>
    
    <section class="filters-section">
      <div class="container">
        <h2>Rechercher des influenceurs</h2>
        <div class="filters">
          <div class="filter-group">
            <label for="category-filter">Catégorie</label>
            <select id="category-filter" v-model="filters.category">
              <option value="">Toutes les catégories</option>
              <option value="Mode">Mode</option>
              <option value="Beauté">Beauté</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Voyage">Voyage</option>
              <option value="Gastronomie">Gastronomie</option>
              <option value="Fitness">Fitness</option>
              <option value="Technologie">Technologie</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="followers-min">Abonnés (min)</label>
            <input 
              type="number" 
              id="followers-min" 
              v-model.number="filters.followersMin" 
              placeholder="0" 
              min="0"
            >
          </div>
          
          <div class="filter-group">
            <label for="followers-max">Abonnés (max)</label>
            <input 
              type="number" 
              id="followers-max" 
              v-model.number="filters.followersMax" 
              placeholder="1000000" 
              min="0"
            >
          </div>
          
          <button @click="applyFilters" class="btn">Appliquer les filtres</button>
          <button @click="resetFilters" class="btn btn-secondary">Réinitialiser</button>
        </div>
      </div>
    </section>
    
    <section class="influencers-section">
      <div class="container">
        <div v-if="influencerStore.loading" class="loading">
          <div class="spinner"></div>
          Chargement des influenceurs...
        </div>
        
        <div v-else-if="influencerStore.error" class="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>
          <p>Erreur: {{ influencerStore.error }}</p>
          <button @click="refreshInfluencers" class="btn btn-small">Réessayer</button>
        </div>
        
        <div v-else-if="filteredInfluencers.length === 0" class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
          </svg>
          <p>Aucun influenceur ne correspond à vos critères de recherche.</p>
        </div>
        
        <div v-else class="influencers-grid">
          <InfluencerCard 
            v-for="influencer in filteredInfluencers" 
            :key="influencer.id" 
            :influencer="influencer"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useInfluencerStore } from '@/stores/influencers'
import InfluencerCard from '@/components/Auth/InfluencerCard.vue'

const influencerStore = useInfluencerStore()

const filters = ref({
  category: '',
  followersMin: null as number | null,
  followersMax: null as number | null
})

// Charger les influenceurs au montage du composant
onMounted(() => {
  influencerStore.fetchInfluencers()
})

// Appliquer les filtres
const applyFilters = () => {
  // Les filtres sont appliqués via la propriété computed filteredInfluencers
  // Cette fonction peut être utilisée pour des actions supplémentaires si nécessaire
}

// Réinitialiser les filtres
const resetFilters = () => {
  filters.value = {
    category: '',
    followersMin: null,
    followersMax: null
  }
}

// Rafraîchir la liste des influenceurs
const refreshInfluencers = () => {
  influencerStore.fetchInfluencers()
}

// Calculer le nombre total d'abonnés pour un influenceur
const calculateTotalFollowers = (influencer: any) => {
  if (!influencer.socialMediaAccounts || influencer.socialMediaAccounts.length === 0) return 0
  return influencer.socialMediaAccounts.reduce((total: number, account: any) => total + (account.followers || 0), 0)
}

// Filtrer les influenceurs en fonction des critères
const filteredInfluencers = computed(() => {
  return influencerStore.influencers.filter((influencer) => {
    // Filtre par catégorie
    if (filters.value.category && influencer.categorie !== filters.value.category) {
      return false
    }
    
    // Filtre par nombre d'abonnés minimum
    if (filters.value.followersMin !== null) {
      const totalFollowers = calculateTotalFollowers(influencer)
      if (totalFollowers < filters.value.followersMin) {
        return false
      }
    }
    
    // Filtre par nombre d'abonnés maximum
    if (filters.value.followersMax !== null) {
      const totalFollowers = calculateTotalFollowers(influencer)
      if (totalFollowers > filters.value.followersMax) {
        return false
      }
    }
    
    return true
  })
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background-color: #fff;
  color: #667eea;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-large:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.filters-section {
  padding: 2rem 0;
  background-color: #f8f9fa;
}

.filters-section h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #5a67d8;
}

.btn-secondary {
  background-color: #95a5a6;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.influencers-section {
  padding: 3rem 0;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading {
  color: #3498db;
}

.error {
  color: #e74c3c;
}

.no-results {
  color: #7f8c8d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.influencers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .influencers-grid {
    grid-template-columns: 1fr;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
}
</style>