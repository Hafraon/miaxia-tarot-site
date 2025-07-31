// Google Ads Conversion Tracking utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// ВИПРАВЛЕНО: Правильні Google Ads ID з GTM
export const GOOGLE_ADS_IDS = {
  PRIMARY: 'AW-7239891504',   // Основний аккаунт
  SECONDARY: 'AW-17416940719' // Додатковий аккаунт
};

// ВИПРАВЛЕНО: Правильні Conversion Labels з GTM
export const CONVERSION_LABELS = {
  PRIMARY_CONVERSION: 'urnsCLD0n_waEK_ZhfFA',      // AW-7239891504
  SECONDARY_CONVERSION: 'waLYCNbXjvwaEK_ZhfFA'     // AW-17416940719
};

// Ініціалізація Google Ads (вже в HTML)
export const initGoogleAds = () => {
  console.log('✅ Google Ads ініціалізація (вже в HTML)');
};

// Відстеження переходів між сторінками
export const trackPageView = (page_title: string, page_location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title,
      page_location,
      event_category: 'navigation'
    });
  }
};

// ВИПРАВЛЕНО: Головна функція конверсії з правильними ID
export const trackMainConversion = (service_name: string, value: number = 100) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Конверсія для основного аккаунта
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_IDS.PRIMARY}/${CONVERSION_LABELS.PRIMARY_CONVERSION}`,
      'value': value,
      'currency': 'UAH',
      'transaction_id': `order_${Date.now()}`,
      'service_name': service_name
    });
    
    // Конверсія для додаткового аккаунта
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_IDS.SECONDARY}/${CONVERSION_LABELS.SECONDARY_CONVERSION}`,
      'value': value,
      'currency': 'UAH',
      'transaction_id': `order_alt_${Date.now()}`,
      'service_name': service_name
    });
    
    // GA4 подія
    window.gtag('event', 'purchase', {
      'transaction_id': `tarot_${Date.now()}`,
      'value': value,
      'currency': 'UAH',
      'event_category': 'Замовлення',
      'event_label': service_name
    });
    
    console.log('✅ Конверсії відправлені:', service_name, value);
  }
};

// Використовуємо головну функцію для всіх типів конверсій
export const trackOrderFormConversion = (service_name: string, value: number = 100) => {
  trackMainConversion(service_name, value);
};

export const trackQuickOrderConversion = (service_name: string, value: number = 100) => {
  trackMainConversion(service_name, value);
};

export const trackConsultationConversion = (service_name: string, value: number = 100) => {
  trackMainConversion(service_name, value);
};

// Відстеження форм
export const trackFormStart = (form_name: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_start', {
      event_category: 'engagement',
      event_label: form_name
    });
  }
};

export const trackFormSubmit = (form_name: string, service_type?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submit', {
      event_category: 'engagement',
      event_label: form_name,
      service_type: service_type || 'general'
    });
  }
};

// Відстеження кліків
export const trackButtonClick = (button_name: string, location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'engagement',
      event_label: button_name,
      click_location: location
    });
  }
};

export const trackCardDraw = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'card_draw', {
      event_category: 'engagement',
      event_label: 'daily_card'
    });
  }
};

export const trackSocialClick = (platform: string, action: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'social_click', {
      event_category: 'social_media',
      event_label: `${platform}_${action}`,
      social_platform: platform
    });
  }
};

export const trackScroll = (percentage: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage
    });
  }
};

export const trackPageLoad = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_load', {
      event_category: 'technical',
      event_label: 'site_loaded'
    });
  }
};

// Відстеження часу на сторінці
export const trackTimeOnPage = (page_name: string, time_seconds: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_engagement', {
      event_category: 'engagement',
      event_label: page_name,
      value: time_seconds
    });
  }
};
