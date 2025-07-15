import React, { useState } from 'react';
import FormManager from './FormManager';

const OrderForm: React.FC = () => {
  return (
    <section id="contact" className="py-12 md:py-20 bg-purple/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Замовити розклад</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Оберіть зручний тип форми та заповніть необхідні дані. Розумна система автоматично збереже ваш прогрес.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <FormManager defaultType="detailed" />
        </div>
      </div>
    </section>
  );
};

export default OrderForm;