import mongoose from 'mongoose';
import { env } from './env.js';

const connectionStateMap = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Connect to MongoDB database if URI is configured
 * @returns {Promise<boolean>} Whether database connected successfully
 */
export async function connectDatabase() {
  if (!env.MONGODB_URI || env.MONGODB_URI.trim() === '') {
    console.warn(
      '[Database] MONGODB_URI is not set. Running in disconnected mode. Database-dependent features are unavailable.'
    );
    return false;
  }

  try {
    mongoose.connection.on('connected', () => {
      console.log('[Database] MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB runtime connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB connection disconnected');
    });

    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    return true;
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB:', error.message);
    // Allow server to continue starting up even if DB connection fails
    return false;
  }
}

/**
 * Get the current MongoDB connection health and readiness
 */
export function getDatabaseStatus() {
  const isConfigured = Boolean(env.MONGODB_URI && env.MONGODB_URI.trim().length > 0);
  const readyState = mongoose.connection.readyState;
  const status = isConfigured ? (connectionStateMap[readyState] || 'unknown') : 'unconfigured';

  return {
    isConfigured,
    isConnected: readyState === 1,
    status,
    message: isConfigured
      ? (readyState === 1 ? 'Database connected' : `Database connection state is ${status}`)
      : 'MONGODB_URI is not configured; database features are disabled',
  };
}

/**
 * Gracefully disconnect from database
 */
export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] Gracefully disconnected from MongoDB');
  }
}
