"use strict";
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
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: SocialMediaAccounts
 *   description: API for managing social media accounts
 */
/**
 * @swagger
 * /api/v1/social-media-accounts/{utilisateurId}:
 *   post:
 *     summary: Créer un compte de média social pour un utilisateur
 *     tags: [SocialMediaAccounts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: utilisateurId
 *         in: path
 *         required: true
 *         description: L'identifiant de l'utilisateur associé au compte de média social
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       description: Détails du compte de média social
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *                 example: "Instagram"
 *               accountUrl:
 *                 type: string
 *                 example: "https://www.instagram.com/utilisateur/"
 *               followers:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       201:
 *         description: Compte de média social créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compte de média social créé avec succès.
 *                 data:
 *                   type: object
 *       400:
 *         description: Requête invalide
 *       403:
 *         description: Accès refusé - L'utilisateur n'a pas les permissions nécessaires
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/:utilisateurId', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { utilisateurId } = req.params;
        // Vérifier si `utilisateurId` est fourni dans les paramètres
        if (!utilisateurId) {
            return res.status(400).json({ message: 'Le paramètre utilisateurId est requis.' });
        }
        // Vérifier si le corps de la requête est vide
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Le corps de la requête ne peut pas être vide.' });
        }
        // Vérifier si l'utilisateur existe
        const utilisateur = yield sequelize_2.default.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
        // Vérifier si l'utilisateur a un rôle permis
        const rolesAutorises = ['influenceur']; // Liste des rôles autorisés
        const role = yield sequelize_2.default.Role.findByPk(utilisateur.roleId);
        if (!role || !rolesAutorises.includes(role.role_name)) {
            return res.status(403).json({ message: 'Cet utilisateur n’a pas les permissions nécessaires pour créer un compte de média social.' });
        }
        // Création du compte de média social
        const account = yield sequelize_2.default.SocialMediaAccount.create(Object.assign(Object.assign({}, req.body), { utilisateurId }));
        res.status(201).json({ message: 'Compte de média social créé avec succès.', data: account });
    }
    catch (error) {
        if (error instanceof sequelize_1.ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(500).json({ message: 'Erreur lors de la création du compte de média social.', data: error });
    }
}));
// 
/**
 * @swagger
 * /api/v1/social-media-accounts:
 *   post:
 *     summary: Créer un compte de média social pour l'utilisateur connecté
 *     tags: [SocialMediaAccounts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Détails du compte de média social
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platform:
 *                 type: string
 *                 example: "Instagram"
 *               accountUrl:
 *                 type: string
 *                 example: "https://www.instagram.com/utilisateur/"
 *               followers:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       201:
 *         description: Compte de média social créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compte de média social créé avec succès.
 *                 data:
 *                   type: object
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé - L'utilisateur n'a pas les permissions nécessaires
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Récupérer l'utilisateur connecté depuis le middleware auth
        const utilisateurId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        // Vérifier si l'utilisateur existe dans la base de données
        const utilisateur = yield sequelize_2.default.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
        // Vérifier si l'utilisateur a un rôle permis
        const rolesAutorises = ['admin']; // Liste des rôles autorisés
        const role = yield sequelize_2.default.Role.findByPk(utilisateur.roleId);
        if (!role || !rolesAutorises.includes(role.role_name)) {
            return res.status(403).json({ message: 'Cet utilisateur n’a pas les permissions nécessaires pour créer un compte de média social.' });
        }
        // Création du compte de média social
        const account = yield sequelize_2.default.SocialMediaAccount.create(Object.assign(Object.assign({}, req.body), { utilisateurId }));
        res.status(201).json({ message: 'Compte de média social créé avec succès.', data: account });
    }
    catch (error) {
        if (error instanceof sequelize_1.ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(500).json({ message: 'Erreur lors de la création du compte de média social.', data: error });
    }
}));
/**
 * @swagger
 * /api/v1/social-media-accounts:
 *   get:
 *     summary: Get all social media accounts
 *     tags: [SocialMediaAccounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of social media accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Social media accounts retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accounts = yield sequelize_2.default.SocialMediaAccount.findAll();
        res.status(200).json({ message: 'Social media accounts retrieved successfully', data: accounts });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving social media accounts', data: error });
    }
}));
// 
/**
 * @swagger
 * /api/v1/social-media-accounts/me:
 *   get:
 *     summary: Récupérer les comptes de médias sociaux de l'utilisateur connecté
 *     tags: [SocialMediaAccounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Comptes de médias sociaux récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comptes de médias sociaux récupérés avec succès.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur non authentifié.
 */
router.get('/me/', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const utilisateurId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        // Vérifiez si l'utilisateur existe
        const utilisateur = yield sequelize_2.default.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
        // Récupérer les comptes de médias sociaux pour cet utilisateur
        const socialMediaAccounts = yield sequelize_2.default.SocialMediaAccount.findAll({
            where: { utilisateurId },
            include: [
                {
                    model: sequelize_2.default.Permission,
                    as: 'permissions',
                },
                {
                    model: sequelize_2.default.Utilisateur,
                    as: 'utilisateurs',
                },
            ],
        });
        res.status(200).json({
            message: 'Comptes de médias sociaux récupérés avec succès.',
            data: socialMediaAccounts,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des comptes de médias sociaux.', error });
    }
}));
//   
/**
 * @swagger
 * /api/v1/social-media-accounts/{id}:
 *   get:
 *     summary: Get a social media account by ID
 *     tags: [SocialMediaAccounts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Social media account retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/:id', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield sequelize_2.default.SocialMediaAccount.findByPk(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Social media account not found' });
        }
        res.status(200).json({ message: 'Social media account retrieved successfully', data: account });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving social media account', data: error });
    }
}));
/**
 * @swagger
 * /api/v1/social-media-accounts/{id}:
 *   put:
 *     summary: Update a social media account
 *     tags: [SocialMediaAccounts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       description: Updated social media account details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Social media account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.put('/:id', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'The request body cannot be empty.' });
        }
        const account = yield sequelize_2.default.SocialMediaAccount.findByPk(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Social media account not found' });
        }
        yield account.update(req.body);
        res.status(200).json({ message: 'Social media account updated successfully', data: account });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating social media account', data: error });
    }
}));
/**
 * @swagger
 * /api/v1/social-media-accounts/{id}:
 *   delete:
 *     summary: Delete a social media account
 *     tags: [SocialMediaAccounts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Social media account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete('/:id', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield sequelize_2.default.SocialMediaAccount.findByPk(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Social media account not found' });
        }
        yield account.destroy();
        res.status(200).json({ message: 'Social media account deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting social media account', data: error });
    }
}));
exports.default = router;
