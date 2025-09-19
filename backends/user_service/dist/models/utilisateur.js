'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Define the Utilisateur model
exports.default = (sequelize) => {
    class Utilisateur extends sequelize_1.Model {
    }
    ;
    Utilisateur.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        roleId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        nom: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        prenom: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        profilePic: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('inactif', 'actif'),
            defaultValue: 'inactif',
            allowNull: false,
        },
        otp: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        cashbackPoints: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'Utilisateur',
    });
    // Utilisateur.beforeSave(async (utilisateur: Utilisateur, options: any) => {
    //     if (utilisateur.password) {
    //         utilisateur.password = bcrypt.hashSync(utilisateur.password, bcrypt.genSaltSync(10));
    //     }
    // });
    Utilisateur.prototype.comparePassword = function (passw, cb) {
        bcryptjs_1.default.compare(passw, this.password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    };
    return Utilisateur;
};
