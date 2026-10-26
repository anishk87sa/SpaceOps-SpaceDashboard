import { signToken } from '../middleware/auth.middleware.js';

// Pre-registered system users for space exploration platform
const SYSTEM_USERS = [
  {
    id: 'usr-01',
    name: 'Dr. Evelyn Reed',
    email: 'admin@spaceops.org',
    role: 'Explorer Guide',
    organization: 'SpaceOps Education',
    title: 'Lead Space Science Curator',
  },
  {
    id: 'usr-02',
    name: 'Marcus Vance',
    email: 'operator@spaceops.org',
    role: 'Observer',
    organization: 'Planetary Society Partner',
    title: 'Observational Astronomy Coordinator',
  },
  {
    id: 'usr-03',
    name: 'Dr. Sarah Chen',
    email: 'analyst@spaceops.org',
    role: 'Researcher',
    organization: 'Space Science Outreach',
    title: 'Astrophysics Research Fellow',
  },
];

export function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      status: 'fail',
      error: { code: 'MISSING_FIELDS', message: 'Email and password are required' },
      timestamp: new Date().toISOString(),
    });
  }

  // Find user by email (case-insensitive) or match demo user
  let user = SYSTEM_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `usr-${Date.now().toString(36)}`,
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      role: 'Space Explorer',
      organization: 'SpaceOps Community',
      title: 'Stargazer & Space Enthusiast',
    };
  }

  const token = signToken(user);

  return res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        organization: user.organization,
      },
    },
    timestamp: new Date().toISOString(),
  });
}

export function register(req, res) {
  const { name, email, password, organization } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'fail',
      error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password are required' },
      timestamp: new Date().toISOString(),
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      status: 'fail',
      error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters long' },
      timestamp: new Date().toISOString(),
    });
  }

  const newUser = {
    id: `usr-${Date.now().toString(36)}`,
    name,
    email,
    role: 'Space Explorer',
    organization: organization || 'SpaceOps Community',
    title: 'Stargazer & Space Enthusiast',
  };

  const token = signToken(newUser);

  return res.status(201).json({
    status: 'success',
    data: {
      token,
      user: newUser,
    },
    timestamp: new Date().toISOString(),
  });
}

export function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
    timestamp: new Date().toISOString(),
  });
}

export const getCurrentUser = getMe;


export function forgotPassword(req, res) {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({
      status: 'fail',
      error: { code: 'MISSING_EMAIL', message: 'Email address is required' },
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'If an account exists with this email, password recovery instructions have been sent.',
    timestamp: new Date().toISOString(),
  });
}
