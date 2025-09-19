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
const router = express_1.default.Router();
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// import auth from "../auth/auth";
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const randomstring_1 = __importDefault(require("randomstring"));
const auth_1 = __importDefault(require("../middlewares/auth"));
/**
 * @swagger
 * tags:
 *   name: utilisateur
 *   description: API pour gérer les utilisateur crud
 */
/**
 * @swagger
 * /api/v1/utilisateur:
 *   post:
 *     summary: Ajouter un nouvel utilisateur
 *     tags: [utilisateur]
 *     description: Ajoute un nouvel utilisateur à la base de données.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       '200':
 *         description: Utilisateur ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       '400':
 *         description: Données manquantes
 *         content:
 *           application/json:
 *             example:
 *               msg: "Veuillez fournir le nom d'utilisateur, le mot de passe et le role."
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "L'utilisateur n'a pas pu être créé. Réessayez."
 *               data: {}
 */
router.post('/', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 
    console.log();
    if (!req.body.role_name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.nom) {
        res.status(400).send({
            msg: "Please pass username, password and name.",
        });
    }
    else {
        sequelize_1.default.Role.findOne({
            where: {
                role_name: req.body.role_name,
            },
        }).then((role) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(role.id);
            // Generate OTP
            let otp = randomstring_1.default.generate({
                length: 6,
                charset: 'numeric'
            });
            const hashedPassword = bcryptjs_1.default.hashSync(req.body.password, bcryptjs_1.default.genSaltSync(10));
            sequelize_1.default.Utilisateur.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword, otp: otp, roleId: role.id })).then((utilisateur) => {
                const message = `L'utilisateur a été bien cree avec succès`;
                res.json({ message, data: utilisateur });
            }).catch((error) => {
                const message = `L'utilisateur n'a pas pu être cree. Réessayez.`;
                res.status(500).json({ message, data: error });
            });
        })).catch((error) => {
            const message = `Le role n'existe pas. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
    }
}));
/**
 * @swagger
 * /api/v1/utilisateur:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [utilisateur]
 *     description: Récupère la liste de tous les utilisateurs avec leurs rôles et permissions associés.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GetAllUsersResponse'
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "La liste des utilisateurs n'a pas pu être récupérée. Réessayez dans quelques instants."
 *               data: {}
 */
router.get('/', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize_1.default.Utilisateur.findAll({
        include: [
            {
                model: sequelize_1.default.Role,
                as: "role",
                include: [
                    {
                        model: sequelize_1.default.Permission,
                        as: "permissions",
                    },
                ],
            },
            {
                model: sequelize_1.default.SocialMediaAccount,
                as: "socialMediaAccounts",
            },
            {
                model: sequelize_1.default.WhatsAppNumber,
                as: "whatsappNumbers",
            },
            {
                model: sequelize_1.default.Profile,
                as: "profile",
            },
        ],
    }).then((utilisateur) => {
        const message = "La liste des utilisateurs a bien été récupéré.";
        res.status(200).json({ message, data: utilisateur });
        // res.status(200).send(roles)
    }).catch((error) => {
        const message = `La liste des utilisateurs n'a pas pu être récupéré Réessayez dans quelques instants.`;
        res.status(500).json({ message, data: error });
    });
}));
/**
 * @swagger
 * /api/v1/utilisateur/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son identifiant
 *     tags: [utilisateur]
 *     description: Récupère un utilisateur spécifique par son identifiant avec son rôle et ses permissions associés.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *               data: {}
 */
router.get('/:id', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize_1.default.Utilisateur.findByPk(req.params.id, {
        include: [
            {
                model: sequelize_1.default.Role,
                as: "role",
                include: [
                    {
                        model: sequelize_1.default.Permission,
                        as: "permissions",
                    },
                ]
            },
        ],
    }).then((utilisateur) => {
        const message = "utilisateur trouvé";
        res.status(200).json({ message, data: utilisateur });
    }).catch((error) => {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
    });
}));
/**
 * @swagger
 * /api/v1/utilisateur/{id}:
 *   put:
 *     summary: Mettre à jour les informations d'un utilisateur
 *     tags: [utilisateur]
 *     description: Met à jour les informations d'un utilisateur spécifique par son identifiant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       '200':
 *         description: Informations utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour des informations de l'utilisateur."
 *               data: {}
 */
