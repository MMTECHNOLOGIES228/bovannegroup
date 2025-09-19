import express, { Request, Response, Router } from 'express';
import { ValidationError } from 'sequelize';
import sequelize from '../db/sequelize';
import auth from '../middlewares/auth';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: API for managing user profiles
 */

/**
 * @swagger
 * /api/v1/profiles:
 *   post:
 *     summary: Create a new profile
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Profile information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utilisateurId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               postalCode:
 *                 type: string
 *                 example: "10001"
 *               bio:
 *                 type: string
 *                 example: "This is my bio"
 *               cashbackPoints:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile created successfully
 *                 data:
 *                   type: object
 */
router.post('/', auth([], ["Admin"]), async (req: Request, res: Response) => {
    try {
      // Vérification si req.body est vide
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'The request body cannot be empty.' });
      }
  
      // Vérification des champs obligatoires
      const { utilisateurId, address, city, postalCode, bio, cashbackPoints } = req.body;
      if (!utilisateurId || !address || !city || !postalCode) {
        return res.status(400).json({
          message: 'Missing required fields: utilisateurId, address, city, or postalCode.',
        });
      }
  
      // Création du profil
      const profile = await sequelize.Profile.create(req.body);
      res.status(201).json({ message: 'Profile created successfully', data: profile });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      res.status(500).json({ message: 'Error creating profile', data: error });
    }
  });
  

/**
 * @swagger
 * /api/v1/profiles:
 *   get:
 *     summary: Get all profiles
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profiles retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', auth([], ["Admin"]), async (req: Request, res: Response) => {
  try {
    const profiles = await sequelize.Profile.findAll();
    res.status(200).json({ message: 'Profiles retrieved successfully', data: profiles });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profiles', data: error });
  }
});

/**
 * @swagger
 * /api/v1/profiles/{id}:
 *   get:
 *     summary: Get a profile by ID
 *     tags: [Profiles]
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
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/:id', auth([], ["Admin"]), async (req: Request, res: Response) => {
  try {
    const profile = await sequelize.Profile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ message: 'Profile retrieved successfully', data: profile });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', data: error });
  }
});

/**
 * @swagger
 * /api/v1/profiles/{id}:
 *   put:
 *     summary: Update a profile by ID
 *     tags: [Profiles]
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
 *       description: Updated profile information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.put('/:id', auth([], ["Admin"]), async (req: Request, res: Response) => {
  try {
    const profile = await sequelize.Profile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    await profile.update(req.body);
    res.status(200).json({ message: 'Profile updated successfully', data: profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', data: error });
  }
});

/**
 * @swagger
 * /api/v1/profiles/{id}:
 *   delete:
 *     summary: Delete a profile by ID
 *     tags: [Profiles]
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
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.delete('/:id', auth([], ["Admin"]), async (req: Request, res: Response) => {
  try {
    const profile = await sequelize.Profile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    await profile.destroy();
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting profile', data: error });
  }
});

export default router;
