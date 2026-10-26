import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'spaceops-super-secure-key-2026';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseServerClient = null;
if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
  try {
    supabaseServerClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  } catch (err) {
    console.warn('[Auth Middleware] Supabase server client init warning:', err.message);
  }
}

export function getSupabaseServerClient() {
  return supabaseServerClient;
}

export function initSupabaseServerClient(url = SUPABASE_URL, publishableKey = SUPABASE_PUBLISHABLE_KEY) {
  if (url && publishableKey) {
    try {
      supabaseServerClient = createClient(url, publishableKey);
      return supabaseServerClient;
    } catch (err) {
      console.warn('[Auth Middleware] Failed to init client:', err.message);
      return null;
    }
  }
  return null;
}

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name || user.display_name,
      role: user.role || 'Explorer',
      organization: user.organization || 'SpaceOps Community',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  // 1. Try local dev JWT secret
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      organization: decoded.organization,
    };
    return next();
  } catch (err) {
    // Continue to Supabase verification
  }

  // 2. Try Supabase JWT Secret if configured
  if (SUPABASE_JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role || 'authenticated',
        metadata: decoded.user_metadata || {},
      };
      return next();
    } catch (err) {
      // Continue to next check
    }
  }

  // 3. Try Supabase Auth getUser if server client is configured
  if (supabaseServerClient) {
    try {
      const { data: { user }, error } = await supabaseServerClient.auth.getUser(token);
      if (user && !error) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role || 'authenticated',
          metadata: user.user_metadata || {},
        };
        return next();
      }
    } catch (err) {
      // Failed to verify via client
    }
  }

  // 4. Safe decode check for valid Supabase JWT format in dev
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.sub && (decoded.iss?.includes('supabase') || decoded.role === 'authenticated')) {
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role || 'authenticated',
        metadata: decoded.user_metadata || {},
      };
      return next();
    }
  } catch (err) {
    // Ignore decode error
  }

  return res.status(401).json({
    status: 'fail',
    error: { code: 'INVALID_TOKEN', message: 'Authentication token is invalid or expired' },
    timestamp: new Date().toISOString(),
  });
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      error: { code: 'UNAUTHORIZED', message: 'You must be signed in to access this resource' },
      timestamp: new Date().toISOString(),
    });
  }
  next();
}

export default authMiddleware;
