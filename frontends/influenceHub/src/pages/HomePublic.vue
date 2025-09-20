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
              v-model="filters.followersMin" 
              placeholder="0" 
              min="0"
            >
          </div>
          
          <div class="filter-group">
            <label for="followers-max">Abonnés (max)</label>
            <input 
              type="number" 
              id="followers-max" 
              v-model="filters.followersMax" 
              placeholder="1000000" 
              min="0"
            >
          </div>
          
          <button @click="applyFilters" class="btn">Appliquer les filtres</button>
        </div>
      </div>
    </section>
    
    <section class="influencers-section">
      <div class="container">
        <div v-if="influencerStore.loading" class="loading">
          Chargement des influenceurs...
        </div>
        
        <div v-else-if="influencerStore.error" class="error">
          Erreur: {{ influencerStore.error }}
        </div>
        
        <div v-else-if="influencerStore.influencers.length === 0" class="no-results">
          Aucun influenceur ne correspond à vos critères de recherche.
        </div>
        
        <div v-else class="influencers-grid">
          <InfluencerCard 
            v-for="influencer in influencerStore.influencers" 
            :key="influencer.id" 
            :influencer="influencer"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInfluencerStore } from '@/stores/influencers'
import InfluencerCard from '@/components/Auth/InfluencerCard.vue' // Chemin corrigé

const influencerStore = useInfluencerStore()

const filters = ref({
  category: '',
  followersMin: '',
  followersMax: ''
})

onMounted(() => {
  influencerStore.fetchInfluencers()
})

const applyFilters = () => {
  influencerStore.fetchInfluencers(filters.value)
}
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

.influencers-section {
  padding: 3rem 0;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #dc3545;
}

.no-results {
  color: #6c757d;
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