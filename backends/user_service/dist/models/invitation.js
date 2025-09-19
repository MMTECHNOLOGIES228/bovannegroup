'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    class Invitation extends sequelize_1.Model {
    }
    ;
    Invitation.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        inviterId: sequelize_1.DataTypes.STRING,
        invitedId: sequelize_1.DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Invitation',
    });
    return Invitation;
};
