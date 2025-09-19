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
 *   name: WhatsAppNumbers
 *   description: API for managing WhatsApp numbers
 */
/**
 * @swagger
 * /api/v1/whatsapp-numbers/{utilisateurId}:
 *   post:
 *     summary: Create a new WhatsApp number for a user
 *     tags: [WhatsAppNumbers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: utilisateurId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       description: WhatsApp number details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 example: "+1234567890"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: WhatsApp number created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: WhatsApp number created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found or not permitted
 */
router.post('/:utilisateurId', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { utilisateurId } = req.params;
        const { influencerProfileId, number, isActive } = req.body;
        // Vérifier si `utilisateurId` est fourni
        if (!utilisateurId) {
            return res.status(400).json({ message: 'utilisateurId is required as a path parameter.' });
        }
        // Vérifier si le corps de la requête est vide
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'The request body cannot be empty.' });
        }
        // Vérifier si l'utilisateur existe
        const utilisateur = yield sequelize_2.default.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur not found.' });
        }
        // Vérifier si l'utilisateur a un rôle permis
        const allowedRoles = ['admin']; // Liste des rôles permis
        const role = yield sequelize_2.default.Role.findByPk(utilisateur.roleId);
        if (!role || !allowedRoles.includes(role.role_name)) {
            return res.status(403).json({ message: 'Utilisateur does not have the required role.' });
        }
        // Créer le numéro WhatsApp
        const whatsAppNumber = yield sequelize_2.default.WhatsAppNumber.create({
            utilisateurId,
            number,
            isActive,
        });
        res.status(201).json({ message: 'WhatsApp number created successfully', data: whatsAppNumber });
    }
    catch (error) {
        if (error instanceof sequelize_1.ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(500).json({ message: 'Error creating WhatsApp number', data: error });
    }
}));
// 
/**
 * @swagger
 * /api/v1/whatsapp-numbers:
 *   post:
 *     summary: Ajouter un numéro WhatsApp pour l'utilisateur connecté
 *     tags: [WhatsAppNumbers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Détails du numéro WhatsApp
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *                 example: "+1234567890"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Numéro WhatsApp créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Numéro WhatsApp créé avec succès.
 *                 data:
 *                   type: object
 *       401:
 *         description: Utilisateur non authentifié
 */
router.post('/', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const utilisateurId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        // Vérifiez si le corps de la requête contient les données nécessaires
        const { number, isActive } = req.body;
        if (!number) {
            return res.status(400).json({ message: 'Le champ "number" est requis.' });
        }
        // Créez le numéro WhatsApp
        const whatsAppNumber = yield sequelize_2.default.WhatsAppNumber.create({
            utilisateurId,
            number,
            isActive: isActive !== null && isActive !== void 0 ? isActive : true,
        });
        res.status(201).json({ message: 'Numéro WhatsApp créé avec succès.', data: whatsAppNumber });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du numéro WhatsApp.', error });
    }
}));
/**
 * @swagger
 * /api/v1/whatsapp-numbers:
 *   get:
 *     summary: Get all WhatsApp numbers
 *     tags: [WhatsAppNumbers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of WhatsApp numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: WhatsApp numbers retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const whatsAppNumbers = yield sequelize_2.default.WhatsAppNumber.findAll();
        res.status(200).json({ message: 'WhatsApp numbers retrieved successfully', data: whatsAppNumbers });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving WhatsApp numbers', data: error });
    }
}));
// 
/**
 * @swagger
 * /api/v1/whatsapp-numbers/me:
 *   get:
 *     summary: Récupérer les numéros WhatsApp de l'utilisateur connecté
 *     tags: [WhatsAppNumbers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des numéros WhatsApp récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Numéros WhatsApp récupérés avec succès.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Utilisateur non authentifié
 */
router.get('/me/', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const utilisateurId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        // Récupérer les numéros WhatsApp associés à l'utilisateur connecté
        const whatsAppNumbers = yield sequelize_2.default.WhatsAppNumber.findAll({
            where: { utilisateurId },
        });
        res.status(200).json({
            message: 'Numéros WhatsApp récupérés avec succès.',
            data: whatsAppNumbers,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des numéros WhatsApp.', error });
    }
}));
/**
 * @swagger
 * /api/v1/whatsapp-numbers/{id}:
 *   get:
 *     summary: Get a WhatsApp number by ID
 *     tags: [WhatsAppNumbers]
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
 *         description: WhatsApp number retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/:id', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const whatsAppNumber = yield sequelize_2.default.WhatsAppNumber.findByPk(req.params.id);
        if (!whatsAppNumber) {
            return res.status(404).json({ message: 'WhatsApp number not found' });
        }
        res.status(200).json({ message: 'WhatsApp number retrieved successfully', data: whatsAppNumber });
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving WhatsApp number', data: error });
    }
}));
/**
 * @swagger
 * /api/v1/whatsapp-numbers/{id}:
 *   put:
 *     summary: Update a WhatsApp number
 *     tags: [WhatsAppNumbers]
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
 *       description: Updated WhatsApp number details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: WhatsApp number updated successfully
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
        const whatsAppNumber = yield sequelize_2.default.WhatsAppNumber.findByPk(req.params.id);
        if (!whatsAppNumber) {
            return res.status(404).json({ message: 'WhatsApp number not found' });
        }
        yield whatsAppNumber.update(req.body);
        res.status(200).json({ message: 'WhatsApp number updated successfully', data: whatsAppNumber });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating WhatsApp number', data: error });
    }
}));
/**
 * @swagger
 * /api/v1/whatsapp-numbers/{id}:
 *   delete:
 *     summary: Delete a WhatsApp number
 *     tags: [WhatsAppNumbers]
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
 *         description: WhatsApp number deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete('/:id', (0, auth_1.default)([], ["Admin"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const whatsAppNumber = yield sequelize_2.default.WhatsAppNumber.findByPk(req.params.id);
        if (!whatsAppNumber) {
            return res.status(404).json({ message: 'WhatsApp number not found' });
        }
        yield whatsAppNumber.destroy();
        res.status(200).json({ message: 'WhatsApp number deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting WhatsApp number', data: error });
    }
}));
exports.default = router;
