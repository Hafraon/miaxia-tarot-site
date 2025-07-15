import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    question: '',
    phone: '',
    instagram: '',
    consent: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Ім'я є обов'язковим";
    }
    
    if (!formData.birthdate) {
      newErrors.birthdate = "Дата народження є обов'язковою";
    }
    
    if (!formData.question.trim()) {
      newErrors.question = "Питання є обов'язковим";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон є обов'язковим";
    }
    
    if (!formData.consent) {
      newErrors.consent = "Необхідно дати згоду на обробку даних";
    }
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Send form data to Express API
    fetch('/api/send-telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        instagram: formData.instagram,
        service: 'Повна форма замовлення',
        birthdate: formData.birthdate,
        question: formData.question
      }),
    })
    .then(response => {
      if (response.ok) {
        // Redirect to thank you page
        navigate('/thank-you');
      } else {
        throw new Error('Failed to send message');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Виникла помилка. Будь ласка, спробуйте пізніше.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
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
          {submitted ? (
            <div className="card text-center py-12">
              <div className="text-gold text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold gold-gradient mb-4">Дякуємо за ваше замовлення!</h3>
              <p className="text-gray-300">
                Ваша заявка успішно відправлена. Я зв'яжуся з вами найближчим часом для уточнення деталей та призначення консультації.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">Ім'я</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-darkblue/60 border ${errors.name ? 'border-accent' : 'border-purple/30'} rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60`}
                    placeholder="Ваше ім'я"
                  />
                  {errors.name && <p className="text-accent text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="birthdate" className="block text-gray-300 mb-2">Дата народження</label>
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
                  <label htmlFor="phone" className="block text-gray-300 mb-2">Контактний телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-darkblue/60 border ${errors.phone ? 'border-accent' : 'border-purple/30'} rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60`}
                    placeholder="+380"
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
                <label htmlFor="question" className="block text-gray-300 mb-2">Ваше питання до таролога</label>
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
              
              <div className="mb-8">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 mr-3"
                  />
                  <span className={`text-sm ${errors.consent ? 'text-accent' : 'text-gray-300'}`}>
                    Я даю згоду на обробку моїх персональних даних та погоджуюся з правилами конфіденційності
                  </span>
                </label>
              </div>
              
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
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderForm;