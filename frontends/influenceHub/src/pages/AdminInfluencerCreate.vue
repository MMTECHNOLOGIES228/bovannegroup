<template>
  <div class="admin-influencer-create">
    <div class="page-header">
      <h1>Créer un nouvel influenceur</h1>
      <router-link to="/admin" class="btn btn-secondary">← Retour au dashboard</router-link>
    </div>
    
    <div class="create-form">
      <InfluencerForm
        ref="influencerForm"
        :loading="loading"
        :error="error"
        :show-cancel="true"
        @submit-basic="handleBasicSubmit"
        @submit-social="handleSocialSubmit"
        @submit-profile="handleProfileSubmit"
        @cancel="$router.push('/admin')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencers'
import InfluencerForm from '@/components/Auth/InfluencerForm.vue'

const router = useRouter()
const influencerStore = useInfluencerStore()
const influencerForm = ref<InstanceType<typeof InfluencerForm> | null>(null)

const loading = ref(false)
const error = ref('')
const currentUserId = ref<string>('')

// Gestion de la soumission des informations de base
const handleBasicSubmit = async (formData: any) => {
  loading.value = true
  error.value = ''
  
  try {
    // Créer l'utilisateur et passer à l'étape suivante
    const response = await influencerStore.createInfluencer(formData)
    currentUserId.value = response.id
    
    // Informer le formulaire que l'étape de base est complétée
    if (influencerForm.value) {
      influencerForm.value.setUserId(response.id)
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

// Gestion de la soumission des réseaux sociaux
const handleSocialSubmit = async (socialData: any) => {
  loading.value = true
  error.value = ''
  
  try {
    if (currentUserId.value) {
      await influencerStore.updateSocialAccounts(currentUserId.value, socialData.accounts)
      
      // Informer le formulaire que l'étape sociale est complétée
      if (influencerForm.value) {
        influencerForm.value.setSocialCompleted()
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la sauvegarde des réseaux sociaux'
  } finally {
    loading.value = false
  }
}

// Gestion de la soumission de la photo de profil
const handleProfileSubmit = async (profileData: any) => {
  loading.value = true
  error.value = ''
  
  try {
    if (currentUserId.value && profileData.profileImage) {
      const formData = new FormData()
      formData.append('profilePic', profileData.profileImage)
      
      await influencerStore.uploadProfileImage(formData)
      router.push('/admin')
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'upload de l\'image'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-influencer-create {
  padding: 2rem 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>