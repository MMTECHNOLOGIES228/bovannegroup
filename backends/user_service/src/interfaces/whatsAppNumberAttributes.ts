export interface WhatsAppNumberAttributes {
    id: string;
    utilisateurId: string; // Foreign key to InfluencerProfile
    number: string; // The WhatsApp number
    isActive: boolean; // Indicates whether the number is active
    createdAt?: Date; // Timestamp when the number was added
    updatedAt?: Date; // Timestamp when the number was updated
  }
  