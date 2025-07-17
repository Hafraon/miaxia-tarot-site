import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartForm from './SmartForm';
import { TelegramService, TelegramMessage } from '../utils/telegramService';

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

  console.log('🎯 FormManager БЕЗ ТРЕКІНГУ:', { activeFormType, isSubmitting });

  // ✅ useCallback для handleFormSubmit БЕЗ трекінгу
  const handleFormSubmit = useCallback(async (data: any) => {
    try {
      console.log('📤 FormManager: Відправка форми БЕЗ ТРЕКІНГУ...', data);
      setIsSubmitting(true);
      setSubmitStatus('idle');
      setSubmitMessage('');

      // ❌ ВИДАЛЕНО: leadTracker.trackFormSubmit(data.formType);
      // ❌ ВИДАЛЕНО: trackFormSubmit, trackQuickOrderConversion, trackOrderFormConversion

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

      console.log('📤 Відправка через TelegramService...', telegramData);

      // Відправка через TelegramService
      const result = await TelegramService.sendMessage(telegramData);

      if (result.success) {
        console.log('✅ Форма успішно відправлена!', result);

        // ❌ ВИДАЛЕНО: trackQuickOrderConversion, trackOrderFormConversion

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
      console.error('❌ FormManager: Помилка відправки форми:', error);
      setSubmitStatus('error');
      
      if (error.message.includes('Network')) {
        setSubmitMessage('Проблеми з мережею. Перевірте з\'єднання та спробуйте ще раз.');
      } else {
        setSubmitMessage(error.message || 'Виникла помилка при відправці. Спробуйте пізніше.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSuccess, navigate]); // ✅ Чисті залежності

  // ✅ useCallback для handleFormTypeChange
  const handleFormTypeChange = useCallback((newFormType: 'quick' | 'detailed' | 'newsletter') => {
    console.log(`🔄 Переключення форми на: ${newFormType}`);
    setActiveFormType(newFormType);
  }, []);

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
              onClick={() => handleFormTypeChange(key as any)}
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

      {/* SmartForm component */}
      <SmartForm 
        formType={activeFormType} 
        onSubmit={handleFormSubmit}
        disabled={isSubmitting}
        className="max-w-2xl mx-auto"
      />
    </div>
  );
};

export default FormManager;
