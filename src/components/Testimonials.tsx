import React, { useState } from 'react';
import { testimonials } from '../data/testimonials';

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

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
          {/* Slider controls */}
          <button 
            onClick={goToPrev}
            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-darkblue/50 hover:bg-darkblue/80 text-gold p-3 rounded-full transition-colors duration-300 z-10"
            aria-label="Попередній відгук"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-darkblue/50 hover:bg-darkblue/80 text-gold p-3 rounded-full transition-colors duration-300 z-10"
            aria-label="Наступний відгук"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Testimonials slider */}
          <div className="overflow-hidden py-8">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4" itemScope itemType="https://schema.org/Review">
                  <div className="card text-center">
                    <meta itemProp="itemReviewed" content="MiaxiaLip Tarot Services" />
                    <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                      <meta itemProp="ratingValue" content="5" />
                      <meta itemProp="bestRating" content="5" />
                    </div>
                    <div className="mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-gold text-xl mx-0.5">★</span>
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-200 text-lg italic mb-8" itemProp="reviewBody">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-purple/30 flex items-center justify-center">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gold text-xl">{testimonial.name[0]}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold gold-gradient" itemProp="name">{testimonial.name}</h4>
                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                      </div>
                      <meta itemProp="datePublished" content="2024-01-01" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'bg-gold w-6' : 'bg-gray-500 hover:bg-gold/60'
                }`}
                aria-label={`Перейти до відгуку ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;