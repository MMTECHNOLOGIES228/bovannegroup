"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("./config/swagger.config"));
const authSwagger_1 = require("./middlewares/authSwagger");
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_config_1.default);
function swaggerDocs(app, port) {
    app.use('/api/v1/api-docs', authSwagger_1.basicAuth, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // app.use("/api-docs", basicAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // Docs in JSON format
    app.get("/api/v1/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    console.log('Swagger docs available at /api-docs');
    console.log(`Docs available at app listening on port: http://localhost:${port}/api/v1/api-docs`);
}
;
exports.default = swaggerDocs;
