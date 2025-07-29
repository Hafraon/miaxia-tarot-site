import React, { useRef, useEffect } from 'react';
import { Sparkles, MessageCircle, Instagram, Star } from 'lucide-react';

interface ExitPopupProps {
isOpen: boolean;
onClose: () => void;
  onOrderClick?: () => void;
}

const ExitPopup: React.FC<ExitPopupProps> = ({ isOpen, onClose, onOrderClick }) => {
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

  const handleBotClick = () => {
  window.open('https://t.me/miaxialiptarotbot?start=free_reading', '_blank');
onClose();
};

const handleInstagramClick = () => {
window.open('https://instagram.com/miaxialip', '_blank');
onClose();
};

const handleDiscountClick = () => {
if (onOrderClick) {
onOrderClick();
}
onClose();
};

const handleStayClick = () => {
    onClose();
};

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
<Sparkles className="h-12 w-12 text-gold mx-auto mb-3" />
          <h3 className="text-2xl font-bold gold-gradient mb-2">Зачекайте!</h3>
<p className="text-xl font-semibold text-purple-200 mb-6">
Ваша магія тільки починається! 🌟
</p>
  
    <p className="text-gray-200 mb-6">
    🎁 <span className="text-gold font-semibold">Оберіть ваш подарунок:</span>
    </p>
          
          <div className="bg-purple/20 border border-gold/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-purple-200">
              🤖 В боті всі консультації дешевші на 30%!
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={handleBotClick}
              className="w-full bg-gradient-to-r from-purple/60 to-blue/60 hover:from-purple/80 hover:to-blue/80 border border-gold/30 rounded-lg px-4 py-3 text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              🔮 Безкоштовний розклад в боті
            </button>
            
            <button
              onClick={handleInstagramClick}
              className="w-full bg-gradient-to-r from-pink/60 to-purple/60 hover:from-pink/80 hover:to-purple/80 border border-gold/30 rounded-lg px-4 py-3 text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Instagram className="h-5 w-5" />
              📱 Підписатися на @miaxialip
            </button>
            
            <button
              onClick={handleDiscountClick}
              className="w-full bg-gradient-to-r from-gold/60 to-orange/60 hover:from-gold/80 hover:to-orange/80 border border-gold/30 rounded-lg px-4 py-3 text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Star className="h-5 w-5" />
              💰 Замовити консультацію
            </button>
          </div>
          
          <button
            onClick={handleStayClick}
            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm underline"
          >
            Або просто залишайтеся на сайті ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitPopup;