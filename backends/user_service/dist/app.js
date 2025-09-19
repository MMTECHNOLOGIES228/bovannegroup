"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
// Importation de la configuration Swagger depuis le fichier `swagger.ts`
const swagger_1 = __importDefault(require("./swagger"));
// 
const auth_1 = __importDefault(require("./routes/auth"));
const reinitialser_1 = __importDefault(require("./routes/reinitialser"));
const utilisateur_1 = __importDefault(require("./routes/utilisateur"));
const roles_1 = __importDefault(require("./routes/roles"));
const permissions_1 = __importDefault(require("./routes/permissions"));
const download_1 = __importDefault(require("./routes/download"));
const profile_1 = __importDefault(require("./routes/profile"));
const socialMediaAccount_1 = __importDefault(require("./routes/socialMediaAccount"));
const whatsAppNumber_1 = __importDefault(require("./routes/whatsAppNumber"));
// 
dotenv.config();
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const sequelize_1 = __importDefault(require("./db/sequelize"));
const app = (0, express_1.default)();
const port = process.env.PORT || 9000;
// parse application/json
app
    .use(body_parser_1.default.json())
    .use(express_1.default.json())
    .use((0, cors_1.default)(corsOptions_1.default))
    .use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: path_1.default.join(__dirname, "/public/tmp"),
    createParentPath: true,
}))
    .use((0, morgan_1.default)('dev'))
    .use(express_1.default.static("./public"))
    .use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
sequelize_1.default.initDb();
// 
// Middleware pour servir la documentation Swagger
// app.use("/api/v1/api-docs-user", swaggerUi.serve, swaggerUi.setup(specs));
// Vos routes
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/reinitialser", reinitialser_1.default);
app.use("/api/v1/utilisateur", utilisateur_1.default);
app.use("/api/v1/profiles", profile_1.default);
app.use("/api/v1/roles", roles_1.default);
app.use("/api/v1/permissions", permissions_1.default);
app.use("/api/v1/social-media-accounts", socialMediaAccount_1.default);
app.use("/api/v1/whatsapp-numbers", whatsAppNumber_1.default);
// Route pour le téléchargement
app.use("/api/v1/download", download_1.default);
app.get('/', (req, res) => {
    res.send('Well done Users!');
});
app.listen(port, () => {
    console.log(`Example app listening on port: http://localhost:${port}`);
    (0, swagger_1.default)(app, port);
});
