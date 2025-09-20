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
import InfluencerForm from '@/components/Auth/InfluencerForm.vue' // Chemin corrigé
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
    // Redirection ou message de succès
    console.log('Inscription complétée avec succès!', basicData)
    const result = await influencerStore.createInfluencer(basicData)

    // Redirection ou message de succès
    console.log('Inscription complétée avec succès!')
    
    // Passer l'ID utilisateur au formulaire pour l'étape des réseaux sociaux
    if (influencerFormRef.value) {
      influencerFormRef.value.setUserId(result.data.id)
    }
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}

const handleSocialSubmit = async (socialData: any) => {
  loading.value = true
  error.value = ''
  
  try {
    await influencerStore.createSocialAccounts(socialData.accounts)
    success.value = true
    
    setTimeout(() => {
      router.push('/profile')
    }, 2000)
    
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de l\'enregistrement des réseaux sociaux'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  console.log('Formulaire annulé')
  // Réinitialiser ou rediriger
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