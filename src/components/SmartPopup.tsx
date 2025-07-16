import React, { useState, useRef, useEffect } from 'react';
import { X, Crown, Star, Zap, Target } from 'lucide-react';

export type PopupType = 'exit-intent' | 'time-based' | 'behavior-based' | 'high-engagement';

interface LeadScore {
  totalScore: number;
  timeOnSite: number;
  scrollDepth: number;
  interactions: number;
  level: 'cold' | 'warm' | 'hot' | 'vip';
}

interface SmartPopupProps {
  isVisible: boolean; // ВИПРАВЛЕНО: правильна назва пропсу
  onClose: () => void;
  type: PopupType;
  leadScore: LeadScore;
  onSubmit: (data: { name: string; phone: string; email: string }) => Promise<boolean>;
}

const SmartPopup: React.FC<SmartPopupProps> = ({ 
  isVisible, 
  onClose, 
  type, 
  leadScore, 
  onSubmit 
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  console.log('🎯 SmartPopup рендериться:', { isVisible, type, leadScore });

  // Обробка натискання Escape та кліків поза попапом
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isVisible, onClose]);

  const getPopupConfig = () => {
    const configs = {
      'exit-intent': {
        title: 'Зачекайте! Не йдіть без подарунка! 🎁',
        subtitle: 'Отримайте безкоштовну консультацію таро',
        icon: <Zap className="h-6 w-6 text-yellow-400" />,
        bgGradient: 'from-purple-900 via-blue-900 to-purple-800',
        borderColor: 'border-yellow-400/50',
        offer: 'Безкоштовна консультація тільки зараз!'
      },
      'time-based': {
        title: 'Ви тут вже 3 хвилини! ⏰',
        subtitle: 'Час для персональної консультації',
        icon: <Target className="h-6 w-6 text-green-400" />,
        bgGradient: 'from-green-900 via-teal-900 to-green-800',
        borderColor: 'border-green-400/50',
        offer: 'Спеціальна пропозиція для вас!'
      },
      'behavior-based': {
        title: 'Вас цікавить таро! 🔮',
        subtitle: 'Отримайте персональний розклад',
        icon: <Star className="h-6 w-6 text-blue-400" />,
        bgGradient: 'from-blue-900 via-indigo-900 to-blue-800',
        borderColor: 'border-blue-400/50',
        offer: 'Ексклюзивний розклад для активних відвідувачів'
      },
      'high-engagement': {
        title: 'VIP статус активований! 👑',
        subtitle: 'Ексклюзивна пропозиція для вас',
        icon: <Crown className="h-6 w-6 text-gold" />,
        bgGradient: 'from-yellow-900 via-orange-900 to-yellow-800',
        borderColor: 'border-gold/50',
        offer: 'VIP консультація зі знижкою 50%'
      }
    };
    return configs[type];
  };

  const config = getPopupConfig();

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Ім\'я обов\'язкове';
        if (value.trim().length < 2) return 'Ім\'я занадто коротке';
        return null;
      case 'phone':
        if (!value.trim()) return 'Телефон обов\'язковий';
        const phoneRegex = /^(\+380|380|0)[0-9]{9}$/;
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) return 'Невірний формат телефону';
        return null;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Невірний формат email';
        }
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`📝 Зміна поля ${name}:`, value);
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Видалити помилку при введенні
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📤 Відправка SmartPopup форми...', formData);

    // Валідація
    const newErrors: Record<string, string> = {};
    const nameError = validateField('name', formData.name);
    const phoneError = validateField('phone', formData.phone);
    const emailError = validateField('email', formData.email);

    if (nameError) newErrors.name = nameError;
    if (phoneError) newErrors.phone = phoneError;
    if (emailError) newErrors.email = emailError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        console.log('✅ SmartPopup форма успішно відправлена');
        onClose();
      }
    } catch (error) {
      console.error('❌ Помилка відправки SmartPopup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    console.log('👁️ SmartPopup не видимий');
    return null;
  }

  console.log('👁️ SmartPopup відображається');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      <div 
        ref={popupRef}
        className={`relative bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor} rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8 transform animate-in zoom-in-95 duration-300`}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Кнопка закриття */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl leading-none transition-colors duration-300 z-10"
          aria-label="Закрити"
          style={{ pointerEvents: 'auto' }}
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Заголовок з іконкою */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            {config.icon}
            <span className="ml-2 text-lg font-semibold text-white">
              Лід-скор: {leadScore.totalScore} ({leadScore.level.toUpperCase()})
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {config.title}
          </h2>
          
          <p className="text-gray-200 mb-4">
            {config.subtitle}
          </p>
          
          {/* Пропозиція */}
          <div className="bg-gradient-to-r from-gold to-yellow-400 text-darkblue p-4 rounded-lg mb-6 text-center">
            <h3 className="font-bold text-lg mb-1">{config.offer}</h3>
            <p className="text-sm opacity-90">Обмежена пропозиція!</p>
          </div>
        </div>

        {/* Форма - ВИПРАВЛЕНО: активні поля з style */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="popup-name"
              type="text"
              name="name"
              placeholder="Ваше ім'я *"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={isSubmitting}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/80 border border-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300 disabled:opacity-50"
              style={{ 
                pointerEvents: 'auto',
                userSelect: 'text',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                fontSize: '16px',
                WebkitAppearance: 'none'
              }}
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1 flex items-center">
                ❌ {errors.name}
              </p>
            )}
          </div>
          
          <div>
            <input
              id="popup-phone"
              type="tel"
              name="phone"
              placeholder="Телефон *"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={isSubmitting}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/80 border border-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300 disabled:opacity-50"
              style={{ 
                pointerEvents: 'auto',
                userSelect: 'text',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                fontSize: '16px',
                WebkitAppearance: 'none'
              }}
            />
            {errors.phone && (
              <p className="text-red-300 text-sm mt-1 flex items-center">
                ❌ {errors.phone}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <span className="mr-1">⬆️</span>
              Заповніть це поле для зв'язку
            </p>
          </div>
          
          <div>
            <input
              id="popup-email"
              type="email"
              name="email"
              placeholder="Email (опціонально)"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/80 border border-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300 disabled:opacity-50"
              style={{ 
                pointerEvents: 'auto',
                userSelect: 'text',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                fontSize: '16px',
                WebkitAppearance: 'none'
              }}
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1 flex items-center">
                ❌ {errors.email}
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.phone}
            className="w-full bg-gradient-to-r from-gold to-yellow-400 text-darkblue font-bold py-4 px-6 rounded-lg hover:from-yellow-400 hover:to-gold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ pointerEvents: 'auto' }}
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

        {/* Статистика користувача */}
        <div className="mt-6 text-center text-sm text-white/80 space-y-2">
          <div className="flex justify-center space-x-4">
            <div>⏱️ {Math.floor(leadScore.timeOnSite / 60)}:{(leadScore.timeOnSite % 60).toString().padStart(2, '0')}</div>
            <div>📊 {leadScore.scrollDepth}%</div>
            <div>🖱️ {leadScore.interactions}</div>
          </div>
        </div>

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

export default SmartPopup;
