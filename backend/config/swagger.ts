// backend/config/swagger.ts

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'SchoolHub API',
        version: '1.0.0',
        description: 'API documentation for SchoolHub backend',
    },
    servers: [
        {
            url: 'http://localhost:5000', 
        },
    ],
};


const options = {
    swaggerDefinition,
    apis: ['./server.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * Function to setup Swagger UI for the app.
 * @param {Express} app - The express app.
 */
export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
