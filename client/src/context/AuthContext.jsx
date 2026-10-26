import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase/supabaseClient';
import { profileService } from '../services/supabase/profileService';
import { preferencesService } from '../services/supabase/preferencesService';
import { apiClient } from '../services/api/client';
import { safeGetJson } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to load profile and preferences for a user
  const loadUserData = useCallback(async (userId, authUser) => {
    if (!userId) {
      setProfile(null);
      setPreferences(null);
      return;
    }

    try {
      const [profRes, prefRes] = await Promise.all([
        profileService.getProfile(userId),
        preferencesService.getPreferences(userId),
      ]);

      if (profRes.data) {
        setProfile(profRes.data);
      } else if (authUser) {
        // Fallback profile based on auth user metadata
        setProfile({
          id: userId,
          display_name: authUser.user_metadata?.display_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0],
          avatar_url: authUser.user_metadata?.avatar_url || '',
          affiliation: authUser.user_metadata?.affiliation || 'Space Enthusiast',
          created_at: authUser.created_at,
        });
      }

      if (prefRes.data) {
        setPreferences(prefRes.data);
      }
    } catch (err) {
      console.warn('Error loading user profile/preferences:', err);
    }
  }, []);

  // Initialize Supabase Auth Session and subscribe to auth state changes
  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      try {
        if (isSupabaseConfigured) {
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Supabase getSession warning:', error.message);
          }

          if (isMounted) {
            if (initialSession?.user) {
              setSession(initialSession);
              setUser(initialSession.user);
              // Store token for backward compatibility with backend API requests
              localStorage.setItem('spaceops_token', initialSession.access_token);
              await loadUserData(initialSession.user.id, initialSession.user);
            } else {
              // Check local storage for quick demo user fallback if no Supabase session
              const savedUser = safeGetJson('spaceops_user', null) || safeGetJson('orbitron_user', null);
              const savedToken = localStorage.getItem('spaceops_token') || localStorage.getItem('orbitron_token');
              if (savedUser && savedToken) {
                setUser(savedUser);
                setSession({ access_token: savedToken, user: savedUser });
              }
            }
          }
        } else {
          // Supabase not configured: restore demo or local storage user
          const savedUser = safeGetJson('spaceops_user', null) || safeGetJson('orbitron_user', null);
          const savedToken = localStorage.getItem('spaceops_token') || localStorage.getItem('orbitron_token');
          if (savedUser && savedToken) {
            setUser(savedUser);
            setSession({ access_token: savedToken, user: savedUser });
            setProfile({
              id: savedUser.id,
              display_name: savedUser.name,
              username: savedUser.email?.split('@')[0],
              avatar_url: '',
              affiliation: savedUser.organization || 'SpaceOps Explorer',
              created_at: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeSession();

    // Subscribe to auth state changes if Supabase is configured
    let subscription = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setSession(newSession);
          setUser(newSession?.user || null);
          if (newSession?.access_token) {
            localStorage.setItem('spaceops_token', newSession.access_token);
          }
          if (newSession?.user) {
            await loadUserData(newSession.user.id, newSession.user);
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setPreferences(null);
          localStorage.removeItem('spaceops_token');
          localStorage.removeItem('spaceops_user');
          localStorage.removeItem('orbitron_token');
          localStorage.removeItem('orbitron_user');
          setLoading(false);
        } else if (event === 'PASSWORD_RECOVERY') {
          // Redirect handled by reset-password route
          setSession(newSession);
          setUser(newSession?.user || null);
          setLoading(false);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [loadUserData]);

  /**
   * Log in using email and password via Supabase Auth
   */
  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter both your email address and password.');
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(error.message || 'Authentication failed. Please check your credentials.');
      }

      setSession(data.session);
      setUser(data.user);
      if (data.session?.access_token) {
        localStorage.setItem('spaceops_token', data.session.access_token);
      }
      await loadUserData(data.user.id, data.user);
      return data.user;
    } else {
      // Fallback local API login when running without Supabase credentials
      const res = await apiClient.login({ email, password });
      if (res?.data?.token) {
        const u = res.data.user;
        const fakeSession = { access_token: res.data.token, user: u };
        setSession(fakeSession);
        setUser(u);
        localStorage.setItem('spaceops_token', res.data.token);
        localStorage.setItem('spaceops_user', JSON.stringify(u));
        setProfile({
          id: u.id,
          display_name: u.name,
          username: u.email?.split('@')[0],
          avatar_url: '',
          affiliation: u.organization || 'SpaceOps Explorer',
          created_at: new Date().toISOString(),
        });
        return u;
      }
      throw new Error('Invalid login response from mission server');
    }
  }, [loadUserData]);

  /**
   * Register a new account via Supabase Auth
   */
  const register = useCallback(async ({ email, password, displayName, username, affiliation }) => {
    if (!email || !password) {
      throw new Error('Email and password are required for registration.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const trimmedEmail = email.trim();
    const resolvedName = displayName?.trim() || trimmedEmail.split('@')[0];
    const resolvedUsername = username?.trim() || trimmedEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            display_name: resolvedName,
            username: resolvedUsername,
            affiliation: affiliation?.trim() || 'Space Explorer',
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }

      // Check if email confirmation is required (session may be null if confirmation is on)
      const needsEmailVerification = Boolean(data.user && !data.session);
      // Supabase returns an empty identities array if user already registered with this email
      const isExistingUser = Boolean(data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0);

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        localStorage.setItem('spaceops_token', data.session.access_token);
        await loadUserData(data.user.id, data.user);
      }

      return {
        user: data.user,
        session: data.session,
        needsEmailVerification,
        isExistingUser,
      };
    } else {
      // Fallback local API register
      const res = await apiClient.register({
        name: resolvedName,
        email: trimmedEmail,
        password,
        organization: affiliation,
      });

      if (res?.data?.token) {
        const u = res.data.user;
        const fakeSession = { access_token: res.data.token, user: u };
        setSession(fakeSession);
        setUser(u);
        localStorage.setItem('spaceops_token', res.data.token);
        localStorage.setItem('spaceops_user', JSON.stringify(u));
        setProfile({
          id: u.id,
          display_name: u.name,
          username: resolvedUsername,
          avatar_url: '',
          affiliation: affiliation || 'SpaceOps Explorer',
          created_at: new Date().toISOString(),
        });
        return { user: u, session: fakeSession, needsEmailVerification: false };
      }
      throw new Error('Registration failed.');
    }
  }, [loadUserData]);

  /**
   * Google OAuth sign-in
   */
  const loginWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Google OAuth requires Supabase configuration with Client ID/Secret configured in the Supabase Dashboard.');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      throw new Error(error.message || 'Google authentication failed.');
    }

    return data;
  }, []);

  /**
   * Request password reset instructions via Supabase Auth
   */
  const forgotPassword = useCallback(async (email) => {
    if (!email) {
      throw new Error('Please enter your account email address.');
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        // Log silently and return generic neutral response to avoid account enumeration
        console.warn('Password reset notice:', error.message);
      }

      return {
        success: true,
        message: 'If an account exists with this email, password recovery instructions have been sent.',
      };
    } else {
      return await apiClient.forgotPassword(email);
    }
  }, []);

  /**
   * Update password for current recovery or authenticated session
   */
  const resetPassword = useCallback(async (newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must contain at least 6 characters.');
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message || 'Failed to update password.');
      }

      return data;
    } else {
      return { success: true, message: 'Password updated successfully.' };
    }
  }, []);

  /**
   * Resend signup email verification instructions
   */
  const resendVerificationEmail = useCallback(async (email) => {
    if (!email) {
      throw new Error('Please enter your email address to resend verification.');
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to resend confirmation email.');
      }

      return {
        success: true,
        message: 'A fresh verification email has been dispatched. Please check your inbox and spam folder.',
      };
    } else {
      throw new Error('Supabase credentials are not configured in client/.env. Verification emails require active Supabase keys.');
    }
  }, []);

  /**
   * Sign out current user
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('SignOut warning:', e.message);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setPreferences(null);
      localStorage.removeItem('spaceops_token');
      localStorage.removeItem('spaceops_user');
      localStorage.removeItem('orbitron_token');
      localStorage.removeItem('orbitron_user');
      setLoading(false);
    }
  }, []);

  /**
   * Quick demo login for local development / evaluation
   */
  const demoLogin = useCallback(async (role = 'Space Science Curator') => {
    let email = 'admin@spaceops.org';
    if (role === 'Astronomy Observer' || role === 'Operations Manager') email = 'operator@spaceops.org';
    if (role === 'Student Researcher' || role === 'Analyst') email = 'analyst@spaceops.org';

    return await login(email, 'spaceops2026');
  }, [login]);

  /**
   * Update profile fields in Supabase
   */
  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error('Must be signed in to update profile.');
    const res = await profileService.updateProfile(user.id, updates);
    if (res.error) throw res.error;
    if (res.data) setProfile(res.data);
    return res.data;
  }, [user]);

  /**
   * Update preferences in Supabase
   */
  const updatePreferences = useCallback(async (updates) => {
    if (!user) throw new Error('Must be signed in to update preferences.');
    const res = await preferencesService.updatePreferences(user.id, updates);
    if (res.error) throw res.error;
    if (res.data) setPreferences(res.data);
    return res.data;
  }, [user]);

  /**
   * Delete account workflow
   */
  const deleteAccount = useCallback(async () => {
    if (!user) return;
    try {
      await profileService.deleteProfile(user.id);
      await logout();
    } catch (err) {
      console.error('Delete account error:', err);
      throw err;
    }
  }, [user, logout]);

  const value = useMemo(() => ({
    user,
    session,
    profile,
    preferences,
    loading,
    isAuthenticated: Boolean(user),
    isConfigured: isSupabaseConfigured,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    logout,
    demoLogin,
    updateProfile,
    updatePreferences,
    deleteAccount,
    hasRole: (allowedRoles) => {
      if (!user) return false;
      if (!allowedRoles || allowedRoles.length === 0) return true;
      const role = profile?.affiliation || user.role || 'Explorer';
      return allowedRoles.includes(role);
    },
  }), [
    user,
    session,
    profile,
    preferences,
    loading,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    logout,
    demoLogin,
    updateProfile,
    updatePreferences,
    deleteAccount,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
