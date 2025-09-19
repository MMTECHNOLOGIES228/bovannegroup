import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { ProfileAttributes } from '../interfaces/profileAttributes';

export interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id'> { }


export default (sequelize: Sequelize) => {
    class Profile extends Model<ProfileAttributes, ProfileCreationAttributes>
        implements ProfileAttributes {
        public bio!: string | null;
        public id!: string;
        public utilisateurId!: string;
        public address!: string | null;
        public city!: string | null;
        public postalCode!: string | null;
        public cashbackPoints!: number;

        // timestamps
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    Profile.init({
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
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cashbackPoints: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Profile',
    });

    return Profile;
};
