<template>
  <form @submit.prevent="handleSubmit" class="influencer-form">
    <div class="form-row">
      <div class="form-group">
        <label for="name">Nom complet *</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          placeholder="Nom de l'influenceur"
        >
      </div>
      
      <div class="form-group">
        <label for="category">Catégorie *</label>
        <select id="category" v-model="formData.category" required>
          <option value="">Sélectionnez une catégorie</option>
          <option value="Mode">Mode</option>
          <option value="Beauté">Beauté</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Voyage">Voyage</option>
          <option value="Gastronomie">Gastronomie</option>
          <option value="Fitness">Fitness</option>
          <option value="Technologie">Technologie</option>
          <option value="Gaming">Gaming</option>
          <option value="Autre">Autre</option>
        </select>
      </div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="email">Email *</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          placeholder="Email de contact"
        >
      </div>
      
      <div class="form-group">
        <label for="phone">Téléphone</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          placeholder="Numéro de téléphone"
        >
      </div>
    </div>
    
    <div class="form-group">
      <label for="bio">Biographie *</label>
      <textarea
        id="bio"
        v-model="formData.bio"
        required
        rows="4"
        placeholder="Description de l'influenceur et de son contenu"
      ></textarea>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="followers">Nombre d'abonnés *</label>
        <input
          type="number"
          id="followers"
          v-model="formData.followers"
          required
          min="0"
          placeholder="0"
        >
      </div>
      
      <div class="form-group">
        <label for="engagementRate">Taux d'engagement (%) *</label>
        <input
          type="number"
          id="engagementRate"
          v-model="formData.engagementRate"
          required
          min="0"
          max="100"
          step="0.01"
          placeholder="0.00"
        >
      </div>
    </div>
    
    <div class="form-group">
      <label for="profileImage">URL de l'image de profil</label>
      <input
        type="url"
        id="profileImage"
        v-model="formData.profileImage"
        placeholder="https://example.com/image.jpg"
      >
    </div>
    
    <div class="form-group">
      <label>Réseaux sociaux</label>
      <div class="social-inputs">
        <div class="social-input">
          <span class="social-icon">📷</span>
          <input
            type="url"
            v-model="formData.socialMedia.instagram"
            placeholder="Lien Instagram"
          >
        </div>
        <div class="social-input">
          <span class="social-icon">🐦</span>
          <input
            type="url"
            v-model="formData.socialMedia.twitter"
            placeholder="Lien Twitter"
          >
        </div>
        <div class="social-input">
          <span class="social-icon">📘</span>
          <input
            type="url"
            v-model="formData.socialMedia.facebook"
            placeholder="Lien Facebook"
          >
        </div>
        <div class="social-input">
          <span class="social-icon">📹</span>
          <input
            type="url"
            v-model="formData.socialMedia.youtube"
            placeholder="Lien YouTube"
          >
        </div>
        <div class="social-input">
          <span class="social-icon">📱</span>
          <input
            type="url"
            v-model="formData.socialMedia.tiktok"
            placeholder="Lien TikTok"
          >
        </div>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div class="form-actions">
      <button 
        type="button" 
        class="btn btn-secondary" 
        @click="$emit('cancel')"
        v-if="showCancel"
      >
        Annuler
      </button>
      <button 
        type="submit" 
        class="btn"
        :disabled="loading"
      >
        {{ loading ? 'Enregistrement...' : submitText }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
  influencer: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  showCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const defaultFormData = {
  name: '',
  category: '',
  email: '',
  phone: '',
  bio: '',
  followers: 0,
  engagementRate: 0,
  profileImage: '',
  socialMedia: {
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: '',
    tiktok: ''
  }
}

const formData = ref({ ...defaultFormData })

// Mettre à jour le formulaire quand l'influenceur change
watch(() => props.influencer, (newInfluencer) => {
  if (newInfluencer) {
    formData.value = { ...defaultFormData, ...newInfluencer }
    // S'assurer que socialMedia est bien un objet
    if (newInfluencer.socialMedia) {
      formData.value.socialMedia = { ...defaultFormData.socialMedia, ...newInfluencer.socialMedia }
    }
  } else {
    formData.value = { ...defaultFormData }
  }
}, { immediate: true })

const submitText = computed(() => {
  return props.influencer ? 'Mettre à jour' : 'Créer l\'influenceur'
})

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>

<style scoped>
.influencer-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.social-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-input {
  display: flex;
  align-items: center;
}

.social-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
  width: 30px;
  text-align: center;
}

.social-input input {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.error-message {
  color: #dc3545;
  margin: 1rem 0;
  padding: 0.5rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>