export interface SocialMediaAccountAttributes {
    id: string;
    utilisateurId: string; // Foreign key to InfluencerProfile
    platform: string; // Name of the social media platform (e.g., Instagram, Facebook)
    accountUrl: string; // URL of the social media account
    followers: number; // Number of followers on the account
    createdAt?: Date; // Timestamp when the account record was created
    updatedAt?: Date; // Timestamp when the account record was updated
  }