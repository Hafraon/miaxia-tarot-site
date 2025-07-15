import React, { useState } from 'react';
import { getRandomCard, getMultipleCards, TarotCard } from '../data/majorArcana';
import { trackCardDraw, trackButtonClick } from '../utils/analytics';
import AdvancedTarotCard from './AdvancedTarotCard';

interface CardOfDayProps {
  onFullReadingClick: () => void;
  onCardDraw?: () => void;
}

const CardOfDay: React.FC<CardOfDayProps> = ({ onFullReadingClick, onCardDraw }) => {
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [multipleCards, setMultipleCards] = useState<TarotCard[]>([]);
  const [showMultiple, setShowMultiple] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const handleDrawSingle = () => {
    trackCardDraw();
    onCardDraw?.();
    
    // Reset if already drawn
    if (isFlipped) {
      setIsFlipped(false);
      setSelectedCard(null);
      setShowMultiple(false);
      setMultipleCards([]);
      setFlippedCards(new Set());
      
      setTimeout(() => {
        const card = getRandomCard();
        setSelectedCard(card);
        setIsFlipped(true);
      }, 300);
    } else {
      const card = getRandomCard();
      setSelectedCard(card);
      setIsFlipped(true);
    }
  };

  const handleDrawMultiple = (count: number) => {
    trackButtonClick(`draw_${count}_cards`, 'card_of_day');
    onCardDraw?.();
    
    // Reset state
    setIsFlipped(false);
    setSelectedCard(null);
    setShowMultiple(false);
    setFlippedCards(new Set());
    
    setTimeout(() => {
      const cards = getMultipleCards(count);
      setMultipleCards(cards);
      setShowMultiple(true);
    }, 300);
  };

  const handleCardFlip = (cardIndex: number) => {
    setFlippedCards(prev => new Set([...prev, cardIndex]));
  };

  const resetAll = () => {
    setIsFlipped(false);
    setSelectedCard(null);
    setShowMultiple(false);
    setMultipleCards([]);
    setFlippedCards(new Set());
  };

  return (
    <section className="py-16 md:py-24 bg-purple/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Карти Таро</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Відкрийте таємниці Великих Арканів. Витягніть карту дня або створіть повний розклад для глибшого розуміння.
          </p>
          
          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              onClick={handleDrawSingle}
              className="btn-primary group"
              onMouseDown={() => trackButtonClick('draw_single_card', 'card_of_day')}
            >
              <span className="relative z-10 flex items-center">
                {isFlipped ? 'Нова карта' : 'Карта дня'}
                <span className="ml-2">🔮</span>
              </span>
            </button>
            
            <button 
              onClick={() => handleDrawMultiple(3)}
              className="bg-purple hover:bg-purple/80 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(74,26,116,0.6)] transform hover:-translate-y-1"
            >
              3 карти ✨
            </button>
            
            <button 
              onClick={() => handleDrawMultiple(5)}
              className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/50 px-6 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transform hover:-translate-y-1"
            >
              5 карт 🌟
            </button>
            
            {(isFlipped || showMultiple) && (
              <button 
                onClick={resetAll}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-md font-medium transition-all duration-300"
              >
                Скинути 🔄
              </button>
            )}
          </div>
        </div>
        
        {/* Single Card Display */}
        {!showMultiple && (
          <div className="flex flex-col items-center justify-center gap-8">
            <AdvancedTarotCard
              card={selectedCard}
              isFlipped={isFlipped}
              onFlip={() => {}}
              size="large"
              showDetails={true}
            />
          </div>
        )}

        {/* Multiple Cards Display */}
        {showMultiple && multipleCards.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold gold-gradient mb-4">
                {multipleCards.length === 3 ? 'Розклад "Минуле-Сьогодення-Майбутнє"' : 'П\'ятикартковий розклад'}
              </h3>
              <div className="flex justify-center gap-2 text-sm text-gray-400 mb-4">
                {multipleCards.length === 3 ? (
                  <>
                    <span>Минуле</span>
                    <span>•</span>
                    <span>Сьогодення</span>
                    <span>•</span>
                    <span>Майбутнє</span>
                  </>
                ) : (
                  <>
                    <span>Ситуація</span>
                    <span>•</span>
                    <span>Виклик</span>
                    <span>•</span>
                    <span>Минуле</span>
                    <span>•</span>
                    <span>Майбутнє</span>
                    <span>•</span>
                    <span>Результат</span>
                  </>
                )}
              </div>
            </div>
            
            <div className={`grid gap-6 justify-center ${
              multipleCards.length === 3 
                ? 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto'
            }`}>
              {multipleCards.map((card, index) => (
                <div key={`${card.id}-${index}`} className="flex flex-col items-center">
                  <div className="mb-3">
                    <span className="text-sm text-gold font-semibold">
                      {multipleCards.length === 3 
                        ? ['Минуле', 'Сьогодення', 'Майбутнє'][index]
                        : ['Ситуація', 'Виклик', 'Минуле', 'Майбутнє', 'Результат'][index]
                      }
                    </span>
                  </div>
                  
                  <AdvancedTarotCard
                    card={card}
                    isFlipped={flippedCards.has(index)}
                    onFlip={() => handleCardFlip(index)}
                    size="medium"
                    showDetails={false}
                  />
                  
                  {flippedCards.has(index) && (
                    <div className="mt-4 max-w-xs text-center">
                      <p className="text-sm text-gray-300 mb-2">{card.shortMeaning}</p>
                      <p className="text-xs text-gray-400 italic">"{card.dailyAdvice}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Call to Action */}
        {(isFlipped || showMultiple) && (
          <div className="text-center mt-12 border-t border-purple/30 pt-8">
            <h3 className="text-2xl font-semibold mb-4 gold-gradient">
              Хочете глибший аналіз?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Ці карти дають загальне уявлення про енергії навколо вас. Для детального розбору вашої ситуації, 
              персональних порад та відповідей на конкретні питання замовте індивідуальну консультацію.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onFullReadingClick}
                className="btn-primary"
                onMouseDown={() => trackButtonClick('get_full_reading', 'card_of_day')}
              >
                Замовити повну консультацію
              </button>
              
              <a 
                href="https://t.me/miaxialip_tarot_bot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-md font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.6)] transform hover:-translate-y-1 flex items-center justify-center"
                onMouseDown={() => trackButtonClick('telegram_bot', 'card_of_day')}
              >
                Telegram бот зі знижками 🤖
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardOfDay;