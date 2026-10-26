import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

let server;

async function startServer() {
  try {
    // Attempt database connection (gracefully degrades if unconfigured)
    await connectDatabase();

    // Start HTTP listener
    server = app.listen(env.PORT, () => {
      console.log('---------------------------------------------------------');
      console.log(` SpaceOps API Server initialized`);
      console.log(` Status: Running`);
      console.log(` Port: ${env.PORT}`);
      console.log(` Environment: ${env.NODE_ENV}`);
      console.log(` Local Endpoint: http://localhost:${env.PORT}/api`);
      console.log(` Health Check:  http://localhost:${env.PORT}/api/health`);
      console.log('---------------------------------------------------------');
    });
  } catch (error) {
    console.error('Fatal error during SpaceOps server startup:', error);
    process.exit(1);
  }
}

// Graceful shutdown handling
async function shutdown(signal) {
  console.log(`\nReceived ${signal}. Gracefully shutting down SpaceOps API server...`);

  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDatabase();
      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }

  // Force shutdown after timeout if pending connections do not drain
  setTimeout(() => {
    console.error('Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
