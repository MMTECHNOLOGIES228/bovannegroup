<template>
  <div class="influencer-card">
    <div class="card-image">
      <img :src="influencer.profileImage || '/default-avatar.png'" :alt="influencer.name">
    </div>
    
    <div class="card-content">
      <h3>{{ influencer.name }}</h3>
      <p class="category">{{ influencer.category }}</p>
      
      <div class="stats">
        <div class="stat">
          <span class="stat-value">{{ formatNumber(influencer.followers) }}</span>
          <span class="stat-label">Abonnés</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ influencer.engagementRate }}%</span>
          <span class="stat-label">Taux d'engagement</span>
        </div>
      </div>
      
      <p class="bio">{{ truncateText(influencer.bio, 100) }}</p>
      
      <div class="card-actions">
        <router-link 
          :to="'/profile/' + influencer._id" 
          class="btn"
        >
          Voir le profil
        </router-link>
        
        <router-link 
          v-if="isAdmin"
          :to="'/admin/influencer/' + influencer._id" 
          class="btn"
        >
          Modifier
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  influencer: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAuthenticated)

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.influencer-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.influencer-card:hover {
  transform: translateY(-5px);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.category {
  color: #7f8c8d;
  margin: 0 0 1rem 0;
  font-style: italic;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
  padding: 1rem 0;
  border-top: 1px solid #ecf0f1;
  border-bottom: 1px solid #ecf0f1;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.bio {
  color: #34495e;
  line-height: 1.5;
  margin: 1rem 0;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.card-actions .btn {
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.9rem;
}
</style>