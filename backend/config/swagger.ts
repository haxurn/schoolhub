import SwaggerJsDoc from 'swagger-jsdoc';

import SwaggerUI from 'swagger-ui-express';
import { Express } from 'express';

const SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'SchoolHub API',
        version: '1.0.0',
        description: 'API documentation for SchoolHub',
    },
    servers: {
        url: 'http://localhost:5000',
    }
}

