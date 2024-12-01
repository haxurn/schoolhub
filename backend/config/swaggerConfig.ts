// backend/config/swaggerConfig.ts

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

import { sessionMiddleware } from '../middleware/sessionMiddleware'; 

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SchoolHub API',
            version: '1.0.0',
            description: 'SchoolHub API documentation',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                
            },
        },
        security: [
            {
                bearerAuth: [],
                csrfAuth: [],
            },
        ],
    },
    apis: ['./routes/*.ts', './controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use(sessionMiddleware);
};

export default setupSwagger;
