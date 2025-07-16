// Telegram Service для MiaxiaLip - ОПТИМІЗОВАНА ВЕРСІЯ
export interface TelegramMessage {
  name: string;
  phone: string;
  email?: string;
  instagram?: string;
  birthdate?: string;
  question?: string;
  service?: string;
  formType: 'quick' | 'detailed' | 'newsletter' | 'popup' | 'card_draw';
  leadScore?: number;
  analytics?: {
    timeOnSite: number;
    source: string;
    completionTime: number;
    interactions: number;
    userAgent: string;
  };
}

export interface TelegramResponse {
  success: boolean;
  method: 'telegram' | 'email' | 'server_api' | 'both';
  message?: string;
  error?: string;
  telegramResult?: any;
  emailResult?: any;
}

export class TelegramService {
  private static readonly BOT_TOKEN = '7853031712:AAHS29d-x7_mWZ1zoNzP8kCbTOxW0vtI18w';
  private static readonly CHAT_ID = '7853031712';
  private static readonly BOT_USERNAME = '@miaxialip_tarot_bot';
  private static readonly BACKUP_EMAIL = 'miaxialip@gmail.com';

  // Форматування повідомлення для Telegram
  static formatTelegramMessage(data: TelegramMessage): string {
    console.log('📝 Форматування Telegram повідомлення:', data);

    const formTypeNames = {
      quick: '⚡ Швидка заявка',
      detailed: '📋 Детальна заявка', 
      newsletter: '📧 Підписка на розсилку',
      popup: '🎯 Smart Popup',
      card_draw: '🔮 Витягування карти'
    };

    let message = `🔔 Нова заявка з сайту MiaxiaLip!\n\n`;
    
    // Основна інформація
    message += `🎭 Тип заявки: ${formTypeNames[data.formType]}\n`;
    message += `👤 Ім'я: ${data.name}\n`;
    
    if (data.phone) {
      message += `📱 Телефон: ${data.phone}\n`;
    }
    
    if (data.email) {
      message += `📧 Email: ${data.email}\n`;
    }
    
    if (data.instagram) {
      message += `📷 Instagram: ${data.instagram}\n`;
    }
    
    if (data.birthdate) {
      message += `🎂 Дата народження: ${data.birthdate}\n`;
    }
    
    if (data.service) {
      message += `🔮 Послуга: ${data.service}\n`;
    }
    
    if (data.question) {
      message += `❓ Питання: ${data.question}\n`;
    }

    // Аналітика
    if (data.analytics) {
      message += `\n📊 Аналітика:\n`;
      message += `⏱️ Час на сайті: ${Math.floor(data.analytics.timeOnSite / 60)}:${(data.analytics.timeOnSite % 60).toString().padStart(2, '0')}\n`;
      message += `🌐 Джерело: ${data.analytics.source || 'Прямий перехід'}\n`;
      message += `⚡ Час заповнення: ${Math.round(data.analytics.completionTime / 1000)} сек\n`;
      message += `🖱️ Взаємодії: ${data.analytics.interactions}\n`;
    }

    if (data.leadScore) {
      message += `🎯 Лід-скор: ${data.leadScore}\n`;
    }

    message += `\n📅 Дата: ${new Date().toLocaleString('uk-UA', { 
      timeZone: 'Europe/Kiev',
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}\n`;
    
    message += `\n💫 З любов'ю, MiaxiaLip Tarot ✨`;

    console.log('✅ Telegram повідомлення сформовано');
    return message;
  }

