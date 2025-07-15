import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartForm from './SmartForm';
import { TelegramService, TelegramMessage } from '../utils/telegramService';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');
      setSubmitMessage('');

      // Track form submission
      trackFormSubmit(`${data.formType}_form`, data.service || 'consultation');

      // Підготовка даних для Telegram
      const telegramData: TelegramMessage = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        instagram: data.instagram,
        birthdate: data.birthdate,
        question: data.question,
        service: data.service,
        formType: data.formType,
        analytics: data.analytics
      };

      // Відправка через TelegramService
      const result = await TelegramService.sendMessage(telegramData);

      if (result.success) {
        // Track conversion based on form type
        if (data.formType === 'quick') {
          trackQuickOrderConversion('Швидка консультація', 300);
        } else if (data.formType === 'detailed') {
          trackOrderFormConversion('Детальна консультація', 500);
        }

        setSubmitStatus('success');
        setSubmitMessage(result.message || 'Заявка успішно відправлена! Перенаправляємо...');

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
      
      if (error.message.includes('Network')) {
        setSubmitMessage('Проблеми з мережею. Перевірте з\'єднання та спробуйте ще раз.');
      } else {
        setSubmitMessage(error.message || 'Виникла помилка при відправці. Спробуйте пізніше.');
      }
    } finally {
      setIsSubmitting(false);
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
        <div className={`mb-6 p-4 rounded-md border animate-pulse ${
          submitStatus === 'success' 
            ? 'bg-green-900/20 border-green-500/30 text-green-400' 
            : 'bg-red-900/20 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center">
            {submitStatus === 'success' ? '✅' : '❌'} {submitMessage}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isSubmitting && (
        <div className="mb-6 p-4 rounded-md border border-gold/30 bg-gold/10 text-gold">
          <div className="flex items-center justify-center">
            <div className="animate-spin mr-2">⌛</div>
            Відправляємо...
          </div>
        </div>
      )}
    </div>
  );
};

export default FormManager;