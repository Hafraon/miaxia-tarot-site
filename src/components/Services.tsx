import React from 'react';
import { Heart, TrendingUp, Users, Star, Building, Calculator, Calendar, UserCheck } from 'lucide-react';
import { getServicesList } from '../data/services';

const Services: React.FC = () => {
  const services = getServicesList();
  
  const icons: Record<string, React.ReactNode> = {
    individual: <Users className="h-8 w-8" />,
    love: <Heart className="h-8 w-8" />,
    career: <TrendingUp className="h-8 w-8" />,
    full: <Star className="h-8 w-8" />,
    relationship: <UserCheck className="h-8 w-8" />,
    business: <Building className="h-8 w-8" />,
    matrix: <Calculator className="h-8 w-8" />,
    compatibility: <Heart className="h-8 w-8" />,
    year: <Calendar className="h-8 w-8" />
  };

  return (
    <section id="services" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title" itemProp="name">Мої послуги</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Професійні розклади таро для всіх сфер життя. Розкривайте свій потенціал і знаходьте відповіді на найважливіші питання.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" itemScope itemType="https://schema.org/ItemList">
          {services.map((service) => (
            <div 
              key={service.id}
              className="card group hover:border-gold/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] relative"
              itemScope
              itemType="https://schema.org/Service"
            >
              {service.discount > 0 && (
                <div className="absolute -top-3 -right-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{service.discount}%
                </div>
              )}
              
              <div className="icon-container mb-6 inline-block group-hover:scale-110 transition-transform duration-300">
                {icons[service.id]}
              </div>
              
              <h3 className="text-xl font-semibold mb-3 gold-gradient" itemProp="name">
                {service.title}
              </h3>
              
              <p className="text-gray-300 mb-6 text-sm" itemProp="description">
                {service.description}
              </p>
              
              <div className="mb-6" itemScope itemType="https://schema.org/Offer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gold" itemProp="price">{service.price}</span>
                  <meta itemProp="priceCurrency" content="UAH" />
                  <span className="text-gold">грн</span>
                  {service.originalPrice > service.price && (
                    <span className="text-gray-400 line-through text-lg">{service.originalPrice} грн</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">Спеціальна ціна</p>
                <meta itemProp="availability" content="https://schema.org/InStock" />
              </div>
              
              <a 
                href="#contact"
                className="inline-flex items-center text-gold hover:text-white transition-colors duration-300"
              >
                Замовити зараз
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className="hidden lg:block absolute top-1/2 left-10 h-32 w-32 border-l-2 border-t-2 border-gold/20 rounded-tl-xl -z-10 transform -translate-y-1/2"></div>
        <div className="hidden lg:block absolute top-1/2 right-10 h-32 w-32 border-r-2 border-b-2 border-gold/20 rounded-br-xl -z-10 transform -translate-y-1/2"></div>
      </div>
    </section>
  );
};

export default Services;