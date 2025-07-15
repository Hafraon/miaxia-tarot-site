export const SERVICES = {
  'individual': { name: '1 питання', price: 70, originalPrice: 100, description: 'Отримайте відповідь на одне конкретне питання, яке вас турбує' },
  'love': { name: 'Любовний прогноз', price: 280, originalPrice: 350, description: 'Розклади на сумісність, перспективи стосунків, пошук істинного кохання та гармонії' },
  'career': { name: 'Кар\'єра і фінанси', price: 350, originalPrice: 400, description: 'Аналіз фінансових можливостей, шляхів розвитку кар\'єри, прийняття важливих рішень' },
  'full': { name: '"Про себе" (6 питань)', price: 450, originalPrice: 500, description: 'Комплексний розклад про вашу особистість, потенціал та життєвий шлях' },
  'relationship': { name: '"Стосунки" (6 питань)', price: 390, originalPrice: 450, description: 'Детальний аналіз ваших стосунків з партнером або близькими людьми' },
  'business': { name: '"Бізнес" (6 питань)', price: 400, originalPrice: 450, description: 'Розклад для підприємців про розвиток бізнесу та фінансові перспективи' },
  'matrix': { name: 'Персональна матриця', price: 570, originalPrice: 650, description: 'Глибинний аналіз вашої особистості через призму нумерології та таро' },
  'compatibility': { name: 'Матриця сумісності', price: 550, originalPrice: 600, description: 'Аналіз сумісності з партнером на основі дат народження' },
  'year': { name: 'Аркан на рік', price: 560, originalPrice: 600, description: 'Прогноз на цілий рік з детальним розбором кожного місяця' }
};

export const getServicesList = () => {
  return Object.entries(SERVICES).map(([key, service]) => ({
    id: key,
    title: service.name,
    description: service.description,
    price: service.price,
    originalPrice: service.originalPrice,
    discount: Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
  }));
};