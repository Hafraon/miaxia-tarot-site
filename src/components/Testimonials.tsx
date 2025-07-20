import React, { useState, useEffect } from 'react';
import { testimonials } from '../data/testimonials';

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // ВИПРАВЛЕНО: Додана перевірка на існування даних
  if (!testimonials || testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-12 md:py-20 bg-purple/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="section-title">Відгуки клієнтів</h2>
            <p className="text-gray-300">Відгуки завантажуються...</p>
          </div>
        </div>
      </section>
    );
  }

  // ВИПРАВЛЕНО: Покращена логіка переключення з діагностикою
  const goToPrev = () => {
    console.log('goToPrev clicked, current index:', activeIndex);
    setActiveIndex((prev) => {
      const newIndex = prev === 0 ? testimonials.length - 1 : prev - 1;
      console.log('New index:', newIndex);
      return newIndex;
    });
  };

  const goToNext = () => {
    console.log('goToNext clicked, current index:', activeIndex);
    setActiveIndex((prev) => {
      const newIndex = prev === testimonials.length - 1 ? 0 : prev + 1;
      console.log('New index:', newIndex);
      return newIndex;
    });
  };

  // ДОДАНО: Автоматичне переключення кожні 6 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // ДОДАНО: Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrev();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-purple/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Відгуки клієнтів</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Що говорять клієнти про мої послуги таро. Дізнайтеся, як розклади допомогли людям знайти відповіді на їхні питання.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto" itemScope itemType="https://schema.org/ItemList">
          {/* ВИПРАВЛЕНО: Кнопки з гарантованою активністю */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-darkblue/70 hover:bg-darkblue/90 text-gold p-4 rounded-full transition-all duration-300 z-20 border-2 border-gold/40 hover:border-gold shadow-lg hover:shadow-xl"
            aria-label="Попередній відгук"
            style={{ 
              pointerEvents: 'auto',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-darkblue/70 hover:bg-darkblue/90 text-gold p-4 rounded-full transition-all duration-300 z-20 border-2 border-gold/40 hover:border-gold shadow-lg hover:shadow-xl"
            aria-label="Наступний відгук"
            style={{ 
              pointerEvents: 'auto',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* ВИПРАВЛЕНО: Testimonials slider з правильними розмірами */}
          <div className="overflow-hidden py-8 px-2">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ 
                transform: `translateX(-${activeIndex * 100}%)`,
                width: `${testimonials.length * 100}%`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4" 
                  itemScope 
                  itemType="https://schema.org/Review"
                  style={{ 
                    width: `${100 / testimonials.length}%`,
                    minHeight: '350px'
                  }}
                >
                  <div className="card text-center h-full flex flex-col justify-between">
                    <meta itemProp="itemReviewed" content="MiaxiaLip Tarot Services" />
                    <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                      <meta itemProp="ratingValue" content="5" />
                      <meta itemProp="bestRating" content="5" />
                    </div>
                    
                    {/* Рейтинг зірочки */}
                    <div className="mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-gold text-2xl mx-1">★</span>
                      ))}
                    </div>
                    
                    {/* Текст відгуку - ВИПРАВЛЕНО: кращий розмір і відступи */}
                    <blockquote 
                      className="text-gray-200 text-base md:text-lg italic mb-8 flex-grow flex items-center leading-relaxed" 
                      itemProp="reviewBody"
                      style={{ minHeight: '120px' }}
                    >
                      <span>"{testimonial.text}"</span>
                    </blockquote>
                    
                    {/* Автор відгуку */}
                    <div className="flex items-center justify-center mt-auto" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <div className="w-14 h-14 rounded-full overflow-hidden mr-4 bg-gradient-to-br from-purple/40 to-darkblue/40 flex items-center justify-center border-2 border-gold/30">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gold text-xl font-bold">{testimonial.name[0]}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold gold-gradient text-lg" itemProp="name">{testimonial.name}</h4>
                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                      </div>
                      <meta itemProp="datePublished" content="2024-12-01" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* ВИПРАВЛЕНО: Dots indicator з гарантованою активністю */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Dot clicked, setting index to:', i);
                  setActiveIndex(i);
                }}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  i === activeIndex 
                    ? 'bg-gold border-gold w-8 shadow-lg' 
                    : 'bg-transparent border-gray-500 hover:border-gold/60 hover:bg-gold/20'
                }`}
                aria-label={`Перейти до відгуку ${i + 1}`}
                style={{ 
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                type="button"
              />
            ))}
          </div>
          
          {/* ДОДАНО: Індикатор прогресу */}
          <div className="text-center mt-6">
            <span className="text-gray-400 text-sm bg-darkblue/30 px-4 py-2 rounded-full">
              Відгук {activeIndex + 1} з {testimonials.length}
            </span>
          </div>
          
          {/* ДОДАНО: Контролі для мобільних */}
          <div className="flex justify-center mt-4 space-x-4 md:hidden">
            <button
              onClick={goToPrev}
              className="bg-gold/20 text-gold px-4 py-2 rounded-lg transition-colors hover:bg-gold/30"
              style={{ pointerEvents: 'auto' }}
            >
              ← Попередній
            </button>
            <button
              onClick={goToNext}
              className="bg-gold/20 text-gold px-4 py-2 rounded-lg transition-colors hover:bg-gold/30"
              style={{ pointerEvents: 'auto' }}
            >
              Наступний →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
