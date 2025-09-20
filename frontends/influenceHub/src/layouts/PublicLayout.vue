<template>
  <div class="public-layout">
    <header>
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <router-link to="/" class="logo">InfluenceHub</router-link>
          </div>
          <div class="navbar-menu">
            <router-link to="/" class="nav-link">Accueil</router-link>
            <router-link to="/register" class="nav-link">Devenir influenceur</router-link>
            <router-link to="/login" class="nav-link">Admin</router-link>
          </div>
        </div>
      </nav>
    </header>
    
    <main>
      <router-view></router-view>
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>&copy; 20 InfluenceHub. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Layout public pour les pages accessibles sans authentification
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
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
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.footer {
  background-color: #f8f9fa;
  padding: 2rem 0;
  text-align: center;
  margin-top: 3rem;
}
</style>