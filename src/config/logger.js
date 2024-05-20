const winston = require('winston');

const levels = {
debug: 0,
http: 1,
info: 2,
warning: 3,
error: 4,
fatal: 5
};

const level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

const logger = winston.createLogger({
levels,
level,
format: winston.format.json(),
transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'errors.log', level: 'error' })
]
});

module.exports = logger;