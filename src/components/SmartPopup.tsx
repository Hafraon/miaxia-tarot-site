// components/SmartPopup.tsx - ПОВНІСТЮ ВИПРАВЛЕНА ВЕРСІЯ
import React, { useState, useRef, useEffect } from 'react';
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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const popupContentRef = useRef<HTMLDivElement>(null);

  // КРИТИЧНО: Запобігаємо закриттю при кліку на форму
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Фокус на першому полі для кращого UX
    if (popupContentRef.current) {
      const firstInput = popupContentRef.current.querySelector('input[type="text"]') as HTMLInputElement;
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  // Закриття тільки по фону
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Зупинка propagation для всього контенту
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleInputBlur = () => {
    setFocusedField(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      style={{ zIndex: 9999 }}
    >
      <div 
        ref={popupContentRef}
        className={`${popupData.backgroundColor} p-6 rounded-xl max-w-md w-full mx-4 relative shadow-2xl`}
        onClick={handleContentClick}
        style={{ zIndex: 10000 }}
      >
        {/* Кнопка закриття */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-xl transition-colors z-50"
          type="button"
          style={{ zIndex: 10001 }}
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

        {/* Індикатор часу */}
        <div className="bg-green-600 text-white p-3 rounded-lg mb-4 text-center">
          <div className="flex items-center justify-center">
            <span className="text-lg mr-2">✅</span>
            <span className="text-sm font-medium">Маєте достатньо часу для заповнення</span>
          </div>
        </div>

        {/* Додатковий блок для VIP */}
        {popupData.type === 'vip' && (
          <div className="bg-yellow-400 text-black p-3 rounded-lg mb-4 text-center">
            <h3 className="font-bold text-sm">Безкоштовна консультація</h3>
            <p className="text-xs">Тільки для тих, хто хотів піти!</p>
          </div>
        )}

        {/* Форма з максимально активними полями */}
        <form onSubmit={handleSubmit} className="space-y-4" onClick={handleContentClick}>
          {/* Ім'я */}
          <div>
            <input
              type="text"
              name="name"
              id="popup-name"
              placeholder="Ваше ім'я *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onFocus={() => handleInputFocus('name')}
              onBlur={handleInputBlur}
              onClick={handleContentClick}
              autoComplete="given-name"
              required
              disabled={isSubmitting}
              tabIndex={1}
              style={{
                pointerEvents: 'auto',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                MozUserSelect: 'text',
                msUserSelect: 'text',
                backgroundColor: focusedField === 'name' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                border: focusedField === 'name' ? '3px solid #fbbf24' : '2px solid rgba(255, 255, 255, 0.4)',
                outline: 'none',
                fontSize: '16px', // iOS zoom fix
                zIndex: 100
              }}
              className="w-full p-4 rounded-lg text-white placeholder-white/80 transition-all duration-200 cursor-text focus:shadow-lg"
            />
          </div>
          
          {/* Телефон */}
          <div>
            <input
              type="tel"
              name="phone"
              id="popup-phone"
              placeholder="Телефон *"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onFocus={() => handleInputFocus('phone')}
              onBlur={handleInputBlur}
              onClick={handleContentClick}
              autoComplete="tel"
              required
              disabled={isSubmitting}
              tabIndex={2}
              style={{
                pointerEvents: 'auto',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                MozUserSelect: 'text',
                msUserSelect: 'text',
                backgroundColor: focusedField === 'phone' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                border: focusedField === 'phone' ? '3px solid #fbbf24' : '2px solid rgba(255, 255, 255, 0.4)',
                outline: 'none',
                fontSize: '16px', // iOS zoom fix
                zIndex: 100
              }}
              className="w-full p-4 rounded-lg text-white placeholder-white/80 transition-all duration-200 cursor-text focus:shadow-lg"
            />
            <p className="text-xs text-blue-200 mt-1 ml-1">
              <span className="mr-1">ℹ️</span>
              Заповніть це поле для зв'язку
            </p>
          </div>
          
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              id="popup-email"
              placeholder="Email (опціонально)"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={() => handleInputFocus('email')}
              onBlur={handleInputBlur}
              onClick={handleContentClick}
              autoComplete="email"
              disabled={isSubmitting}
              tabIndex={3}
              style={{
                pointerEvents: 'auto',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                MozUserSelect: 'text',
                msUserSelect: 'text',
                backgroundColor: focusedField === 'email' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                border: focusedField === 'email' ? '3px solid #fbbf24' : '2px solid rgba(255, 255, 255, 0.4)',
                outline: 'none',
                fontSize: '16px', // iOS zoom fix
                zIndex: 100
              }}
              className="w-full p-4 rounded-lg text-white placeholder-white/80 transition-all duration-200 cursor-text focus:shadow-lg"
            />
          </div>

          {/* Кнопка відправки */}
          <button 
            type="submit"
            disabled={isSubmitting || !formData.name.trim() || !formData.phone.trim()}
            onClick={handleContentClick}
            tabIndex={4}
            style={{ 
              pointerEvents: 'auto',
              zIndex: 100
            }}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Відправляємо...
              </div>
            ) : (
              popupData.buttonText
            )}
          </button>
        </form>

        {/* Гарантії */}
        <div className="flex items-center justify-center mt-4 text-xs text-white/60">
          <span className="mr-2">🔒</span>
          <span>Дані захищені</span>
          <span className="mx-2">⚡</span>
          <span>Відповідь за 15 хв</span>
        </div>
      </div>
    </div>
  );
};

export default SmartPopup;
