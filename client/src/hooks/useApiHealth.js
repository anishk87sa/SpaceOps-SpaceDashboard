import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api/client';

/**
 * Hook to monitor and query backend API health
 */
export function useApiHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.checkHealth();
      setHealth(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to SpaceOps API');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return {
    health,
    loading,
    error,
    refresh: fetchHealth,
  };
}
