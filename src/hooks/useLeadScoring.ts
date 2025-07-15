import { useState, useEffect, useCallback } from 'react';

export interface LeadScore {
  timeOnSite: number;
  scrollDepth: number;
  interactions: number;
  totalScore: number;
  level: 'cold' | 'warm' | 'hot' | 'vip';
}

export interface UserBehavior {
  startTime: number;
  lastActivity: number;
  scrollEvents: number;
  clickEvents: number;
  formInteractions: number;
  pageViews: number;
  cardDraws: number;
  serviceViews: number;
}

const useLeadScoring = () => {
  const [behavior, setBehavior] = useState<UserBehavior>({
    startTime: Date.now(),
    lastActivity: Date.now(),
    scrollEvents: 0,
    clickEvents: 0,
    formInteractions: 0,
    pageViews: 1,
    cardDraws: 0,
    serviceViews: 0
  });

  const [leadScore, setLeadScore] = useState<LeadScore>({
    timeOnSite: 0,
    scrollDepth: 0,
    interactions: 0,
    totalScore: 0,
    level: 'cold'
  });

  // Calculate lead score based on behavior
  const calculateScore = useCallback((currentBehavior: UserBehavior): LeadScore => {
    const timeOnSite = Math.floor((Date.now() - currentBehavior.startTime) / 1000);
    const scrollDepth = Math.min(currentBehavior.scrollEvents * 5, 100);
    
    // Scoring weights
    const timeScore = Math.min(timeOnSite / 10, 50); // Max 50 points for time
    const scrollScore = scrollDepth * 0.3; // Max 30 points for scroll
    const interactionScore = (
      currentBehavior.clickEvents * 2 +
      currentBehavior.formInteractions * 10 +
      currentBehavior.cardDraws * 15 +
      currentBehavior.serviceViews * 8
    );
    
    const totalScore = Math.round(timeScore + scrollScore + interactionScore);
    
    // Determine lead level
    let level: LeadScore['level'] = 'cold';
    if (totalScore >= 200) level = 'vip';
    else if (totalScore >= 100) level = 'hot';
    else if (totalScore >= 50) level = 'warm';
    
    return {
      timeOnSite,
      scrollDepth: Math.round(scrollDepth),
      interactions: currentBehavior.clickEvents + currentBehavior.formInteractions + currentBehavior.cardDraws,
      totalScore,
      level
    };
  }, []);

  // Update score periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newScore = calculateScore(behavior);
      setLeadScore(newScore);
    }, 1000);

    return () => clearInterval(interval);
  }, [behavior, calculateScore]);

  // Track scroll events
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setBehavior(prev => ({
          ...prev,
          scrollEvents: prev.scrollEvents + 1,
          lastActivity: Date.now()
        }));
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Track click events
  useEffect(() => {
    const handleClick = () => {
      setBehavior(prev => ({
        ...prev,
        clickEvents: prev.clickEvents + 1,
        lastActivity: Date.now()
      }));
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Manual tracking functions
  const trackFormInteraction = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      formInteractions: prev.formInteractions + 1,
      lastActivity: Date.now()
    }));
  }, []);

  const trackCardDraw = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      cardDraws: prev.cardDraws + 1,
      lastActivity: Date.now()
    }));
  }, []);

  const trackServiceView = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      serviceViews: prev.serviceViews + 1,
      lastActivity: Date.now()
    }));
  }, []);

  const trackPageView = useCallback(() => {
    setBehavior(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1,
      lastActivity: Date.now()
    }));
  }, []);

  return {
    leadScore,
    behavior,
    trackFormInteraction,
    trackCardDraw,
    trackServiceView,
    trackPageView
  };
};

export default useLeadScoring;