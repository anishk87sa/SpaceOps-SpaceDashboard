import { supabase, isSupabaseConfigured } from './supabaseClient';

export const profileService = {
  /**
   * Fetch user profile from public.profiles table
   */
  async getProfile(userId) {
    if (!userId) return { data: null, error: new Error('User ID is required') };

    if (!isSupabaseConfigured) {
      // Local fallback profile
      return {
        data: {
          id: userId,
          display_name: 'Space Explorer',
          username: 'explorer',
          avatar_url: '',
          affiliation: 'Independent Researcher',
          created_at: new Date().toISOString(),
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile from Supabase:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Profile fetch exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Update fields on public.profiles table
   */
  async updateProfile(userId, updates) {
    if (!userId) return { data: null, error: new Error('User ID is required') };

    if (!isSupabaseConfigured) {
      return { data: { id: userId, ...updates }, error: null };
    }

    try {
      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile in Supabase:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Profile update exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Delete account profile
   */
  async deleteProfile(userId) {
    if (!userId) return { error: new Error('User ID is required') };

    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },
};

export default profileService;
