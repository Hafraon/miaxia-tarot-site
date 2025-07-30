import React, { useEffect } from 'react';
import { CheckCircle, Clock, Instagram, Send } from 'lucide-react';
import { trackPageView, trackSocialClick, trackConsultationConversion } from '../utils/analytics';

const ThankYouPage: React.FC = () => {
  useEffect(() => {
    // Відстеження перегляду сторінки подяки
    trackPageView('Thank You Page', window.location.href);
    
    // Додаткова конверсія консультації (якщо потрібно)
    trackConsultationConversion('Consultation Completed', 400);

    // Facebook Pixel conversion tracking
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }

    // Custom event for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'consultation_completed', {
        'event_category': 'engagement',
        'event_label': 'thank_you_page_reached'
      });
    }
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-darkblue/70 backdrop-blur-[2px] -z-10"></div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-gold mx-auto mb-4" />
            <div className="text-6xl mb-4">✅</div>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gold-gradient">
            Дякуємо за замовлення!
          </h1>

          <p className="text-xl text-gray-200 mb-12">
            Ваша заявка успішно відправлена. Я отримала всю необхідну інформацію та готуюся до нашої консультації.
          </p>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="card">
              <Clock className="h-8 w-8 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold gold-gradient mb-2">📱 Зв'язок в Instagram</h3>
              <p className="text-gray-300">
                З вами зв'яжуться в Instagram <a href="https://instagram.com/miaxialip" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/80 font-semibold underline">@miaxialip</a> для уточнення деталей та призначення зручного часу консультації.
              </p>
            </div>

            <div className="card">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-xl font-semibold gold-gradient mb-2">Підготовка до сеансу</h3>
              <p className="text-gray-300">
                Тим часом підготуйтеся до консультації: сформулюйте ваші питання та налаштуйтеся на відкритий діалог з картами.
              </p>
            </div>
          </div>

          {/* Instagram як основний канал */}
          <div className="bg-gradient-to-r from-purple/20 to-pink/20 rounded-lg p-8 mb-8 border border-gold/30">
            <h2 className="text-2xl font-bold gold-gradient mb-6 text-center">💬 Основне спілкування в Instagram</h2>
            
            <div className="text-center mb-6">
              <p className="text-gray-200 mb-4">
                Всі консультації, розклади та спілкування відбуваються в Instagram. Саме там ви отримаєте свій персональний розклад і зможете залишити відгук.
              </p>
              
              <a 
                href="https://www.instagram.com/miaxialip?igsh=bzF5bGZ6N3N3ODRt&utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialClick('instagram', 'thank_you_page')}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 p-4 rounded-lg transition-all duration-300 group text-white font-semibold text-lg"
              >
                <Instagram className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <div className="text-sm opacity-90">📱 Перейти в Instagram</div>
                  <div>@miaxialip</div>
                </div>
              </a>
            </div>
            
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                <strong className="text-gold">Також підписуйтесь на наш Telegram канал:</strong>
              </p>
              <a 
                href="https://t.me/miaxiataro" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSocialClick('telegram', 'thank_you_page')}
                className="inline-flex items-center gap-2 mt-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Send className="h-4 w-4" />
                @miaxiataro - щоденні розклади та інсайти
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="text-gray-300 mb-8">
            <p className="mb-4">
              <strong className="text-gold">Що далі?</strong>
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li>• Перевіримо вашу заявку</li>
              <li>• Зв'яжемося в Instagram @miaxialip</li>
              <li>• Уточнимо деталі та призначимо час</li>
              <li>• Проведемо розклад таро</li>
              <li>• Надішлемо детальну інтерпретацію в Instagram</li>
              <li>• Ви зможете залишити відгук там же</li>
            </ul>
          </div>

          {/* Back to Home Button */}
          <a 
            href="/"
            className="btn-primary inline-block"
          >
            Повернутися на головну
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;