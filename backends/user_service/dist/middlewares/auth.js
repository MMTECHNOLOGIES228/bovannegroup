"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const private_key_1 = require("../config/private_key");
// Middleware pour vérifier les permissions et rôles requis
exports.default = (requiredPermissions = [], requiredRoles = []) => {
    return (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({
                message: "Jeton d'authentification manquant. Veuillez fournir un jeton valide."
            });
        }
        const token = authorizationHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, private_key_1.privateKey, (error, decodedToken) => {
            if (error) {
                return res.status(401).json({
                    message: "Jeton invalide ou expiré.",
                    error
                });
            }
            const { utilisateurId, role, permissions } = decodedToken;
            if (!role || !permissions) {
                return res.status(403).json({
                    message: "Rôle ou permissions manquants dans le jeton."
                });
            }
            req.user = {
                id: utilisateurId,
                role,
                permissions
            };
            // Vérifier les rôles requis
            if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
                return res.status(403).json({
                    message: "Accès refusé : rôle non autorisé."
                });
            }
            // Vérifier les permissions requises
            if (requiredPermissions.length > 0) {
                const hasRequiredPermissions = requiredPermissions.every(perm => permissions.includes(perm));
                if (!hasRequiredPermissions) {
                    return res.status(403).json({
                        message: "Accès refusé : permissions manquantes."
                    });
                }
            }
            next();
        });
    };
};
