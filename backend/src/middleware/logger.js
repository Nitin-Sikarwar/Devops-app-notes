const morgan = require('morgan');
const logger = require('../config/logger');

const stream = { write: (msg) => logger.info(msg.trim()) };

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

module.exports = requestLogger;
