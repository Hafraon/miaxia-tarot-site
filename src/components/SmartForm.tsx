import React, { useState, useEffect, useCallback } from 'react';
import { User, Phone, Mail, Instagram, Calendar, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import useLeadTracker from '../hooks/useLeadTracker';

interface FormField {
  name: string;
  type: 'text' | 'tel' | 'email' | 'date' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
  icon: React.ReactNode;
  validation?: (value: string) => string | null;
}

interface SmartFormProps {
  formType: 'quick' | 'detailed' | 'newsletter';
  onSubmit: (data: any) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const SmartForm: React.FC<SmartFormProps> = ({ formType, onSubmit, disabled = false, className = '' }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const leadTracker = useLeadTracker();
  const [formStartTime] = useState(Date.now());
  const [analytics, setAnalytics] = useState({
    startTime: Date.now(),
    fieldInteractions: {} as Record<string, number>,
    source: document.referrer || 'direct',
    userAgent: navigator.userAgent
  });

  console.log('🎯 SmartForm рендериться:', { formType, disabled });

  // Field configurations for different form types
  const getFormFields = (): FormField[] => {
    const baseFields: Record<string, FormField> = {
      name: {
        name: 'name',
        type: 'text',
        label: "Ім'я",
        placeholder: "Ваше ім'я",
        required: true,
        icon: <User className="h-5 w-5" />,
        validation: (value) => {
          if (!value.trim()) return "Ім'я є обов'язковим";
          if (value.trim().length < 2) return "Ім'я повинно містити мінімум 2 символи";
          if (!/^[а-яА-ЯіІїЇєЄa-zA-Z\s'-]+$/.test(value)) return "Ім'я містить недопустимі символи";
          return null;
        }
      },
      phone: {
        name: 'phone',
        type: 'tel',
        label: 'Телефон',
        placeholder: '+380XXXXXXXXX',
        required: true,
        icon: <Phone className="h-5 w-5" />,
        validation: (value) => {
          if (!value.trim()) return "Телефон є обов'язковим";
          const phoneRegex = /^(\+380|380|0)[0-9]{9}$/;
          const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
          if (!phoneRegex.test(cleanPhone)) return "Невірний формат телефону";
          return null;
        }
      },
      email: {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'your@email.com',
        required: formType === 'newsletter',
        icon: <Mail className="h-5 w-5" />,
        validation: (value) => {
          if (formType === 'newsletter' && !value.trim()) return "Email є обов'язковим";
          if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Невірний формат email";
          return null;
        }
      },
      instagram: {
        name: 'instagram',
        type: 'text',
        label: 'Instagram',
        placeholder: '@username',
        required: false,
        icon: <Instagram className="h-5 w-5" />,
        validation: (value) => {
          if (value.trim() && !value.startsWith('@')) return "Instagram має починатися з @";
          return null;
        }
      },
      birthdate: {
        name: 'birthdate',
        type: 'date',
        label: 'Дата народження',
        placeholder: '',
        required: true,
        icon: <Calendar className="h-5 w-5" />,
        validation: (value) => {
          if (!value.trim()) return "Дата народження є обов'язковою";
          const date = new Date(value);
          const now = new Date();
          if (date > now) return "Дата не може бути в майбутньому";
          if (now.getFullYear() - date.getFullYear() > 100) return "Перевірте правильність дати";
          return null;
        }
      },
      question: {
        name: 'question',
        type: 'textarea',
        label: 'Ваше питання',
        placeholder: 'Опишіть вашу ситуацію або питання...',
        required: true,
        icon: <MessageSquare className="h-5 w-5" />,
        validation: (value) => {
          if (!value.trim()) return "Питання є обов'язковим";
          if (value.trim().length < 10) return "Питання занадто коротке (мінімум 10 символів)";
          return null;
        }
      }
    };

    switch (formType) {
      case 'quick':
        return [baseFields.name, baseFields.phone];
      case 'detailed':
        return [baseFields.name, baseFields.phone, baseFields.instagram, baseFields.birthdate, baseFields.question];
      case 'newsletter':
        return [baseFields.name, baseFields.email];
      default:
        return [baseFields.name, baseFields.phone];
    }
  };

  const fields = getFormFields();

  // Load saved data from localStorage
  useEffect(() => {
    console.log(`📝 Ініціалізація форми типу: ${formType}`);
    
    // Track form open
    leadTracker.trackFormOpen(formType);
    
    const savedData = localStorage.getItem(`miaxialip_form_${formType}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log('📂 Завантажено збережені дані форми:', parsed);
        setFormData(parsed);
      } catch (error) {
        console.error('❌ Помилка завантаження збережених даних форми:', error);
      }
    }
  }, [formType, leadTracker]);

  // Save data to localStorage
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(`miaxialip_form_${formType}`, JSON.stringify(formData));
      console.log('💾 Дані форми збережено в localStorage');
    }
  }, [formData, formType]);

  // Calculate progress
  useEffect(() => {
    const requiredFields = fields.filter(field => field.required);
    const filledRequired = requiredFields.filter(field => 
      formData[field.name] && !errors[field.name]
    ).length;
    const newProgress = (filledRequired / requiredFields.length) * 100;
    setProgress(newProgress);
    
    console.log(`📊 Прогрес форми: ${Math.round(newProgress)}% (${filledRequired}/${requiredFields.length})`);
  }, [formData, errors, fields]);

  // Real-time validation
  const validateField = useCallback((field: FormField, value: string): string | null => {
    if (field.validation) {
      const error = field.validation(value);
      console.log(`✅ Валідація поля ${field.name}:`, error || 'OK');
      return error;
    }
    return null;
  }, []);

  const handleChange = (fieldName: string, value: string) => {
    console.log(`📝 Зміна поля ${fieldName}:`, value);
    
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Track field interaction in lead tracker
    leadTracker.trackFormFill(fieldName);
    
    // Track field interactions
    setAnalytics(prev => ({
      ...prev,
      fieldInteractions: {
        ...prev.fieldInteractions,
        [fieldName]: (prev.fieldInteractions[fieldName] || 0) + 1
      }
    }));

    // Real-time validation
    const field = fields.find(f => f.name === fieldName);
    if (field && touched[fieldName]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }));
    }
  };

  const handleBlur = (fieldName: string) => {
    console.log(`👁️ Blur на полі: ${fieldName}`);
    
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, formData[fieldName] || '');
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }));
    }
  };

  const validateForm = (): boolean => {
    console.log('🔍 Валідація всієї форми...');
    
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    console.log('🔍 Результат валідації:', { isValid, errors: newErrors });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📤 Відправка SmartForm...');
    
    if (!validateForm() || disabled) {
      console.warn('⚠️ Форма не пройшла валідацію або вимкнена');
      return;
    }

    try {
      // Add analytics data
      const submissionData = {
        ...formData,
        formType,
        analytics: {
          ...analytics,
          completionTime: Date.now() - analytics.startTime,
          totalInteractions: Object.values(analytics.fieldInteractions).reduce((a, b) => a + b, 0)
        }
      };

      console.log('📤 Відправка даних:', submissionData);
      await onSubmit(submissionData);
      
      // Clear form and localStorage on success
      console.log('✅ Форма успішно відправлена, очищення...');
      setFormData({});
      localStorage.removeItem(`miaxialip_form_${formType}`);
      
    } catch (error) {
      console.error('❌ Помилка відправки SmartForm:', error);
    }
  };

  const getFormTitle = () => {
    switch (formType) {
      case 'quick': return 'Швидка заявка';
      case 'detailed': return 'Детальна заявка';
      case 'newsletter': return 'Підписка на розсилку';
      default: return 'Форма';
    }
  };

  return (
    <div className={`bg-darkblue/80 backdrop-blur-sm border border-gold/30 rounded-lg p-6 ${className}`}>
      {/* Header with progress */}
      <div className="mb-6">
        <h3 className="text-xl font-bold gold-gradient mb-2">{getFormTitle()}</h3>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Прогрес заповнення</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-darkblue/60 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-gold to-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="relative">
            <label className="block text-gray-300 mb-2 text-sm font-medium">
              {field.label} {field.required && <span className="text-accent">*</span>}
            </label>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold/60">
                {field.icon}
              </div>
              
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  placeholder={field.placeholder}
                  rows={4}
                  disabled={disabled}
                  className={`w-full pl-12 pr-4 py-3 bg-darkblue/60 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors[field.name] ? 'border-accent' : 'border-purple/30'
                  }`}
                  style={{ 
                    pointerEvents: disabled ? 'none' : 'auto',
                    userSelect: 'text',
                    fontSize: '16px'
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  placeholder={field.placeholder}
                  disabled={disabled}
                  className={`w-full pl-12 pr-4 py-3 bg-darkblue/60 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors[field.name] ? 'border-accent' : 'border-purple/30'
                  }`}
                  style={{ 
                    pointerEvents: disabled ? 'none' : 'auto',
                    userSelect: 'text',
                    fontSize: '16px'
                  }}
                />
              )}
              
              {/* Validation icon */}
              {touched[field.name] && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {errors[field.name] ? (
                    <AlertCircle className="h-5 w-5 text-accent" />
                  ) : formData[field.name] ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : null}
                </div>
              )}
            </div>
            
            {/* Error message */}
            {errors[field.name] && (
              <p className="text-accent text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        {/* Submit button - ВИПРАВЛЕНО: покращена логіка */}
        <button
          type="submit"
          disabled={disabled || progress < 100}
          className={`w-full py-3 px-6 rounded-md font-semibold transition-all duration-300 ${
            disabled || progress < 100
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'btn-primary hover:shadow-lg transform hover:-translate-y-1'
          }`}
          style={{ pointerEvents: 'auto' }}
        >
          {disabled ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Надсилання...
            </span>
          ) : progress < 100 ? (
            `Заповніть обов'язкові поля (${Math.round(progress)}%)`
          ) : (
            `Відправити ${formType === 'newsletter' ? 'підписку' : 'заявку'}`
          )}
        </button>

        {/* Form info */}
        <div className="text-xs text-gray-400 text-center mt-4">
          <p>🔒 Ваші дані захищені та не передаються третім особам</p>
          {formType !== 'newsletter' && (
            <p className="mt-1">⚡ Відповідь протягом 2-3 годин</p>
          )}
          {Object.keys(formData).length > 0 && (
            <p className="mt-1">💾 Прогрес автоматично збережено</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SmartForm;
