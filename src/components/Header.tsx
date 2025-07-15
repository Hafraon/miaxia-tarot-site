import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { trackButtonClick } from '../utils/analytics';

interface HeaderProps {
  onOrderClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOrderClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-darkblue/95 backdrop-blur-md py-3 shadow-lg border-b border-gold/20' : 'bg-darkblue/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-gold" />
          <span className="text-xl md:text-2xl font-bold gold-gradient">MiaxiaLip</span>
        </a>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gold"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="nav-link">Головна</a>
          <a href="#services" className="nav-link">Послуги</a>
          <a href="#about" className="nav-link">Про мене</a>
          <a href="#testimonials" className="nav-link">Відгуки</a>
          <a href="#contact" className="nav-link">Контакти</a>
        </nav>
        
        <button onClick={onOrderClick} className="hidden md:block btn-primary">
          Замовити розклад
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full top-full left-0 bg-darkblue/95 backdrop-blur-md transition-all duration-300 ${
        isMobileMenuOpen ? 'max-h-[300px] py-4 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
      }`}>
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <a href="#" className="nav-link block py-2" onClick={() => setIsMobileMenuOpen(false)}>Головна</a>
          <a href="#services" className="nav-link block py-2" onClick={() => setIsMobileMenuOpen(false)}>Послуги</a>
          <a href="#about" className="nav-link block py-2" onClick={() => setIsMobileMenuOpen(false)}>Про мене</a>
          <a href="#testimonials" className="nav-link block py-2" onClick={() => setIsMobileMenuOpen(false)}>Відгуки</a>
          <a href="#contact" className="nav-link block py-2" onClick={() => setIsMobileMenuOpen(false)}>Контакти</a>
          <button onClick={() => {onOrderClick(); setIsMobileMenuOpen(false);}} className="btn-primary w-full text-center">
            Замовити розклад
          </button>
          <button 
            onClick={() => {
              trackButtonClick('order_reading', 'mobile_menu');
              onOrderClick(); 
              setIsMobileMenuOpen(false);
            }} 
            className="btn-primary w-full text-center"
          >
            Замовити розклад
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header