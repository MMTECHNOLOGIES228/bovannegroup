<template>
  <div class="influencer-profile">
    <div v-if="loading" class="loading">
      Chargement du profil...
    </div>
    
    <div v-else-if="error" class="error">
      Erreur: {{ error }}
    </div>
    
    <div v-else-if="influencer" class="profile-content">
      <div class="profile-header">
        <div class="profile-image">
          <img :src="influencer.profileImage || '/default-avatar.png'" :alt="influencer.name">
        </div>
        
        <div class="profile-info">
          <h1>{{ influencer.name }}</h1>
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
          
          <div class="contact-info">
            <p v-if="influencer.email">📧 {{ influencer.email }}</p>
            <p v-if="influencer.phone">📞 {{ influencer.phone }}</p>
          </div>
        </div>
      </div>
      
      <div class="profile-details">
        <div class="bio-section">
          <h2>À propos</h2>
          <p>{{ influencer.bio }}</p>
        </div>
        
        <div class="social-section" v-if="hasSocialLinks">
          <h2>Réseaux sociaux</h2>
          <div class="social-links">
            <a 
              v-if="influencer.socialMedia.instagram" 
              :href="influencer.socialMedia.instagram" 
              target="_blank" 
              class="social-link"
            >
              📷 Instagram
            </a>
            <a 
              v-if="influencer.socialMedia.twitter" 
              :href="influencer.socialMedia.twitter" 
              target="_blank" 
              class="social-link"
            >
              🐦 Twitter
            </a>
            <a 
              v-if="influencer.socialMedia.facebook" 
              :href="influencer.socialMedia.facebook" 
              target="_blank" 
              class="social-link"
            >
              📘 Facebook
            </a>
            <a 
              v-if="influencer.socialMedia.youtube" 
              :href="influencer.socialMedia.youtube" 
              target="_blank" 
              class="social-link"
            >
              📹 YouTube
            </a>
            <a 
              v-if="influencer.socialMedia.tiktok" 
              :href="influencer.socialMedia.tiktok" 
              target="_blank" 
              class="social-link"
            >
              📱 TikTok
            </a>
          </div>
        </div>
      </div>
      
      <div class="back-link">
        <router-link to="/" class="btn">← Retour à l'accueil</router-link>
      </div>
    </div>

    <!-- Ajout d'un message si aucun influenceur n'est trouvé -->
    <div v-else class="not-found">
      <p>Influenceur non trouvé</p>
      <router-link to="/" class="btn">Retour à l'accueil</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencers' // Chemin corrigé

const route = useRoute()
const influencerStore = useInfluencerStore()

const loading = ref(false)
const error = ref('')

const influencer = computed(() => influencerStore.currentInfluencer)

const hasSocialLinks = computed(() => {
  if (!influencer.value || !influencer.value.socialMedia) return false
  const socials = influencer.value.socialMedia
  return socials.instagram || socials.twitter || socials.facebook || socials.youtube || socials.tiktok
})

onMounted(async () => {
  const influencerId = route.params.id as string
  if (influencerId) {
    loading.value = true
    try {
      await influencerStore.fetchInfluencerById(influencerId)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement du profil'
    } finally {
      loading.value = false
    }
  }
})

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
.influencer-profile {
  min-height: 70vh;
  padding: 2rem 0;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #dc3545;
}

.not-found {
  color: #6c757d;
}

.profile-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
}

.profile-image {
  flex-shrink: 0;
}

.profile-image img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-info h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.category {
  color: #7f8c8d;
  font-style: italic;
  margin: 0 0 1rem 0;
}

.stats {
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-weight: bold;
  font-size: 1.5rem;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.contact-info p {
  margin: 0.5rem 0;
  color: #34495e;
}

.profile-details {
  margin-bottom: 2rem;
}

.bio-section, .social-section {
  margin-bottom: 2rem;
}

.bio-section h2, .social-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
}

.bio-section p {
  line-height: 1.6;
  color: #34495e;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.social-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.social-link:hover {
  background: #2980b9;
}

.back-link {
  text-align: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .stats {
    justify-content: center;
  }
  
  .social-links {
    flex-direction: column;
  }
}
</style>