<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInfluencersStore } from "@/stores/influencers";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const store = useInfluencersStore();
const auth = useAuthStore();

const influencer = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  influencer.value = await store.fetchOne(route.params.id as string);
  loading.value = false;
});

const canEdit = computed(() => {
  if (!auth.isAuthenticated) return false;
  if (auth.isAdmin) return true;
  return influencer.value && auth.user?.id === influencer.value.id;
});

function goToEdit() {
  router.push({ name: "admin.influencer.edit", params: { id: influencer.value.id } });
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="loading">Chargement du profil...</div>

    <div v-else-if="influencer" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-6">
        <img
          :src="influencer.avatar || '/default-avatar.png'"
          alt="avatar"
          class="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h1 class="text-2xl font-bold">{{ influencer.name }}</h1>
          <p class="text-gray-600">{{ influencer.bio }}</p>
          <p class="text-sm text-gray-500">Pays : {{ influencer.country }}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="p-4 bg-gray-100 rounded">
          <p class="text-lg font-bold">{{ influencer.stats?.followers ?? 0 }}</p>
          <p class="text-sm text-gray-600">Followers</p>
        </div>
        <div class="p-4 bg-gray-100 rounded">
          <p class="text-lg font-bold">{{ influencer.stats?.posts ?? 0 }}</p>
          <p class="text-sm text-gray-600">Posts</p>
        </div>
        <div class="p-4 bg-gray-100 rounded">
          <p class="text-lg font-bold">{{ influencer.stats?.engagementRate ?? 0 }}%</p>
          <p class="text-sm text-gray-600">Engagement</p>
        </div>
      </div>

      <!-- Réseaux sociaux -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Réseaux sociaux</h2>
        <ul class="space-y-1">
          <li v-for="(link, key) in influencer.socials" :key="key">
            <a :href="link" target="_blank" class="text-blue-600 hover:underline">
              {{ key }} : {{ link }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Portfolio -->
      <div>
        <h2 class="text-xl font-semibold mb-2">Portfolio</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(item, i) in influencer.portfolio || []"
            :key="i"
            class="border rounded overflow-hidden"
          >
            <img v-if="item.type === 'image'" :src="item.url" class="w-full h-40 object-cover" />
            <video v-else controls class="w-full h-40 object-cover">
              <source :src="item.url" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      <!-- Bouton Modifier -->
      <div v-if="canEdit" class="text-right">
        <button
          @click="goToEdit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Modifier le profil
        </button>
      </div>
    </div>

    <div v-else>
      <p>Profil introuvable.</p>
    </div>
  </div>
</template>
