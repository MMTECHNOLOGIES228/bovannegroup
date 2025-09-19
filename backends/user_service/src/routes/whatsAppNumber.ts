import express, { Request, Response, Router } from 'express';
import { ValidationError } from 'sequelize';
import sequelize from '../db/sequelize';
import auth, { AuthenticatedRequest } from '../middlewares/auth';

const router: Router = express.Router();

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
router.post('/:utilisateurId', auth([], ["Admin"]), async (req: Request, res: Response) => {
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
        const utilisateur = await sequelize.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur not found.' });
        }

        // Vérifier si l'utilisateur a un rôle permis
        const allowedRoles = ['admin']; // Liste des rôles permis
        const role = await sequelize.Role.findByPk(utilisateur.roleId);
        if (!role || !allowedRoles.includes(role.role_name)) {
            return res.status(403).json({ message: 'Utilisateur does not have the required role.' });
        }

        // Créer le numéro WhatsApp
        const whatsAppNumber = await sequelize.WhatsAppNumber.create({
            utilisateurId,
            number,
            isActive,
        });

        res.status(201).json({ message: 'WhatsApp number created successfully', data: whatsAppNumber });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(500).json({ message: 'Error creating WhatsApp number', data: error });
    }
});

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
router.post('/', auth([], ["Admin"]), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const utilisateurId = req.user?.id;

        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        // Vérifiez si le corps de la requête contient les données nécessaires
        const { number, isActive } = req.body;
        if (!number) {
            return res.status(400).json({ message: 'Le champ "number" est requis.' });
        }

        // Créez le numéro WhatsApp
        const whatsAppNumber = await sequelize.WhatsAppNumber.create({
            utilisateurId,
            number,
            isActive: isActive ?? true,
        });

        res.status(201).json({ message: 'Numéro WhatsApp créé avec succès.', data: whatsAppNumber });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du numéro WhatsApp.', error });
    }
});
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
router.get('/', auth([], ["Admin"]), async (req: Request, res: Response) => {
    try {
        const whatsAppNumbers = await sequelize.WhatsAppNumber.findAll();
        res.status(200).json({ message: 'WhatsApp numbers retrieved successfully', data: whatsAppNumbers });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving WhatsApp numbers', data: error });
    }
});

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
router.get('/me/', auth([], ["Admin"]), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const utilisateurId = req.user?.id;

        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        // Récupérer les numéros WhatsApp associés à l'utilisateur connecté
        const whatsAppNumbers = await sequelize.WhatsAppNumber.findAll({
            where: { utilisateurId },
        });

        res.status(200).json({
            message: 'Numéros WhatsApp récupérés avec succès.',
            data: whatsAppNumbers,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des numéros WhatsApp.', error });
    }
});


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
router.get('/:id', auth([], ["Admin"]), async (req: Request, res: Response) => {
    try {
        const whatsAppNumber = await sequelize.WhatsAppNumber.findByPk(req.params.id);
        if (!whatsAppNumber) {
            return res.status(404).json({ message: 'WhatsApp number not found' });
        }
        res.status(200).json({ message: 'WhatsApp number retrieved successfully', data: whatsAppNumber });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving WhatsApp number', data: error });
    }
});

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
router.put('/:id', auth([], ["Admin"]), async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'The request body cannot be empty.' });
        }

        const whatsAppNumber = await sequelize.WhatsAppNumber.findByPk(req.params.id);
        if (!whatsAppNumber) {
            return res.status(404).json({ message: 'WhatsApp number not found' });
        }
        await whatsAppNumber.update(req.body);
        res.status(200).json({ message: 'WhatsApp number updated successfully', data: whatsAppNumber });
    } catch (error) {
        res.status(500).json({ message: 'Error updating WhatsApp number', data: error });
    }
});

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
router.delete('/:id', auth([], ["Admin"]), async (req: Request, res: Response) => {
    try {
        const whatsAppNumber = await sequelize.WhatsAppNumber.findByPk(req.params.id);
        if (!whatsAppNumber) {
            return res.status(404).json({ message: 'WhatsApp number not found' });
        }
        await whatsAppNumber.destroy();
        res.status(200).json({ message: 'WhatsApp number deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting WhatsApp number', data: error });
    }
});

export default router;
