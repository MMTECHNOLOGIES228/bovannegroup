"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Service API',
            version: '1.0.0',
            description: 'API documentation for User Service',
        },
        servers: [
            {
                url: 'http://localhost:9000',
                description: 'Local server',
            },
            {
                url: 'http://195.26.241.68:9000',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Chemins des fichiers contenant des annotations Swagger
};
exports.default = swaggerOptions;
