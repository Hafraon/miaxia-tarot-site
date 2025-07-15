import React, { useEffect } from 'react';
import { CheckCircle, Clock, Instagram, Send } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  useEffect(() => {
    // Google Ads conversion tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Замініть на ваш ID
        'value': 1.0,
        'currency': 'UAH'
      });
    }

    // Facebook Pixel conversion tracking
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }

    // Custom event for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        'event_category': 'engagement',
        'event_label': 'tarot_consultation_request'
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
              <h3 className="text-xl font-semibold gold-gradient mb-2">📞 Зв'язок з вами</h3>
              <p className="text-gray-300">
                Ми зв'яжемося з вами протягом 2-3 годин для уточнення деталей та призначення зручного часу консультації.
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

          {/* Social Media Section */}
          <div className="bg-purple/20 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold gold-gradient mb-6">Залишайтеся на зв'язку</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a 
                href="https://www.instagram.com/miaxialip?igsh=bzF5bGZ6N3N3ODRt&utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-darkblue/70 p-4 rounded-lg border border-gold/30 hover:border-gold/60 hover:bg-darkblue/90 transition-all duration-300 group"
              >
                <Instagram className="h-6 w-6 text-gold group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="text-sm text-gray-400">📱 Слідкуйте за нами</div>
                  <div className="font-semibold text-white">Instagram @miaxialip</div>
                </div>
              </a>

              <a 
                href="https://t.me/miaxiataro" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-darkblue/70 p-4 rounded-lg border border-gold/30 hover:border-gold/60 hover:bg-darkblue/90 transition-all duration-300 group"
              >
                <Send className="h-6 w-6 text-gold group-hover:scale-110 transition-transform duration-300" />
                <div className="text-left">
                  <div className="text-sm text-gray-400">📺 Приєднуйтесь до каналу</div>
                  <div className="font-semibold text-white">@miaxiataro</div>
                </div>
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
              <li>• Зв'яжемося для уточнення деталей</li>
              <li>• Призначимо зручний час консультації</li>
              <li>• Проведемо розклад таро</li>
              <li>• Надамо детальну інтерпретацію</li>
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