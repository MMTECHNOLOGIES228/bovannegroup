<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Dashboard Administrateur</h1>
      <div class="header-actions">
        <router-link to="/admin/influencer/new" class="btn">+ Nouvel influenceur</router-link>
        <button @click="refreshData" class="btn btn-secondary" title="Actualiser les données">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-value">{{ totalUsers }}</div>
        <div class="stat-label">Utilisateurs totaux</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ influencersCount }}</div>
        <div class="stat-label">Influenceurs</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ adminsCount }}</div>
        <div class="stat-label">Administrateurs</div>
      </div>
    </div>
    
    <div class="filters">
      <h2>Filtrer les utilisateurs</h2>
      <div class="filter-controls">
        <div class="filter-group">
          <label for="admin-role">Rôle</label>
          <select id="admin-role" v-model="filters.role">
            <option value="">Tous les rôles</option>
            <option value="Influenceur">Influenceur</option>
            <option value="Admin">Administrateur</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="admin-category">Catégorie</label>
          <select id="admin-category" v-model="filters.category">
            <option value="">Toutes les catégories</option>
            <option value="Mode">Mode</option>
            <option value="Beauté">Beauté</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Voyage">Voyage</option>
            <option value="Gastronomie">Gastronomie</option>
            <option value="Fitness">Fitness</option>
            <option value="Technologie">Technologie</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="admin-status">Statut</label>
          <select id="admin-status" v-model="filters.status">
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>
        
        <button @click="applyFilters" class="btn">Filtrer</button>
        <button @click="resetFilters" class="btn btn-secondary">Réinitialiser</button>
      </div>
    </div>
    
    <div class="users-list">
      <h2>Liste des utilisateurs ({{ filteredUsers.length }})</h2>
      
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        Chargement des utilisateurs...
      </div>
      
      <div v-else-if="error" class="error">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>
        <p>Erreur: {{ error }}</p>
        <button @click="fetchUsers" class="btn btn-small">Réessayer</button>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="no-results">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
        </svg>
        <p>Aucun utilisateur trouvé.</p>
      </div>
      
      <table v-else class="users-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Rôle</th>
            <th>Catégorie</th>
            <th>Réseaux sociaux</th>
            <th>Abonnés totaux</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              <div class="user-info">
                <img 
                  :src="user.profilePic || '/default-avatar.png'" 
                  :alt="userDisplayName(user)"
                  class="avatar"
                >
                <div class="user-details">
                  <div class="user-name">{{ userDisplayName(user) }}</div>
                  <div class="user-contact">
                    <span v-if="user.email">{{ user.email }}</span>
                    <span v-if="user.email && user.phone"> • </span>
                    <span v-if="user.phone">{{ user.phone }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span class="role-badge" :class="user.role.role_name.toLowerCase()">
                {{ user.role.role_name }}
              </span>
            </td>
            <td>{{ user.categorie || 'N/A' }}</td>
            <td>
              <div class="social-accounts">
                <span v-if="user.socialMediaAccounts.length === 0">Aucun</span>
                <div v-else v-for="account in user.socialMediaAccounts" :key="account.id" class="social-account">
                  <span class="platform-tag">{{ account.platform }}</span>
                  <span class="followers-count">{{ formatNumber(account.followers) }}</span>
                </div>
              </div>
            </td>
            <td>
              {{ formatNumber(totalFollowers(user)) }}
            </td>
            <td>
              <span class="status-badge" :class="user.status">{{ user.status }}</span>
            </td>
            <td>
              <div class="actions">
                <router-link 
                  :to="'/admin/user/' + user.id" 
                  class="btn btn-small"
                  title="Modifier"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>
                </router-link>
                <button 
                  @click="toggleUserStatus(user)" 
                  class="btn btn-small"
                  :class="user.status === 'actif' ? 'btn-warning' : 'btn-success'"
                  :title="user.status === 'actif' ? 'Désactiver' : 'Activer'"
                >
                  <svg v-if="user.status === 'actif'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                  </svg>
                </button>
                <button 
                  @click="deleteUser(user.id)" 
                  class="btn btn-small btn-danger"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const filters = ref({
  role: "",
  category: "",
  status: "",
});

// Chargement initial
onMounted(() => {
  userStore.fetchUsers();
});

// Méthodes
const refreshData = () => {
  userStore.fetchUsers();
};

const applyFilters = () => {
  // Rien ici, car on utilise filteredUsers (computed)
};

const resetFilters = () => {
  filters.value = {
    role: "",
    category: "",
    status: "",
  };
};

const deleteUser = async (id: string) => {
  if (
    confirm(
      "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
    )
  ) {
    try {
      // Ici, ajoute ton appel API réel
      // await axios.delete(`http://localhost:9000/api/users/${id}`)
      userStore.removeUser(id); // MAJ locale
      await userStore.fetchUsers(); // recharge depuis l’API
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression de l'utilisateur");
    }
  }
};

const toggleUserStatus = async (user: any) => {
  const newStatus = user.status === "actif" ? "inactif" : "actif";
  if (
    confirm(
      `Êtes-vous sûr de vouloir ${
        newStatus === "actif" ? "activer" : "désactiver"
      } cet utilisateur ?`
    )
  ) {
    try {
      // Appel API pour changer le statut
      // await axios.patch(`http://localhost:9000/api/users/${user.id}`, { status: newStatus })
      user.status = newStatus;
      userStore.updateUser(user); // MAJ locale
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err);
      alert("Erreur lors du changement de statut");
    }
  }
};

