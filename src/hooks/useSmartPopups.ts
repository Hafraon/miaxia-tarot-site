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
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitIntentShown, setExitIntentShown] = useState(false);
  const [userIsFillingForm, setUserIsFillingForm] = useState(false); // ✅ ДОДАНО: статус заповнення форми

  // ✅ ДОДАНО: Відстеження заповнення форм
  useEffect(() => {
    const checkFormActivity = () => {
      const activeElement = document.activeElement;
      const isFormInput = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT'
      );
      
      const hasFormData = Array.from(document.querySelectorAll('input, textarea')).some(
        input => (input as HTMLInputElement).value.trim().length > 0
      );

      setUserIsFillingForm(isFormInput || hasFormData);
    };

    const interval = setInterval(checkFormActivity, 1000);
    return () => clearInterval(interval);
  }, []);

  // Exit intent detection - БЕЗ ЗМІН
  useEffect(() => {
    let isExiting = false;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !exitIntentShown && !isExiting && leadScore.timeOnSite > 30) {
        isExiting = true;
        setShowExitPopup(true);
        setExitIntentShown(true);
      }
    };

    const inactivityTimer = setTimeout(() => {
      if (!exitIntentShown && !isExiting && leadScore.timeOnSite > 45) {
        isExiting = true;
        setShowExitPopup(true);
        setExitIntentShown(true);
      }
    }, 45000);

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(inactivityTimer);
    };
  }, [exitIntentShown, leadScore.timeOnSite]);

  // ✅ ВИПРАВЛЕНО: Time-based popup (5 хвилин замість 3)
  useEffect(() => {
    if (
      leadScore.timeOnSite >= 300 && // ✅ 5 хвилин замість 180 сек (3 хв)
      !popupState.hasShown['time-based'] &&
      !popupState.isOpen &&
      !userIsFillingForm // ✅ ДОДАНО: не показувати якщо заповнює форму
    ) {
      showPopup('time-based');
    }
  }, [leadScore.timeOnSite, popupState.hasShown, popupState.isOpen, userIsFillingForm]);

  // ✅ ВИПРАВЛЕНО: Behavior-based popup (більш жорсткі умови)
  useEffect(() => {
    if (
      leadScore.interactions >= 10 && // ✅ 10 замість 5 взаємодій
      leadScore.scrollDepth >= 75 && // ✅ 75% замість 50% прокрутки
      leadScore.timeOnSite > 180 && // ✅ 3 хвилини замість 60 сек
      !popupState.hasShown['behavior-based'] &&
      !popupState.isOpen &&
      !userIsFillingForm // ✅ ДОДАНО: не показувати якщо заповнює форму
    ) {
      showPopup('behavior-based');
    }
  }, [leadScore.interactions, leadScore.scrollDepth, leadScore.timeOnSite, popupState.hasShown, popupState.isOpen, userIsFillingForm]);

  // ✅ ВИПРАВЛЕНО: High engagement popup (додано затримку)
  useEffect(() => {
    if (
      leadScore.level === 'vip' &&
      leadScore.timeOnSite > 120 && // ✅ ДОДАНО: мінімум 2 хвилини навіть для VIP
      !popupState.hasShown['high-engagement'] &&
      !popupState.isOpen &&
      !userIsFillingForm // ✅ ДОДАНО: не показувати якщо заповнює форму
    ) {
      showPopup('high-engagement');
    }
  }, [leadScore.level, leadScore.timeOnSite, popupState.hasShown, popupState.isOpen, userIsFillingForm]);

  const showPopup = useCallback((type: PopupType) => {
    // ✅ ЗБІЛЬШЕНО: cooldown з 1 до 3 хвилин
    const lastPopupTime = localStorage.getItem('lastPopupTime');
    if (lastPopupTime && Date.now() - parseInt(lastPopupTime) < 180000) { // 3 хвилини cooldown
      console.log(`⏰ Popup ${type} заблокований cooldown'ом`);
      return;
    }

    // ✅ ДОДАНО: додаткова перевірка на заповнення форми
    if (userIsFillingForm) {
      console.log(`📝 Popup ${type} заблокований - користувач заповнює форму`);
      return;
    }

    console.log(`🎯 Показуємо popup: ${type}`);

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
  }, [userIsFillingForm]);

  const closePopup = useCallback(() => {
    console.log('❌ Закриваємо popup');
    setPopupState(prev => ({
      ...prev,
      isOpen: false,
      type: null
    }));
  }, []);

  const handlePopupSubmit = useCallback(async (data: { name: string; phone: string; email: string }) => {
    try {
      const telegramData: TelegramMessage = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        formType: 'popup',
        leadScore: leadScore.totalScore,
        analytics: {
          timeOnSite: leadScore.timeOnSite,
          source: document.referrer || 'direct',
          completionTime: 5000,
          interactions: leadScore.interactions,
          userAgent: navigator.userAgent
        }
      };

      const result = await TelegramService.sendMessage(telegramData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to send popup data');
      }

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
    showExitPopup,
    setShowExitPopup,
    closePopup,
    handlePopupSubmit,
    showPopup
  };
};

export default useSmartPopups;
