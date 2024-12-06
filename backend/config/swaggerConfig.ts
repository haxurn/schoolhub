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
            description: 'SchoolHub API Documentation',
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
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        './routes/student/*.ts',
        './routes/admin/*.ts',
        './routes/finance/*.ts',
        './routes/parent/*.ts',
        './routes/index.ts'
    ]
};

const setupSwagger = (app: Express) => {
    const swaggerSpec = swaggerJSDoc(options);
    app.use('/api-docs', sessionMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;