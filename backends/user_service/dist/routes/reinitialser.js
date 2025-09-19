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
const refresh_key_1 = require("../config/refresh_key");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const randomstring_1 = __importDefault(require("randomstring"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: réinitialisation
 *   description: API pour gérer les réinitialisation
 */
/**
 * @swagger
 * /api/v1/reinitialser:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe
 *     description: L'API pour la renitialisation de mote de passe, vous devez founire le phone et RefreshToken.
 *     tags: [réinitialisation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur
 *               resetToken:
 *                 type: string
 *                 description: Token de réinitialisation du mot de passe
 *             required:
 *               - phone
 *               - resetToken
 *             example:
 *               phone: "+22890112376"
 *               resetToken: "eyJ1dGlsaXNhdGV1cklkIjoiNzM4ODBlZmUtMWVkYi00NmY3LWIwOTYtYmVkZTdhMTI2ZjA5IiwiaWF0IjoxNzA5NTA4Mzg5LCJleHAiOjE3NzI2MjM1ODl"
 *     responses:
 *       '200':
 *         description: Code OTP envoyé avec succès
 *       '400':
 *         description: Erreur de requête
 *       '404':
 *         description: Utilisateur non trouvé
 *       '500':
 *         description: Erreur serveur
 */
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.default.Utilisateur.findOne({
            where: {
                phone: req.body.phone
            }
        }).then((utilisateur) => __awaiter(void 0, void 0, void 0, function* () {
            const otp = randomstring_1.default.generate({
                length: 6,
                charset: 'numeric'
            });
            if (utilisateur.status == "actif") {
                // const client = new UniClient({
                //     accessKeyId: '7r2tVvYVMuq2sSA4gwEMd1',
                // });
                // const urlsms = `https://api.afriksms.com/api/web/web_v1/outbounds/send`;
                //     const data = new URLSearchParams({
                //         ClientId: '12178593',
                //         ApiKey: 'fTpwoW_k1LKgiqlbL2KjsS6haTN8nRk9',
                //         SenderId: 'MAYO APP',
                //         Message: `Votre code de vérification est ${otp}. Pour sécurité, ne le partagez pas.`,
                //         MobileNumbers: req.body.phone.substring(1)
                //     });
                // 
                utilisateur.otp = otp;
                yield utilisateur.save();
                // 
                // Supprimez l'ancien refreshToken
                yield sequelize_1.default.RefreshToken.destroy({ where: { utilisateurId: utilisateur.id, } }).then((_) => __awaiter(void 0, void 0, void 0, function* () {
                    const resetToken = jsonwebtoken_1.default.sign({ id: utilisateur.id }, refresh_key_1.refreshkey, { expiresIn: '10m' });
                    yield sequelize_1.default.RefreshToken.create({
                        utilisateurId: utilisateur.id,
                        token: resetToken,
                        expires: new Date(Date.now() + 10 * 60 * 1000)
                    }).then((_) => __awaiter(void 0, void 0, void 0, function* () {
                        // await client.messages.send({
                        //     to: req.body.phone, // in E.164 format
                        //     text: `Votre code de vérification est ${otp}. Ne le partagez avec personne.`
                        // });
                        // const response = await axios.post(urlsms, data.toString(), {
                        //     headers: {
                        //         'Content-Type': 'application/x-www-form-urlencoded',
                        //     },
                        // });
                        // 
                        res.status(200).json({ message: "Code otp envoyer sur votre numero", resetToken, utilisateur });
                    })).catch((error) => {
                        res.status(404).send({
                            message: ` utilisateur not found.${error}`,
                        });
                    });
                })).catch((error) => {
                    res.status(404).send({
                        message: ` utilisateur not found.${error}`,
                    });
                });
            }
            else {
                yield utilisateur.destroy();
                res.json({ message: 'Utilisateur supprimer avec succès', utilisateur });
            }
        })).catch((error) => {
            res.status(404).send({
                message: ` utilisateur not found.${error}`,
            });
        });
    }
    catch (error) {
        res.status(500).send('Server error');
    }
}));
/**
 * @swagger
 * /api/v1/reinitialser/reset:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     description: L'API pour entre le nouveau mote de passe, vous devez founire le phone et resetToken.
 *     tags: [réinitialisation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: Token de réinitialisation du mot de passe
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe
 *             required:
 *               - resetToken
 *               - newPassword
 *             example:
 *               resetToken: "eyJ1dGlsaXNhdGV1cklkIjoiNzM4ODBlZmUtMWVkYi00NmY3LWIwOTYtYmVkZTdhMTI2ZjA5IiwiaWF0IjoxNzA5NTA4Mzg5LCJleHAiOjE3NzI2MjM1ODl"
 *               newPassword: "votre nouvelle mots de passe"
 *     responses:
 *       '200':
 *         description: Mot de passe réinitialisé avec succès
 *       '401':
 *         description: Token de réinitialisation invalide ou expiré
 *       '500':
 *         description: Erreur serveur
 */
router.post('/reset', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { resetToken, newPassword } = req.body;
    try {
        jsonwebtoken_1.default.verify(resetToken, refresh_key_1.refreshkey, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(401).send({ message: 'Invalid or expired reset token' });
            }
            let utilisateur = yield sequelize_1.default.Utilisateur.findByPk(decoded.id);
            utilisateur.password = bcryptjs_1.default.hashSync(newPassword, bcryptjs_1.default.genSaltSync(10));
            yield utilisateur.save();
            // // Invalidate the resetToken
            yield sequelize_1.default.RefreshToken.destroy({ where: { token: resetToken } });
            res.status(200).send({
                message: "Password reset successfully ",
            });
        }));
    }
    catch (error) {
        res.status(500).send('Server error');
    }
}));
/**
 * @swagger
 * /api/v1/reinitialser/changementpassword/{id}:
 *   post:
 *     summary: Changer le mot de passe
 *     description: L'API pour changer le mote de passe, vous devez founire le phone , l'ancien password et newPassword.
 *     tags: [réinitialisation]
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
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Ancien mot de passe
 *               newPassword:
 *                 type: string
 *                 description: Nouveau mot de passe
 *             required:
 *               - phone
 *               - password
 *               - newPassword
 *             example:
 *               phone: "+22890112376"
 *               password: "old password"
 *               newPassword: "your newPassword"
 *     responses:
 *       '200':
 *         description: Mot de passe changé avec succès
 *       '401':
 *         description: Mot de passe incorrect ou utilisateur inactif
 *       '400':
 *         description: Erreur de requête
 *       '500':
 *         description: Erreur serveur
 */
router.post('/changementpassword/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 
        sequelize_1.default.Utilisateur.findOne({ where: { phone: req.body.phone } }).then((utilisateur) => {
            if (!utilisateur) {
                return res.status(401).send({
                    message: "Authentication failed. utilisateur not found.",
                });
            }
            if (utilisateur.status == "inactif") {
                return res.status(401).send({
                    message: "utilisateur inactif.",
                });
            }
            utilisateur.comparePassword(req.body.password, (err, isMatch) => __awaiter(void 0, void 0, void 0, function* () {
                if (isMatch && !err) {
                    utilisateur.password = bcryptjs_1.default.hashSync(req.body.newPassword, bcryptjs_1.default.genSaltSync(10));
                    yield utilisateur.save();
                    res.status(200).send({
                        message: "Password change successfully ",
                    });
                }
                else {
                    res.status(401).send({
                        success: false,
                        msg: "Password incorectte",
                    });
                }
            }));
        }).catch((error) => res.status(400).send(error));
    }
    catch (error) {
        res.status(500).send('Server error');
    }
}));
exports.default = router;
