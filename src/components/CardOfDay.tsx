import React, { useState } from 'react';
import { tarotCards } from '../data/tarotCards';
import { trackCardDraw, trackButtonClick } from '../utils/analytics';

interface CardOfDayProps {
  onFullReadingClick: () => void;
}

const CardOfDay: React.FC<CardOfDayProps> = ({ onFullReadingClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof tarotCards[number] | null>(null);

  const handleDraw = () => {
    // Відстеження витягування карти
    trackCardDraw();
    
    // Reset state if already drawn
    if (isFlipped) {
      setIsFlipped(false);
      setSelectedCard(null);
      setTimeout(() => {
        const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        setSelectedCard(randomCard);
        setIsFlipped(true);
      }, 300);
    } else {
      const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
      setSelectedCard(randomCard);
      setIsFlipped(true);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-purple/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Карта дня</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Отримайте безкоштовну карту дня, щоб відчути силу таро. Це невеликий промінь світла у вашому житті щодня.
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="w-full max-w-xs">
            <div className="card-flip-container">
              <div className={`card-flip ${isFlipped ? 'flipped' : ''}`}>
                {/* Card Back */}
                <div className="card-back rounded-lg bg-purple border-2 border-gold/50 shadow-lg">
                  <div className="w-full h-full flex items-center justify-center" onClick={!isFlipped ? handleDraw : undefined}>
                    <div className="bg-gold/20 w-[80%] h-[90%] mx-auto rounded border border-gold/30 flex items-center justify-center p-4">
                      <div className="text-gold text-center">
                        <div className="text-5xl font-heading mb-2">?</div>
                        <p className="text-sm">Таємниці долі</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Front */}
                {selectedCard && (
                  <div className="card-front rounded-lg bg-gradient-to-b from-darkblue to-purple border-2 border-gold/50 shadow-lg">
                    <div className="w-full h-full flex flex-col items-center justify-between p-6">
                      <h3 className="text-xl font-bold gold-gradient">{selectedCard.name}</h3>
                      <img 
                        src={selectedCard.image} 
                        alt={selectedCard.name} 
                        className="w-32 h-auto my-4"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Meaning */}
          {isFlipped && selectedCard && (
            <div className="w-full max-w-md text-center">
              <p className="text-gray-200 mb-6">{selectedCard.shortMeaning}</p>
            </div>
          )}
          
          {/* Daily Predictions Section */}
          <div className="w-full max-w-md text-center border-t border-purple/30 pt-8 mt-8">
            <h3 className="text-2xl font-semibold mb-4 gold-gradient">
              Щоденні предбачення
            </h3>
            <p className="text-gray-300 mb-6">
              Карта дня дає короткий погляд на енергії, які оточують вас сьогодні. Для глибшого розуміння вашої ситуації замовте повний розклад таро, який розкриє деталі та надасть конкретні поради.
            </p>
            
            {!isFlipped ? (
              <button 
                onClick={handleDraw}
                className="btn-primary group"
                onMouseDown={() => trackButtonClick('draw_card', 'card_of_day')}
              >
                <span className="relative z-10 flex items-center">
                  Витягнути карту
                  <span className="ml-2">✨</span>
                </span>
              </button>
            ) : (
              <button 
                onClick={onFullReadingClick}
                className="btn-primary"
                onMouseDown={() => trackButtonClick('get_full_reading', 'card_of_day')}
              >
                Отримати повний розклад
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardOfDay;