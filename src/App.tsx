import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initGoogleAds, trackPageView, trackScroll, trackPageLoad } from './utils/analytics';
import Header from './components/Header';
import Services from './components/Services';
import AboutMe from './components/AboutMe';
import Testimonials from './components/Testimonials';
import SpecialOffer from './components/SpecialOffer';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ExitPopup from './components/ExitPopup';
import CardOfDay from './components/CardOfDay';
import ThankYouPage from './components/ThankYouPage';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);

  // Ініціалізація Google Ads
  React.useEffect(() => {
    initGoogleAds();
    trackPageLoad();
  }, []);

  // Відстеження скролу сторінки
  React.useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const scrollPercentages = [25, 50, 75, 100];
    const trackedPercentages = new Set<number>();

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        scrollPercentages.forEach(percentage => {
          if (scrollPercent >= percentage && !trackedPercentages.has(percentage)) {
            trackScroll(percentage);
            trackedPercentages.add(percentage);
          }
        });
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Handle exit intent
  React.useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('exitPopupShown')) {
        setShowExitPopup(true);
        localStorage.setItem('exitPopupShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const HomePage = () => (
    <>
      {React.useEffect(() => {
        trackPageView('Home Page', window.location.href);
      }, [])}
      
      <Header onOrderClick={() => setShowModal(true)} />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="text-gold text-lg">✨ Магія таро</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight gold-gradient">
              MiaxiaLip: ключ до вашого майбутнього
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Пізнайте таємниці долі разом зі справжнім майстром таро. Відкрийте шлях до розуміння минулого, сьогодення та майбутнього.
            </p>
            
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary text-lg relative group overflow-hidden"
            >
              <span className="relative z-10">Отримати консультацію зараз</span>
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </button>
          </div>
        </div>
      </section>
      
      <main>
        <CardOfDay onFullReadingClick={() => setShowModal(true)} />
        <Services />
        <AboutMe />
        <Testimonials />
        <SpecialOffer onOfferClick={() => setShowModal(true)} />
        <OrderForm />
      </main>
      
      <Footer />
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
      <ExitPopup isOpen={showExitPopup} onClose={() => setShowExitPopup(false)} />
    </>
  );

  return (
    <Router>
      <div className="min-h-screen relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;