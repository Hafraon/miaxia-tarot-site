// Google Ads Conversion Tracking utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GOOGLE_ADS_ID = 'AW-11069742071'; // Замініть на ваш реальний Google Ads ID

// Conversion Labels для різних типів замовлень
export const CONVERSION_LABELS = {
  ORDER_FORM: 'LABEL_ORDER_FORM',        // Основна форма замовлення
  QUICK_ORDER: 'LABEL_QUICK_ORDER',      // Швидке замовлення (модальне вікно)
  CONSULTATION: 'LABEL_CONSULTATION'      // Консультації
};

// Ініціалізація Google Ads
export const initGoogleAds = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GOOGLE_ADS_ID, {
      page_title: 'MiaxiaLip Tarot',
      page_location: window.location.href,
      send_page_view: false
    });
  }
};

// Відстеження переходів між сторінками (для аналітики)
export const trackPageView = (page_title: string, page_location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title,
      page_location,
      event_category: 'navigation'
    });
  }
};

// Відстеження початку заповнення форми
export const trackFormStart = (form_name: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_start', {
      event_category: 'engagement',
      event_label: form_name,
      form_type: 'tarot_consultation'
    });
  }
};

// Відстеження відправки форми (не конверсія)
export const trackFormSubmit = (form_name: string, service_type?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_submit', {
      event_category: 'engagement',
      event_label: form_name,
      service_type: service_type || 'general_consultation'
    });
  }
};

// Google Ads конверсії для різних типів замовлень
export const trackOrderFormConversion = (service_name: string, value: number = 500) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_ID}/${CONVERSION_LABELS.ORDER_FORM}`,
      'value': value,
      'currency': 'UAH',
      'transaction_id': `order_${Date.now()}`,
      'service_name': service_name,
      'order_type': 'full_form'
    });
  }
};

export const trackQuickOrderConversion = (service_name: string, value: number = 300) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_ID}/${CONVERSION_LABELS.QUICK_ORDER}`,
      'value': value,
      'currency': 'UAH',
      'transaction_id': `quick_${Date.now()}`,
      'service_name': service_name,
      'order_type': 'quick_modal'
    });
  }
};

export const trackConsultationConversion = (service_name: string, value: number = 400) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_ID}/${CONVERSION_LABELS.CONSULTATION}`,
      'value': value,
      'currency': 'UAH',
      'transaction_id': `consultation_${Date.now()}`,
      'service_name': service_name,
      'order_type': 'consultation'
    });
  }
};

// Відстеження кліків по кнопках (для аналітики)
export const trackButtonClick = (button_name: string, location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'engagement',
      event_label: button_name,
      click_location: location
    });
  }
};

// Відстеження витягування карти дня
export const trackCardDraw = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'card_draw', {
      event_category: 'engagement',
      event_label: 'daily_card',
      service_type: 'free_service'
    });
  }
};

// Відстеження переходів по соціальних мережах
export const trackSocialClick = (platform: string, action: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'social_click', {
      event_category: 'social_media',
      event_label: `${platform}_${action}`,
      social_platform: platform
    });
  }
};

// Відстеження часу на сторінці
export const trackTimeOnPage = (page_name: string, time_seconds: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_engagement', {
      event_category: 'engagement',
      event_label: page_name,
      value: time_seconds,
      engagement_type: 'time_spent'
    });
  }
};

// Відстеження скролу сторінки
export const trackScroll = (percentage: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage
    });
  }
};

// Відстеження завантаження сторінки
export const trackPageLoad = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_load', {
      event_category: 'technical',
      event_label: 'site_loaded',
      page_type: 'tarot_landing'
    });
  }
};
