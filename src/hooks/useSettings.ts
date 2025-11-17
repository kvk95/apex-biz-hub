import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Hook to ensure settings are loaded on any page
export const useSettings = () => {
  const { ensureSettingsLoaded } = useAuth();

  useEffect(() => {
    ensureSettingsLoaded();
  }, [ensureSettingsLoaded]);
};