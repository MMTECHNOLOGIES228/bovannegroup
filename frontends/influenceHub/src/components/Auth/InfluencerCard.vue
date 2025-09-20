<template>
  <div class="influencer-card">
    <div class="card-image">
      <img :src="influencer.profilePic || '/default-avatar.png'" :alt="influencerName">
    </div>
    
    <div class="card-content">
      <h3>{{ influencerName }}</h3>
      <p class="category">{{ influencer.categorie || 'Non spécifié' }}</p>
      
      <div class="stats">
        <div class="stat">
          <span class="stat-value">{{ totalFollowers }}</span>
          <span class="stat-label">Abonnés</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ platformCount }}</span>
          <span class="stat-label">Plateformes</span>
        </div>
      </div>
      
      <p class="bio">{{ truncateText(influencer.biographie, 100) }}</p>
      
      <div class="social-platforms" v-if="hasSocialAccounts">
        <span class="platform-tag" v-for="account in limitedAccounts" :key="account.id">
          {{ account.platform }}
        </span>
        <span v-if="influencer.socialMediaAccounts.length > 3" class="platform-more">
          +{{ influencer.socialMediaAccounts.length - 3 }} autres
        </span>
      </div>
      
      <div class="card-actions">
        <router-link 
          :to="'/profile/' + influencer.id" 
          class="btn"
        >
          Voir le profil
        </router-link>
        
        <!-- <router-link 
          v-if="isAdmin"
          :to="'/admin/influencer/' + influencer.id + '/edit'" 
          class="btn"
        >
          Modifier
        </router-link> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  influencer: {
    type: Object,
    required: true
  }
})

// Computed properties pour adapter aux données de l'API
const influencerName = computed(() => {
  return props.influencer.nom && props.influencer.prenom 
    ? `${props.influencer.prenom} ${props.influencer.nom}`
    : props.influencer.nom || props.influencer.prenom || 'Influenceur'
})

const totalFollowers = computed(() => {
  if (!props.influencer.socialMediaAccounts) return '0'
  const total = props.influencer.socialMediaAccounts.reduce((sum: number, account: any) => sum + (account.followers || 0), 0)
  return formatNumber(total)
})

const platformCount = computed(() => {
  return props.influencer.socialMediaAccounts?.length || 0
})

const hasSocialAccounts = computed(() => {
  return props.influencer.socialMediaAccounts?.length > 0
})

const limitedAccounts = computed(() => {
  return props.influencer.socialMediaAccounts?.slice(0, 3) || []
})

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const truncateText = (text: string, maxLength: number) => {
  if (!text) return 'Aucune description'
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
  height: 100%;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.category {
  color: #7f8c8d;
  margin: 0 0 1rem 0;
  font-style: italic;
  font-size: 0.9rem;
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
  flex: 1;
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
  display: block;
}

.bio {
  color: #34495e;
  line-height: 1.4;
  margin: 1rem 0;
  flex: 1;
  font-size: 0.9rem;
}

.social-platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0 1rem 0;
  align-items: center;
}

.platform-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.platform-more {
  color: #7f8c8d;
  font-size: 0.8rem;
  font-style: italic;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.card-actions .btn {
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.9rem;
  text-decoration: none;
  background-color: #667eea;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.card-actions .btn:hover {
  background-color: #5a67d8;
}

/* Responsive */
@media (max-width: 480px) {
  .card-content {
    padding: 1rem;
  }
  
  .stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .card-actions {
    flex-direction: column;
  }
}
</style>