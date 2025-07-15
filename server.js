const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Services configuration (matching the bot)
const SERVICES = {
  'individual': { name: '1 питання', price: 70, originalPrice: 100 },
  'love': { name: 'Любовний прогноз', price: 280, originalPrice: 350 },
  'career': { name: 'Кар\'єра і фінанси', price: 350, originalPrice: 400 },
  'full': { name: '"Про себе" (6 питань)', price: 450, originalPrice: 500 },
  'relationship': { name: '"Стосунки" (6 питань)', price: 390, originalPrice: 450 },
  'business': { name: '"Бізнес" (6 питань)', price: 400, originalPrice: 450 },
  'matrix': { name: 'Персональна матриця', price: 570, originalPrice: 650 },
  'compatibility': { name: 'Матриця сумісності', price: 550, originalPrice: 600 },
  'year': { name: 'Аркан на рік', price: 560, originalPrice: 600 }
};

// Validation function
const validateFormData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Ім\'я повинно містити мінімум 2 символи');
  }
  
  if (!data.phone || data.phone.trim().length < 10) {
    errors.push('Телефон повинен містити мінімум 10 цифр');
  }
  
  // Phone format validation (Ukrainian numbers)
  const phoneRegex = /^(\+380|380|0)[0-9]{9}$/;
  if (data.phone && !phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Невірний формат телефону. Використовуйте формат: +380XXXXXXXXX');
  }
  
  return errors;
};

// API endpoint for sending Telegram messages
app.post('/api/send-telegram', async (req, res) => {
  try {
    const { name, phone, instagram, service, birthdate, question } = req.body;

    // Validate required fields
    const validationErrors = validateFormData({ name, phone });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Помилки валідації',
        details: validationErrors
      });
    }

    // Bot configuration (matching your bot)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7322148325:AAHWjMEFuBVVoUhsPQ6SOsSTBE2fxFZfeXU';
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '603047391';

    // Get service info
    const serviceInfo = service && SERVICES[service] ? SERVICES[service] : null;
    const serviceName = serviceInfo ? serviceInfo.name : (service || 'Не вказано');
    const servicePrice = serviceInfo ? `${serviceInfo.price} грн` : '';

    // Create message text (matching PHP script format)
    let message = `🎴 Нова заявка на консультацію!\n\n`;
    message += `👤 Ім'я: ${name}\n`;
    message += `📱 Телефон: ${phone}\n`;
    message += `📸 Instagram: ${instagram || 'Не вказано'}\n`;
    message += `💫 Послуга: ${serviceName}`;
    if (servicePrice) {
      message += ` (${servicePrice})`;
    }
    message += `\n`;
    
    if (birthdate) {
      message += `🎂 Дата народження: ${birthdate}\n`;
    }
    
    if (question) {
      message += `❓ Питання: ${question}\n`;
    }

    message += `\n⏰ Час: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' })}`;

    console.log('Sending message to Telegram:', {
      chat_id: TELEGRAM_CHAT_ID,
      bot_token: TELEGRAM_BOT_TOKEN ? 'Set' : 'Not set',
      message_length: message.length
    });

    // Send message to Telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    const responseData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API Error:', responseData);
      throw new Error(`Telegram API Error: ${JSON.stringify(responseData)}`);
    }

    console.log('Message sent successfully:', responseData);

    res.json({
      success: true,
      message: 'Повідомлення успішно відправлено',
      response: responseData,
      service: serviceInfo
    });

  } catch (error) {
    console.error('Error in send-telegram endpoint:', error);
    
    res.status(500).json({
      success: false,
      error: 'Помилка відправки повідомлення',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services_count: Object.keys(SERVICES).length
  });
});

// Get services endpoint
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    services: SERVICES
  });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Внутрішня помилка сервера'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Telegram Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Using default'}`);
  console.log(`💬 Telegram Chat ID: ${process.env.TELEGRAM_CHAT_ID || '603047391'}`);
  console.log(`🛍️ Available services: ${Object.keys(SERVICES).length}`);
});