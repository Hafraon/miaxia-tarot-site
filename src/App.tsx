import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initGoogleAds, trackPageView, trackScroll, trackPageLoad } from './utils/analytics';
import useLeadTracker from './hooks/useLeadTracker';
import useSmartPopups from './hooks/useSmartPopups';
import LeadAnalyticsBadge from './components/LeadAnalyticsBadge';
import './utils/leadReporting'; // Ініціалізація системи звітності
import SmartPopup from './components/SmartPopup';
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
  
  // Lead tracking and smart popups
  const leadTracker = useLeadTracker();
  
  // Створюємо об'єкт leadScore для smart popups
  const currentLeadScore = {
    totalScore: leadTracker.getCurrentScore(),
    timeOnSite: leadTracker.getCurrentDuration(),
    scrollDepth: leadTracker.getCurrentScrollPercent(),
    interactions: leadTracker.getCurrentInteractions(),
    level: leadTracker.getCurrentScore() >= 80 ? 'vip' as const : 
           leadTracker.getCurrentScore() >= 60 ? 'hot' as const :
           leadTracker.getCurrentScore() >= 40 ? 'warm' as const : 'cold' as const
  };

  const { 
    popupState, 
    showExitPopup, 
    setShowExitPopup, 
    closePopup, 
    handlePopupSubmit 
  } = useSmartPopups(currentLeadScore);

  console.log('🚀 App рендериться, popupState:', popupState);

  // Ініціалізація Google Ads
  React.useEffect(() => {
    initGoogleAds();
    trackPageLoad();
    console.log('📊 Google Ads ініціалізовано');
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
            console.log(`📊 Відстежено скрол: ${percentage}%`);
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

  const HomePage = () => (
    <>
      {React.useEffect(() => {
        trackPageView('Home Page', window.location.href);
        console.log('📊 Відстежено перегляд головної сторінки');
      }, [])}
      
      <Header onOrderClick={() => {
        console.log('🔄 Відкриття модального вікна замовлення');
        setShowModal(true);
      }} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
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
              onClick={() => {
                console.log('🔄 Відкриття модального вікна з hero секції');
                setShowModal(true);
              }}
              className="btn-primary text-lg relative group overflow-hidden"
              style={{ pointerEvents: 'auto' }}
            >
              <span className="relative z-10">Отримати консультацію зараз</span>
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </button>
          </div>
        </div>
      </section>
      
      <main className="pt-4">
        <CardOfDay 
          onFullReadingClick={() => {
            console.log('🔄 Відкриття модального вікна з CardOfDay');
            setShowModal(true);
          }} 
          onCardDraw={() => {
			console.log('🔮 Витягування карти відстежено');
			leadTracker.trackServiceClick('daily_card');
          }}
        />
        <Services />
        <AboutMe />
        <Testimonials />
        <SpecialOffer onOfferClick={() => {
          console.log('🔄 Відкриття модального вікна з спеціальної пропозиції');
          setShowModal(true);
        }} />
        <OrderForm />
      </main>
      
      <Footer />
      
      <Modal 
        isOpen={showModal} 
        onClose={() => {
          console.log('🔄 Закриття модального вікна');
          setShowModal(false);
        }}
        onFormStart={() => {
          console.log('📝 Початок заповнення форми в модальному вікні');
          leadTracker.trackFormOpen('modal');
        }}
      />
      
      {/* Exit Intent Popup */}
      <ExitPopup
        isOpen={showExitPopup}
        onClose={() => {
          console.log('🔄 Закриття Exit Intent попапу');
          setShowExitPopup(false);
        }}
      />
      
      {/* Smart Popup System - ВИПРАВЛЕНО: правильний пропс isVisible */}
      <SmartPopup
        isVisible={popupState.isOpen} // ВИПРАВЛЕНО: було isOpen, тепер isVisible
        onClose={() => {
          console.log('🔄 Закриття SmartPopup');
          closePopup();
        }}
        type={popupState.type!}
        leadScore={currentLeadScore}
        onSubmit={handlePopupSubmit}
      />
      
      {/* Lead Analytics Badge */}
      <LeadAnalyticsBadge />
    </>
  );

  console.log('🎯 App повертає JSX, показуємо SmartPopup:', popupState.isOpen);

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
