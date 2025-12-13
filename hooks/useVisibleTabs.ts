import { useMemo } from 'react';
import { getVisibleTabs } from '../utils/tabConfig';
import { useAuth } from '../contexts/AuthContext';

export const useVisibleTabs = () => {
  const { profile } = useAuth();

  const visibleTabs = useMemo(() => {
    return getVisibleTabs((profile?.role as any) || null);
  }, [profile?.role]);

  return visibleTabs;
};
