// hooks/useLeadTracker.ts - ВИПРАВЛЕНА ВЕРСІЯ
// Хук для відстеження поведінки користувачів та підрахунку лід-скору

import { useState, useEffect, useCallback, useRef } from 'react';

interface LeadData {
  leadId: string;
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  score: number;
  maxScroll: number;
  interactions: number;
  actions: Array<{
    type: string;
    value?: number;
    element?: string;
    form?: string;
    time: number;
    score: number;
  }>;
  source: string;
  device: string;
  converted: boolean;
}

interface LeadTrackerState {
  leadId: string;
  sessionId: string;
  startTime: number;
  score: number;
  maxScroll: number;
  interactions: number;
  actions: LeadData['actions'];
  isActive: boolean;
}

const useLeadTracker = () => {
  const [state, setState] = useState<LeadTrackerState>(() => {
    const leadId = `lead_${Date.now()}`;
    const sessionId = `session_${Date.now()}`;
    
    return {
      leadId,
      sessionId,
      startTime: Date.now(),
      score: 0,
      maxScroll: 0,
      interactions: 0,
      actions: [],
      isActive: true
    };
  });

  const timeSpentRef = useRef<number>(0);
  const lastActionTimeRef = useRef<number>(Date.now());

  // ВИПРАВЛЕНО: Визначаємо всі функції через useCallback спочатку
  const updateScore = useCallback((actionType: string, value?: number, element?: string, form?: string): number => {
    let scoreIncrease = 0;

    switch (actionType) {
      case 'time_30s':
        scoreIncrease = 5;
        break;
      case 'scroll_25':
        scoreIncrease = 10;
        break;
      case 'scroll_50':
        scoreIncrease = 20;
        break;
      case 'scroll_75':
        scoreIncrease = 30;
        break;
      case 'scroll_100':
        scoreIncrease = 40;
        break;
      case 'service_click':
        scoreIncrease = 15;
        break;
      case 'form_open':
        scoreIncrease = 25;
        break;
      case 'form_field_fill':
        scoreIncrease = 50;
        break;
      case 'form_submit':
        scoreIncrease = 100;
        break;
      case 'exit_intent':
        scoreIncrease = 30;
        break;
      case 'return_visit':
        scoreIncrease = 20;
        break;
      default:
        scoreIncrease = 1;
    }

    const currentTime = Date.now();
    const timeFromStart = Math.round((currentTime - state.startTime) / 1000);

    const newAction = {
      type: actionType,
      value,
      element,
      form,
      time: timeFromStart,
      score: scoreIncrease
    };

    setState(prevState => ({
      ...prevState,
      score: prevState.score + scoreIncrease,
      actions: [...prevState.actions, newAction]
    }));

    lastActionTimeRef.current = currentTime;
    return scoreIncrease;
  }, [state.startTime]);

  const getCurrentScore = useCallback((): number => {
    return state.score;
  }, [state.score]);

  const getTimeSpent = useCallback((): number => {
    return Math.round((Date.now() - state.startTime) / 1000);
  }, [state.startTime]);

  const getCurrentScrollPercent = useCallback((): number => {
    return state.maxScroll;
  }, [state.maxScroll]);

  const getCurrentInteractions = useCallback((): number => {
    return state.interactions;
  }, [state.interactions]);

  const getDeviceType = useCallback((): string => {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }, []);

  const getTrafficSource = useCallback((): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    if (utmSource) return utmSource;
    
    const referrer = document.referrer;
    if (referrer.includes('google')) return 'google';
    if (referrer.includes('facebook')) return 'facebook';
    if (referrer.includes('instagram')) return 'instagram';
    if (referrer.includes('t.me')) return 'telegram';
    if (referrer) return 'referral';
    
    return 'direct';
  }, []);

  const saveLeadData = useCallback(() => {
    try {
      const leadData: LeadData = {
        leadId: state.leadId,
        sessionId: state.sessionId,
        startTime: new Date(state.startTime).toISOString(),
        endTime: new Date().toISOString(),
        duration: getTimeSpent(),
        score: state.score,
        maxScroll: state.maxScroll,
        interactions: state.interactions,
        actions: state.actions,
        source: getTrafficSource(),
        device: getDeviceType(),
        converted: false
      };

      // Зберігаємо в localStorage
      const existingData = localStorage.getItem('miaxialip_leads');
      const leads = existingData ? JSON.parse(existingData) : [];
      
      // Перевіряємо чи існує вже такий лід
      const existingLeadIndex = leads.findIndex((lead: LeadData) => lead.leadId === state.leadId);
      
      if (existingLeadIndex >= 0) {
        leads[existingLeadIndex] = leadData;
      } else {
        leads.push(leadData);
      }

      // Обмежуємо кількість збережених лідів (останні 50)
      if (leads.length > 50) {
        leads.splice(0, leads.length - 50);
      }

      localStorage.setItem('miaxialip_leads', JSON.stringify(leads));
    } catch (error) {
      console.error('Помилка збереження lead data:', error);
    }
  }, [state, getTimeSpent, getTrafficSource, getDeviceType]);

  const trackScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;

    if (scrollPercentage > state.maxScroll) {
      setState(prevState => ({
        ...prevState,
        maxScroll: scrollPercentage
      }));

      // Додаємо бали за прокрутку
      if (scrollPercentage >= 25 && state.maxScroll < 25) {
        updateScore('scroll_25');
      } else if (scrollPercentage >= 50 && state.maxScroll < 50) {
        updateScore('scroll_50');
      } else if (scrollPercentage >= 75 && state.maxScroll < 75) {
        updateScore('scroll_75');
      } else if (scrollPercentage >= 100 && state.maxScroll < 100) {
        updateScore('scroll_100');
      }
    }
  }, [state.maxScroll, updateScore]);

  const trackInteraction = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      interactions: prevState.interactions + 1
    }));
  }, []);

  const trackServiceClick = useCallback((serviceName: string) => {
    updateScore('service_click', undefined, serviceName);
    trackInteraction();
  }, [updateScore, trackInteraction]);

  const trackFormOpen = useCallback((formName: string) => {
    updateScore('form_open', undefined, undefined, formName);
    trackInteraction();
  }, [updateScore, trackInteraction]);

  const trackFormFieldFill = useCallback((fieldName: string) => {
    updateScore('form_field_fill', undefined, fieldName);
    trackInteraction();
  }, [updateScore, trackInteraction]);

  const trackFormSubmit = useCallback((formName: string) => {
    updateScore('form_submit', undefined, undefined, formName);
    setState(prevState => ({
      ...prevState,
      converted: true
    }));
    saveLeadData();
  }, [updateScore, saveLeadData]);

  const trackExitIntent = useCallback(() => {
    updateScore('exit_intent');
    saveLeadData();
  }, [updateScore, saveLeadData]);

  // Відстеження часу кожні 30 секунд
  useEffect(() => {
    if (!state.isActive) return;

    const interval = setInterval(() => {
      timeSpentRef.current = getTimeSpent();
      
      // Додаємо бали за кожні 30 секунд
      if (timeSpentRef.current > 0 && timeSpentRef.current % 30 === 0) {
        updateScore('time_30s');
      }

      // Зберігаємо дані кожні 30 секунд
      saveLeadData();
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isActive, getTimeSpent, updateScore, saveLeadData]);

  // Відстеження прокрутки
  useEffect(() => {
    window.addEventListener('scroll', trackScroll, { passive: true });
    return () => window.removeEventListener('scroll', trackScroll);
  }, [trackScroll]);

  // Відстеження кліків
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Відстежуємо кліки по сервісах
      if (target.closest('[data-service]')) {
        const serviceName = target.closest('[data-service]')?.getAttribute('data-service') || 'unknown';
        trackServiceClick(serviceName);
      }
      
      // Відстежуємо відкриття форм
      if (target.closest('form') || target.closest('[data-form]')) {
        const formName = target.closest('form')?.getAttribute('name') || 
                        target.closest('[data-form]')?.getAttribute('data-form') || 'unknown';
        trackFormOpen(formName);
      }

      // Загальний клік
      trackInteraction();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackServiceClick, trackFormOpen, trackInteraction]);

  // Exit intent
  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY <= 0) {
        trackExitIntent();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [trackExitIntent]);

  // Відстеження фокусу на поля форм
  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        const fieldName = target.getAttribute('name') || target.getAttribute('id') || 'unknown';
        trackFormFieldFill(fieldName);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [trackFormFieldFill]);

  // Збереження при закритті сторінки
  useEffect(() => {
    const handleBeforeUnload = () => {
      setState(prevState => ({ ...prevState, isActive: false }));
      saveLeadData();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveLeadData]);

  // Функція для отримання всіх лідів
  const getAllLeads = useCallback((): LeadData[] => {
    try {
      const existingData = localStorage.getItem('miaxialip_leads');
      return existingData ? JSON.parse(existingData) : [];
    } catch (error) {
      console.error('Помилка отримання leads:', error);
      return [];
    }
  }, []);

  // Функція для отримання лідів за сьогоднішній день
  const getTodayLeads = useCallback((): LeadData[] => {
    const today = new Date().toDateString();
    return getAllLeads().filter(lead => {
      const leadDate = new Date(lead.startTime).toDateString();
      return leadDate === today;
    });
  }, [getAllLeads]);

  // Функція для отримання гарячих лідів (score >= 60)
  const getHotLeads = useCallback((): LeadData[] => {
    return getTodayLeads().filter(lead => lead.score >= 60);
  }, [getTodayLeads]);

  return {
    // Поточний стан
    leadId: state.leadId,
    sessionId: state.sessionId,
    score: state.score,
    maxScroll: state.maxScroll,
    interactions: state.interactions,
    timeSpent: getTimeSpent(),
    isActive: state.isActive,
    
    // Функції трекінгу
    trackServiceClick,
    trackFormOpen,
    trackFormFieldFill,
    trackFormSubmit,
    trackExitIntent,
    
    // Утілітарні функції
    getCurrentScore,
    getTimeSpent,
    getCurrentDuration: getTimeSpent, // Аліас для сумісності
    getCurrentScrollPercent, // ДОДАНО: функція для отримання відсотка прокрутки
    getCurrentInteractions, // ДОДАНО: функція для отримання кількості взаємодій
    saveLeadData,
    
    // Аналітика
    getAllLeads,
    getTodayLeads,
    getHotLeads
  };
};

export default useLeadTracker;