import React, { useEffect, useRef, useState } from 'react';
import FormManager from './FormManager';
import { trackButtonClick } from '../utils/analytics';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormStart?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onFormStart }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  // ✅ ВИДАЛЕНО: помилкову строку "name: '',"

  // Відстеження відкриття модального вікна
  useEffect(() => {
    if (isOpen) {
      trackButtonClick('open_modal', 'consultation_request');
    }
  }, [isOpen]);

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

  const handleSuccess = () => {
    onFormStart?.();
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-darkblue/80 backdrop-blur-sm"></div>
      
      <div 
        ref={modalRef}
        className="relative bg-darkblue border border-gold/30 rounded-lg shadow-xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        style={{ 
          pointerEvents: 'auto'  // ✅ ДОДАНО: гарантуємо що модал активний
        }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
          aria-label="Закрити"
          style={{ pointerEvents: 'auto' }}  // ✅ ДОДАНО: активна кнопка закриття
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-bold gold-gradient mb-4">Швидка заявка</h3>
        
        <p className="text-gray-300 mb-6">
          Заповніть швидку форму, і я зв'яжуся з вами найближчим часом для узгодження деталей консультації.
        </p>
        
        <div style={{ pointerEvents: 'auto' }}>  {/* ✅ ДОДАНО: гарантуємо активність форми */}
          <FormManager 
            defaultType="quick" 
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
