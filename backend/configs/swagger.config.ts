import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import * as path from 'path';
import * as yaml from 'yamljs';


const setupSwagger = (app: Express) => {

    const swaggerDocument = yaml.load(path.join(__dirname, '../docs/api.doc.yaml')) as object;


    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
