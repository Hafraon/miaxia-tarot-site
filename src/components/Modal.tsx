import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    instagram: '',
    service: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Close modal and redirect to thank you page
        onClose();
        navigate('/thank-you');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      alert('Виникла помилка. Будь ласка, спробуйте пізніше.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id.replace('modal-', '')]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-darkblue/80 backdrop-blur-sm"></div>
      
      <div 
        ref={modalRef}
        className="relative bg-darkblue border border-gold/30 rounded-lg shadow-xl max-w-md w-full p-6 md:p-8"
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

        {submitted ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold gold-gradient mb-4">Дякуємо! Ми зв'яжемося з вами найближчим часом.</h3>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold gold-gradient mb-4">Записатися на консультацію</h3>
            
            <p className="text-gray-300 mb-6">
              Залиште свої контактні дані, і я зв'яжуся з вами найближчим часом для узгодження деталей.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="modal-name" className="block text-gray-300 mb-2">Ім'я</label>
                <input
                  type="text"
                  id="modal-name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-darkblue/60 border border-purple/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60"
                  placeholder="Ваше ім'я"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="modal-phone" className="block text-gray-300 mb-2">Телефон</label>
                <input
                  type="tel"
                  id="modal-phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-darkblue/60 border border-purple/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60"
                  placeholder="+380"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="modal-instagram" className="block text-gray-300 mb-2">Нікнейм Instagram</label>
                <input
                  type="text"
                  id="modal-instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full bg-darkblue/60 border border-purple/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60"
                  placeholder="@username"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="modal-service" className="block text-gray-300 mb-2">Послуга, яка вас цікавить</label>
                <select
                  id="modal-service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-darkblue/60 border border-purple/30 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gold/60"
                  required
                >
                  <option value="">Оберіть послугу</option>
                  <option value="individual">Індивідуальний розклад</option>
                  <option value="love">Любовний прогноз</option>
                  <option value="career">Кар'єра і фінанси</option>
                  <option value="full">Повний розклад</option>
                  <option value="other">Інше</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full text-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Надсилання...' : 'Замовити консультацію'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;