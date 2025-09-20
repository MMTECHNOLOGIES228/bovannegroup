<template>
  <div class="form-container">
    <div class="tabs">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'basic', completed: basicInfoCompleted }"
        @click="activeTab = 'basic'"
      >
        Informations de base
        <span v-if="basicInfoCompleted" class="checkmark">✓</span>
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'social', disabled: !basicInfoCompleted }"
        :disabled="!basicInfoCompleted"
        @click="goToSocialTab"
      >
        Réseaux sociaux
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="influencer-form">
      <!-- Onglet Informations de base -->
      <div v-show="activeTab === 'basic'" class="tab-content">
        <!-- Ajout du champ role_name (caché car fixe pour les influenceurs) -->
        <input type="hidden" v-model="basicFormData.role_name" />
        
        <div class="form-row">
          <div class="form-group">
            <label for="nom">Nom *</label>
            <input
              type="text"
              id="nom"
              v-model="basicFormData.nom"
              required
              :class="{ error: errors.nom }"
              placeholder="Votre nom"
              @blur="validateField('nom')"
            />
            <span v-if="errors.nom" class="field-error">{{ errors.nom }}</span>
          </div>

          <div class="form-group">
            <label for="prenom">Prénom *</label>
            <input
              type="text"
              id="prenom"
              v-model="basicFormData.prenom"
              required
              :class="{ error: errors.prenom }"
              placeholder="Votre prénom"
              @blur="validateField('prenom')"
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
              v-model="basicFormData.email"
              required
              :class="{ error: errors.email }"
              placeholder="Votre email"
              @blur="validateField('email')"
            />
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="phone">Téléphone *</label>
            <input
              type="tel"
              id="phone"
              v-model="basicFormData.phone"
              required
              :class="{ error: errors.phone }"
              placeholder="Votre numéro"
              @blur="validateField('phone')"
            />
            <span v-if="errors.phone" class="field-error">{{ errors.phone }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe *</label>
          <input
            type="password"
            id="password"
            v-model="basicFormData.password"
            required
            :class="{ error: errors.password }"
            placeholder="Créez un mot de passe"
            @blur="validateField('password')"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="category">Catégorie *</label>
          <select
            id="category"
            v-model="basicFormData.categorie"
            required
            :class="{ error: errors.categorie }"
            @blur="validateField('categorie')"
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
            v-model="basicFormData.biographie"
            required
            :class="{ error: errors.biographie }"
            rows="4"
            placeholder="Présentez-vous et votre contenu"
            @blur="validateField('biographie')"
          ></textarea>
          <span v-if="errors.biographie" class="field-error">{{ errors.biographie }}</span>
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
            type="button"
            class="btn btn-primary"
            @click="validateAndProceed"
            :disabled="basicLoading"
          >
            {{ basicLoading ? "Enregistrement..." : "Suivant →" }}
          </button>
        </div>
      </div>

      <!-- Onglet Réseaux sociaux -->
      <div v-show="activeTab === 'social'" class="tab-content">
        <div class="success-message" v-if="basicInfoCompleted">
          ✓ Informations de base enregistrées avec succès
        </div>

        <div class="social-platforms">
          <div
            v-for="platform in socialPlatforms"
            :key="platform.key"
            class="social-platform"
          >
            <h3>{{ platform.label }}</h3>
            <div class="form-group">
              <label :for="`${platform.key}-url`">URL du profil</label>
              <input
                type="url"
                :id="`${platform.key}-url`"
                v-model="socialFormData[platform.key].url"
                :placeholder="`https://${platform.key}.com/votre-profil`"
              />
            </div>
            <div class="form-group">
              <label :for="`${platform.key}-followers`">Nombre d'abonnés</label>
              <input
                type="number"
                :id="`${platform.key}-followers`"
                v-model="socialFormData[platform.key].followers"
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="activeTab = 'basic'">
            ← Retour
          </button>

          <button type="submit" class="btn btn-primary" :disabled="socialLoading">
            {{ socialLoading ? "Enregistrement..." : "Finaliser l'inscription" }}
          </button>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";

const props = defineProps({
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

const goToSocialTab = () => {
  if (basicInfoCompleted.value) {
    activeTab.value = 'social'
  }
}

const emit = defineEmits(["submit-basic", "submit-social", "cancel"]);

const activeTab = ref("basic");
const basicLoading = ref(false);
const socialLoading = ref(false);
const basicInfoCompleted = ref(false);
const userId = ref(""); // Stockera l'ID utilisateur après l'inscription

// Liste des plateformes sociales
const socialPlatforms = [
  { key: "instagram", label: "Instagram" },
  { key: "twitter", label: "Twitter" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
];

// Données pour le formulaire de base
const basicFormData = reactive({
  role_name: "Influenceur", // Champ requis par l'API
  nom: "",
  prenom: "",
  email: "",
  phone: "",
  password: "",
  categorie: "", // Renommé pour correspondre à l'API
  biographie: "", // Renommé pour correspondre à l'API
  profileImage: null as File | null,
  status: "actif", // Ajout du champ status requis
});

// Données pour les réseaux sociaux
const socialFormData = reactive({
  instagram: { url: "", followers: 0 },
  twitter: { url: "", followers: 0 },
  facebook: { url: "", followers: 0 },
  youtube: { url: "", followers: 0 },
  tiktok: { url: "", followers: 0 },
});

// Erreurs de validation
const errors = reactive({
  nom: "",
  prenom: "",
  email: "",
  phone: "",
  password: "",
  categorie: "", // Renommé
  biographie: "", // Renommé
});

// Validation des champs
const validateField = (field: string) => {
  const value = (basicFormData as any)[field];

  switch (field) {
    case "email":
      errors.email = !value
        ? "Email requis"
        : !/^\S+@\S+\.\S+$/.test(value)
        ? "Email invalide"
        : "";
      break;
    case "phone":
      errors.phone = !value ? "Téléphone requis" : "";
      break;
    case "password":
      errors.password = !value
        ? "Mot de passe requis"
        : value.length < 6
        ? "Minimum 6 caractères"
        : "";
      break;
    default:
      errors[field as keyof typeof errors] = !value ? "Ce champ est requis" : "";
  }
};

// Validation complète du formulaire de base
const validateBasicForm = (): boolean => {
  Object.keys(basicFormData).forEach((field) => {
    if (field !== "profileImage" && field !== "role_name") {
      validateField(field);
    }
  });

  return !Object.values(errors).some((error) => error !== "");
};

// Procédure pour valider et passer à l'étape suivante
const validateAndProceed = async () => {
  if (!validateBasicForm()) {
    return;
  }

  basicLoading.value = true;
  try {
    // Émettre les données pour l'API d'inscription
    emit("submit-basic", basicFormData);

  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
  } finally {
    basicLoading.value = false;
  }
};

// Soumission des réseaux sociaux
const handleSubmit = async () => {

  socialLoading.value = true;
  try {
    // Préparer les données pour l'API des réseaux sociaux
    const socialData = {
      userId: userId.value,
      accounts: Object.entries(socialFormData)
        .filter(([_, data]) => data.url) // Filtrer les plateformes avec URL
        .map(([platform, data]) => ({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          accountUrl: data.url,
          followers: data.followers || 0,
        })),
    };

    emit("submit-social", socialData);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des réseaux sociaux:", error);
  } finally {
    socialLoading.value = false;
  }
};

// Méthode pour définir l'ID utilisateur après l'inscription réussie
const setUserId = (id: string) => {
  userId.value = id;
  basicInfoCompleted.value = true;
  activeTab.value = "social";
};

// Exposer les méthodes pour le parent
defineExpose({
  setUserId,
});
</script>

<style scoped>
/* Les styles restent les mêmes */
.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
}

.tab-button {
  position: relative;
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover:not(.disabled) {
  color: #007bff;
}

.tab-button.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.tab-button.completed {
  color: #28a745;
}

.tab-button.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkmark {
  color: #28a745;
  font-weight: bold;
}

.tab-content {
  padding: 1rem 0;
}

.influencer-form {
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

.social-platforms {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.social-platform {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.social-platform h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.error-message {
  color: #dc3545;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.success-message {
  color: #155724;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  .tabs {
    flex-direction: column;
  }

  .tab-button {
    text-align: center;
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
  }
}
</style>