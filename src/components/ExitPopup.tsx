import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ExitPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExitPopup: React.FC<ExitPopupProps> = ({ isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-darkblue/80 backdrop-blur-sm"></div>
      
      <div 
        ref={popupRef}
        className="relative bg-gradient-to-br from-darkblue to-purple/80 border-2 border-gold/30 rounded-lg shadow-xl max-w-md w-full p-6 md:p-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
          aria-label="Закрити"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-gold mx-auto mb-2" />
          <h3 className="text-2xl font-bold gold-gradient mb-4">Не поспішайте!</h3>
          
          <p className="text-gray-200 mb-6">
            Отримайте <span className="text-gold font-semibold">безкоштовну</span> першу онлайн-консультацію з таро прямо зараз!
          </p>
          
          <form className="mb-6">
            <div className="mb-4">
              <input
                type="email"
                className="w-full bg-darkblue/60 border border-purple/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60"
                placeholder="Ваш email"
              />
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full text-center"
            >
              Отримати безкоштовну консультацію
            </button>
          </form>
          
          <p className="text-sm text-gray-400">
            Ми ніколи не розсилаємо спам і цінуємо вашу конфіденційність
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitPopup;