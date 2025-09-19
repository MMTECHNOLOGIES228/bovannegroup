'use strict';
import { Model, DataTypes, Sequelize, Optional, ModelAttributes } from 'sequelize';
import { PermissionAttributes } from '../interfaces/permissionAttributes'; // Assuming PermissionAttributes interface is defined in a separate file
import { InvitationAttributes } from '../interfaces/invitationAttributes';

export interface InvitationCreationAttributes extends Optional<InvitationAttributes, 'id'> { }

export default (sequelize: Sequelize) => {
    class Invitation extends Model<InvitationAttributes, InvitationCreationAttributes> implements InvitationAttributes {

        public id!: string;
        public inviterId!: string;
        public invitedId!: string;
        // timestamps!
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    };

    Invitation.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            inviterId: DataTypes.STRING,
            invitedId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Invitation',
        });

    return Invitation;
};
