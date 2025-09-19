<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();
const mobileMenuOpen = ref(false);

onMounted(async () => {
  if (auth.token) await auth.fetchUser();
});

const menuItems = [
  { name: "Accueil", action: () => router.push({ name: "home" }) },
];

const isAuthenticated = computed(() => !!auth.user);

function goLogin() { router.push({ name: "login" }); }
function goRegister() { router.push({ name: "register" }); }
function goProfile() { router.push({ name: "profile" }); }
function logout() { auth.logout(); router.push({ name: "home" }); }
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <div
              class="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-500 transition"
              @click="menuItems[0].action()"
            >
              Influencers
            </div>
          </div>

          <!-- Desktop Menu -->
          <nav class="hidden md:flex items-center space-x-6">
            <button
              v-for="item in menuItems"
              :key="item.name"
              @click="item.action()"
              class="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition"
            >
              {{ item.name }}
            </button>

            <template v-if="!isAuthenticated">
              <button @click="goRegister" class="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition">
                S'inscrire
              </button>
              <button @click="goLogin" class="text-blue-600 hover:text-blue-700 px-3 py-2 font-medium transition">
                Connexion
              </button>
            </template>

            <template v-else>
              <!-- User dropdown -->
              <div class="relative">
                <button class="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none" @click="mobileMenuOpen = !mobileMenuOpen">
                  <span class="mr-2">{{ auth.user.name }}</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  v-if="mobileMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <button @click="goProfile" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition">
                    Profil
                  </button>
                  <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 transition">
                    Déconnexion
                  </button>
                </div>
              </div>
            </template>
          </nav>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-2 rounded-md hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="!mobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white shadow-inner">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.name + '-mobile'"
            @click="item.action(); mobileMenuOpen=false"
            class="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
          >
            {{ item.name }}
          </button>

          <template v-if="!isAuthenticated">
            <button @click="goRegister; mobileMenuOpen=false" class="block w-full text-left px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium transition">
              S'inscrire
            </button>
            <button @click="goLogin; mobileMenuOpen=false" class="block w-full text-left px-3 py-2 rounded-md text-blue-600 hover:text-blue-700 font-medium transition">
              Connexion
            </button>
          </template>

          <template v-else>
            <button @click="goProfile; mobileMenuOpen=false" class="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">
              Profil
            </button>
            <button @click="logout; mobileMenuOpen=false" class="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition">
              Déconnexion
            </button>
          </template>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 text-gray-600 text-center p-6 border-t mt-6">
      &copy; {{ new Date().getFullYear() }} Influencers Platform. Tous droits réservés.
    </footer>
  </div>
</template>

<style scoped>
button { outline: none; }
</style>