router.put('/:id', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.default.Utilisateur.findByPk(req.params.id)
            .then((utilisateur) => __awaiter(void 0, void 0, void 0, function* () {
            yield utilisateur.update(req.body);
            res.json(utilisateur);
        })).catch(() => {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        });
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
}));
/**
 * @swagger
 * /api/v1/utilisateur/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par son identifiant
 *     tags: [utilisateur]
 *     description: Supprime un utilisateur spécifique par son identifiant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la suppression de l'utilisateur."
 *               data: {}
 */
router.delete('/:id', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const utilisateur = yield sequelize_1.default.Utilisateur.findByPk(req.params.id);
        if (utilisateur) {
            yield utilisateur.destroy();
            res.json({ message: 'Utilisateur supprimer avec succès', utilisateur });
        }
        else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
}));
// 
/**
 * @swagger
 * /api/v1/utilisateur/upload/{id}:
 *   put:
 *     summary: Mettre à jour la photo de profil d'un utilisateur
 *     tags: [utilisateur]
 *     description: Met à jour la photo de profil d'un utilisateur spécifique par son identifiant.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Photo de profil de l'utilisateur mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       '400':
 *         description: Aucun fichier téléchargé
 *         content:
 *           application/json:
 *             example:
 *               message: "Aucun fichier n'a été téléchargé."
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour de la photo de profil de l'utilisateur."
 *               data: {}
 */
router.put('/upload/:id', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    let file = req.files.profilePic;
    sequelize_1.default.Utilisateur.findByPk(req.params.id)
        .then((utilisateur) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(utilisateur.id);
        if (utilisateur.profilePic === null) {
            // Faites quelque chose si la valeur est null
            console.log('La valeur est null, exécution de l\'action A.');
        }
        else {
            // Récupère la partie du chemin de l'URL
            const pathname = new URL(utilisateur.profilePic).pathname;
            // Récupère le nom du fichier
            const imageName = path_1.default.basename(pathname);
            // console.log(imageName);  // Affiche "image.jpg"
            if (imageName == "profile.png") {
                console.log('default image');
            }
            else {
                const uploadPath = path_1.default.join(__dirname, './../../public', '/uploads/', imageName);
                // console.log(uploadPath);  // Affiche "image.jpg " Url
                if (fs_1.default.existsSync(uploadPath)) {
                    // console.log('Le fichier existe.');
                    fs_1.default.unlinkSync(uploadPath);
                    // console.log('Le fichier a été supprimé.');
                }
                else {
                    console.log('Le fichier n\'existe pas, donc rien à supprimer.');
                }
            }
            console.log('La valeur n\'est pas null, exécution de l\'action B.');
        }
        let fileName = Date.now() + file.name;
        let urlinit = "/uploads/" + fileName;
        const uploadPath = path_1.default.join(__dirname, './../../public', '/uploads/', fileName);
        let url = `${req.protocol}://${req.get("host")}${urlinit}`;
        // const uploadPath = __dirname + '/uploads/' + file.name;
        console.log(uploadPath, url);
        file.mv(uploadPath, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return res.status(500).send(err);
            yield utilisateur.update(Object.assign(Object.assign({}, req.body), { profilePic: url })).then((utilisateur) => {
                const message = "utilisateur Profile picture uploaded";
                res.status(200).json({ message, data: utilisateur });
                // res.status(200).send(roles)
            }).catch((error) => {
                const message = `La liste des utilisateurs n'a pas pu être récupéré Réessayez dans quelques instants.`;
                res.status(500).json({ message, data: error });
            });
        }));
    }))
        .catch((error) => {
        const message = `Utilisateurd n'existe pas. Réessayez dans quelques instants.`;
        res.status(500).json({ message, data: error });
    });
}));
// 
/**
 * @swagger
 * /api/v1/utilisateur/upload-profile:
 *   put:
 *     summary: Mettre à jour la photo de profil de l'utilisateur connecté
 *     tags: [utilisateur]
 *     description: Met à jour la photo de profil de l'utilisateur connecté.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Photo de profil mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Photo de profil mise à jour avec succès.
 *                 data:
 *                   type: object
 *       '400':
 *         description: Aucun fichier téléchargé
 *         content:
 *           application/json:
 *             example:
 *               message: "Aucun fichier n'a été téléchargé."
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour de la photo de profil."
 */
