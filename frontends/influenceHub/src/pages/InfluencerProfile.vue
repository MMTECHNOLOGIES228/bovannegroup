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
          <img :src="influencer.profilePic || '/default-avatar.png'" :alt="influencerName">
        </div>
        
        <div class="profile-info">
          <h1>{{ influencerName }}</h1>
          <p class="category">{{ influencer.categorie || 'Non spécifié' }}</p>
          
          <div class="stats">
            <div class="stat">
              <span class="stat-value">{{ totalFollowers }}</span>
              <span class="stat-label">Abonnés totaux</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ influencer.socialMediaAccounts?.length || 0 }}</span>
              <span class="stat-label">Plateformes</span>
            </div>
          </div>
          
          <div class="contact-info">
            <p v-if="influencer.email">📧 {{ influencer.email }}</p>
            <p v-if="influencer.phone">📞 {{ influencer.phone }}</p>
          </div>
        </div>
      </div>
      
      <div class="profile-details">
        <div class="bio-section" v-if="influencer.biographie">
          <h2>À propos</h2>
          <p>{{ influencer.biographie }}</p>
        </div>
        
        <div class="social-section" v-if="hasSocialAccounts">
          <h2>Réseaux sociaux</h2>
          <div class="social-platforms">
            <div v-for="account in influencer.socialMediaAccounts" :key="account.id" class="social-account">
              <h3>{{ account.platform }}</h3>
              <div class="account-details">
                <a :href="account.accountUrl" target="_blank" class="account-link">
                  {{ formatUrl(account.accountUrl) }}
                </a>
                <p class="followers">{{ formatNumber(account.followers) }} abonnés</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-social-accounts">
          <p>Cet influenceur n'a pas encore de comptes de médias sociaux associés.</p>
        </div>
      </div>
      
      <div class="back-link">
        <router-link to="/" class="btn">← Retour à l'accueil</router-link>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Influenceur non trouvé</p>
      <router-link to="/" class="btn">Retour à l'accueil</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInfluencerStore } from '@/stores/influencers'

const influencerStore = useInfluencerStore()
const loading = ref(false)
const error = ref('')

const influencer = computed(() => influencerStore.currentInfluencer)

onMounted(async () => {
  loading.value = true
  try {
    await influencerStore.fetchInfluencerByMe()
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement du profil'
  } finally {
    loading.value = false
  }
})

// Computed properties adaptées
const influencerName = computed(() => {
  if (!influencer.value) return 'Influenceur'
  return `${influencer.value.prenom} ${influencer.value.nom}`
})

const totalFollowers = computed(() => {
  if (!influencer.value || !influencer.value.socialMediaAccounts) return 0
  return influencer.value.socialMediaAccounts.reduce((total, account) => {
    return total + (account.followers || 0)
  }, 0)
})

const hasSocialAccounts = computed(() => {
  return influencer.value?.socialMediaAccounts?.length! > 0
})

// Méthodes utilitaires
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname + urlObj.pathname
  } catch (e) {
    return url
  }
}
</script>

<style scoped>
.influencer-profile {
  min-height: 70vh;
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
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
  flex-wrap: wrap;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  font-size: 2rem;
}

.category {
  color: #7f8c8d;
  font-style: italic;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.stats {
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
}

.stat {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 120px;
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
  font-size: 1rem;
}

.profile-details {
  margin-bottom: 2rem;
}

.bio-section, .social-section, .no-social-accounts {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  font-size: 1.1rem;
}

.social-platforms {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-account {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.social-account h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.account-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.account-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.account-link:hover {
  text-decoration: underline;
}

.followers {
  color: #6c757d;
  font-weight: 500;
  margin: 0;
}

.no-social-accounts {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.back-link {
  text-align: center;
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .stats {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .stat {
    min-width: 100px;
  }
  
  .account-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>