// Telegram Service для MiaxiaLip
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
  method: 'telegram' | 'email' | 'both';
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

    return message;
  }

  // Відправка в Telegram
  static async sendToTelegram(message: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
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
        console.log('✅ Telegram message sent successfully:', result);
        return { success: true, data: result };
      } else {
        console.error('❌ Telegram API error:', result);
        return { success: false, error: result.description || 'Telegram API error' };
      }
    } catch (error) {
      console.error('❌ Network error sending to Telegram:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Backup відправка на email
  static async sendBackupEmail(data: TelegramMessage): Promise<{ success: boolean; error?: string }> {
    try {
      const emailBody = this.formatEmailMessage(data);
      
      // Використовуємо існуючий API endpoint
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
        console.log('✅ Backup email sent successfully');
        return { success: true };
      } else {
        console.error('❌ Backup email failed:', result);
        return { success: false, error: result.error || 'Email sending failed' };
      }
    } catch (error) {
      console.error('❌ Backup email error:', error);
      return { success: false, error: 'Email service error' };
    }
  }

  // Форматування для email
  static formatEmailMessage(data: TelegramMessage): string {
    const message = this.formatTelegramMessage(data);
    return message.replace(/[🔔👤📱📧📷🎂🔮❓📊⏱️🌐⚡🖱️🎯📅💫✨🎭]/g, '');
  }

  // Головна функція відправки з backup
  static async sendMessage(data: TelegramMessage): Promise<TelegramResponse> {
    const message = this.formatTelegramMessage(data);
    
    // Спочатку пробуємо Telegram
    const telegramResult = await this.sendToTelegram(message);
    
    if (telegramResult.success) {
      // Відстежуємо успішну конверсію
      this.trackConversion(data.formType, 'telegram');
      
      return {
        success: true,
        method: 'telegram',
        message: 'Повідомлення успішно відправлено в Telegram!',
        telegramResult: telegramResult.data
      };
    }

    // Якщо Telegram не працює, пробуємо email backup
    console.warn('⚠️ Telegram failed, trying email backup...');
    const emailResult = await this.sendBackupEmail(data);
    
    if (emailResult.success) {
      this.trackConversion(data.formType, 'email_backup');
      
      return {
        success: true,
        method: 'email',
        message: 'Повідомлення відправлено через резервний канал!',
        emailResult
      };
    }

    // Якщо обидва методи не працюють
    return {
      success: false,
      method: 'both',
      error: 'Не вдалося відправити повідомлення. Спробуйте пізніше.',
      message: 'Помилка відправки повідомлення'
    };
  }

  // Відстеження конверсій
  static trackConversion(formType: string, method: string) {
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
  }

  // Тестування з'єднання
  static async testConnection(): Promise<{ telegram: boolean; email: boolean }> {
    const testMessage = `🧪 Тест з'єднання MiaxiaLip\n\n⏰ ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}\n\n✅ Система працює!`;
    
    const telegramTest = await this.sendToTelegram(testMessage);
    const emailTest = await this.sendBackupEmail({
      name: 'Test User',
      phone: '+380000000000',
      formType: 'quick'
    });

    return {
      telegram: telegramTest.success,
      email: emailTest.success
    };
  }

  // Отримання статистики
  static getStats() {
    return JSON.parse(localStorage.getItem('miaxialip_stats') || '{}');
  }
}

// Експорт для глобального використання
if (typeof window !== 'undefined') {
  (window as any).TelegramService = TelegramService;
}