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

  const sizeClasses = {
    small: 'h-[200px] w-[130px]',
    medium: 'h-[350px] w-[220px]',
    large: 'h-[400px] w-[250px]'
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      onFlip();
      // Звуковий ефект (опціонально)
      if (typeof window !== 'undefined' && window.Audio) {
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
          audio.volume = 0.3;
          audio.play().catch(() => {}); // Ignore errors if audio fails
        } catch (error) {
          // Ignore audio errors
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card Container */}
      <div className={`${sizeClasses[size]} mx-auto cursor-pointer relative`} style={{ perspective: '1000px' }}>
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleCardClick}
        >
          {/* Card Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg bg-gradient-to-br from-purple via-darkblue to-purple border-2 border-gold/50 shadow-xl">
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="bg-gold/20 w-[85%] h-[90%] rounded border border-gold/40 flex flex-col items-center justify-center text-center">
                <div className="text-gold text-4xl mb-3 animate-pulse">🔮</div>
                <div className="text-gold font-heading text-lg mb-2">MiaxiaLip</div>
                <div className="text-gold/80 text-sm">Таро</div>
                <div className="absolute inset-0 bg-gold/10 rounded animate-pulse-slow"></div>
              </div>
            </div>
          </div>

          {/* Card Front */}
          {card && (
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg bg-gradient-to-br from-darkblue via-purple/80 to-darkblue border-2 border-gold/50 shadow-xl overflow-hidden">
              <div className="w-full h-full flex flex-col">
                {/* Card Header */}
                <div className="p-3 text-center border-b border-gold/30">
                  <div className="text-2xl mb-1">{card.emoji}</div>
                  <h3 className="text-lg font-bold gold-gradient">{card.name}</h3>
                  <div className="text-xs text-gray-400">#{card.id}</div>
                </div>

                {/* Card Image */}
                <div className="flex-1 relative overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-purple/30 flex items-center justify-center">
                      <div className="text-4xl animate-spin">🔮</div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-darkblue/80 via-transparent to-transparent"></div>
                </div>

                {/* Card Footer */}
                <div className="p-3 bg-darkblue/90">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {card.keywords.slice(0, 3).map((keyword, index) => (
                      <span key={index} className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full border border-gold/30">
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2">
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
          <div className="card">
            <div className="mb-4">
              <h4 className="text-xl font-semibold gold-gradient mb-2 flex items-center">
                {card.emoji} {card.name}
              </h4>
              <p className="text-gray-300 text-sm mb-3">{card.shortMeaning}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="text-gold font-semibold mb-2">📖 Детальне значення:</h5>
                <p className="text-gray-300 text-sm leading-relaxed">{card.detailedMeaning}</p>
              </div>

              <div>
                <h5 className="text-gold font-semibold mb-2">💡 Порада дня:</h5>
                <p className="text-gray-200 text-sm leading-relaxed italic">"{card.dailyAdvice}"</p>
              </div>

              <div>
                <h5 className="text-gold font-semibold mb-2">🏷️ Ключові слова:</h5>
                <div className="flex flex-wrap gap-2">
                  {card.keywords.map((keyword, index) => (
                    <span key={index} className="text-xs bg-purple/30 text-gray-200 px-3 py-1 rounded-full border border-purple/50">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="mt-4 text-gold hover:text-white transition-colors duration-300 text-sm flex items-center"
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
      `}</style>
    </div>
  );
};

export default AdvancedTarotCard;