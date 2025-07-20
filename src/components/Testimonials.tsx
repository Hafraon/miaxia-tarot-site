import React, { useState, useCallback } from 'react';
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

  // ВИПРАВЛЕНО: Використовуємо useCallback для стабільних функцій
  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
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
        
        <div className="relative max-w-4xl mx-auto px-8 md:px-12" itemScope itemType="https://schema.org/ItemList">
          
          {/* ВИПРАВЛЕНО: Testimonials slider з правильними розмірами */}
          <div className="overflow-hidden py-8 px-8 md:px-12 relative">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4" 
                  itemScope 
                  itemType="https://schema.org/Review"
                >
                  <div className="card text-center h-full flex flex-col justify-between min-h-[350px]">
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
                    
                    {/* Текст відгуку */}
                    <blockquote 
                      className="text-gray-200 text-base md:text-lg italic mb-8 flex-grow flex items-center leading-relaxed px-4" 
                      itemProp="reviewBody"
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
          
          {/* Кнопки навігації - ВИПРАВЛЕНО: позиціонування відносно всього блоку */}
          <button 
            onClick={goToPrev}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 bg-gradient-to-r from-darkblue to-purple hover:from-purple hover:to-darkblue text-gold p-3 md:p-4 rounded-full transition-all duration-300 z-30 border-2 border-gold/50 hover:border-gold shadow-2xl hover:shadow-gold/30 hover:scale-110"
            aria-label="Попередній відгук"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-2 bg-gradient-to-r from-darkblue to-purple hover:from-purple hover:to-darkblue text-gold p-3 md:p-4 rounded-full transition-all duration-300 z-30 border-2 border-gold/50 hover:border-gold shadow-2xl hover:shadow-gold/30 hover:scale-110"
            aria-label="Наступний відгук"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* ВИПРАВЛЕНО: Dots indicator з гарантованою активністю */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  i === activeIndex 
                    ? 'bg-gold border-gold w-8 shadow-lg' 
                    : 'bg-transparent border-gray-500 hover:border-gold/60 hover:bg-gold/20'
                }`}
                aria-label={`Перейти до відгуку ${i + 1}`}
                type="button"
              />
            ))}
          </div>
          
          {/* Індикатор прогресу */}
          <div className="text-center mt-6">
            <span className="text-gray-400 text-sm bg-darkblue/30 px-4 py-2 rounded-full">
              Відгук {activeIndex + 1} з {testimonials.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
