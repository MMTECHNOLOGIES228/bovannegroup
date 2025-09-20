import express, { Request, Response, Router } from 'express';
import { ValidationError } from 'sequelize';
import sequelize from '../db/sequelize';
import auth, { AuthenticatedRequest } from '../middlewares/auth';

const router: Router = express.Router();

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

router.post('/:utilisateurId', auth([], []), async (req: Request, res: Response) => {
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
        const utilisateur = await sequelize.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        // Vérifier si l'utilisateur a un rôle permis
        const rolesAutorises = ['influenceur']; // Liste des rôles autorisés
        const role = await sequelize.Role.findByPk(utilisateur.roleId);

        if (!role || !rolesAutorises.includes(role.role_name)) {
            return res.status(403).json({ message: 'Cet utilisateur n’a pas les permissions nécessaires pour créer un compte de média social.' });
        }

        // Création du compte de média social
        const account = await sequelize.SocialMediaAccount.create({
            ...req.body,
            utilisateurId, // Associe l'utilisateur au compte
        });

        res.status(201).json({ message: 'Compte de média social créé avec succès.', data: account });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(500).json({ message: 'Erreur lors de la création du compte de média social.', data: error });
    }
});

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

router.post('/', auth([], []), async (req: AuthenticatedRequest, res: Response) => {
    try {


        // Récupérer l'utilisateur connecté depuis le middleware auth
        const utilisateurId = req.user?.id;
        console.log(req.user?.id)

        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        // Vérifier si l'utilisateur existe dans la base de données
        const utilisateur = await sequelize.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        // Vérifier si l'utilisateur a un rôle permis
        const rolesAutorises = ['admin']; // Liste des rôles autorisés
        const role = await sequelize.Role.findByPk(utilisateur.roleId);

        if (!role || !rolesAutorises.includes(role.role_name)) {
            return res.status(403).json({ message: 'Cet utilisateur n’a pas les permissions nécessaires pour créer un compte de média social.' });
        }

        // Création du compte de média social
        const account = await sequelize.SocialMediaAccount.create({
            ...req.body,
            utilisateurId, // Associe l'utilisateur connecté au compte
        });

        res.status(201).json({ message: 'Compte de média social créé avec succès.', data: account });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error });
        }
        res.status(500).json({ message: 'Erreur lors de la création du compte de média social.', data: error });
    }
});



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
router.get('/', auth([], []), async (req: Request, res: Response) => {
    try {
        const accounts = await sequelize.SocialMediaAccount.findAll();
        res.status(200).json({ message: 'Social media accounts retrieved successfully', data: accounts });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving social media accounts', data: error });
    }
});

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
router.get('/me/', auth([], []), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const utilisateurId = req.user?.id;

        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }

        // Vérifiez si l'utilisateur existe
        const utilisateur = await sequelize.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        // Récupérer les comptes de médias sociaux pour cet utilisateur
        const socialMediaAccounts = await sequelize.SocialMediaAccount.findAll({
            where: { utilisateurId },
            // include: [
            //     {
            //         model: sequelize.Permission,
            //         as: 'permissions',
            //     },
            //     {
            //         model: sequelize.Utilisateur,
            //         as: 'utilisateurs',
            //     },
            // ],
        });

        res.status(200).json({
            message: 'Comptes de médias sociaux récupérés avec succès.',
            data: socialMediaAccounts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des comptes de médias sociaux.', error });
    }
});
//   

/**
 * @swagger
 * /api/v1/social-media-accounts/add/me:
 *   post:
 *     summary: Créer ou mettre à jour les comptes de médias sociaux de l'utilisateur connecté
 *     tags: [SocialMediaAccounts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accounts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     platform:
 *                       type: string
 *                       example: "Instagram"
 *                     accountUrl:
 *                       type: string
 *                       example: "https://instagram.com/utilisateur"
 *                     followers:
 *                       type: integer
 *                       example: 10000
 *             required:
 *               - accounts
 *     responses:
 *       201:
 *         description: Comptes de médias sociaux créés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comptes de médias sociaux créés avec succès.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SocialMediaAccount'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Utilisateur non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/add/me/', auth([], []), async (req: AuthenticatedRequest, res: Response) => {
    try {
       const utilisateurId = req.user?.id;

       console.log(req.user?.id)

        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }


        // Vérifiez si l'utilisateur existe
        const utilisateur = await sequelize.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        const { accounts } = req.body;

        // Validation des données
        if (!accounts || !Array.isArray(accounts)) {
            return res.status(400).json({ message: 'Le champ "accounts" est requis et doit être un tableau.' });
        }

        // Préparer les données pour la création
        const accountsToCreate = accounts.map(account => ({
            platform: account.platform,
            accountUrl: account.accountUrl,
            followers: account.followers,
            utilisateurId: utilisateurId
        }));
        console.log('Données des comptes à créer:', accountsToCreate);

        // Créer les comptes de médias sociaux
        const createdAccounts = await sequelize.SocialMediaAccount.bulkCreate(accountsToCreate, {
            updateOnDuplicate: ['accountUrl', 'followers', 'updatedAt'] // Mise à jour si le compte existe déjà
        });

        res.status(201).json({
            message: 'Comptes de médias sociaux créés avec succès.',
            data: createdAccounts
        });

    } catch (error) {
        console.error('Erreur lors de la création des comptes de médias sociaux:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la création des comptes de médias sociaux.', 
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

// 
/**
 * @swagger
 * components:
 *   schemas:
 *     SocialMediaAccount:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         platform:
 *           type: string
 *           example: "Instagram"
 *         accountUrl:
 *           type: string
 *           format: uri
 *           example: "https://instagram.com/utilisateur"
 *         followers:
 *           type: integer
 *           example: 10000
 *         utilisateurId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - platform
 *         - accountUrl
 *         - utilisateurId
 */


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
router.get('/:id', auth([], []), async (req: Request, res: Response) => {
    try {
        const account = await sequelize.SocialMediaAccount.findByPk(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Social media account not found' });
        }
        res.status(200).json({ message: 'Social media account retrieved successfully', data: account });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving social media account', data: error });
    }
});

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
router.put('/:id', auth([], []), async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'The request body cannot be empty.' });
        }

        const account = await sequelize.SocialMediaAccount.findByPk(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Social media account not found' });
        }
        await account.update(req.body);
        res.status(200).json({ message: 'Social media account updated successfully', data: account });
    } catch (error) {
        res.status(500).json({ message: 'Error updating social media account', data: error });
    }
});

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
router.delete('/:id', auth([], []), async (req: Request, res: Response) => {
    try {
        const account = await sequelize.SocialMediaAccount.findByPk(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Social media account not found' });
        }
        await account.destroy();
        res.status(200).json({ message: 'Social media account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting social media account', data: error });
    }
});

export default router;