router.put('/upload-profile', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Vérifier si un fichier est envoyé
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Aucun fichier n'a été téléchargé." });
        }
        const file = req.files.profilePic;
        const utilisateurId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Vérifier si l'utilisateur connecté existe
        const utilisateur = yield sequelize_1.default.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
        // Supprimer l'ancienne photo de profil si elle n'est pas une image par défaut
        if (utilisateur.profilePic) {
            const pathname = new URL(utilisateur.profilePic).pathname;
            const imageName = path_1.default.basename(pathname);
            if (imageName !== 'profile.png') {
                const uploadPath = path_1.default.join(__dirname, '../../public/uploads/', imageName);
                if (fs_1.default.existsSync(uploadPath)) {
                    fs_1.default.unlinkSync(uploadPath); // Supprimez l'ancien fichier
                }
            }
        }
        // Définir le chemin pour le nouveau fichier
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path_1.default.join(__dirname, '../../public/uploads/', fileName);
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
        // Déplacer le fichier téléchargé
        file.mv(filePath, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier.', error: err });
            }
            // Mettre à jour la photo de profil dans la base de données
            yield utilisateur.update({ profilePic: fileUrl });
            res.status(200).json({ message: 'Photo de profil mise à jour avec succès.', data: utilisateur });
        }));
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo de profil.', error });
    }
}));
/**
 * @swagger
 * /api/v1/utilisateur/info/{id}:
 *   put:
 *     summary: ajouter un info
 *     tags: [utilisateur]
 *     description: Met à jour les informations d'un utilisateur en ajouter l'info.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       '200':
 *         description: Informations utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé"
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour des informations de l'utilisateur."
 *               data: {}
 */
router.put('/info/:id', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.default.Utilisateur.findByPk(req.params.id)
            .then((utilisateur) => __awaiter(void 0, void 0, void 0, function* () {
            //    
            yield utilisateur.update(req.body);
            // 
            const message = "vous avez bien complecter les information";
            res.status(200).json({ message, data: utilisateur });
        })).catch((error) => {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        });
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
}));
/**
 * @swagger
 * /api/v1/utilisateur/user/connect/info:
 *   put:
 *     summary: Mettre à jour les informations de l'utilisateur connecté
 *     tags: [utilisateur]
 *     description: Met à jour les informations de l'utilisateur connecté, y compris le nom, prénom, email, numéro de téléphone, et autres détails personnels.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Jean"
 *               prenom:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 example: "jean.dupont@example.com"
 *     responses:
 *       '200':
 *         description: Informations utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Informations mises à jour avec succès.
 *                 data:
 *                   type: object
 *       '401':
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non authentifié."
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé."
 *       '500':
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour des informations de l'utilisateur."
 */
