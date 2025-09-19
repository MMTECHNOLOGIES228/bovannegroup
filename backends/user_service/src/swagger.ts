import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './config/swagger.config';
import { Express, Request, Response } from 'express';
import { basicAuth } from './middlewares/authSwagger';


const swaggerSpec = swaggerJsdoc(swaggerOptions);

function swaggerDocs (app: any, port: any)  {
  app.use('/api/v1/api-docs',basicAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // app.use("/api-docs", basicAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Docs in JSON format
  app.get("/api/v1/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

  console.log('Swagger docs available at /api-docs');
  console.log(`Docs available at app listening on port: http://localhost:${port}/api/v1/api-docs`);
};

export default swaggerDocs;