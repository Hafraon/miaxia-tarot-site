// utils/leadReporting.ts - ВИПРАВЛЕНА ВЕРСІЯ
// Система аналітики лідів для MiaxiaLip з виправленням JSON помилок

interface UserBehavior {
  timeOnSite: number;
  scrollPercentage: number;
  interactions: number;
  pageViews: number;
  source: string;
  device: string;
}

interface LeadData {
  id: string;
  score: number;
  behavior: UserBehavior;
  timestamp: number;
  status: 'active' | 'converted' | 'left';
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

class LeadReportingService {
  private startTime: number;
  private interactions: number = 0;
  private maxScroll: number = 0;
  private leadId: string;
  private reportingInterval: NodeJS.Timeout | null = null;
  private isDestroyed: boolean = false;

  constructor() {
    this.startTime = Date.now();
    this.leadId = this.generateLeadId();
    this.cleanupCorruptedData(); // ДОДАНО: очищення некоректних даних
    this.init();
  }

  private generateLeadId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ДОДАНО: Очищення некоректних даних з localStorage
  private cleanupCorruptedData(): void {
    try {
      const storageKey = 'miaxialip_lead_analytics';
      const existingData = localStorage.getItem(storageKey);
      
      if (existingData) {
        // Спробуємо спарсити дані
        try {
          JSON.parse(existingData);
        } catch (error) {
          console.warn('Виявлено некоректні дані в localStorage, очищуємо...', error);
          localStorage.removeItem(storageKey);
          
          // Створюємо чисту структуру
          const cleanData = {
            leads: [],
            events: [],
            lastCleanup: Date.now()
          };
          localStorage.setItem(storageKey, JSON.stringify(cleanData));
        }
      }
    } catch (error) {
      console.error('Помилка очищення localStorage:', error);
      // У крайньому випадку просто видаляємо ключ
      try {
        localStorage.removeItem('miaxialip_lead_analytics');
      } catch (e) {
        console.error('Не вдалося очистити localStorage:', e);
      }
    }
  }

  private init(): void {
    if (this.isDestroyed) return;
    
    this.trackScrolling();
    this.trackInteractions();
    this.trackTimeOnSite();
    this.startReporting();
  }