router.put('/user/connect/info', (0, auth_1.default)([], []), (req, res) => {
    var _a;
    // Récupérer l'utilisateur connecté à partir du middleware `auth`
    const utilisateurId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!utilisateurId) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }
    console.log("utilisateurId:", utilisateurId);
    // Vérifier si l'utilisateur existe
    sequelize_1.default.Utilisateur.findByPk(utilisateurId)
        .then((utilisateur) => {
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        // Mettre à jour les informations utilisateur
        utilisateur
            .update({
            nom: req.body.nom || utilisateur.nom,
            prenom: req.body.prenom || utilisateur.prenom,
            email: req.body.email || utilisateur.email,
        })
            .then((updatedUtilisateur) => {
            res.status(200).json({
                message: 'Informations mises à jour avec succès.',
                data: updatedUtilisateur,
            });
        })
            .catch((updateError) => {
            res.status(500).json({
                message: "Erreur lors de la mise à jour des informations de l'utilisateur.",
                error: updateError,
            });
        });
    })
        .catch((findError) => {
        res.status(500).json({
            message: "Erreur lors de la recherche de l'utilisateur.",
            error: findError,
        });
    });
});
/**
 * @swagger
 * /api/v1/utilisateur/user/connect/me/update-profile:
 *   put:
 *     summary: Mettre à jour les informations personnelles et la photo de profil de l'utilisateur connecté
 *     tags: [utilisateur]
 *     description: Permet de mettre à jour les informations personnelles et la photo de profil de l'utilisateur connecté.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Jean"
 *               prenom:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 example: "jean.dupont@example.com"
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Informations utilisateur mises à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Informations utilisateur mises à jour avec succès.
 *                 data:
 *                   type: object
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non authentifié."
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               message: "Erreur lors de la mise à jour des informations."
 */
router.put('/user/connect/me/update-profile', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // const id = req.user?.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        // Récupérer l'utilisateur connecté depuis la base de données
        const utilisateur = yield sequelize_1.default.Utilisateur.findByPk(userId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        // Gérer la photo de profil si un fichier est envoyé
        if (req.files && req.files.profilePic) {
            const file = req.files.profilePic;
            // Supprimer l'ancienne photo de profil si elle existe et n'est pas l'image par défaut
            if (utilisateur.profilePic) {
                const pathname = new URL(utilisateur.profilePic).pathname;
                const imageName = path_1.default.basename(pathname);
                if (imageName !== 'profile.png') {
                    const uploadPath = path_1.default.join(__dirname, '../../public/uploads/', imageName);
                    if (fs_1.default.existsSync(uploadPath)) {
                        fs_1.default.unlinkSync(uploadPath); // Supprimez l'ancien fichier
                    }
                }
            }
            // Définir le chemin pour le nouveau fichier
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path_1.default.join(__dirname, '../../public/uploads/', fileName);
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileName}`;
            // Déplacer le fichier téléchargé
            file.mv(filePath, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier.', error: err });
                }
                // utilisateur.profilePic = fileUrl; // Mettre à jour l'URL de la photo de profil
                // Mettre à jour la photo de profil dans la base de données
                yield utilisateur.update(Object.assign(Object.assign({}, req.body), { profilePic: fileUrl }));
                res.status(200).json({ message: 'Informations utilisateur mises à jour avec succès.', data: utilisateur });
            }));
        }
        // // Mettre à jour les autres informations
        // await utilisateur.update({
        //     ...req.body,
        //     profilePic: fileUrl
        // });
        // res.status(200).json({
        //     message: 'Informations utilisateur mises à jour avec succès.',
        //     data: utilisateur,
        // });
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour des informations.',
            error,
        });
    }
}));
/**
 * @swagger
 * /api/v1/utilisateur/user/connect/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [utilisateur]
 *     description: Récupère les informations personnelles de l'utilisateur actuellement authentifié.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur connecté récupéré avec succès."
 *                 data:
 *                   type: object
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non authentifié."
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             example:
 *               message: "Utilisateur non trouvé."
 */
router.get('/user/connect/me', (0, auth_1.default)([], []), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const utilisateurId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!utilisateurId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        const utilisateur = yield sequelize_1.default.Utilisateur.findByPk(utilisateurId, {
            include: [
                {
                    model: sequelize_1.default.Role,
                    as: 'role',
                    include: [{ model: sequelize_1.default.Permission, as: 'permissions' }],
                },
            ],
        });
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        res.status(200).json({
            message: 'Utilisateur connecté récupéré avec succès.',
            data: utilisateur,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération de l\'utilisateur.',
            error,
        });
    }
}));
exports.default = router;
