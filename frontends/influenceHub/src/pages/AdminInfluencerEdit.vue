<template>
  <div class="admin-influencer-edit">
    <div class="page-header">
      <h1>{{ isEditing ? 'Modifier l\'influenceur' : 'Créer un nouvel influenceur' }}</h1>
      <router-link to="/admin" class="btn btn-secondary">← Retour au dashboard</router-link>
    </div>
    
    <div class="edit-form">
      <InfluencerForm
        :influencer="currentInfluencer"
        :loading="loading"
        :error="error"
        :show-cancel="true"
        @submit="handleSubmit"
        @cancel="$router.push('/admin')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencers'
import InfluencerForm from '@/components/Auth/InfluencerForm.vue' // Chemin corrigé

const route = useRoute()
const router = useRouter()
const influencerStore = useInfluencerStore()

const loading = ref(false)
const error = ref('')

const influencerId = computed(() => route.params.id as string)
const isEditing = computed(() => {
  // Vérifier si nous sommes en mode édition (ID existe et n'est pas "new")
  return influencerId.value && influencerId.value !== 'new'
})

const currentInfluencer = computed(() => {
  if (isEditing.value && influencerStore.currentInfluencer) {
    return influencerStore.currentInfluencer
  }
  return null
})

// Charger l'influenceur si on est en mode édition
onMounted(async () => {
  if (isEditing.value && influencerId.value) {
    loading.value = true
    try {
      await influencerStore.fetchInfluencerById(influencerId.value)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }
})

// Recharger quand l'ID change
watch(influencerId, async (newId) => {
  if (newId && newId !== 'new') {
    loading.value = true
    try {
      await influencerStore.fetchInfluencerById(newId)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async (formData: any) => {
  loading.value = true
  error.value = ''
  
  try {
    if (isEditing.value) {
      await influencerStore.updateInfluencer(influencerId.value, formData)
    } else {
      await influencerStore.createInfluencer(formData)
    }
    router.push('/admin')
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la sauvegarde'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-influencer-edit {
  padding: 2rem 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.edit-form {
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