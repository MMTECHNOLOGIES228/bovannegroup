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
        :class="{ active: activeTab === 'social', completed: socialInfoCompleted, disabled: !basicInfoCompleted }"
        :disabled="!basicInfoCompleted"
        @click="goToSocialTab"
      >
        Réseaux sociaux
        <span v-if="socialInfoCompleted" class="checkmark">✓</span>
      </button>
      <button
        class="tab-button"
        :class="{ active: activeTab === 'profile', disabled: !socialInfoCompleted }"
        :disabled="!socialInfoCompleted"
        @click="goToProfileTab"
      >
        Photo de profil
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

          <button type="button" class="btn btn-primary" @click="validateAndProceedSocial" :disabled="socialLoading">
            {{ socialLoading ? "Enregistrement..." : "Suivant →" }}
          </button>
        </div>
      </div>

      <!-- Nouvel onglet Photo de profil -->
      <div v-show="activeTab === 'profile'" class="tab-content">
        <div class="success-message" v-if="socialInfoCompleted">
          ✓ Réseaux sociaux enregistrés avec succès
        </div>

        <div class="profile-image-upload">
          <h3>Photo de profil</h3>
          <p>Ajoutez une photo pour votre profil d'influenceur</p>
          
          <div class="upload-area" 
               @click="triggerFileInput"
               @dragover.prevent="dragOver = true"
               @dragleave="dragOver = false"
               @drop="handleDrop"
               :class="{ 'drag-over': dragOver, 'has-image': profileImagePreview }">
            <div v-if="!profileImagePreview" class="upload-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#E9ECEF"/>
                <path d="M14 2V8H20M16 13H8M16 17H8M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#495057" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>Glissez-déposez votre image ici ou <span>parcourir</span></p>
              <p class="upload-hint">Formats supportés: JPG, PNG - Max 2MB</p>
            </div>
            <div v-else class="image-preview">
              <img :src="profileImagePreview" alt="Aperçu de l'image de profil" />
              <button type="button" class="remove-image" @click.stop="removeImage">×</button>
            </div>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/jpeg,image/png"
              style="display: none"
            />
          </div>

          <div v-if="uploadError" class="field-error">{{ uploadError }}</div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="activeTab = 'social'">
            ← Retour
          </button>

          <button type="submit" class="btn btn-primary" :disabled="profileLoading || !profileImage">
            {{ profileLoading ? "Enregistrement..." : "Finaliser l'inscription" }}
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

const goToProfileTab = () => {
  if (socialInfoCompleted.value) {
    activeTab.value = 'profile'
  }
}

const emit = defineEmits(["submit-basic", "submit-social", "submit-profile", "cancel"]);

const activeTab = ref("basic");
const basicLoading = ref(false);
const socialLoading = ref(false);
const profileLoading = ref(false);
const basicInfoCompleted = ref(false);
const socialInfoCompleted = ref(false);
const userId = ref(""); // Stockera l'ID utilisateur après l'inscription
const dragOver = ref(false);
const uploadError = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const profileImage = ref<File | null>(null);
const profileImagePreview = ref("");

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
    if (field !== "role_name") {
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

// Validation et passage à l'étape de profil
const validateAndProceedSocial = async () => {
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

// Gestion de l'upload d'image
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    processImage(input.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  dragOver.value = false;
  
  if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
    processImage(event.dataTransfer.files[0]);
  }
};

const processImage = (file: File) => {
  // Vérification du type de fichier
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    uploadError.value = "Seuls les fichiers JPG et PNG sont autorisés";
    return;
  }
  
  // Vérification de la taille (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = "L'image ne doit pas dépasser 2MB";
    return;
  }
  
  uploadError.value = "";
  profileImage.value = file;
  
  // Création d'un aperçu
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  profileImage.value = null;
  profileImagePreview.value = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Soumission finale avec l'image de profil
const handleSubmit = async () => {
  if (!profileImage.value) {
    uploadError.value = "Veuillez sélectionner une image de profil";
    return;
  }

  profileLoading.value = true;
  try {
    // Préparer les données pour l'API de l'image de profil
    const profileData = {
      userId: userId.value,
      profileImage: profileImage.value
    };

    emit("submit-profile", profileData);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'image:", error);
  } finally {
    profileLoading.value = false;
  }
};

// Méthode pour définir l'ID utilisateur après l'inscription réussie
const setUserId = (id: string) => {
  userId.value = id;
  basicInfoCompleted.value = true;
  activeTab.value = "social";
};

// Méthode pour indiquer que les réseaux sociaux sont enregistrés
const setSocialCompleted = () => {
  socialInfoCompleted.value = true;
  activeTab.value = "profile";
};

// Exposer les méthodes pour le parent
defineExpose({
  setUserId,
  setSocialCompleted
});
</script>

<style scoped>
/* Les styles existants restent les mêmes */
.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  justify-content: space-between;
}

.tab-button {
  position: relative;
  padding: 1rem 1.5rem;
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
  flex: 1;
  justify-content: center;
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

/* Styles pour l'upload d'image */
.profile-image-upload {
  text-align: center;
}

.profile-image-upload h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.profile-image-upload > p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.upload-area.has-image {
  border-style: solid;
  padding: 0;
  min-height: auto;
}

.upload-placeholder {
  text-align: center;
}

.upload-placeholder p {
  margin: 1rem 0 0;
  color: #6c757d;
}

.upload-placeholder p span {
  color: #007bff;
  font-weight: 500;
}

.upload-hint {
  font-size: 0.875rem;
  margin-top: 0.5rem !important;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  max-height: 300px;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image:hover {
  background: #c82333;
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