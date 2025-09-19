<script lang="ts" setup>
import { ref, reactive, watch, defineEmits, defineProps } from "vue";
import api from "@/services/api";

const props = defineProps<{
  influencer?: any; // mode édition si défini
}>();
const emit = defineEmits(["submit-success", "cancel"]);

const form = reactive({
  name: "",
  email: "",
  bio: "",
  platforms: [] as string[],
  audienceSize: null as number | null,
  country: "",
  tags: [] as string[],
  socials: {
    instagram: "",
    tiktok: "",
    youtube: "",
  },
  photos: [] as string[],
  avatarFile: null as File | null,
});

const errors = reactive<{ [k: string]: string }>({});
const loading = ref(false);

// Pré-remplissage en édition
watch(
  () => props.influencer,
  (inf) => {
    if (inf) {
      form.name = inf.name || "";
      form.email = inf.email || "";
      form.bio = inf.bio || "";
      form.platforms = inf.platforms || [];
      form.audienceSize = inf.audienceSize || null;
      form.country = inf.country || "";
      form.tags = inf.tags || [];
      form.socials = { ...form.socials, ...(inf.socials || {}) };
      form.photos = inf.photos || [];
    }
  },
  { immediate: true }
);

function validate() {
  errors.name = form.name ? "" : "Nom requis";
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? "" : "Email invalide";
  errors.audienceSize =
    form.audienceSize && form.audienceSize > 0 ? "" : "Audience requise";
  return !Object.values(errors).some((e) => e);
}

async function handleSubmit() {
  if (!validate()) return;

  loading.value = true;
  try {
    let res;
    if (props.influencer?.id) {
      // édition
      res = await api.put(`/influencers/${props.influencer.id}`, {
        ...form,
        avatarFile: undefined, // upload séparé
      });
    } else {
      // création
      res = await api.post("/influencers", {
        ...form,
        avatarFile: undefined,
      });
    }

    const id = props.influencer?.id || res.data.id;

    // upload avatar si fichier choisi
    if (form.avatarFile) {
      const fd = new FormData();
      fd.append("avatar", form.avatarFile);
      await api.post(`/influencers/${id}/avatar`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    emit("submit-success", res.data);
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l’enregistrement");
  } finally {
    loading.value = false;
  }
}

function onAvatarChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    form.avatarFile = files[0];
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Nom -->
    <div>
      <label class="block font-medium">Nom *</label>
      <input v-model="form.name" type="text" class="w-full p-2 border rounded" />
      <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
    </div>

    <!-- Email -->
    <div>
      <label class="block font-medium">Email *</label>
      <input v-model="form.email" type="email" class="w-full p-2 border rounded" />
      <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
    </div>

    <!-- Bio -->
    <div>
      <label class="block font-medium">Bio</label>
      <textarea v-model="form.bio" rows="3" class="w-full p-2 border rounded"></textarea>
    </div>

    <!-- Plateformes -->
    <div>
      <label class="block font-medium">Plateformes</label>
      <select v-model="form.platforms" multiple class="w-full p-2 border rounded">
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
        <option value="youtube">YouTube</option>
      </select>
    </div>

    <!-- Audience -->
    <div>
      <label class="block font-medium">Audience (nombre de followers) *</label>
      <input
        v-model.number="form.audienceSize"
        type="number"
        min="0"
        class="w-full p-2 border rounded"
      />
      <p v-if="errors.audienceSize" class="text-red-500 text-sm">{{ errors.audienceSize }}</p>
    </div>

    <!-- Pays -->
    <div>
      <label class="block font-medium">Pays</label>
      <input v-model="form.country" type="text" class="w-full p-2 border rounded" />
    </div>

    <!-- Tags -->
    <div>
      <label class="block font-medium">Tags (séparés par virgule)</label>
      <input
        v-model="form.tags"
        @change="form.tags = (form.tags as any).split(',').map((t: string) => t.trim())"
        :value="form.tags.join(', ')"
        type="text"
        class="w-full p-2 border rounded"
      />
    </div>

    <!-- Social links -->
    <div>
      <label class="block font-medium">Réseaux sociaux</label>
      <input
        v-model="form.socials.instagram"
        type="url"
        placeholder="Instagram URL"
        class="w-full p-2 border rounded mb-2"
      />
      <input
        v-model="form.socials.tiktok"
        type="url"
        placeholder="TikTok URL"
        class="w-full p-2 border rounded mb-2"
      />
      <input
        v-model="form.socials.youtube"
        type="url"
        placeholder="YouTube URL"
        class="w-full p-2 border rounded"
      />
    </div>

    <!-- Photos -->
    <div>
      <label class="block font-medium">Photos (URLs, séparées par virgule)</label>
      <input
        v-model="form.photos"
        @change="form.photos = (form.photos as any).split(',').map((p: string) => p.trim())"
        :value="form.photos.join(', ')"
        type="text"
        class="w-full p-2 border rounded"
      />
    </div>

    <!-- Avatar -->
    <div>
      <label class="block font-medium">Avatar</label>
      <input type="file" accept="image/*" @change="onAvatarChange" />
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3">
      <button type="button" @click="emit('cancel')" class="px-4 py-2 bg-gray-300 rounded">
        Annuler
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {{ loading ? "Enregistrement..." : "Enregistrer" }}
      </button>
    </div>
  </form>
</template>
