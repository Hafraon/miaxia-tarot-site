import { useState, useEffect, useCallback } from 'react';
import { TelegramService, TelegramMessage } from '../utils/telegramService';
import { LeadScore } from './useLeadScoring';

export type PopupType = 'exit-intent' | 'time-based' | 'behavior-based' | 'high-engagement';

interface PopupState {
  isOpen: boolean;
  type: PopupType | null;
  hasShown: {
    'exit-intent': boolean;
    'time-based': boolean;
    'behavior-based': boolean;
    'high-engagement': boolean;
  };
}

const useSmartPopups = (leadScore: LeadScore) => {
  const [popupState, setPopupState] = useState<PopupState>({
    isOpen: false,
    type: null,
    hasShown: {
      'exit-intent': false,
      'time-based': false,
      'behavior-based': false,
      'high-engagement': false
    }
  });

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 0 && 
        !popupState.hasShown['exit-intent'] && 
        !popupState.isOpen &&
        leadScore.timeOnSite > 30 // At least 30 seconds on site
      ) {
        showPopup('exit-intent');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [popupState.hasShown, popupState.isOpen, leadScore.timeOnSite]);

  // Time-based popup (3 minutes)
  useEffect(() => {
    if (
      leadScore.timeOnSite >= 180 && // 3 minutes
      !popupState.hasShown['time-based'] &&
      !popupState.isOpen
    ) {
      showPopup('time-based');
    }
  }, [leadScore.timeOnSite, popupState.hasShown, popupState.isOpen]);

  // Behavior-based popup (high interaction)
  useEffect(() => {
    if (
      leadScore.interactions >= 5 &&
      leadScore.scrollDepth >= 50 &&
      !popupState.hasShown['behavior-based'] &&
      !popupState.isOpen &&
      leadScore.timeOnSite > 60
    ) {
      showPopup('behavior-based');
    }
  }, [leadScore.interactions, leadScore.scrollDepth, leadScore.timeOnSite, popupState.hasShown, popupState.isOpen]);

  // High engagement popup (VIP users)
  useEffect(() => {
    if (
      leadScore.level === 'vip' &&
      !popupState.hasShown['high-engagement'] &&
      !popupState.isOpen
    ) {
      showPopup('high-engagement');
    }
  }, [leadScore.level, popupState.hasShown, popupState.isOpen]);

  const showPopup = useCallback((type: PopupType) => {
    // Don't show if any popup was recently shown
    const lastPopupTime = localStorage.getItem('lastPopupTime');
    if (lastPopupTime && Date.now() - parseInt(lastPopupTime) < 60000) { // 1 minute cooldown
      return;
    }

    setPopupState(prev => ({
      ...prev,
      isOpen: true,
      type,
      hasShown: {
        ...prev.hasShown,
        [type]: true
      }
    }));

    localStorage.setItem('lastPopupTime', Date.now().toString());
  }, []);

  const closePopup = useCallback(() => {
    setPopupState(prev => ({
      ...prev,
      isOpen: false,
      type: null
    }));
  }, []);

  const handlePopupSubmit = useCallback(async (data: { name: string; phone: string; email: string }) => {
    try {
      // Підготовка даних для Telegram
      const telegramData: TelegramMessage = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        formType: 'popup',
        leadScore: leadScore.totalScore,
        analytics: {
          timeOnSite: leadScore.timeOnSite,
          source: document.referrer || 'direct',
          completionTime: 5000, // Popup forms are quick
          interactions: leadScore.interactions,
          userAgent: navigator.userAgent
        }
      };

      // Відправка через TelegramService
      const result = await TelegramService.sendMessage(telegramData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send popup data');
      }

      // Track conversion
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'smart_popup_conversion', {
          event_category: 'lead_generation',
          event_label: popupState.type,
          lead_score: leadScore.totalScore,
          lead_level: leadScore.level
        });
      }

      return true;
    } catch (error) {
      console.error('Error submitting popup form:', error);
      throw error;
    }
  }, [popupState.type, leadScore]);

  return {
    popupState,
    closePopup,
    handlePopupSubmit,
    showPopup // For manual triggering
  };
};

export default useSmartPopups;