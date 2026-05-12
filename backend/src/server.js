require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const logger = require('./config/logger');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ready', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'not ready', db: 'disconnected' });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use(errorHandler);

const connectWithRetry = async (retries = 10, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      logger.info('Database connected');
      return;
    } catch (err) {
      logger.warn(`DB connection attempt ${i}/${retries} failed. Retrying in ${delay / 1000}s...`);
      if (i === retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

const start = async () => {
  try {
    await connectWithRetry();
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('Database synced');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
