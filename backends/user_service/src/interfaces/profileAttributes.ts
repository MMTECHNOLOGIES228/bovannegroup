export interface ProfileAttributes {
    id: string;
    utilisateurId: string; // Foreign key to Utilisateur
    address: string | null; // Client's address
    city: string | null; // Client's city
    postalCode: string | null; // Client's postal code
    cashbackPoints: number; // Accumulated cashback points
    bio: string | null; // Short biography of the influencer
  }
  