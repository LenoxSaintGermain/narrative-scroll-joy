import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type EngagementType = 'shelve' | 'ovation' | 'view';

interface EngagementCounts {
  shelves: number;
  ovations: number;
  views: number;
}

interface UseStoryEngagementReturn {
  counts: EngagementCounts;
  userEngagements: Set<EngagementType>;
  toggleEngagement: (type: EngagementType) => Promise<void>;
  recordView: () => Promise<void>;
  isLoading: boolean;
}

// Get or create a session ID for anonymous engagement tracking
const getSessionId = (): string => {
  const key = 'story_session_id';
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
};

export const useStoryEngagement = (narrativeId: string): UseStoryEngagementReturn => {
  const [counts, setCounts] = useState<EngagementCounts>({ shelves: 0, ovations: 0, views: 0 });
  const [userEngagements, setUserEngagements] = useState<Set<EngagementType>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  
  const sessionId = getSessionId();

  const fetchEngagements = useCallback(async () => {
    try {
      // Fetch counts
      const { data: allEngagements } = await supabase
        .from('story_engagements')
        .select('engagement_type')
        .eq('narrative_id', narrativeId);

      if (allEngagements) {
        const newCounts = {
          shelves: allEngagements.filter(e => e.engagement_type === 'shelve').length,
          ovations: allEngagements.filter(e => e.engagement_type === 'ovation').length,
          views: allEngagements.filter(e => e.engagement_type === 'view').length,
        };
        setCounts(newCounts);
      }

      // Fetch user's engagements
      const { data: userEngs } = await supabase
        .from('story_engagements')
        .select('engagement_type')
        .eq('narrative_id', narrativeId)
        .eq('session_id', sessionId);

      if (userEngs) {
        setUserEngagements(new Set(userEngs.map(e => e.engagement_type as EngagementType)));
      }
    } catch (error) {
      console.error('Error fetching engagements:', error);
    } finally {
      setIsLoading(false);
    }
  }, [narrativeId, sessionId]);

  useEffect(() => {
    fetchEngagements();
  }, [fetchEngagements]);

  const toggleEngagement = useCallback(async (type: EngagementType) => {
    const hasEngagement = userEngagements.has(type);
    
    try {
      if (hasEngagement) {
        // Remove engagement
        await supabase
          .from('story_engagements')
          .delete()
          .eq('narrative_id', narrativeId)
          .eq('session_id', sessionId)
          .eq('engagement_type', type);
        
        setUserEngagements(prev => {
          const next = new Set(prev);
          next.delete(type);
          return next;
        });
        
        setCounts(prev => ({
          ...prev,
          [type === 'shelve' ? 'shelves' : type === 'ovation' ? 'ovations' : 'views']: 
            Math.max(0, prev[type === 'shelve' ? 'shelves' : type === 'ovation' ? 'ovations' : 'views'] - 1)
        }));
      } else {
        // Add engagement
        await supabase
          .from('story_engagements')
          .insert({
            narrative_id: narrativeId,
            session_id: sessionId,
            engagement_type: type,
          });
        
        setUserEngagements(prev => new Set([...prev, type]));
        
        setCounts(prev => ({
          ...prev,
          [type === 'shelve' ? 'shelves' : type === 'ovation' ? 'ovations' : 'views']: 
            prev[type === 'shelve' ? 'shelves' : type === 'ovation' ? 'ovations' : 'views'] + 1
        }));
      }
    } catch (error) {
      console.error('Error toggling engagement:', error);
      // Refresh to get accurate state
      fetchEngagements();
    }
  }, [narrativeId, sessionId, userEngagements, fetchEngagements]);

  const recordView = useCallback(async () => {
    if (userEngagements.has('view')) return;
    
    try {
      await supabase
        .from('story_engagements')
        .insert({
          narrative_id: narrativeId,
          session_id: sessionId,
          engagement_type: 'view',
        });
      
      setUserEngagements(prev => new Set([...prev, 'view']));
      setCounts(prev => ({ ...prev, views: prev.views + 1 }));
    } catch (error) {
      // View already recorded or error - ignore
    }
  }, [narrativeId, sessionId, userEngagements]);

  return {
    counts,
    userEngagements,
    toggleEngagement,
    recordView,
    isLoading,
  };
};
