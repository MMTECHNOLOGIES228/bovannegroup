export interface UtilisateurAttributes {
  id: String;
  roleId: String;
  email: String;
  password: String;
  nom: String;
  prenom: String;
  phone: String;
  profilePic: String | null;
  status: 'actif' | 'inactif';
  categorie: String;
  biographie: String;
  }