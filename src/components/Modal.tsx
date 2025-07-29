import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackFormStart, trackFormSubmit, trackQuickOrderConversion, trackButtonClick } from '../utils/analytics';
import { SERVICES } from '../data/services';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    instagram: '',
    service: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Відстеження відкриття модального вікна
  useEffect(() => {
    if (isOpen) {
      trackButtonClick('open_modal', 'consultation_request');
    }
  }, [isOpen]);

  const handleFormStart = () => {
    trackFormStart('modal_form');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Додаткові перевірки для запобігання закриття при кліку на форму
      if (modalRef.current && 
          !modalRef.current.contains(target) && 
          !target.closest('form') && 
          !target.closest('.bg-darkblue') &&
          !target.matches('input, select, textarea, label, option')) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Використовуємо setTimeout для уникнення конфліктів з іншими обробниками
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }, 100);
      
      document.body.style.overflow = 'hidden';
      // Блокуємо всі кліки позаду модального вікна
      document.body.style.pointerEvents = 'none';
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
      };
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    };
  }, [isOpen, onClose]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Ім'я повинно містити мінімум 2 символи";
    }
    
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      newErrors.phone = "Телефон повинен містити мінімум 10 цифр";
    }
    
    // Phone format validation
    const phoneRegex = /^(\+380|380|0)[0-9]{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = "Невірний формат телефону. Використовуйте: +380XXXXXXXXX";
    }
    
    if (!formData.instagram.trim()) {
      newErrors.instagram = "Instagram є обов'язковим";
    }
    
    if (!formData.service) {
      newErrors.service = "Оберіть послугу";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitStatus('error');
      setSubmitMessage('Будь ласка, виправте помилки у формі');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // Відстеження відправки форми
      trackFormSubmit('modal_form', formData.service || 'quick_consultation');
      
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Відстеження успішної конверсії
        const serviceInfo = result.service || SERVICES[formData.service as keyof typeof SERVICES];
        const servicePrice = serviceInfo ? serviceInfo.originalPrice : 400; // Використовуємо повну ціну
        const serviceName = serviceInfo ? serviceInfo.name : 'Швидка консультація';
        
        trackQuickOrderConversion(serviceName, servicePrice);
        
        setSubmitStatus('success');
        setSubmitMessage('Заявка успішно відправлена! Перенаправляємо...');
        
        // Close modal and redirect to thank you page after short delay
        setTimeout(() => {
          onClose();
          navigate('/thank-you');
        }, 2000);
      } else {
        throw new Error(result.error || 'Помилка відправки');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setSubmitStatus('error');
      
      if (error.message.includes('валідації')) {
        setSubmitMessage('Помилка валідації даних. Перевірте правильність заповнення полів.');
      } else {
        setSubmitMessage('Виникла помилка при відправці. Будь ласка, спробуйте пізніше.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Відстеження початку заповнення при першому введенні
    if (!formData.name && !formData.phone) {
      handleFormStart();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear submit status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      <div 
        className="absolute inset-0 bg-darkblue/80 backdrop-blur-sm" 
        style={{ zIndex: 9998, pointerEvents: 'auto' }}
      ></div>
      
      <div 
        ref={modalRef}
        className="relative bg-darkblue border border-gold/30 rounded-lg shadow-xl max-w-md w-full p-6 md:p-8"
        style={{ zIndex: 10000, pointerEvents: 'auto' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
          aria-label="Закрити"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-bold gold-gradient mb-4">Записатися на консультацію</h3>
        
        <p className="text-gray-300 mb-4">
          Залиште свої контактні дані, і я зв'яжуся з вами найближчим часом для узгодження деталей.
        </p>
        
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-200">
            💡 <strong>Підказка:</strong> В Telegram боті всі ці ж консультації дешевші на 20-30%!
          </p>
          <a 
            href="https://t.me/miaxialiptarotbot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 text-sm underline"
          >
            Перейти в бот →
          </a>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 mb-2">Ім'я *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={handleFormStart}
              className={`w-full bg-darkblue/60 border ${errors.name ? 'border-accent' : 'border-purple/30'} rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60`}
              placeholder="Ваше ім'я"
            />
            {errors.name && <p className="text-accent text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-300 mb-2">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full bg-darkblue/60 border ${errors.phone ? 'border-accent' : 'border-purple/30'} rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60`}
              placeholder="+380XXXXXXXXX"
            />
            {errors.phone && <p className="text-accent text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="instagram" className="block text-gray-300 mb-2">Нікнейм Instagram *</label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className={`w-full bg-darkblue/60 border ${errors.instagram ? 'border-accent' : 'border-purple/30'} rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60`}
              placeholder="@username"
            />
            {errors.instagram && <p className="text-accent text-sm mt-1">{errors.instagram}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="service" className="block text-gray-300 mb-2">Послуга, яка вас цікавить *</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={`w-full bg-darkblue/60 border ${errors.service ? 'border-accent' : 'border-purple/30'} rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60`}
            >
              <option value="">Оберіть послугу</option>
              {Object.entries(SERVICES).map(([key, service]) => (
                <option key={key} value={key}>
                  {service.name} - {service.originalPrice} грн
                </option>
              ))}
            </select>
            {errors.service && <p className="text-accent text-sm mt-1">{errors.service}</p>}
          </div>

          {submitMessage && (
            <div className={`mb-6 p-4 rounded-md border ${
              submitStatus === 'success' 
                ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                : 'bg-red-900/20 border-red-500/30 text-red-400'
            }`}>
              {submitMessage}
            </div>
          )}
          
          <button
            type="submit"
            className="btn-primary w-full text-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Надсилання...' : 'Замовити консультацію'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;