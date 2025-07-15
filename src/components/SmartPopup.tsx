// components/SmartPopup.tsx - ВИПРАВЛЕНА ВЕРСІЯ
import React, { useState, useRef } from 'react';
import { X, Crown } from 'lucide-react';

interface SmartPopupProps {
  isVisible: boolean;
  popupData: {
    type: 'vip' | 'hot' | 'warm' | 'cold';
    title: string;
    subtitle: string;
    leadScore: number;
    timeOnSite: number;
    buttonText: string;
    backgroundColor: string;
  };
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const SmartPopup: React.FC<SmartPopupProps> = ({ isVisible, popupData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const popupContentRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Будь ласка, заповніть обов\'язкові поля');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        source: `Smart Popup - ${popupData.type.toUpperCase()}`,
        leadScore: popupData.leadScore,
        timeOnSite: popupData.timeOnSite
      });
      
      onClose();
    } catch (error) {
      console.error('Помилка відправки:', error);
      alert('Помилка відправки. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ВИПРАВЛЕНО: Обробка кліків тільки по фону, НЕ по вмісту
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Закриваємо тільки якщо клік був по фону (backdrop), а не по вмісту попапу
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ВИПРАВЛЕНО: Зупинка propagation для внутрішнього контенту
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getIcon = () => {
    switch (popupData.type) {
      case 'vip':
        return <Crown className="w-6 h-6 text-yellow-300" />;
      default:
        return <span className="text-2xl">🎁</span>;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick} // ТІЛЬКИ ТУТ обробляємо закриття
    >
      <div 
        ref={popupContentRef}
        className={`${popupData.backgroundColor} p-6 rounded-xl max-w-md w-full mx-4 relative shadow-2xl`}
        onClick={handleContentClick} // ЗУПИНЯЄМО propagation для контенту
      >
        {/* Кнопка закриття */}
        <button 
          onClick={onClose} // Пряме закриття без propagation
          className="absolute top-4 right-4 text-white/80 hover:text-white text-xl transition-colors"
          type="button"
        >
          <X size={24} />
        </button>

        {/* Заголовок */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            {getIcon()}
            <span className="ml-2 text-lg font-medium text-white/90">
              Лід-скор: {popupData.leadScore} ({popupData.type.toUpperCase()})
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {popupData.title}
          </h2>
          
          <p className="text-white/80 text-sm">
            {popupData.subtitle}
          </p>
        </div>

        {/* Додатковий блок для VIP */}
        {popupData.type === 'vip' && (
          <div className="bg-yellow-400 text-black p-3 rounded-lg mb-4 text-center">
            <h3 className="font-bold text-sm">Ексклюзивна консультація</h3>
            <p className="text-xs">Тільки для VIP клієнтів</p>
          </div>
        )}

<form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Ваше ім'я *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              onClick={handleContentClick} // ЗУПИНЯЄМО propagation
              onFocus={handleContentClick} // ЗУПИНЯЄМО propagation
              required
              disabled={isSubmitting}
              className="w-full p-3 rounded-lg bg-white/15 text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
            />
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Телефон *"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              onClick={handleContentClick} // ЗУПИНЯЄМО propagation
              onFocus={handleContentClick} // ЗУПИНЯЄМО propagation
              required
              disabled={isSubmitting}
              className="w-full p-3 rounded-lg bg-white/15 text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email (опціонально)"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              onClick={handleContentClick} // ЗУПИНЯЄМО propagation
              onFocus={handleContentClick} // ЗУПИНЯЄМО propagation
              disabled={isSubmitting}
              className="w-full p-3 rounded-lg bg-white/15 text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !formData.name.trim() || !formData.phone.trim()}
            onClick={handleContentClick} // ЗУПИНЯЄМО propagation
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Відправляємо...' : popupData.buttonText}
          </button>
        </form>

        {/* Гарантії */}
        <div className="flex items-center justify-center mt-4 text-xs text-white/60">
          <span className="mr-2">🔒</span>
          <span>Ваші дані захищені</span>
          <span className="mx-2">⚡</span>
          <span>Відповідь протягом 15 хвилин</span>
        </div>
      </div>
    </div>
  );
};

export default SmartPopup;