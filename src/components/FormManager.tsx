import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartForm from './SmartForm';
import { trackFormStart, trackFormSubmit, trackOrderFormConversion, trackQuickOrderConversion } from '../utils/analytics';

interface FormManagerProps {
  defaultType?: 'quick' | 'detailed' | 'newsletter';
  onSuccess?: () => void;
  className?: string;
}

const FormManager: React.FC<FormManagerProps> = ({ 
  defaultType = 'detailed', 
  onSuccess,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [activeFormType, setActiveFormType] = useState<'quick' | 'detailed' | 'newsletter'>(defaultType);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFormSubmit = async (data: any) => {
    try {
      setSubmitStatus('idle');
      setSubmitMessage('');

      // Track form submission
      trackFormSubmit(`${data.formType}_form`, data.service || 'consultation');

      // Format message for Telegram
      const message = formatTelegramMessage(data);

      // Send to Telegram
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          instagram: data.instagram,
          service: data.service,
          birthdate: data.birthdate,
          question: data.question,
          email: data.email,
          formType: data.formType,
          analytics: data.analytics
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Track conversion based on form type
        if (data.formType === 'quick') {
          trackQuickOrderConversion('Швидка консультація', 300);
        } else if (data.formType === 'detailed') {
          trackOrderFormConversion('Детальна консультація', 500);
        }

        setSubmitStatus('success');
        setSubmitMessage('Заявка успішно відправлена! Перенаправляємо...');

        // Handle success
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        } else {
          setTimeout(() => {
            navigate('/thank-you');
          }, 2000);
        }
      } else {
        throw new Error(result.error || 'Помилка відправки');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      
      if (error.message.includes('валідації')) {
        setSubmitMessage('Помилка валідації даних. Перевірте правильність заповнення полів.');
      } else {
        setSubmitMessage('Виникла помилка при відправці. Будь ласка, спробуйте пізніше.');
      }
    }
  };

  const formatTelegramMessage = (data: any): string => {
    const formTypeNames = {
      quick: 'Швидка заявка',
      detailed: 'Детальна заявка',
      newsletter: 'Підписка на розсилку'
    };

    let message = `📋 ${formTypeNames[data.formType as keyof typeof formTypeNames]}\n\n`;
    
    message += `👤 Ім'я: ${data.name}\n`;
    
    if (data.phone) {
      message += `📱 Телефон: ${data.phone}\n`;
    }
    
    if (data.email) {
      message += `📧 Email: ${data.email}\n`;
    }
    
    if (data.instagram) {
      message += `📸 Instagram: ${data.instagram}\n`;
    }
    
    if (data.birthdate) {
      message += `🎂 Дата народження: ${data.birthdate}\n`;
    }
    
    if (data.service) {
      message += `💫 Послуга: ${data.service}\n`;
    }
    
    if (data.question) {
      message += `❓ Питання: ${data.question}\n`;
    }

    // Analytics data
    if (data.analytics) {
      message += `\n📊 Аналітика:\n`;
      message += `⏱️ Час заповнення: ${Math.round(data.analytics.completionTime / 1000)} сек\n`;
      message += `🖱️ Взаємодії: ${data.analytics.totalInteractions}\n`;
      message += `🔗 Джерело: ${data.analytics.source || 'direct'}\n`;
    }

    message += `\n⏰ Час: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}`;

    return message;
  };

  return (
    <div className={className}>
      {/* Form type selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-darkblue/60 rounded-lg p-1 border border-purple/30">
          {[
            { key: 'quick', label: 'Швидко', icon: '⚡' },
            { key: 'detailed', label: 'Детально', icon: '📋' },
            { key: 'newsletter', label: 'Розсилка', icon: '📧' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveFormType(key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeFormType === key
                  ? 'bg-gold text-darkblue shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-purple/30'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status message */}
      {submitMessage && (
        <div className={`mb-6 p-4 rounded-md border ${
          submitStatus === 'success' 
            ? 'bg-green-900/20 border-green-500/30 text-green-400' 
            : 'bg-red-900/20 border-red-500/30 text-red-400'
        }`}>
          {submitMessage}
        </div>
      )}

      {/* Active form */}
      <SmartForm
        formType={activeFormType}
        onSubmit={handleFormSubmit}
      />

      {/* Form descriptions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className={`p-3 rounded-lg border transition-all duration-300 ${
          activeFormType === 'quick' 
            ? 'border-gold/50 bg-gold/10' 
            : 'border-purple/30 bg-purple/10'
        }`}>
          <h4 className="font-semibold text-gold mb-1">⚡ Швидка заявка</h4>
          <p className="text-gray-300">Тільки ім'я та телефон. Ідеально для швидкого зв'язку.</p>
        </div>
        
        <div className={`p-3 rounded-lg border transition-all duration-300 ${
          activeFormType === 'detailed' 
            ? 'border-gold/50 bg-gold/10' 
            : 'border-purple/30 bg-purple/10'
        }`}>
          <h4 className="font-semibold text-gold mb-1">📋 Детальна заявка</h4>
          <p className="text-gray-300">Повна інформація для якісної консультації таро.</p>
        </div>
        
        <div className={`p-3 rounded-lg border transition-all duration-300 ${
          activeFormType === 'newsletter' 
            ? 'border-gold/50 bg-gold/10' 
            : 'border-purple/30 bg-purple/10'
        }`}>
          <h4 className="font-semibold text-gold mb-1">📧 Розсилка</h4>
          <p className="text-gray-300">Отримуйте новини, акції та безкоштовні прогнози.</p>
        </div>
      </div>
    </div>
  );
};

export default FormManager;