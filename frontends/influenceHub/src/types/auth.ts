// types/auth.ts
export interface LoginCredentials {
  login: string;
  password: string;
}

export interface User {
  socialMediaAccounts: any;
  id: string;
  roleId: string;
  email: string | null;
  phone: string | null;
  nom: string | null;
  prenom: string | null;
  profilePic: string | null;
  status: 'actif' | 'inactif';
  categorie: string | null;
  biographie: string | null;
  role: string; // Le nom du rôle (ex: "Admin", "Influenceur")
  permissions?: string[];
}

export interface LoginResponse {
  message: string;
  data: User;
  token: string;
  refreshToken: string;
  role: string;
  permissions: string[];
}

export interface SignupResponse {
  message: string;
  data: User;
  mode: 'simple' | 'complet';
}

export interface VerifyResponse {
  user: User;
}