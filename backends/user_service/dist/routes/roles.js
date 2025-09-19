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
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API for managing roles
 */
/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Role details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 example: Admin
 *               role_description:
 *                 type: string
 *                 example: Role for administrators
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Le Roles Admin a bien été cree.
 *                 data:
 *                   type: object
 */
// Create a new Role
router.post("/", (0, auth_1.default)([], ["Admin"]), function (req, res) {
    if (!req.body.role_name || !req.body.role_description) {
        res.status(400).send({
            msg: "Please pass Role name or description.",
        });
    }
    else {
        sequelize_1.default.Role.create(req.body)
            .then((role) => {
            const message = `Le Roles ${req.body.role_name} a bien été cree.`;
            res.json({ message, data: role });
        })
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
 * /api/v1/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La liste des roles a bien été récupéré.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
// Get List of Roles
router.get("/", (0, auth_1.default)([], []), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        sequelize_1.default.Role.findAll({
            include: [
                {
                    model: sequelize_1.default.Permission,
                    as: "permissions",
                },
                {
                    model: sequelize_1.default.Utilisateur,
                    as: "utilisateurs",
                },
            ],
        })
            .then((roles) => {
            const message = "La liste des roles a bien été récupéré.";
            res.json({ message, data: roles });
        })
            .catch((error) => {
            const message = `La liste des roles n'a pas pu être récupéré. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
    });
});
/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
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
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Get Role by ID
router.get("/:id", (0, auth_1.default)([], ["Admin"]), function (req, res) {
    sequelize_1.default.Role.findByPk(req.params.id, {
        include: [
            {
                model: sequelize_1.default.Permission,
                as: "permissions",
            },
            {
                model: sequelize_1.default.Utilisateur,
                as: "utilisateurs",
            },
        ],
    })
        .then((roles) => {
        res.status(200).send(roles);
    })
        .catch((error) => {
        res.status(400).send({
            success: false,
            msg: error,
        });
    });
});
/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
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
 *       description: Updated role details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 example: Manager
 *               role_description:
 *                 type: string
 *                 example: Role for managing teams
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
// Update a Role
router.put("/:id", (0, auth_1.default)([], ["Admin"]), function (req, res) {
    if (!req.params.id || !req.body.role_name || !req.body.role_description) {
        res.status(400).send({
            msg: "Please pass Role ID, name or description.",
        });
    }
    else {
        sequelize_1.default.Role.findByPk(req.params.id)
            .then((_) => {
            sequelize_1.default.Role.update(req.body, {
                where: {
                    id: req.params.id,
                },
            }).then((_) => {
                sequelize_1.default.Role.findByPk(req.params.id).then((roleup) => {
                    res.status(200).send({
                        message: "Role updated",
                        roleup,
                    });
                });
            }).catch((err) => res.status(400).send({
                success: false,
                msg: err,
            }));
        })
            .catch((error) => {
            res.status(400).send({
                success: false,
                msg: error,
            });
        });
    }
});
/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
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
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role deleted
 */
// Delete a Role
router.delete("/:id", (0, auth_1.default)([], ["Admin"]), function (req, res) {
    if (!req.params.id) {
        res.status(400).send({
            msg: "Please pass role ID.",
        });
    }
    else {
        sequelize_1.default.Role.findByPk(req.params.id)
            .then((role) => {
            if (role) {
                sequelize_1.default.Role.destroy({
                    where: {
                        id: req.params.id,
                    },
                })
                    .then((_) => {
                    res.status(200).send({
                        message: "Role deleted",
                        role,
                    });
                })
                    .catch((err) => res.status(400).send(err));
            }
            else {
                res.status(404).send({
                    message: "Role not found",
                });
            }
        })
            .catch((error) => {
            res.status(400).send({
                success: false,
                msg: error,
            });
        });
    }
});
/**
 * @swagger
 * /api/v1/roles/permissions/{id}:
 *   post:
 *     summary: Ajouter des permissions à un rôle
 *     description: Associe des permissions à un rôle existant.
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du rôle
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 description: Liste des IDs des permissions à associer
 *                 items:
 *                   type: string
 *             required:
 *               - permissions
 *             example:
 *               permissions: ["perm1", "perm2", "perm3"]
 *     responses:
 *       '200':
 *         description: Permissions ajoutées avec succès
 *       '400':
 *         description: Erreur de validation
 *       '500':
 *         description: Erreur interne du serveur
 */
// Add Permissions to Role
router.post("/permissions/:id", (0, auth_1.default)([], ["SuperAdmin", "Admin", "Staff"]), function (req, res) {
    if (!req.body.permissions) {
        res.status(400).send({
            msg: "Please pass permissions.",
        });
    }
    else {
        sequelize_1.default.Role.findByPk(req.params.id)
            .then((role) => {
            sequelize_1.default.RolePermission.destroy({
                where: {
                    roleId: role.id,
                },
            })
                .then((roles) => {
                req.body.permissions.forEach(function (item, index) {
                    sequelize_1.default.Permission.findByPk(item)
                        .then((perm) => __awaiter(this, void 0, void 0, function* () {
                        yield role.addPermissions(perm, {
                            through: {
                                selfGranted: false,
                            },
                        });
                    }))
                        .catch((error) => {
                        res.status(400).send({
                            success: false,
                            msg: error,
                        });
                    });
                });
                const message = `Permissions added.`;
                res.status(500).json({ message, data: roles });
            })
                .catch((error) => {
                const message = `Le RolePermission n'existe pas. Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
        })
            .catch((error) => {
            const message = `Le Role n'existe pas. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
    }
});
exports.default = router;
