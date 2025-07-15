import React, { useState, useRef, useEffect } from 'react';
import { X, Gift, Clock, Star, Crown } from 'lucide-react';
import { LeadScore } from '../hooks/useLeadScoring';

export type PopupType = 'exit-intent' | 'time-based' | 'behavior-based' | 'high-engagement';

interface SmartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: PopupType;
  leadScore: LeadScore;
  onSubmit: (data: { name: string; phone: string; email: string }) => void;
}

const SmartPopup: React.FC<SmartPopupProps> = ({ isOpen, onClose, type, leadScore, onSubmit }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
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
  }, [isOpen, onClose]);

  const getPopupConfig = () => {
    switch (type) {
      case 'exit-intent':
        return {
          title: 'Зачекайте! Не йдіть без подарунка! 🎁',
          subtitle: 'Отримайте безкоштовну консультацію таро',
          offer: 'Безкоштовна консультація',
          gradient: 'from-red-600 to-pink-600',
          icon: <Gift className="h-8 w-8" />,
          urgency: 'Тільки для тих, хто хотів піти!'
        };
      case 'time-based':
        return {
          title: '3 хвилини на сайті - це знак! ⏰',
          subtitle: 'Всесвіт посилає вам сигнал',
          offer: 'Спеціальна знижка 50%',
          gradient: 'from-blue-600 to-purple-600',
          icon: <Clock className="h-8 w-8" />,
          urgency: 'Пропозиція діє лише 5 хвилин!'
        };
      case 'behavior-based':
        return {
          title: 'Ви активно досліджуєте! ⭐',
          subtitle: 'Час зробити наступний крок',
          offer: 'Персональна консультація',
          gradient: 'from-purple-600 to-indigo-600',
          icon: <Star className="h-8 w-8" />,
          urgency: 'Для активних користувачів'
        };
      case 'high-engagement':
        return {
          title: 'VIP пропозиція для вас! 👑',
          subtitle: 'Ви заслуговуєте на найкраще',
          offer: 'Ексклюзивна консультація',
          gradient: 'from-gold to-yellow-500',
          icon: <Crown className="h-8 w-8" />,
          urgency: 'Тільки для VIP клієнтів'
        };
      default:
        return {
          title: 'Спеціальна пропозиція!',
          subtitle: 'Не пропустіть можливість',
          offer: 'Консультація таро',
          gradient: 'from-purple-600 to-blue-600',
          icon: <Gift className="h-8 w-8" />,
          urgency: 'Обмежена пропозиция'
        };
    }
  };

  const config = getPopupConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting popup form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Popup */}
      <div 
        ref={popupRef}
        className="relative max-w-md w-full bg-darkblue rounded-2xl shadow-2xl overflow-hidden animate-[popupAppear_0.5s_ease-out]"
      >
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <button 
              onClick={onClose}
              className="absolute top-0 right-0 text-white/80 hover:text-white text-2xl leading-none"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-3 mb-3">
              {config.icon}
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                Лід-скор: {leadScore.totalScore} ({leadScore.level.toUpperCase()})
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
            <p className="text-white/90">{config.subtitle}</p>
          </div>
          
          {/* Animated background elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-white/5 rounded-full animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Offer highlight */}
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6 text-center">
            <div className="text-gold font-bold text-lg mb-1">{config.offer}</div>
            <div className="text-sm text-gray-300">{config.urgency}</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ваше ім'я *"
                className="w-full bg-darkblue/60 border border-purple/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/60"
                required
              />
            </div>
            
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Телефон *"
                className="w-full bg-darkblue/60 border border-purple/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/60"
                required
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (опціонально)"
                className="w-full bg-darkblue/60 border border-purple/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/60"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.phone}
              className={`w-full bg-gradient-to-r ${config.gradient} text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Надсилання...' : 'Отримати пропозицію'}
            </button>
          </form>

          {/* Trust indicators */}
          <div className="mt-4 text-center text-xs text-gray-400">
            <p>🔒 Ваші дані захищені • ⚡ Відповідь протягом 15 хвилин</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes popupAppear {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SmartPopup;