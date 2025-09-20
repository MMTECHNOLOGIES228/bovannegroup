<template>
  <div class="admin-layout">
    <header>
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <router-link to="/admin" class="logo">InfluenceHub Admin</router-link>
          </div>
          <div class="navbar-menu">
            <router-link to="/admin" class="nav-link">Dashboard</router-link>
            <button @click="handleLogout" class="btn btn-danger">Déconnexion</button>
          </div>
        </div>
      </nav>
    </header>
    
    <main>
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.navbar {
  background-color: #343a40;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}
</style>