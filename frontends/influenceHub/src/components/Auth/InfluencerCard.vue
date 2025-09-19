<template>
  <div class="border rounded p-3">
    <img :src="influencer.avatar || '/default-avatar.png'" class="w-full h-48 object-cover rounded" />
    <h3 class="font-bold mt-2">{{ influencer.name }}</h3>
    <p class="text-sm">{{ influencer.bio }}</p>
    <div class="mt-2">
      <router-link :to="{ name: 'influencer.profile', params: { id: influencer.id } }" class="text-blue-600">Voir profil</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ influencer: any }>();
</script>
