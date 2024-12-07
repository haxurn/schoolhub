import winston from 'winston';

export const createLogger = (module: string) => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.label({ label: module }),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({ 
                filename: 'logs/error.log', 
                level: 'error',
                dirname: 'logs' 
            }),
            new winston.transports.File({ 
                filename: 'logs/combined.log',
                dirname: 'logs'
            })
        ]
    });
};
