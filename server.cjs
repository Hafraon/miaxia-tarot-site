const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Railway configuration
const isDevelopment = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🚀 Starting server on port ${PORT}`);

// CORS configuration for production and development
app.use(cors({
  origin: isDevelopment 
    ? ['http://localhost:5173', 'http://localhost:3000']
    : function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Railway domains and custom domains
        const allowedOrigins = [
          process.env.RAILWAY_PUBLIC_DOMAIN,
          process.env.FRONTEND_URL,
          /\.railway\.app$/,
          /\.up\.railway\.app$/
        ].filter(Boolean);
        
        const isAllowed = allowedOrigins.some(allowed => {
          if (typeof allowed === 'string') {
            return origin === allowed || origin === `https://${allowed}`;
          }
          return allowed.test(origin);
        });
        
        callback(null, isAllowed);
      },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// TELEGRAM CONFIGURATION
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7853031712:AAHS29d-x7_mWZ1zoNzP8kCbTOxW0vtI18w';

// Chat IDs (same as before)
const TELEGRAM_CHAT_IDS = [
    '603047391',        // Roman
    '1305926338',       // angela
    '7853031712'        // Bot
];

// Services configuration
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
  
  return errors;
};

// Telegram message sending function
async function sendTelegramMessage(botToken, chatId, message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`❌ Помилка відправки до ${chatId}:`, error);
        return { ok: false, error: error.message };
    }
}

// API endpoint for sending Telegram messages
app.post('/api/send-telegram', async (req, res) => {
  try {
    const { name, phone, instagram, service, birthdate, question } = req.body;

    console.log('📝 Отримано дані форми:', { name, phone, instagram, service });

    // Validate required fields
    const validationErrors = validateFormData({ name, phone });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Помилки валідації',
        details: validationErrors
      });
    }

    // Create message
    let message = "🔔 <b>Нове замовлення з сайту MiaxiaLip!</b>\n\n";
    
    if (name && name.trim()) {
        message += "👤 <b>Ім'я:</b> " + name.trim() + "\n";
    }
    
    if (phone && phone.trim()) {
        message += "📱 <b>Телефон:</b> " + phone.trim() + "\n";
    }
    
    if (instagram && instagram.trim()) {
        message += "📸 <b>Instagram:</b> " + instagram.trim() + "\n";
    }
    
    if (service) {
        const serviceInfo = SERVICES[service];
        const serviceName = serviceInfo ? serviceInfo.name : service;
        const servicePrice = serviceInfo ? `${serviceInfo.price} грн` : '';
        
        message += "🔮 <b>Послуга:</b> " + serviceName;
        if (servicePrice) {
            message += " (" + servicePrice + ")";
        }
        message += "\n";
    }
    
    if (birthdate && birthdate.trim()) {
        message += "🎂 <b>Дата народження:</b> " + birthdate.trim() + "\n";
    }
    
    if (question && question.trim()) {
        message += "❓ <b>Питання:</b> " + question.trim() + "\n";
    }

    message += "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    message += "\n🌐 <b>Сайт:</b> " + (process.env.RAILWAY_PUBLIC_DOMAIN || 'theglamstyle.com.ua');
    message += "\n📅 <b>Дата подачі:</b> " + new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' });

    console.log('📤 Надсилаю повідомлення до Telegram...');

    // Send to all chat IDs
    const results = [];
    let successCount = 0;
    
    for (const chatId of TELEGRAM_CHAT_IDS) {
        if (chatId) {
            console.log(`📨 Надсилаю до ${chatId}...`);
            const result = await sendTelegramMessage(TELEGRAM_BOT_TOKEN, chatId, message);
            
            results.push({
                chat_id: chatId,
                success: result && result.ok,
                result: result
            });
            
            if (result && result.ok) {
                successCount++;
                console.log(`✅ Успішно надіслано до ${chatId}`);
            } else {
                console.log(`❌ Помилка надсилання до ${chatId}:`, result);
            }
        }
    }

    if (successCount > 0) {
        console.log(`🎉 Успішно надіслано ${successCount} користувачам`);
        res.json({
            success: true,
            message: `Повідомлення відправлено ${successCount} користувачам!`,
            details: results,
            service: service ? SERVICES[service] : null
        });
    } else {
        console.log('❌ Не вдалося надіслати жодному користувачу');
        res.status(500).json({
            success: false,
            error: 'Помилка відправки всім користувачам',
            details: results
        });
    }

  } catch (error) {
    console.error('❌ Помилка в send-telegram endpoint:', error);
    
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
    environment: process.env.NODE_ENV || 'development',
    services_count: Object.keys(SERVICES).length,
    telegram_bot: TELEGRAM_BOT_TOKEN ? 'Configured' : 'Not configured',
    chat_ids: TELEGRAM_CHAT_IDS
  });
});

// Get services endpoint
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    services: SERVICES
  });
});

// Test endpoint
app.get('/api/test-telegram', async (req, res) => {
  try {
    const botResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const botData = await botResponse.json();
    
    res.json({
      success: botResponse.ok,
      bot: botData,
      chat_ids: TELEGRAM_CHAT_IDS,
      message: botResponse.ok ? 'Бот активний!' : 'Проблеми з ботом'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Telegram Bot: @miaxialip_tarot_bot`);
  console.log(`💬 Chat IDs: ${TELEGRAM_CHAT_IDS.join(', ')}`);
  console.log(`🛍️ Доступні послуги: ${Object.keys(SERVICES).length}`);
  console.log(`📁 Static files: ${path.join(__dirname, 'dist')}`);
  console.log(`🔗 API endpoints: /api/send-telegram, /api/health, /api/test-telegram`);
  
  if (isDevelopment) {
    console.log(`🌐 Тест бота: http://localhost:${PORT}/api/test-telegram`);
    console.log(`📊 Перевірка здоров'я: http://localhost:${PORT}/api/health`);
  }
});