  // Відправка в Telegram через API
  static async sendToTelegram(message: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log('📤 Відправка в Telegram API...');
      
      const response = await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        }),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        console.log('✅ Telegram повідомлення відправлено успішно:', result);
        return { success: true, data: result };
      } else {
        console.error('❌ Помилка Telegram API:', result);
        return { success: false, error: result.description || 'Telegram API error' };
      }
    } catch (error) {
      console.error('❌ Мережева помилка при відправці в Telegram:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // ДОДАНО: Відправка через server.js API
  static async sendViaServerAPI(data: TelegramMessage): Promise<{ success: boolean; error?: string; response?: any }> {
    try {
      console.log('📤 Відправка через Server API...');
      
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Server API успішно відправив повідомлення');
        return { success: true, response: result };
      } else {
        console.error('❌ Server API помилка:', result);
        return { success: false, error: result.error || 'Server API error' };
      }
    } catch (error) {
      console.error('❌ Server API мережева помилка:', error);
      return { success: false, error: 'Server API network error' };
    }
  }

  // Backup відправка на email
  static async sendBackupEmail(data: TelegramMessage): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Відправка backup email...');
      
      const emailBody = this.formatEmailMessage(data);
      
      // Використовуємо Server API для email backup
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          backup: true,
          emailBody
        }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Backup email відправлено успішно');
        return { success: true };
      } else {
        console.error('❌ Backup email помилка:', result);
        return { success: false, error: result.error || 'Email sending failed' };
      }
    } catch (error) {
      console.error('❌ Backup email мережева помилка:', error);
      return { success: false, error: 'Email service error' };
    }
  }

  // Форматування для email
  static formatEmailMessage(data: TelegramMessage): string {
    const message = this.formatTelegramMessage(data);
    return message.replace(/[🔔👤📱📧📷🎂🔮❓📊⏱️🌐⚡🖱️🎯📅💫✨🎭]/g, '');
  }

  // ОНОВЛЕНО: Головна функція відправки з покращеною логікою
  static async sendMessage(data: TelegramMessage): Promise<TelegramResponse> {
    console.log('🚀 TelegramService.sendMessage викликано:', data);
    
    const message = this.formatTelegramMessage(data);
    
    // СТРАТЕГІЯ 1: Спочатку пробуємо Server API (рекомендовано)
    console.log('📤 Пробуємо Server API...');
    const serverResult = await this.sendViaServerAPI(data);
    
    if (serverResult.success) {
      this.trackConversion(data.formType, 'server_api');
      console.log('✅ Успішна відправка через Server API');
      
      return {
        success: true,
        method: 'server_api',
        message: 'Повідомлення успішно відправлено через сервер!',
        telegramResult: serverResult.response
      };
    }

    // СТРАТЕГІЯ 2: Якщо Server API не працює, пробуємо прямий Telegram API
    console.warn('⚠️ Server API недоступний, пробуємо прямий Telegram API...');
    const telegramResult = await this.sendToTelegram(message);
    
    if (telegramResult.success) {
      this.trackConversion(data.formType, 'telegram');
      console.log('✅ Успішна відправка через прямий Telegram API');
      
      return {
        success: true,
        method: 'telegram',
        message: 'Повідомлення успішно відправлено в Telegram!',
        telegramResult: telegramResult.data
      };
    }

    // СТРАТЕГІЯ 3: Якщо обидва методи не працюють, пробуємо email backup
    console.warn('⚠️ Telegram недоступний, пробуємо email backup...');
    const emailResult = await this.sendBackupEmail(data);
    
    if (emailResult.success) {
      this.trackConversion(data.formType, 'email_backup');
      console.log('✅ Успішна відправка через email backup');
      
      return {
        success: true,
        method: 'email',
        message: 'Повідомлення відправлено через резервний канал!',
        emailResult
      };
    }

    // Якщо все не працює
    console.error('❌ Всі методи відправки не працюють');
    return {
      success: false,
      method: 'both',
      error: 'Не вдалося відправити повідомлення. Спробуйте пізніше.',
      message: 'Помилка відправки повідомлення'
    };
  }

  // Відстеження конверсій
  static trackConversion(formType: string, method: string) {
    console.log(`📊 Відстеження конверсії: ${formType} через ${method}`);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submission_success', {
        event_category: 'conversion',
        event_label: `${formType}_${method}`,
        form_type: formType,
        delivery_method: method
      });
    }

    // Зберігаємо статистику в localStorage
    const stats = JSON.parse(localStorage.getItem('miaxialip_stats') || '{}');
    const today = new Date().toISOString().split('T')[0];
    
    if (!stats[today]) stats[today] = {};
    if (!stats[today][formType]) stats[today][formType] = 0;
    
    stats[today][formType]++;
    localStorage.setItem('miaxialip_stats', JSON.stringify(stats));
    
    console.log('📊 Статистика оновлена:', stats[today]);
  }

  // Тестування з'єднання
  static async testConnection(): Promise<{ telegram: boolean; server: boolean; email: boolean }> {
    console.log('🧪 Тестування з\'єднань...');
    
    const testMessage = `🧪 Тест з'єднання MiaxiaLip\n\n⏰ ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}\n\n✅ Система працює!`;
    const testData: TelegramMessage = {
      name: 'Test User',
      phone: '+380000000000',
      formType: 'quick'
    };
    
    const telegramTest = await this.sendToTelegram(testMessage);
    const serverTest = await this.sendViaServerAPI(testData);
    const emailTest = await this.sendBackupEmail(testData);

    const results = {
      telegram: telegramTest.success,
      server: serverTest.success,
      email: emailTest.success
    };

    console.log('🧪 Результати тестування:', results);
    return results;
  }

  // Отримання статистики
  static getStats() {
    const stats = JSON.parse(localStorage.getItem('miaxialip_stats') || '{}');
    console.log('📊 Поточна статистика:', stats);
    return stats;
  }

  // ДОДАНО: Функція очищення старих даних
  static cleanupOldStats() {
    const stats = JSON.parse(localStorage.getItem('miaxialip_stats') || '{}');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
    const cleanedStats: Record<string, any> = {};
    
    Object.keys(stats).forEach(date => {
      if (date >= cutoffDate) {
        cleanedStats[date] = stats[date];
      }
    });
    
    localStorage.setItem('miaxialip_stats', JSON.stringify(cleanedStats));
    console.log('🧹 Старі статистики очищено');
  }
}

// Експорт для глобального використання
if (typeof window !== 'undefined') {
  (window as any).TelegramService = TelegramService;
  
  // Очищення старих статистик при завантаженні
  setTimeout(() => {
    TelegramService.cleanupOldStats();
  }, 1000);
}
