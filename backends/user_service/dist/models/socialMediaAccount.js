"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    class SocialMediaAccount extends sequelize_1.Model {
    }
    SocialMediaAccount.init({
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
        platform: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        accountUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        followers: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'SocialMediaAccount',
    });
    return SocialMediaAccount;
};
