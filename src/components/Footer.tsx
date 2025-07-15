import React from 'react';
import { Sparkles, Mail, Instagram, GitBranch as BrandTiktok, MessageCircle, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-darkblue/90 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-gold" />
              <h3 className="text-xl font-bold gold-gradient">MiaxiaLip</h3>
            </div>
            
            <p className="mb-6">
              Відкрийте таємниці майбутнього та знайдіть відповіді на найважливіші питання життя з допомогою професійних розкладів таро.
            </p>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-gold/20 text-gold px-3 py-1 rounded-full border border-gold/30">
                5 років досвіду
              </span>
              <span className="bg-gold/20 text-gold px-3 py-1 rounded-full border border-gold/30">
                Сертифікований таролог
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 gold-gradient">Контакти</h4>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold" />
                <a href="mailto:info@miaxialip.com" className="hover:text-gold transition-colors duration-300">
                  info@miaxialip.com
                </a>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold mt-6 mb-4 gold-gradient">Години роботи</h4>
            <p>Щодня: 11:00 - 02:00</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 gold-gradient">Слідкуйте за нами</h4>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              <a 
                href="https://www.instagram.com/miaxialip?igsh=bzF5bGZ6N3N3ODRt&utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-darkblue/70 p-3 rounded-full border border-purple/40 hover:border-gold/50 hover:text-gold transition-all duration-300 group flex items-center justify-center"
                title="Instagram"
              >
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="https://www.tiktok.com/@miaxialip2?_t=ZM-8w4vRCs4x8f&_r=1" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-darkblue/70 p-3 rounded-full border border-purple/40 hover:border-gold/50 hover:text-gold transition-all duration-300 group flex items-center justify-center"
                title="TikTok"
              >
                <BrandTiktok className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="https://t.me/miaxialip_tarot_bot" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-darkblue/70 p-3 rounded-full border border-purple/40 hover:border-gold/50 hover:text-gold transition-all duration-300 group flex items-center justify-center"
                title="Telegram Bot"
              >
                <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a 
                href="https://t.me/miaxiataro" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-darkblue/70 p-3 rounded-full border border-purple/40 hover:border-gold/50 hover:text-gold transition-all duration-300 group flex items-center justify-center"
                title="Telegram Channel"
              >
                <Send className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
            
            <h4 className="text-lg font-semibold mb-4 gold-gradient">Розсилка новин</h4>
            <p className="mb-3 text-sm">
              Підпишіться на нашу розсилку, щоб отримувати спеціальні пропозиції та новини
            </p>
            
            <form className="flex">
              <input 
                type="email" 
                placeholder="Ваш email" 
                className="bg-darkblue/60 border border-purple/30 rounded-l-md px-4 py-2 text-white focus:outline-none focus:border-gold/60 flex-grow"
              />
              <button 
                type="submit" 
                className="bg-gold text-darkblue px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors duration-300"
              >
                OK
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-purple/30 pt-6 mt-6 text-center text-sm text-gray-400">
          <div className="mb-4">
            <a href="#" className="mx-3 hover:text-gold transition-colors duration-300">Політика конфіденційності</a>
            <a href="#" className="mx-3 hover:text-gold transition-colors duration-300">Умови використання</a>
          </div>
          <p>© 2025 MiaxiaLip. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;