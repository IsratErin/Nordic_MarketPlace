import app from './app.js';
import prisma from '../prisma/client.js';
import logger from './logger.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    logger.info('Connecting to database...');
    await prisma.$connect();
    logger.info('Database connected.');

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = async () => {
      logger.info('Shutting down server...');
      await prisma.$disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

startServer();
