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
        
        <div className="relative max-w-6xl mx-auto px-20">
          {/* Slider controls */}
          <button 
            onClick={goToPrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gradient-to-r from-darkblue to-purple hover:from-purple hover:to-darkblue text-gold p-3 md:p-4 rounded-full transition-all duration-300 z-30 border-2 border-gold/50 hover:border-gold shadow-2xl hover:shadow-gold/30 hover:scale-110"
            aria-label="Попередній відгук"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-darkblue to-purple hover:from-purple hover:to-darkblue text-gold p-3 md:p-4 rounded-full transition-all duration-300 z-30 border-2 border-gold/50 hover:border-gold shadow-2xl hover:shadow-gold/30 hover:scale-110"
            aria-label="Наступний відгук"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="card text-center">
                    <div className="mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-gold text-2xl mx-1">★</span>
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-200 text-lg italic mb-8">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-purple/30 flex items-center justify-center">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gold text-xl">{testimonial.name[0]}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold gold-gradient">{testimonial.name}</h4>
                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
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
        </div>
      </div>
    </section>
  );
};

export default Testimonials;