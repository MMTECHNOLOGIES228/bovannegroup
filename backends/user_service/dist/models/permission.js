'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    class Permission extends sequelize_1.Model {
    }
    ;
    Permission.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        perm_name: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        perm_description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Permission',
    });
    return Permission;
};
