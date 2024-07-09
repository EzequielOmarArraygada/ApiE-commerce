import dotenv from 'dotenv'; // Importa el paquete dotenv
import { devLogger } from './logger-dev.js';
import { prodLogger } from './logger-prod.js';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

export const addLogger = async (req, res, next) => {
    const environment = process.env.NODE_ENV || 'development';
    const logger = environment === 'production' ? prodLogger : devLogger;
    
    req.logger = logger;
    
    next();
};

