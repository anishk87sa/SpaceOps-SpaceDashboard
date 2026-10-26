import { supabase, isSupabaseConfigured } from './supabaseClient';
import { safeGetJson, safeSetJson } from '../../utils/storage';

const DEFAULT_PREFERENCES = {
  theme: 'dark',
  timezone: 'UTC',
  dashboard_preferences: {
    showCountdowns: true,
    showOrbitalGlobe: true,
    favoriteDestinations: ['Mars', 'Moon'],
  },
  notification_preferences: {
    launchAlerts: true,
    eventAlerts: true,
    missionMilestones: false,
  },
};

export const preferencesService = {
  /**
   * Fetch user preferences from public.user_preferences table
   */
  async getPreferences(userId) {
    if (!userId) return { data: DEFAULT_PREFERENCES, error: null };

    if (!isSupabaseConfigured) {
      const local = safeGetJson(`spaceops_prefs_${userId}`, null);
      return { data: local || DEFAULT_PREFERENCES, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error.message);
        return { data: DEFAULT_PREFERENCES, error };
      }

      return { data: data || DEFAULT_PREFERENCES, error: null };
    } catch (err) {
      console.error('Preferences fetch exception:', err);
      return { data: DEFAULT_PREFERENCES, error: err };
    }
  },

  /**
   * Update user preferences in public.user_preferences table
   */
  async updatePreferences(userId, updates) {
    if (!userId) return { data: null, error: new Error('User ID is required') };

    if (!isSupabaseConfigured) {
      const current = safeGetJson(`spaceops_prefs_${userId}`, DEFAULT_PREFERENCES);
      const merged = { ...current, ...updates };
      safeSetJson(`spaceops_prefs_${userId}`, merged);
      return { data: merged, error: null };
    }

    try {
      const payload = {
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.error('Error saving preferences to Supabase:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Preferences update exception:', err);
      return { data: null, error: err };
    }
  },
};

export default preferencesService;
