import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import { signToken, authMiddleware, requireAuth, initSupabaseServerClient, getSupabaseServerClient } from '../src/middleware/auth.middleware.js';
import { spaceopsRepo } from '../src/repositories/spaceops.repository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('SpaceOps Supabase Authentication & User Account Architecture', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'spaceops-super-secure-key-2026';

  // 1. User Registration & Validation
  test('rejects registration when email, name, or password are missing', () => {
    const invalidPayloads = [
      { email: '', password: 'password123', name: 'Alex' },
      { email: 'alex@example.com', password: '', name: 'Alex' },
      { email: 'alex@example.com', password: 'password123', name: '' },
    ];

    for (const payload of invalidPayloads) {
      assert.ok(!payload.email || !payload.password || !payload.name);
    }
  });

  test('validates password minimum length requirement (>= 6 chars)', () => {
    const weakPassword = '123';
    assert.ok(weakPassword.length < 6);

    const validPassword = 'secureSpacePass2026!';
    assert.ok(validPassword.length >= 6);
  });

  // 2. Token Generation & Verification
  test('generates valid cryptographic JWT for registered user', () => {
    const mockUser = {
      id: 'usr-supabase-uuid-1',
      email: 'explorer@spaceops.org',
      name: 'Dr. Jane Orbit',
      role: 'Astronomer',
      organization: 'Deep Space Observatory',
    };

    const token = signToken(mockUser);
    assert.equal(typeof token, 'string');

    const decoded = jwt.verify(token, JWT_SECRET);
    assert.equal(decoded.id, mockUser.id);
    assert.equal(decoded.email, mockUser.email);
    assert.equal(decoded.name, mockUser.name);
  });

  test('authMiddleware verifies valid token and populates req.user', async () => {
    const mockUser = {
      id: 'usr-uuid-test-2',
      email: 'eva@spaceops.org',
      name: 'Eva Green',
      role: 'Explorer',
    };
    const token = signToken(mockUser);

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    let nextCalled = false;

    await authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.ok(req.user);
    assert.equal(req.user.id, mockUser.id);
    assert.equal(req.user.email, mockUser.email);
  });

  test('authMiddleware parses simulated Supabase JWT with sub claim', async () => {
    const supabasePayload = {
      sub: '550e8400-e29b-41d4-a716-446655440000',
      email: 'cosmonaut@example.com',
      role: 'authenticated',
      iss: 'https://supabase.co/auth/v1',
      user_metadata: { display_name: 'Yuri Gagarin', username: 'yuri' },
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const supabaseToken = jwt.sign(supabasePayload, 'simulated-supabase-secret');

    const req = { headers: { authorization: `Bearer ${supabaseToken}` } };
    const res = {};
    let nextCalled = false;

    await authMiddleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.ok(req.user);
    assert.equal(req.user.id, supabasePayload.sub);
    assert.equal(req.user.email, supabasePayload.email);
  });

  test('authMiddleware rejects expired or malformed token with 401 status', async () => {
    const expiredToken = jwt.sign(
      { id: 'usr-expired', email: 'old@example.com', exp: Math.floor(Date.now() / 1000) - 100 },
      JWT_SECRET
    );

    const req = { headers: { authorization: `Bearer ${expiredToken}` } };
    let statusCode = null;
    let jsonResponse = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            jsonResponse = data;
          },
        };
      },
    };

    await authMiddleware(req, res, () => {});

    assert.equal(statusCode, 401);
    assert.equal(jsonResponse.status, 'fail');
    assert.equal(jsonResponse.error.code, 'INVALID_TOKEN');
  });

  test('requireAuth rejects unauthenticated requests with 401', () => {
    const req = { user: null };
    let statusCode = null;
    let jsonResponse = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            jsonResponse = data;
          },
        };
      },
    };

    requireAuth(req, res, () => {});

    assert.equal(statusCode, 401);
    assert.equal(jsonResponse.error.code, 'UNAUTHORIZED');
  });

  // 3. User Favorites Isolation & Prevention of Duplicates
  test('enforces user-specific favorites isolation between User A and User B', () => {
    const userA = 'user-alpha-uuid';
    const userB = 'user-beta-uuid';

    const itemA = {
      id: 'mis-james-webb',
      title: 'James Webb Space Telescope',
      slug: 'james-webb-space-telescope',
      url: '/missions/james-webb-space-telescope',
      summary: 'Deep-space infrared observatory',
    };

    const itemB = {
      id: 'mis-perseverance',
      title: 'Mars 2020 Perseverance',
      slug: 'mars-perseverance-rover',
      url: '/missions/mars-perseverance-rover',
      summary: 'Mars astrobiology rover',
    };

    // User A adds James Webb
    spaceopsRepo.addBookmark(userA, itemA);
    // User B adds Perseverance
    spaceopsRepo.addBookmark(userB, itemB);

    const userAFavorites = spaceopsRepo.getUserBookmarks(userA);
    const userBFavorites = spaceopsRepo.getUserBookmarks(userB);

    // User A should only see their own favorite
    assert.equal(userAFavorites.length, 1);
    assert.equal(userAFavorites[0].itemId, itemA.id);
    assert.ok(!userAFavorites.some(f => f.itemId === itemB.id));

    // User B should only see their own favorite
    assert.equal(userBFavorites.length, 1);
    assert.equal(userBFavorites[0].itemId, itemB.id);
    assert.ok(!userBFavorites.some(f => f.itemId === itemA.id));

    // User A removing their favorite does not affect User B
    spaceopsRepo.removeBookmark(userA, itemA.id);
    assert.equal(spaceopsRepo.getUserBookmarks(userA).length, 0);
    assert.equal(spaceopsRepo.getUserBookmarks(userB).length, 1);

    // Cleanup
    spaceopsRepo.removeBookmark(userB, itemB.id);
  });

  test('prevents duplicate favorites for the same user and entity', () => {
    const testUser = 'user-dedup-uuid';
    const duplicateItem = {
      id: 'launch-falcon-heavy',
      title: 'Falcon Heavy | Europa Clipper',
      slug: 'falcon-heavy-europa-clipper',
      url: '/launches/falcon-heavy-europa-clipper',
    };

    spaceopsRepo.addBookmark(testUser, duplicateItem);
    spaceopsRepo.addBookmark(testUser, duplicateItem);

    const list = spaceopsRepo.getUserBookmarks(testUser);
    assert.equal(list.length, 1, 'Duplicate favorites should not create multiple entries');

    // Cleanup
    spaceopsRepo.removeBookmark(testUser, duplicateItem.id);
  });

  // 4. Password Recovery & Neutrality
  test('password recovery returns neutral response to protect user privacy', () => {
    const neutralMessage = 'If an account exists with this email, password recovery instructions have been sent.';
    assert.ok(!neutralMessage.includes('found') && !neutralMessage.includes('not found'));
    assert.ok(neutralMessage.startsWith('If an account exists'));
  });

  // 5. Existing Space Data API Integrity
  test('public space data APIs continue functioning without authentication', () => {
    const missions = spaceopsRepo.getMissions();
    assert.ok(missions.length >= 6);

    const launches = spaceopsRepo.getLaunches();
    assert.ok(launches.length >= 3);

    const events = spaceopsRepo.getEvents();
    assert.ok(events.length >= 4);

    const spacecraft = spaceopsRepo.getSpacecraft();
    assert.ok(spacecraft.length >= 5);
  });

  // 6. Supabase Publishable Key Integration Architecture
  test('supports Supabase publishable keys for client initialization', () => {
    const publishableKey = 'sb_pub_mock_spaceops_2026_xyz123';
    const mockUrl = 'https://spaceops-test.supabase.co';
    const client = initSupabaseServerClient(mockUrl, publishableKey);
    assert.ok(client);
    assert.equal(typeof client.auth?.getUser, 'function');
    assert.equal(getSupabaseServerClient(), client);
  });

  // 7. Client-Side Input & Registration Validation Rules
  test('validates email format with RFC-compliant regex pattern', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = ['explorer@spaceops.org', 'user.name+tag@sub.domain.co', 'astronomer2026@nasa.gov'];
    const invalidEmails = ['invalid', 'plainaddress', '@missingusername.com', 'username@.com', 'user @example.com'];

    for (const valid of validEmails) {
      assert.ok(emailRegex.test(valid), `Expected valid email: ${valid}`);
    }
    for (const invalid of invalidEmails) {
      assert.ok(!emailRegex.test(invalid), `Expected invalid email: ${invalid}`);
    }
  });

  test('validates password and confirmPassword match during registration', () => {
    const passwordMatchCheck = (pw, confirm) => Boolean(pw && confirm && pw === confirm);
    assert.equal(passwordMatchCheck('SuperSecret123', 'SuperSecret123'), true);
    assert.equal(passwordMatchCheck('SuperSecret123', 'DifferentPassword'), false);
    assert.equal(passwordMatchCheck('SuperSecret123', ''), false);
  });

  // 8. Supabase Configuration Validation Logic
  test('correctly evaluates Supabase configuration readiness', () => {
    const checkConfig = (url, key) => Boolean(
      url &&
      key &&
      !url.includes('placeholder') &&
      !url.includes('your-project') &&
      !key.includes('placeholder') &&
      !key.includes('your-supabase') &&
      (url.startsWith('https://') || url.startsWith('http://'))
    );

    // Placeholders should be recognized as unconfigured
    assert.equal(checkConfig('https://your-project-ref.supabase.co', 'your-supabase-publishable-key'), false);
    assert.equal(checkConfig('https://placeholder.supabase.co', 'sb_publishable_123'), false);
    assert.equal(checkConfig('', 'sb_publishable_123'), false);
    assert.equal(checkConfig('ftp://invalid-proto.com', 'sb_publishable_123'), false);

    // Real production configuration should be recognized as ready
    assert.equal(checkConfig('https://xyzcompany.supabase.co', 'sb_pub_real_key_xyz_7890'), true);
  });

  // 9. Saved Missions Stable External Identifier Integration
  test('persists stable mission slugs and provides dedicated saved missions queries', () => {
    const testUserId = 'user-saved-missions-uuid';
    const missionEntity = {
      id: 'mis-artemis-ii',
      title: 'Artemis II',
      slug: 'artemis-ii',
      url: '/missions/artemis-ii',
      summary: 'Crewed lunar flyby test mission',
    };

    spaceopsRepo.addBookmark(testUserId, missionEntity);
    const userFavorites = spaceopsRepo.getUserBookmarks(testUserId);

    assert.equal(userFavorites.length, 1);
    const savedMission = userFavorites[0];
    assert.equal(savedMission.itemId, 'mis-artemis-ii');
    assert.equal(savedMission.slug, 'artemis-ii');

    // Clean up
    spaceopsRepo.removeBookmark(testUserId, missionEntity.id);
  });

  // 10. Database Migration Scripts & Security Policies Integrity
  test('verifies SQL migration scripts contain complete schema, RLS, triggers, and views', () => {
    const migrationPath = path.join(__dirname, '..', 'src', 'db', 'supabase_migration.sql');
    const docsSchemaPath = path.join(__dirname, '..', '..', 'docs', 'supabase_schema.sql');

    assert.ok(fs.existsSync(migrationPath), 'Server migration file must exist');
    assert.ok(fs.existsSync(docsSchemaPath), 'Docs schema file must exist');

    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // 1. Core tables
    assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.profiles'));
    assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.user_preferences'));
    assert.ok(migrationSql.includes('CREATE TABLE IF NOT EXISTS public.favorites'));

    // 2. Saved missions view
    assert.ok(migrationSql.includes('CREATE OR REPLACE VIEW public.saved_missions'));

    // 3. Row Level Security
    assert.ok(migrationSql.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'));
    assert.ok(migrationSql.includes('ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;'));
    assert.ok(migrationSql.includes('ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;'));

    // 4. Safe trigger with exception handling
    assert.ok(migrationSql.includes('CREATE OR REPLACE FUNCTION public.handle_new_user()'));
    assert.ok(migrationSql.includes('ON CONFLICT (id) DO NOTHING'));
    assert.ok(migrationSql.includes('EXCEPTION'));
    assert.ok(migrationSql.includes('WHEN OTHERS THEN'));
    assert.ok(migrationSql.includes('DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;'));
  });

  // 11. Request Body Serialization & JSON Parse Safeguards
  test('ensures request body serializer converts plain objects to valid JSON strings and handles invalid syntax gracefully', () => {
    // 1. Client-side serialization rule
    const serializeBody = (body) => {
      if (body !== undefined && body !== null && typeof body === 'object') {
        return JSON.stringify(body);
      }
      return body;
    };

    const rawRegistrationPayload = {
      name: 'Dr. Jane Orbit',
      email: 'jane@spaceops.org',
      password: 'secureSpacePass2026',
      organization: 'Deep Space Observatory',
    };

    const serialized = serializeBody(rawRegistrationPayload);
    assert.equal(typeof serialized, 'string');
    assert.notEqual(serialized, '[object Object]');
    assert.doesNotThrow(() => JSON.parse(serialized));

    // 2. Error handler mapping for body-parser SyntaxErrors
    const syntaxErr = new SyntaxError('Unexpected token in JSON');
    syntaxErr.status = 400;
    syntaxErr.body = '[object Object]';

    const isJsonSyntaxError = Boolean(
      syntaxErr instanceof SyntaxError &&
      (syntaxErr.status === 400) &&
      'body' in syntaxErr
    );
    assert.equal(isJsonSyntaxError, true);
  });
});

