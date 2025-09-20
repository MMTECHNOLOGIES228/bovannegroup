<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Dashboard Administrateur</h1>
      <router-link to="/admin/influencer/new" class="btn">+ Nouvel influenceur</router-link>
    </div>
    
    <div class="filters">
      <h2>Filtrer les influenceurs</h2>
      <div class="filter-controls">
        <div class="filter-group">
          <label for="admin-category">Catégorie</label>
          <select id="admin-category" v-model="filters.category">
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
          <label for="admin-followers-min">Abonnés (min)</label>
          <input 
            type="number" 
            id="admin-followers-min" 
            v-model="filters.followersMin" 
            placeholder="0" 
            min="0"
          >
        </div>
        
        <div class="filter-group">
          <label for="admin-followers-max">Abonnés (max)</label>
          <input 
            type="number" 
            id="admin-followers-max" 
            v-model="filters.followersMax" 
            placeholder="1000000" 
            min="0"
          >
        </div>
        
        <button @click="applyFilters" class="btn">Filtrer</button>
        <button @click="resetFilters" class="btn btn-secondary">Réinitialiser</button>
      </div>
    </div>
    
    <div class="influencers-list">
      <h2>Liste des influenceurs ({{ influencerStore.influencers.length }})</h2>
      
      <div v-if="influencerStore.loading" class="loading">
        Chargement des influenceurs...
      </div>
      
      <div v-else-if="influencerStore.error" class="error">
        Erreur: {{ influencerStore.error }}
      </div>
      
      <div v-else-if="influencerStore.influencers.length === 0" class="no-results">
        Aucun influenceur trouvé.
      </div>
      
      <table v-else class="influencers-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Abonnés</th>
            <th>Engagement</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="influencer in influencerStore.influencers" :key="influencer._id">
            <td>
              <div class="influencer-name">
                <img 
                  :src="influencer.profileImage || '/default-avatar.png'" 
                  :alt="influencer.name"
                  class="avatar"
                >
                {{ influencer.name }}
              </div>
            </td>
            <td>{{ influencer.category }}</td>
            <td>{{ formatNumber(influencer.followers) }}</td>
            <td>{{ influencer.engagementRate }}%</td>
            <td>{{ influencer.email }}</td>
            <td>
              <div class="actions">
                <router-link 
                  :to="'/admin/influencer/' + influencer._id" 
                  class="btn btn-small"
                >
                  Modifier
                </router-link>
                <button 
                  @click="deleteInfluencer(influencer._id)" 
                  class="btn btn-small btn-danger"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInfluencerStore } from '../stores/influencers'

const influencerStore = useInfluencerStore()

const filters = ref({
  category: '',
  followersMin: '',
  followersMax: '',
  engagementRateMin: ''
})

onMounted(() => {
  influencerStore.fetchInfluencers()
})

const applyFilters = () => {
  influencerStore.fetchInfluencers(filters.value)
}

const resetFilters = () => {
  filters.value = {
    category: '',
    followersMin: '',
    followersMax: '',
    engagementRateMin: ''
  }
  influencerStore.fetchInfluencers()
}

const deleteInfluencer = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet influenceur ?')) {
    try {
      await influencerStore.deleteInfluencer(id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.filters h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
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
  font-size: 0.9rem;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.influencers-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.influencers-list h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #dc3545;
}

.influencers-table {
  width: 100%;
  border-collapse: collapse;
}

.influencers-table th,
.influencers-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.influencers-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #2c3e50;
}

.influencer-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group select,
  .filter-group input {
    min-width: auto;
  }
  
  .influencers-table {
    display: block;
    overflow-x: auto;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>