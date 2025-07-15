import React from 'react';
import useCountdown from '../hooks/useCountdown';

interface SpecialOfferProps {
  onOfferClick: () => void;
}

const SpecialOffer: React.FC<SpecialOfferProps> = ({ onOfferClick }) => {
  const { hours, minutes, seconds } = useCountdown();

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple/50 to-darkblue/50 rounded-lg transform rotate-1"></div>
          <div className="absolute inset-0 border-2 border-gold/30 rounded-lg transform -rotate-1"></div>
          
          <div className="relative bg-darkblue/80 backdrop-blur-sm p-8 md:p-12 rounded-lg border border-gold/20 z-10 text-center">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gold text-darkblue px-6 py-2 rounded-full font-bold text-sm uppercase">
              Спеціальна пропозиція
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold gold-gradient mb-6 mt-4">
              Спеціальна пропозиція тільки сьогодні!
            </h2>
            
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Замовте повний розклад долі та отримайте безкоштовну консультацію з питань кохання. Не пропустіть цю можливість дізнатися більше про своє майбутнє!
            </p>
            
            <div className="mb-8">
              <p className="text-gray-400 mb-3">Пропозиція закінчується через:</p>
              <div className="flex justify-center gap-4">
                <div className="w-20 h-20 bg-darkblue border border-gold/30 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gold">{hours}</span>
                  <span className="text-xs text-gray-400">годин</span>
                </div>
                <div className="w-20 h-20 bg-darkblue border border-gold/30 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gold">{minutes}</span>
                  <span className="text-xs text-gray-400">хвилин</span>
                </div>
                <div className="w-20 h-20 bg-darkblue border border-gold/30 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gold">{seconds}</span>
                  <span className="text-xs text-gray-400">секунд</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onOfferClick}
              className="btn-primary text-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Скористатися пропозицією</span>
              <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;