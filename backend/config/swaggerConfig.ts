// backend/config/swaggerConfig.ts

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { sessionMiddleware } from '../middleware/sessionMiddleware';

export const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SchoolHub API',
            version: '1.0.0',
            description: 'Comprehensive API documentation for SchoolHub platform',
            contact: {
                name: 'SchoolHub Development Team',
                email: 'support@schoolhub.edu'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000/api/',
                description: 'Local development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
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
                },
                LibraryUser: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'Unique identifier for the library user'
                        },
                        username: {
                            type: 'string',
                            description: 'Username of the library user'
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the library user'
                        },
                        firstName: {
                            type: 'string',
                            description: 'First name of the library user'
                        },
                        lastName: {
                            type: 'string',
                            description: 'Last name of the library user'
                        },
                        role: {
                            type: 'string',
                            enum: ['student', 'staff', 'admin'],
                            description: 'Role of the library user'
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'inactive'],
                            description: 'Current status of the library user'
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
        './routes/admin/*.ts',
        './routes/student/*.ts',
        './routes/teacher/*.ts',
        './routes/parent/*.ts',
        './routes/library/*.ts',
        './routes/finance/*.ts',
        './routes/index.ts'
    ]
};

const setupSwagger = (app: Express) => {
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.use('/api-docs', sessionMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;