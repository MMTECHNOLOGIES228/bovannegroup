<template>
  <div class="register-page">
    <div class="container">
      <div class="register-form">
        <h2>Devenir influenceur sur notre plateforme</h2>
        <p>Remplissez le formulaire ci-dessous pour rejoindre notre communauté d'influenceurs</p>
        
        <InfluencerForm
          ref="influencerFormRef"
          :loading="loading"
          :error="error"
          :show-cancel="true"
          @submit-basic="handleBasicSubmit"
          @submit-social="handleSocialSubmit"
          @submit-profile="handleProfileSubmit"
          @cancel="handleCancel"
        />
        
        <div v-if="success" class="success-message">
          Votre inscription a été envoyée avec succès ! Notre équipe la validera sous peu.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInfluencerStore } from '@/stores/influencers'
import InfluencerForm from '@/components/Auth/InfluencerForm.vue'
import router from '@/router'

const influencerStore = useInfluencerStore()
const influencerFormRef = ref<InstanceType<typeof InfluencerForm> | null>(null)

const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleBasicSubmit = async (basicData: any) => {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    console.log('Enregistrement des informations de base...', basicData)
    const result = await influencerStore.createInfluencer(basicData)

    console.log('Informations de base enregistrées avec succès!')
    
    // Passer l'ID utilisateur au formulaire pour les étapes suivantes
    if (influencerFormRef.value) {
      influencerFormRef.value.setUserId(result.data.id)
    }
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'enregistrement des informations de base'
  } finally {
    loading.value = false
  }
}

const handleSocialSubmit = async (socialData: any) => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Enregistrement des réseaux sociaux...', socialData)
    await influencerStore.createSocialAccounts(socialData.accounts)
    
    // Indiquer que les réseaux sociaux sont enregistrés pour passer à l'étape suivante
    if (influencerFormRef.value) {
      influencerFormRef.value.setSocialCompleted()
    }
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'enregistrement des réseaux sociaux'
  } finally {
    loading.value = false
  }
}

const handleProfileSubmit = async (profileData: any) => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Enregistrement de la photo de profil...', profileData)
    
    // Créer un FormData pour l'upload du fichier - CORRECT FIELD NAME
    const formData = new FormData()
    formData.append('profilePic', profileData.profileImage) // Changé de 'profileImage' à 'profilePic'
    
    // Le userId n'est pas nécessaire dans le FormData car il est dans le token JWT
    // formData.append('userId', profileData.userId) ← À SUPPRIMER
    
    await influencerStore.uploadProfileImage(formData)
    
    success.value = true
    
    setTimeout(() => {
      router.push('/profile')
    }, 2000)
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'enregistrement de la photo de profil'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  console.log('Formulaire annulé')
  router.push('/')
}
</script>

<style scoped>
.register-page {
  padding: 2rem 0;
  min-height: 70vh;
}

.register-form {
  max-width: 800px;
  margin: 0 auto;
}

.register-form h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.register-form > p {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
}
</style>