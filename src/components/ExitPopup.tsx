import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Clock } from 'lucide-react';

interface ExitPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExitPopup: React.FC<ExitPopupProps> = ({ isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 хвилини
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Відстеження взаємодії користувача з формою
  useEffect(() => {
    if (isOpen) {
      const handleUserActivity = () => {
        setIsUserInteracting(true);
        setTimeLeft(120); // Скидання таймеру при взаємодії
      };

      // Відстежуємо активність
      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity);
        });
      };
    }
  }, [isOpen]);

  // Таймер зникання (тільки якщо користувач НЕ взаємодіє)
  useEffect(() => {
    if (isOpen && !isUserInteracting) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, isUserInteracting, onClose]);

  // Зупинка таймеру при фокусі на поля
  const handleFieldFocus = () => {
    setIsUserInteracting(true);
    setTimeLeft(300); // Даємо 5 хвилин на заповнення
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    handleFieldFocus(); // Активуємо при зміні значення
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    try {
      // Відправка в Telegram через TelegramService
      const telegramData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: 'Exit-Intent - Безкоштовна консультація',
        formType: 'popup' as const,
        analytics: {
          timeOnSite: 120 - timeLeft,
          source: 'Exit Intent Popup',
          completionTime: 5000,
          interactions: 1,
          userAgent: navigator.userAgent
        }
      };

      // Використовуємо глобальний TelegramService якщо доступний
      if (typeof window !== 'undefined' && (window as any).TelegramService) {
        const result = await (window as any).TelegramService.sendMessage(telegramData);
        
        if (result.success) {
          // Показати успіх та закрити попап
          alert('Дякуємо! Зв\'яжемося протягом 15 хвилин!');
          onClose();
        } else {
          throw new Error(result.error || 'Помилка відправки');
        }
      } else {
        // Fallback до стандартного API
        const response = await fetch('/api/send-telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(telegramData)
        });

        if (response.ok) {
          alert('Дякуємо! Зв\'яжемося протягом 15 хвилин!');
          onClose();
        } else {
          throw new Error('Помилка відправки');
        }
      }
    } catch (error) {
      console.error('Помилка відправки exit popup:', error);
      alert('Виникла помилка. Спробуйте ще раз або зв\'яжіться з нами іншим способом.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        // Не закриваємо автоматично при кліку поза попапом, якщо користувач взаємодіє
        if (!isUserInteracting) {
          onClose();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, isUserInteracting]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      <div 
        ref={popupRef}
        className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 border-2 border-gold/30 rounded-lg shadow-xl max-w-md w-full p-6 md:p-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl leading-none transition-colors duration-300"
          aria-label="Закрити"
        >
          ×
        </button>
        
        {/* Заголовок з таймером */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-gold mr-2" />
            <span className="text-lg text-yellow-300 font-semibold">
              Лід-скор 71 (WARM)
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Зачекайте! Не йдіть без подарунка! 🎁
          </h2>
          
          <p className="text-gray-200 mb-4">
            Отримайте <span className="text-gold font-semibold">безкоштовну</span> консультацію таро
          </p>
          
          {!isUserInteracting && timeLeft > 0 && (
            <div className="flex items-center justify-center text-yellow-300 text-sm bg-yellow-400/10 rounded-lg p-2 border border-yellow-400/30">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                Пропозиція зникне через {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
          
          {isUserInteracting && (
            <div className="text-green-300 text-sm bg-green-400/10 rounded-lg p-2 border border-green-400/30">
              ✅ Маєте достатньо часу для заповнення
            </div>
          )}
        </div>

        {/* Додатковий блок привабливості */}
        <div className="bg-gradient-to-r from-gold to-yellow-400 text-darkblue p-4 rounded-lg mb-6 text-center">
          <h3 className="font-bold text-lg mb-1">Безкоштовна консультація</h3>
          <p className="text-sm opacity-90">Тільки для тих, хто хотів піти!</p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Ваше ім'я *"
              value={formData.name}
              onChange={handleChange}
              onFocus={handleFieldFocus}
              required
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300"
            />
          </div>
          
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Телефон *"
              value={formData.phone}
              onChange={handleChange}
              onFocus={handleFieldFocus}
              required
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300"
            />
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <span className="mr-1">⬆️</span>
              Заповніть це поле для зв'язку
            </p>
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email (опціонально)"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFieldFocus}
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.phone}
            className="w-full bg-gradient-to-r from-gold to-yellow-400 text-darkblue font-bold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Надсилання...
              </span>
            ) : (
              'Отримати пропозицію'
            )}
          </button>
        </form>

        {/* Гарантії */}
        <div className="flex items-center justify-center mt-4 text-xs text-gray-400 space-x-4">
          <div className="flex items-center">
            <span className="mr-1">🔒</span>
            <span>Дані захищені</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⚡</span>
            <span>Відповідь за 15 хв</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitPopup;