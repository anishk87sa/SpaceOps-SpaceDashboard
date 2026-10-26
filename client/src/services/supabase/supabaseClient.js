import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Use publishable key as primary; fallback to legacy anon key if provided
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  !supabasePublishableKey.includes('placeholder') &&
  !supabasePublishableKey.includes('your-supabase') &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://'))
);

function createChainableQuery(defaultData = null) {
  const queryResult = { data: defaultData, error: null };
  const handler = {
    get(target, prop) {
      if (prop === 'then') {
        return (resolve, reject) => Promise.resolve(queryResult).then(resolve, reject);
      }
      if (prop === 'catch') {
        return (reject) => Promise.resolve(queryResult).catch(reject);
      }
      return () => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

// Fallback dummy client for when keys are unconfigured (prevents app initialization crash)
const fallbackClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: async () => ({
      data: null,
      error: new Error('Supabase credentials are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in client/.env to enable cloud accounts.'),
    }),
    signInWithPassword: async () => ({
      data: null,
      error: new Error('Supabase credentials are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in client/.env to enable cloud accounts.'),
    }),
    signInWithOAuth: async () => ({
      data: null,
      error: new Error('Google OAuth requires valid Supabase credentials.'),
    }),
    resetPasswordForEmail: async () => ({
      data: null,
      error: new Error('Password reset requires configured Supabase credentials.'),
    }),
    updateUser: async () => ({
      data: null,
      error: new Error('Password update requires configured Supabase credentials.'),
    }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    resend: async () => ({
      data: null,
      error: new Error('Resend requires configured Supabase credentials.'),
    }),
  },
  from: () => createChainableQuery(null),
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : fallbackClient;

export default supabase;