  private trackScrolling(): void {
    const handleScroll = () => {
      if (this.isDestroyed) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      
      if (scrollPercentage > this.maxScroll) {
        this.maxScroll = Math.min(scrollPercentage, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private trackInteractions(): void {
    const trackEvent = () => {
      if (this.isDestroyed) return;
      this.interactions++;
    };

    // Відстежуємо різні типи взаємодій
    document.addEventListener('click', trackEvent);
    document.addEventListener('keydown', trackEvent);
    document.addEventListener('touchstart', trackEvent);
    
    // Відстежуємо фокус на форми
    document.addEventListener('focusin', (e) => {
      if (this.isDestroyed) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        this.interactions += 2; // Фокус на форму = більший інтерес
      }
    });
  }

  private trackTimeOnSite(): void {
    // Відстежуємо коли користувач покидає сторінку
    document.addEventListener('visibilitychange', () => {
      if (this.isDestroyed) return;
      if (document.hidden) {
        this.sendLeadReport('paused');
      } else {
        this.sendLeadReport('resumed');
      }
    });

    // Exit intent
    document.addEventListener('mouseleave', (e) => {
      if (this.isDestroyed) return;
      if (e.clientY <= 5) {
        this.sendLeadReport('exit_intent');
      }
    });
  }

  private calculateLeadScore(): number {
    const timeOnSite = (Date.now() - this.startTime) / 1000; // в секундах
    
    let score = 0;
    
    // Час на сайті (до 40 балів)
    if (timeOnSite > 300) score += 40; // 5+ хвилин
    else if (timeOnSite > 180) score += 30; // 3+ хвилини
    else if (timeOnSite > 120) score += 20; // 2+ хвилини
    else if (timeOnSite > 60) score += 10; // 1+ хвилина
    
    // Прокрутка (до 30 балів)
    if (this.maxScroll >= 90) score += 30;
    else if (this.maxScroll >= 70) score += 20;
    else if (this.maxScroll >= 50) score += 15;
    else if (this.maxScroll >= 25) score += 10;
    
    // Взаємодії (до 30 балів)
    if (this.interactions >= 10) score += 30;
    else if (this.interactions >= 7) score += 25;
    else if (this.interactions >= 5) score += 20;
    else if (this.interactions >= 3) score += 15;
    else if (this.interactions >= 1) score += 10;
    
    return Math.min(score, 100);
  }

  private getLeadData(): LeadData {
    const timeOnSite = (Date.now() - this.startTime) / 1000;
    
    return {
      id: this.leadId,
      score: this.calculateLeadScore(),
      behavior: {
        timeOnSite: Math.round(timeOnSite),
        scrollPercentage: this.maxScroll,
        interactions: this.interactions,
        pageViews: 1,
        source: document.referrer || 'direct',
        device: this.getDeviceType()
      },
      timestamp: Date.now(),
      status: 'active'
    };
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private async sendLeadReport(event: string = 'update'): Promise<void> {
    if (this.isDestroyed) return;
    
    try {
      const leadData = this.getLeadData();
      
      // Відправляємо дані в Telegram якщо лід "гарячий"
      if (leadData.score >= 60 && event === 'exit_intent') {
        await this.sendHotLeadAlert(leadData);
      }
      
      // Локальне збереження для аналітики
      this.saveLeadLocally(leadData, event);
      
    } catch (error) {
      console.error('Помилка відправки лід-репорту:', error);
    }
  }

  private async sendHotLeadAlert(leadData: LeadData): Promise<void> {
    const message = `🔥 ГАРЯЧИЙ ЛІД НА САЙТІ!

👤 ID: ${leadData.id}
📊 Скор: ${leadData.score}
⏰ На сайті: ${Math.floor(leadData.behavior.timeOnSite / 60)}:${(leadData.behavior.timeOnSite % 60).toString().padStart(2, '0')}
📱 Прокрутка: ${leadData.behavior.scrollPercentage}%
🖱️ Взаємодії: ${leadData.behavior.interactions}
📱 Пристрій: ${leadData.behavior.device}

💡 ДІЇ: Зателефонувати або запустити чат!
🌐 Сайт: theglamstyle.com.ua`;

    try {
      // Відправляємо через існуючу систему Telegram
      const response = await fetch('/telegram-notify.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Гарячий лід',
          phone: `Скор: ${leadData.score}`,
          service: 'Lead Analytics Alert',
          message: message,
          source: 'Lead Scoring System'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Помилка відправки алерту:', error);
    }
  }

  // ВИПРАВЛЕНО: Безпечне збереження з обробкою помилок
  private saveLeadLocally(leadData: LeadData, event: string): void {
    try {
      const storageKey = 'miaxialip_lead_analytics';
      let analytics;
      
      try {
        const existingData = localStorage.getItem(storageKey);
        analytics = existingData ? JSON.parse(existingData) : { leads: [], events: [] };
      } catch (parseError) {
        console.warn('Помилка парсингу існуючих даних, створюємо нові:', parseError);
        analytics = { leads: [], events: [] };
      }
      
      // Перевіряємо структуру даних
      if (!analytics.leads || !Array.isArray(analytics.leads)) {
        analytics.leads = [];
      }
      if (!analytics.events || !Array.isArray(analytics.events)) {
        analytics.events = [];
      }
      
      // Оновлюємо або додаємо лід
      const existingLeadIndex = analytics.leads.findIndex((l: LeadData) => l?.id === leadData.id);
      if (existingLeadIndex >= 0) {
        analytics.leads[existingLeadIndex] = leadData;
      } else {
        analytics.leads.push(leadData);
      }
      
      // Додаємо подію
      analytics.events.push({
        leadId: leadData.id,
        event: event,
        timestamp: Date.now(),
        score: leadData.score
      });
      
      // Обмежуємо кількість записів
      if (analytics.leads.length > 100) {
        analytics.leads = analytics.leads.slice(-50);
      }
      if (analytics.events.length > 500) {
        analytics.events = analytics.events.slice(-200);
      }
      
      // Безпечне збереження
      const dataToSave = JSON.stringify(analytics);
      localStorage.setItem(storageKey, dataToSave);
      
    } catch (error) {
      console.error('Помилка збереження аналітики:', error);
      
      // Спробуємо очистити та почати заново
      try {
        localStorage.removeItem('miaxialip_lead_analytics');
        const cleanData = { leads: [leadData], events: [{ leadId: leadData.id, event, timestamp: Date.now(), score: leadData.score }] };
        localStorage.setItem('miaxialip_lead_analytics', JSON.stringify(cleanData));
      } catch (fallbackError) {
        console.error('Критична помилка збереження:', fallbackError);
      }
    }
  }

  private startReporting(): void {
    if (this.isDestroyed) return;
    
    // Звітуємо кожні 30 секунд
    this.reportingInterval = setInterval(() => {
      if (!this.isDestroyed) {
        this.sendLeadReport('periodic');
      }
    }, 30000);
  }

  // ВИПРАВЛЕНО: Безпечне отримання аналітики
  public getAnalytics(): any {
    try {
      const data = localStorage.getItem('miaxialip_lead_analytics');
      if (!data) return { leads: [], events: [] };
      
      const parsed = JSON.parse(data);
      
      // Перевіряємо структуру
      if (!parsed.leads || !Array.isArray(parsed.leads)) {
        parsed.leads = [];
      }
      if (!parsed.events || !Array.isArray(parsed.events)) {
        parsed.events = [];
      }
      
      return parsed;
    } catch (error) {
      console.error('Помилка отримання аналітики:', error);
      return { leads: [], events: [] };
    }
  }

  // ВИПРАВЛЕНО: Безпечне отримання лідів за дату
  public getAllLeadsForDate(date: string): LeadData[] {
    try {
      const analytics = this.getAnalytics();
      if (!analytics.leads || !Array.isArray(analytics.leads)) {
        return [];
      }

      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

      return analytics.leads.filter((lead: LeadData) => {
        if (!lead || typeof lead.timestamp !== 'number') return false;
        return lead.timestamp >= startOfDay && lead.timestamp < endOfDay;
      });
    } catch (error) {
      console.error('Error parsing lead data:', error);
      return [];
    }
  }

  // ВИПРАВЛЕНО: Безпечне отримання активних лідів
  public getActiveLeads(): LeadData[] {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayLeads = this.getAllLeadsForDate(today);
      
      return todayLeads.filter(lead => {
        if (!lead || typeof lead.score !== 'number') return false;
        return lead.score >= 60 && lead.status === 'active';
      });
    } catch (error) {
      console.error('Помилка отримання активних лідів:', error);
      return [];
    }
  }

  public recordConversion(contactData: { name?: string; phone?: string; email?: string }): void {
    if (this.isDestroyed) return;
    
    try {
      const leadData = this.getLeadData();
      leadData.status = 'converted';
      leadData.contactInfo = contactData;
      
      this.sendLeadReport('conversion');
      this.sendConversionAlert(leadData);
    } catch (error) {
      console.error('Помилка запису конверсії:', error);
    }
  }

  private async sendConversionAlert(leadData: LeadData): Promise<void> {
    const message = `🎉 КОНВЕРСІЯ!

👤 ${leadData.contactInfo?.name || 'Невідомо'}
📞 ${leadData.contactInfo?.phone || 'Не вказано'}
📊 Підсумковий скор: ${leadData.score}
⏰ Час до конверсії: ${Math.floor(leadData.behavior.timeOnSite / 60)}:${(leadData.behavior.timeOnSite % 60).toString().padStart(2, '0')}

💰 Лід успішно конвертований!`;

    try {
      await fetch('/telegram-notify.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.contactInfo?.name || 'Конверсія',
          phone: leadData.contactInfo?.phone || '',
          email: leadData.contactInfo?.email || '',
          service: 'Успішна конверсія',
          message: message,
          source: 'Lead Analytics - Conversion'
        })
      });
    } catch (error) {
      console.error('Помилка відправки конверсії:', error);
    }
  }

  public getCurrentLeadData(): LeadData {
    return this.getLeadData();
  }

  public destroy(): void {
    this.isDestroyed = true;
    
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
      this.reportingInterval = null;
    }
    
    try {
      this.sendLeadReport('session_end');
    } catch (error) {
      console.error('Помилка при завершенні сесії:', error);
    }
  }
}

// Глобальна ініціалізація
declare global {
  interface Window {
    leadReporting: LeadReportingService;
  }
}

// Автоматична ініціалізація при завантаженні модуля
let leadReporting: LeadReportingService;

if (typeof window !== 'undefined') {
  try {
    leadReporting = new LeadReportingService();
    window.leadReporting = leadReporting;
    
    // Очищення при закритті сторінки
    window.addEventListener('beforeunload', () => {
      if (leadReporting) {
        leadReporting.destroy();
      }
    });
  } catch (error) {
    console.error('Помилка ініціалізації Lead Reporting:', error);
  }
}

export default leadReporting;

// Утиліти для компонентів
export const useLeadReporting = () => {
  return {
    recordConversion: (contactData: { name?: string; phone?: string; email?: string }) => {
      try {
        if (window.leadReporting) {
          window.leadReporting.recordConversion(contactData);
        }
      } catch (error) {
        console.error('Помилка запису конверсії:', error);
      }
    },
    getCurrentData: () => {
      try {
        return window.leadReporting ? window.leadReporting.getCurrentLeadData() : null;
      } catch (error) {
        console.error('Помилка отримання поточних даних:', error);
        return null;
      }
    },
    getAnalytics: () => {
      try {
        return window.leadReporting ? window.leadReporting.getAnalytics() : null;
      } catch (error) {
        console.error('Помилка отримання аналітики:', error);
        return null;
      }
    }
  };
};