<template>
  <div class="influencer-edit-form">
    <form @submit.prevent="handleSubmit" class="edit-form">
      <div class="form-row">
        <div class="form-group">
          <label for="nom">Nom *</label>
          <input
            type="text"
            id="nom"
            v-model="formData.nom"
            required
            :class="{ error: errors.nom }"
            placeholder="Nom de l'influenceur"
          />
          <span v-if="errors.nom" class="field-error">{{ errors.nom }}</span>
        </div>

        <div class="form-group">
          <label for="prenom">Prénom *</label>
          <input
            type="text"
            id="prenom"
            v-model="formData.prenom"
            required
            :class="{ error: errors.prenom }"
            placeholder="Prénom de l'influenceur"
          />
          <span v-if="errors.prenom" class="field-error">{{ errors.prenom }}</span>
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
            :class="{ error: errors.email }"
            placeholder="Email de l'influenceur"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="phone">Téléphone *</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            required
            :class="{ error: errors.phone }"
            placeholder="Téléphone de l'influenceur"
          />
          <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="category">Catégorie *</label>
        <select
          id="category"
          v-model="formData.categorie"
          required
          :class="{ error: errors.categorie }"
        >
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
        <span v-if="errors.categorie" class="field-error">{{ errors.categorie }}</span>
      </div>

      <div class="form-group">
        <label for="bio">Biographie *</label>
        <textarea
          id="bio"
          v-model="formData.biographie"
          required
          :class="{ error: errors.biographie }"
          rows="4"
          placeholder="Biographie de l'influenceur"
        ></textarea>
        <span v-if="errors.biographie" class="field-error">{{ errors.biographie }}</span>
      </div>

      <div class="form-group">
        <label for="status">Statut *</label>
        <select
          id="status"
          v-model="formData.status"
          required
          :class="{ error: errors.status }"
        >
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
          <option value="suspendu">Suspendu</option>
        </select>
        <span v-if="errors.status" class="field-error">{{ errors.status }}</span>
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
          class="btn btn-primary"
          :disabled="loading"
        >
          {{ loading ? "Mise à jour..." : "Mettre à jour" }}
        </button>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";

const props = defineProps({
  influencer: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  showCancel: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const formData = reactive({
  nom: "",
  prenom: "",
  email: "",
  phone: "",
  categorie: "",
  biographie: "",
  status: "actif",
});

const errors = reactive({
  nom: "",
  prenom: "",
  email: "",
  phone: "",
  categorie: "",
  biographie: "",
  status: "",
});

// Pré-remplir le formulaire avec les données de l'influenceur
watch(() => props.influencer, (newInfluencer) => {
  if (newInfluencer) {
    Object.assign(formData, {
      nom: newInfluencer.nom || "",
      prenom: newInfluencer.prenom || "",
      email: newInfluencer.email || "",
      phone: newInfluencer.phone || "",
      categorie: newInfluencer.categorie || "",
      biographie: newInfluencer.biographie || "",
      status: newInfluencer.status || "actif",
    });
  }
}, { immediate: true });

const handleSubmit = () => {
  // Validation simple
  let hasErrors = false;
  
  Object.keys(formData).forEach(key => {
    if (!formData[key as keyof typeof formData] && key !== 'status') {
      errors[key as keyof typeof errors] = "Ce champ est requis";
      hasErrors = true;
    } else {
      errors[key as keyof typeof errors] = "";
    }
  });

  if (!hasErrors) {
    emit("submit", formData);
  }
};
</script>

<style scoped>
.influencer-edit-form {
  max-width: 800px;
  margin: 0 auto;
}

.edit-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #dc3545;
}

.field-error {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  color: #dc3545;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>