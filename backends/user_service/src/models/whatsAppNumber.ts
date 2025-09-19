import { Model, DataTypes, Sequelize } from 'sequelize';
import { WhatsAppNumberAttributes } from '../interfaces/whatsAppNumberAttributes';

export interface WhatsAppNumberCreationAttributes extends Partial<WhatsAppNumberAttributes> { }

export default (sequelize: Sequelize) => {
  class WhatsAppNumber extends Model<WhatsAppNumberAttributes, WhatsAppNumberCreationAttributes>
    implements WhatsAppNumberAttributes {
    public id!: string;
    public utilisateurId!: string;
    public number!: string;
    public isActive!: boolean;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WhatsAppNumber.init({
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
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'WhatsAppNumber',
  });

  return WhatsAppNumber;
};
