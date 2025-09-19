'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    class RolePermission extends sequelize_1.Model {
    }
    ;
    RolePermission.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        roleId: sequelize_1.DataTypes.STRING,
        permId: sequelize_1.DataTypes.STRING
    }, {
        sequelize,
        modelName: 'RolePermission',
    });
    return RolePermission;
};
