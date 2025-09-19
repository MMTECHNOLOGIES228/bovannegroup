import { Model, DataTypes, Sequelize } from 'sequelize';
import { SocialMediaAccountAttributes } from '../interfaces/socialMediaAccountAttributes';

export interface SocialMediaAccountCreationAttributes extends Partial<SocialMediaAccountAttributes> { }

export default (sequelize: Sequelize) => {
  class SocialMediaAccount extends Model<SocialMediaAccountAttributes, SocialMediaAccountCreationAttributes>
    implements SocialMediaAccountAttributes {
    public id!: string;
    public utilisateurId!: string;
    public platform!: string;
    public accountUrl!: string;
    public followers!: number;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SocialMediaAccount.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    utilisateurId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    followers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'SocialMediaAccount',
  });

  return SocialMediaAccount;
};
