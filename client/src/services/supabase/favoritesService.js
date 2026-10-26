import { supabase, isSupabaseConfigured } from './supabaseClient';
import { getLocalBookmarks, setLocalBookmarks } from '../../utils/storage';

export const favoritesService = {
  /**
   * Fetch all favorites for an authenticated user from public.favorites
   */
  async getFavorites(userId) {
    if (!userId) return { data: [], error: null };

    if (!isSupabaseConfigured) {
      const saved = getLocalBookmarks();
      return { data: saved, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites from Supabase:', error.message);
        const saved = getLocalBookmarks();
        return { data: saved, error };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error('Favorites fetch exception:', err);
      const saved = getLocalBookmarks();
      return { data: saved, error: err };
    }
  },

  /**
   * Check if a specific entity is already favorited by the user
   */
  async isFavorited(userId, entityType, entityId) {
    if (!userId || !entityType || !entityId) return false;

    const ids = Array.isArray(entityId) ? entityId.map(String) : [String(entityId)];

    if (!isSupabaseConfigured) {
      const saved = getLocalBookmarks();
      return saved.some((b) => ids.some((id) => b.entity_id === id || b.id === id || b.slug === id));
    }

    try {
      let query = supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('entity_type', entityType.toLowerCase());

      if (ids.length === 1) {
        query = query.eq('entity_id', ids[0]);
      } else {
        query = query.in('entity_id', ids);
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (error) {
        console.warn('Error checking favorite status:', error.message);
        return false;
      }

      return Boolean(data);
    } catch {
      return false;
    }
  },

  /**
   * Add an entity to user's favorites
   */
  async addFavorite(userId, { entityType, entityId, entityName, metadata = {} }) {
    if (!userId) {
      return { data: null, error: new Error('User authentication is required to save favorites.') };
    }
    if (!entityType || !entityId) {
      return { data: null, error: new Error('Entity type and identifier are required.') };
    }

    const payload = {
      user_id: userId,
      entity_type: entityType.toLowerCase(),
      entity_id: String(entityId),
      entity_name: entityName || entityId,
      metadata: metadata || {},
    };

    // Mirror to local bookmarks for unified experience
    try {
      const saved = getLocalBookmarks();
      const exists = saved.some((b) => (b.entity_id === String(entityId) || b.id === entityId || b.slug === entityId));
      if (!exists) {
        saved.unshift({
          id: entityId,
          entity_id: String(entityId),
          entity_type: entityType,
          title: entityName || entityId,
          itemType: entityType,
          summary: metadata.summary || '',
          url: metadata.url || `/${entityType.toLowerCase()}s/${entityId}`,
          created_at: new Date().toISOString(),
        });
        setLocalBookmarks(saved);
      }
    } catch (e) {
      // Ignore local storage error
    }

    if (!isSupabaseConfigured) {
      return { data: payload, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert(payload)
        .select()
        .single();

      if (error) {
        // Unique violation code 23505 in postgres
        if (error.code === '23505') {
          return { data: payload, error: null }; // Already favorited
        }
        console.error('Error inserting favorite in Supabase:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Add favorite exception:', err);
      return { data: null, error: err };
    }
  },

  /**
   * Remove an entity from user's favorites
   */
  async removeFavorite(userId, entityType, entityId) {
    if (!userId || !entityType || !entityId) {
      return { success: false, error: new Error('Missing required arguments to remove favorite.') };
    }

    const idsToRemove = Array.isArray(entityId) ? entityId.map(String) : [String(entityId)];

    // Mirror remove to local bookmarks
    try {
      const saved = getLocalBookmarks();
      const filtered = saved.filter((b) => !idsToRemove.some((id) => b.entity_id === id || b.id === id || b.slug === id));
      setLocalBookmarks(filtered);
    } catch (e) {
      // Ignore
    }

    if (!isSupabaseConfigured) {
      return { success: true, error: null };
    }

    try {
      let query = supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('entity_type', entityType.toLowerCase());

      if (idsToRemove.length === 1) {
        query = query.eq('entity_id', idsToRemove[0]);
      } else {
        query = query.in('entity_id', idsToRemove);
      }

      const { error } = await query;

      if (error) {
        console.error('Error removing favorite from Supabase:', error.message);
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error('Remove favorite exception:', err);
      return { success: false, error: err };
    }
  },
};

export default favoritesService;
