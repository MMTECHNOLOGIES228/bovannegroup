<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInfluencersStore } from "@/stores/influencers";
import api from "@/services/api";

const router = useRouter();
const store = useInfluencersStore();

const search = ref("");
const platform = ref("");
const niche = ref("");
const country = ref("");
const audienceMin = ref<number | null>(null);
const audienceMax = ref<number | null>(null);

onMounted(() => {
  fetchInfluencers();
});

function fetchInfluencers() {
  const filters: any = {
    q: search.value,
    platform: platform.value || undefined,
    niche: niche.value || undefined,
    country: country.value || undefined,
    audienceMin: audienceMin.value || undefined,
    audienceMax: audienceMax.value || undefined,
  };
  store.fetchList(filters);
}

function createInfluencer() {
  router.push({ name: "admin.influencer.edit", params: { id: "new" } });
}

async function exportCSV() {
  const params: any = {
    q: search.value,
    platform: platform.value,
    niche: niche.value,
    country: country.value,
    audienceMin: audienceMin.value,
    audienceMax: audienceMax.value,
  };

  try {
    const res = await api.get("/influencers/export", {
      params,
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "influencers.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert("Erreur lors de l’export CSV");
  }
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tableau de bord - Influenceurs</h1>
      <div class="flex gap-3">
        <button @click="createInfluencer" class="px-4 py-2 bg-blue-600 text-white rounded">
          + Créer un influenceur
        </button>
        <button @click="exportCSV" class="px-4 py-2 bg-green-600 text-white rounded">
          Export CSV
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <input
        v-model="search"
        @keyup.enter="fetchInfluencers"
        type="text"
        placeholder="Rechercher..."
        class="p-2 border rounded"
      />
      <select v-model="platform" class="p-2 border rounded">
        <option value="">Plateforme</option>
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
        <option value="youtube">YouTube</option>
      </select>
      <input v-model="niche" type="text" placeholder="Niche" class="p-2 border rounded" />
      <input v-model="country" type="text" placeholder="Pays" class="p-2 border rounded" />
      <div class="flex gap-2">
        <input
          v-model.number="audienceMin"
          type="number"
          placeholder="Audience min"
          class="p-2 border rounded w-1/2"
        />
        <input
          v-model.number="audienceMax"
          type="number"
          placeholder="Audience max"
          class="p-2 border rounded w-1/2"
        />
      </div>
    </div>
    <div class="mb-6">
      <button @click="fetchInfluencers" class="px-4 py-2 bg-gray-800 text-white rounded">
        Appliquer les filtres
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 border">Avatar</th>
            <th class="p-3 border">Nom</th>
            <th class="p-3 border">Plateformes</th>
            <th class="p-3 border">Audience</th>
            <th class="p-3 border">Pays</th>
            <th class="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inf in store.list" :key="inf.id" class="hover:bg-gray-50">
            <td class="p-3 border text-center">
              <img
                :src="inf.avatar || '/default-avatar.png'"
                class="w-12 h-12 object-cover rounded-full mx-auto"
              />
            </td>
            <td class="p-3 border">{{ inf.name }}</td>
            <td class="p-3 border">
              <span v-for="(p, i) in inf.platforms || []" :key="i" class="inline-block px-2 py-1 bg-gray-200 rounded mr-1">
                {{ p }}
              </span>
            </td>
            <td class="p-3 border">{{ inf.audienceSize }}</td>
            <td class="p-3 border">{{ inf.country }}</td>
            <td class="p-3 border text-center">
              <button
                @click="router.push({ name: 'admin.influencer.edit', params: { id: inf.id } })"
                class="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Modifier
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
