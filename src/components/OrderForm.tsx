import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackFormStart, trackFormSubmit, trackOrderFormConversion } from '../utils/analytics';
import { SERVICES } from '../data/services';

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    question: '',
    phone: '',
    instagram: '',
    service: '',
    consent: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Відстеження початку заповнення форми
  const handleFormStart = () => {
    trackFormStart('order_form');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Відстеження початку заповнення при першому введенні
    if (!formData.name && !formData.phone && !formData.question) {
      handleFormStart();
    }
    
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Ім'я повинно містити мінімум 2 символи";
    }
    
    if (!formData.birthdate) {
      newErrors.birthdate = "Дата народження є обов'язковою";
    }
    
    if (!formData.question.trim()) {
      newErrors.question = "Питання є обов'язковим";
    }
    
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      newErrors.phone = "Телефон повинен містити мінімум 10 цифр";
    }
    
    // Phone format validation
    const phoneRegex = /^(\+380|380|0)[0-9]{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = "Невірний формат телефону. Використовуйте: +380XXXXXXXXX";
    }
    
    if (!formData.consent) {
      newErrors.consent = "Необхідно дати згоду на обробку даних";
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
      trackFormSubmit('order_form', formData.service || 'full_consultation');
      
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
        const servicePrice = serviceInfo ? serviceInfo.originalPrice : 500; // Використовуємо повну ціну
        const serviceName = serviceInfo ? serviceInfo.name : 'Повна консультація таро';
        
        trackOrderFormConversion(serviceName, servicePrice);
        
        setSubmitStatus('success');
        setSubmitMessage('Заявка успішно відправлена! Перенаправляємо...');
        
        // Redirect to thank you page after short delay
        setTimeout(() => {
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
        setSubmitMessage('Виникла помилка при відправці. Будь ласка, спробуйте пізніше або зв\'яжіться з нами напряму.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = () => {
    switch (submitStatus) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-purple/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Замовити розклад</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Заповніть форму нижче, щоб замовити індивідуальний розклад таро. Я зв'яжуся з вами найближчим часом, щоб обговорити деталі.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
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
              
              <div>
                <label htmlFor="birthdate" className="block text-gray-300 mb-2">Дата народження *</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className={`w-full bg-darkblue/60 border ${errors.birthdate ? 'border-accent' : 'border-purple/30'} rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60`}
                />
                {errors.birthdate && <p className="text-accent text-sm mt-1">{errors.birthdate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="phone" className="block text-gray-300 mb-2">Контактний телефон *</label>
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

              <div>
                <label htmlFor="instagram" className="block text-gray-300 mb-2">Нікнейм Instagram</label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full bg-darkblue/60 border border-purple/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60"
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="service" className="block text-gray-300 mb-2">Оберіть послугу</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-darkblue/60 border border-purple/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60"
              >
                <option value="">Оберіть послугу</option>
                {Object.entries(SERVICES).map(([key, service]) => (
                  <option key={key} value={key}>
                    {service.name} - {service.originalPrice} грн
                  </option>
                ))}                
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="question" className="block text-gray-300 mb-2">Ваше питання до таролога *</label>
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows={4}
                className={`w-full bg-darkblue/60 border ${errors.question ? 'border-accent' : 'border-purple/30'} rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60 resize-none`}
                placeholder="Опишіть вашу ситуацію або питання, яке вас цікавить..."
              ></textarea>
              {errors.question && <p className="text-accent text-sm mt-1">{errors.question}</p>}
            </div>
            
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <span className={`text-sm ${errors.consent ? 'text-accent' : 'text-gray-300'}`}>
                  Я даю згоду на обробку моїх персональних даних та погоджуюся з правилами конфіденційності *
                </span>
              </label>
              {errors.consent && <p className="text-accent text-sm mt-1">{errors.consent}</p>}
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
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-darkblue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Надсилання...
                </span>
              ) : (
                "Замовити розклад"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;