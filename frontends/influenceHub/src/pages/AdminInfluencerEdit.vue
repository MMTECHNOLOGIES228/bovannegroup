<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInfluencersStore } from "@/stores/influencers";
import InfluencerForm from "@/components/InfluencerForm.vue";

const route = useRoute();
const router = useRouter();
const store = useInfluencersStore();

const influencer = ref<any>(null);
const loading = ref(true);
const isNew = route.params.id === "new";

onMounted(async () => {
  if (!isNew) {
    loading.value = true;
    try {
      influencer.value = await store.fetchOne(route.params.id as string);
    } catch (err) {
      alert("Influenceur introuvable");
      router.push({ name: "admin" });
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
});

function handleSuccess(savedInfluencer: any) {
  alert("Influenceur enregistré avec succès !");
  router.push({ name: "admin" });
}

function handleCancel() {
  router.push({ name: "admin" });
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      {{ isNew ? "Créer un influenceur" : "Modifier l’influenceur" }}
    </h1>

    <div v-if="loading">Chargement...</div>

    <div v-else>
      <InfluencerForm
        :influencer="influencer"
        @submit-success="handleSuccess"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>
