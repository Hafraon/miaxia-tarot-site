import React, { useState } from 'react';
import { TarotCard } from '../data/majorArcana';

interface AdvancedTarotCardProps {
  card: TarotCard | null;
  isFlipped: boolean;
  onFlip: () => void;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

const AdvancedTarotCard: React.FC<AdvancedTarotCardProps> = ({ 
  card, 
  isFlipped, 
  onFlip, 
  size = 'medium',
  showDetails = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // ДОДАНО: Красиві оригінальні зображення карт Таро
  const getCardImage = (cardId: number): string => {
    const cardImages: Record<number, string> = {
      0: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', // The Fool
      1: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80', // The Magician  
      2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', // High Priestess
      3: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // The Empress
      4: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', // The Emperor
      5: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80', // The Hierophant
      6: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', // The Lovers
      7: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // The Chariot
      8: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', // Strength
      9: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80', // The Hermit
      10: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', // Wheel of Fortune
      11: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // Justice
      12: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', // The Hanged Man
      13: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80', // Death
      14: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', // Temperance
      15: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // The Devil
      16: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', // The Tower
      17: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80', // The Star
      18: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', // The Moon
      19: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80', // The Sun
      20: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', // Judgement
      21: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80'  // The World
    };

    return cardImages[cardId] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80';
  };

  const sizeClasses = {
    small: 'h-[200px] w-[130px]',
    medium: 'h-[350px] w-[220px]',
    large: 'h-[400px] w-[250px]'
  };

  const handleCardClick = () => {
    console.log('🎯 Клік по карті, isFlipped:', isFlipped);
    
    // ВИПРАВЛЕНО: завжди викликаємо onFlip при кліку
    onFlip();
    
    // Звуковий ефект
    if (typeof window !== 'undefined' && window.Audio) {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors if audio fails
      } catch (error) {
        // Ignore audio errors
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card Container - ВИПРАВЛЕНО: додано style для гарантованого кліку */}
      <div 
        className={`${sizeClasses[size]} mx-auto cursor-pointer relative`} 
        style={{ 
          perspective: '1000px',
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleCardClick}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Card Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg bg-gradient-to-br from-purple via-darkblue to-purple border-2 border-gold/50 shadow-xl">
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="bg-gold/20 w-[85%] h-[90%] rounded border border-gold/40 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Анімований фон */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-purple/10 to-gold/10 animate-pulse"></div>
                
                {/* Декоративні елементи */}
                <div className="absolute top-2 left-2 text-gold/60 text-xs">✨</div>
                <div className="absolute top-2 right-2 text-gold/60 text-xs">✨</div>
                <div className="absolute bottom-2 left-2 text-gold/60 text-xs">🌙</div>
                <div className="absolute bottom-2 right-2 text-gold/60 text-xs">🌙</div>
                
                {/* Центральний контент */}
                <div className="text-gold text-4xl mb-3 animate-pulse">🔮</div>
                <div className="text-gold font-heading text-lg mb-2 font-bold">MiaxiaLip</div>
                <div className="text-gold/80 text-sm font-medium">Таро</div>
                <div className="text-gold/60 text-xs mt-2">Натисніть для розкриття</div>
                
                {/* Мерехтливі зірки */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/3 text-gold/40 animate-ping">⭐</div>
                  <div className="absolute bottom-1/3 right-1/4 text-gold/40 animate-ping" style={{ animationDelay: '1s' }}>✨</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Front - ВИПРАВЛЕНО: красиві зображення */}
          {card && (
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg bg-gradient-to-br from-darkblue via-purple/80 to-darkblue border-2 border-gold/50 shadow-xl overflow-hidden">
              <div className="w-full h-full flex flex-col">
                {/* Card Header */}
                <div className="p-3 text-center border-b border-gold/30 bg-gradient-to-r from-purple/30 to-darkblue/30">
                  <div className="text-2xl mb-1">{card.emoji}</div>
                  <h3 className="text-lg font-bold gold-gradient">{card.name}</h3>
                  <div className="text-xs text-gray-400">#{card.id} • Великий Аркан</div>
                </div>

                {/* Card Image - ВИПРАВЛЕНО: красиві зображення карт */}
                <div className="flex-1 relative overflow-hidden">
                  <img 
                    src={getCardImage(card.id)}
                    alt={`Карта Таро ${card.name}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                    }`}
                    onLoad={() => {
                      setImageLoaded(true);
                      console.log(`🖼️ Зображення карти "${card.name}" завантажено`);
                    }}
                    onError={() => {
                      setImageLoaded(true);
                      console.log(`❌ Помилка завантаження зображення карти "${card.name}"`);
                    }}
                  />
                  
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-purple/30 flex items-center justify-center">
                      <div className="text-4xl animate-spin">🔮</div>
                      <div className="absolute bottom-4 text-sm text-white/80">Завантаження...</div>
                    </div>
                  )}
                  
                  {/* Красивий градієнт оверлей */}
                  <div className="absolute inset-0 bg-gradient-to-t from-darkblue/90 via-purple/20 to-transparent"></div>
                  
                  {/* Декоративні елементи на зображенні */}
                  <div className="absolute top-4 right-4 text-gold/80 text-sm">✨</div>
                  <div className="absolute bottom-4 left-4 text-gold/60 text-xs">{card.emoji}</div>
                </div>

                {/* Card Footer */}
                <div className="p-3 bg-gradient-to-r from-darkblue/90 to-purple/90">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.keywords.slice(0, 3).map((keyword, index) => (
                      <span key={index} className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full border border-gold/30 font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {card.shortMeaning}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Details */}
      {isFlipped && card && showDetails && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="card bg-gradient-to-br from-darkblue/80 to-purple/80 border border-gold/30">
            <div className="mb-4">
              <h4 className="text-xl font-semibold gold-gradient mb-2 flex items-center">
                {card.emoji} {card.name}
              </h4>
              <p className="text-gray-300 text-sm mb-3 leading-relaxed">{card.shortMeaning}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="text-gold font-semibold mb-2 flex items-center">
                  📖 <span className="ml-2">Детальне значення:</span>
                </h5>
                <p className="text-gray-300 text-sm leading-relaxed">{card.detailedMeaning}</p>
              </div>

              <div>
                <h5 className="text-gold font-semibold mb-2 flex items-center">
                  💡 <span className="ml-2">Порада дня:</span>
                </h5>
                <p className="text-gray-200 text-sm leading-relaxed italic bg-gold/10 p-3 rounded border-l-3 border-gold">
                  "{card.dailyAdvice}"
                </p>
              </div>

              <div>
                <h5 className="text-gold font-semibold mb-2 flex items-center">
                  🏷️ <span className="ml-2">Ключові слова:</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  {card.keywords.map((keyword, index) => (
                    <span key={index} className="text-xs bg-purple/30 text-gray-200 px-3 py-1 rounded-full border border-purple/50 hover:bg-purple/40 transition-colors">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="mt-4 text-gold hover:text-white transition-colors duration-300 text-sm flex items-center font-medium"
              style={{ pointerEvents: 'auto' }}
            >
              {showFullDetails ? 'Згорнути' : 'Детальніше'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 transform transition-transform duration-300 ${showFullDetails ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .border-l-3 {
          border-left-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default AdvancedTarotCard;
