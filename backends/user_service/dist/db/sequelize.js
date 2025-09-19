"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
// import { DataTypes } from "sequelize";
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// 
const role_1 = __importDefault(require("../models/role"));
const permission_1 = __importDefault(require("../models/permission"));
const rolepermission_1 = __importDefault(require("../models/rolepermission"));
const utilisateur_1 = __importDefault(require("../models/utilisateur"));
const refreshToken_1 = __importDefault(require("../models/refreshToken"));
const invitation_1 = __importDefault(require("../models/invitation"));
const profile_1 = __importDefault(require("../models/profile"));
const socialMediaAccount_1 = __importDefault(require("../models/socialMediaAccount"));
const whatsAppNumber_1 = __importDefault(require("../models/whatsAppNumber"));
const ENV = process.env.NODE_ENV || 'development'; // Par défaut à 'development' si rien n'est défini
let sequelize;
switch (ENV) {
    case 'development':
        sequelize = new sequelize_typescript_1.Sequelize({
            database: process.env.DEV_DB_DATABASE,
            username: process.env.DEV_DB_USERNAME,
            password: process.env.DEV_DB_PASSWORD,
            host: process.env.DEV_DB_HOST,
            port: parseInt(process.env.DEV_DB_PORT || '3306'),
            dialect: 'postgres',
            dialectOptions: {
                timezone: "Etc/GMT-2",
            },
            logging: true,
        });
        break;
    case 'test':
        sequelize = new sequelize_typescript_1.Sequelize({
            database: process.env.TEST_DB_DATABASE,
            username: process.env.TEST_DB_USERNAME,
            password: process.env.TEST_DB_PASSWORD,
            host: process.env.TEST_DB_HOST,
            port: parseInt(process.env.TEST_DB_PORT || '3306'),
            dialect: 'postgres',
            dialectOptions: {
                timezone: "Etc/GMT-2",
            },
            logging: true,
        });
        break;
    case 'production':
        sequelize = new sequelize_typescript_1.Sequelize({
            database: process.env.PROD_DB_DATABASE,
            username: process.env.PROD_DB_USERNAME,
            password: process.env.PROD_DB_PASSWORD,
            host: process.env.PROD_DB_HOST,
            port: parseInt(process.env.PROD_DB_PORT || '3306'),
            dialect: 'postgres',
            dialectOptions: {
                timezone: "Etc/GMT-2",
            },
            logging: true,
        });
        break;
    default:
        throw new Error('Invalid environment specified');
}
const Role = (0, role_1.default)(sequelize);
const Permission = (0, permission_1.default)(sequelize);
const RolePermission = (0, rolepermission_1.default)(sequelize);
const Utilisateur = (0, utilisateur_1.default)(sequelize);
const RefreshToken = (0, refreshToken_1.default)(sequelize);
const Invitation = (0, invitation_1.default)(sequelize);
const Profile = (0, profile_1.default)(sequelize);
const SocialMediaAccount = (0, socialMediaAccount_1.default)(sequelize);
const WhatsAppNumber = (0, whatsAppNumber_1.default)(sequelize);
// // Define associations
Role.belongsToMany(Permission, { through: "RolePermission", as: "permissions", foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: "RolePermission", as: "roles", foreignKey: "permId" });
Utilisateur.belongsToMany(Utilisateur, { through: "Invitation", as: "inviter", foreignKey: "inviterId" });
// // // One-To-Many relationships
Role.hasMany(Utilisateur, { foreignKey: "roleId", as: "utilisateurs" });
Utilisateur.belongsTo(Role, { foreignKey: "roleId", as: "role" });
// Relations for ClientProfile
Utilisateur.hasOne(Profile, { foreignKey: 'utilisateurId', as: 'profile' });
Profile.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', as: 'utilisateur' });
// Relations for SocialMediaAccount
Utilisateur.hasMany(SocialMediaAccount, { foreignKey: 'utilisateurId', as: 'socialMediaAccounts' });
SocialMediaAccount.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', as: 'utilisateur' });
// Relations for WhatsAppNumber
Utilisateur.hasMany(WhatsAppNumber, { foreignKey: 'utilisateurId', as: 'whatsappNumbers' });
WhatsAppNumber.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', as: 'utilisateur' });
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.sync({ force: false });
        console.log("La base de donnée a bien été initialisée !");
        // roles.map(async (role) => {
        //   await Role.create({
        //     role_name: role.role_name,
        //     role_description: role.role_description,
        //   }).then((createdRole) => {
        //     console.log(createdRole.toJSON());
        //   });
        // });
        // permissions.map(async (permission) => {
        //   await Permission.create({
        //     perm_name: permission.perm_name,
        //     perm_description: permission.perm_description,
        //   }).then((permission) => {
        //     console.log(permission.toJSON())
        //   });
        // });
        // 
    }
    catch (error) {
        console.error("Erreur lors de l'initialisation de la base de données :", error);
    }
});
exports.default = {
    initDb,
    // 
    Role,
    Permission,
    RolePermission,
    // 
    Utilisateur,
    RefreshToken,
    Invitation,
    Profile,
    SocialMediaAccount,
    WhatsAppNumber
};
