import React from 'react';

const AboutMe: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center" itemScope itemType="https://schema.org/Person">
          <h2 className="section-title">Майстер таро з 5-річним досвідом</h2>
          
          <p className="text-gray-300 mb-6 text-lg" itemProp="description">
            Мій шлях у світі Таро почався 5 років тому. За цей час я навчилася чути голос карт, розуміти їхні послання та передавати їх людям, які шукають відповіді на свої запитання.
          </p>
          
          <p className="text-gray-300 mb-6 text-lg">
            Я навчалася у найкращих майстрів таро Європи, постійно вдосконалюючи свої навички. Моя інтуїція та глибоке розуміння символів Таро дозволяють мені створювати точні та детальні прогнози, які допомагають моїм клієнтам знайти правильний шлях.
          </p>
          
          <p className="text-gray-300 mb-8 text-lg">
            Кожен розклад – це особливий ритуал, під час якого я встановлюю зв'язок між вами, картами та вищими силами. Я вірю, що Таро – це не просто інструмент передбачення, а можливість глибше зрозуміти себе та своє життя.
          </p>
          
          <div className="flex justify-center items-center">
            <div className="mr-6">
              <div className="bg-gold/20 px-4 py-2 rounded-lg text-center border border-gold/30">
                <span className="block text-2xl font-bold text-gold">10 000+</span>
                <span className="text-sm text-gray-300">задоволених клієнтів</span>
              </div>
            </div>
            <div>
              <p className="font-heading text-lg gold-gradient italic" itemProp="name">Mia</p>
              <p className="text-sm text-gray-400" itemProp="jobTitle">Ваш особистий провідник у світі Таро</p>
              <meta itemProp="worksFor" content="MiaxiaLip Tarot" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;