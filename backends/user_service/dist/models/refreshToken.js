'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    class RefreshToken extends sequelize_1.Model {
    }
    RefreshToken.init({
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
        token: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        expires: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'RefreshToken',
    });
    return RefreshToken;
};