// Helpers
const userDisplayName = (user: any) => {
  if (user.nom && user.prenom) return `${user.prenom} ${user.nom}`;
  if (user.prenom) return user.prenom;
  if (user.nom) return user.nom;
  return "Utilisateur sans nom";
};

const totalFollowers = (user: any) => {
  if (!user.socialMediaAccounts || user.socialMediaAccounts.length === 0)
    return 0;
  return user.socialMediaAccounts.reduce(
    (total: number, acc: any) => total + (acc.followers || 0),
    0
  );
};

const formatNumber = (num: number) => {
  if (!num) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

// Computed
const totalUsers = computed(() => userStore.users.length);
const influencersCount = computed(
  () =>
    userStore.users.filter((u) => u.role.role_name === "Influenceur").length
);
const adminsCount = computed(
  () => userStore.users.filter((u) => u.role.role_name === "Admin").length
);

const filteredUsers = computed(() => {
  return userStore.users.filter((user) => {
    if (filters.value.role && user.role.role_name !== filters.value.role)
      return false;
    if (filters.value.category && user.categorie !== filters.value.category)
      return false;
    if (filters.value.status && user.status !== filters.value.status)
      return false;
    return true;
  });
});
</script>


<style scoped>
.admin-dashboard {
  padding: 2rem 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.filters {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.filters h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 0.9rem;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.users-list {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.users-list h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading {
  color: #3498db;
}

.error {
  color: #e74c3c;
}

.no-results {
  color: #7f8c8d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #2c3e50;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
}

.user-contact {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.role-badge.admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge.influenceur {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.actif {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-badge.inactif {
  background-color: #ffebee;
  color: #d32f2f;
}

.social-accounts {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.social-account {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.platform-tag {
  background-color: #f1f8ff;
  color: #0366d6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

.followers-count {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.actions {
  display: flex;
  gap: 0.25rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.btn-success {
  background-color: #27ae60;
}

.btn-success:hover {
  background-color: #219653;
}

.btn-warning {
  background-color: #f39c12;
}

.btn-warning:hover {
  background-color: #e67e22;
}

.btn-danger {
  background-color: #e74c3c;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group select,
  .filter-group input {
    min-width: auto;
  }
  
  .users-table {
    display: block;
    overflow-x: auto;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>