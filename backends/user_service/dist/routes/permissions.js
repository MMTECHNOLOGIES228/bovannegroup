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
const sequelize_1 = __importDefault(require("../db/sequelize"));
const sequelize_2 = require("sequelize");
// import { PermissionAttributes } from '../interfaces/permissionAttributes';
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API for managing permissions
 */
/**
 * @swagger
 * /api/v1/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Permission details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perm_name:
 *                 type: string
 *                 example: Read
 *               perm_description:
 *                 type: string
 *                 example: Permission to read resources
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La Permission Read a bien été cree.
 *                 data:
 *                   type: object
 */
// Create a new permission
router.post('/', (0, auth_1.default)([], ["Admin"]), function (req, res) {
    // Code de création d'une nouvelle permission
    if (!req.body.perm_name || !req.body.perm_description) {
        res.status(400).send({
            msg: "Please pass Permission name or description.",
        });
    }
    else {
        sequelize_1.default.Permission.create(req.body)
            .then((permission) => __awaiter(this, void 0, void 0, function* () {
            const message = `La Permission ${req.body.perm_name} a bien été cree.`;
            res.json({ message, data: permission });
        }))
            .catch((error) => {
            if (error instanceof sequelize_2.ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            if (error instanceof sequelize_2.UniqueConstraintError) {
                return res.status(400).json({ message: "error.message", data: error });
            }
            const message = `Le Role n'a pas pu être ajouté. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
    }
});
/**
 * @swagger
 * /api/v1/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La liste des Permission a bien été récupéré.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
// Get List of permissions
router.get('/', (0, auth_1.default)(["permissions_get_all"], ["Admin"]), function (req, res) {
    sequelize_1.default.Permission.findAll()
        .then((perms) => {
        const message = 'La liste des Permission a bien été récupéré.';
        res.json({ message, data: perms });
    })
        .catch((error) => {
        res.status(400).send(error);
    });
});
/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Permission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Get permissions by ID
router.get("/:id", (0, auth_1.default)([], []), function (req, res) {
    sequelize_1.default.Permission.findByPk(req.params.id, {
        include: [
            {
                model: sequelize_1.default.Role,
                as: "roles",
            },
            // {
            //     model: sequelize.Utilisateur,
            //     as: "utilisateurs",
            // },
        ],
    }).then((permission) => {
        res.status(200).send(permission);
    }).catch((error) => {
        res.status(400).send({
            success: false,
            msg: error,
        });
    });
});
/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     requestBody:
 *       description: Updated permission details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perm_name:
 *                 type: string
 *                 example: Write
 *               perm_description:
 *                 type: string
 *                 example: Permission to write resources
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Update a permission
router.put('/:id', (0, auth_1.default)([], ["Admin"]), function (req, res) {
    if (!req.params.id || !req.body.perm_name || !req.body.perm_description) {
        res.status(400).send({
            msg: 'Please pass permission ID, name, or description.',
        });
    }
    else {
        sequelize_1.default.Permission.findByPk(req.params.id)
            .then((perm) => {
            sequelize_1.default.Permission.update({
                perm_name: req.body.perm_name || perm.perm_name,
                perm_description: req.body.perm_description || perm.perm_description,
            }, {
                where: {
                    id: req.params.id,
                },
            })
                .then((_) => {
                res.status(200).send({
                    message: 'permission updated',
                });
            })
                .catch((err) => res.status(400).send(err));
        })
            .catch((error) => {
            res.status(400).send(error);
        });
    }
});
/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: permission deleted
 */
// Delete a permission
router.delete('/:id', (0, auth_1.default)([], ["Admin"]), function (req, res) {
    if (!req.params.id) {
        res.status(400).send({
            msg: 'Please pass permission ID.',
        });
    }
    else {
        sequelize_1.default.Permission.findByPk(req.params.id)
            .then((perm) => {
            if (perm) {
                perm
                    .destroy({
                    where: {
                        id: req.params.id,
                    },
                }).then((_) => {
                    res.status(200).send({
                        message: 'permission deleted',
                    });
                })
                    .catch((err) => res.status(400).send(err));
            }
            else {
                res.status(404).send({
                    message: 'permission not found',
                });
            }
        })
            .catch((error) => {
            res.status(400).send(error);
        });
    }
});
exports.default = router;
