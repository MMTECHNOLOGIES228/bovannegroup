"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    class Profile extends sequelize_1.Model {
    }
    Profile.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        utilisateurId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
        },
        address: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        postalCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        bio: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        cashbackPoints: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Profile',
    });
    return Profile;
};
