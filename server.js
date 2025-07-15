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

// API endpoint for sending Telegram messages
app.post('/api/send-telegram', async (req, res) => {
  try {
    const { name, phone, instagram, service, birthdate, question } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone are required fields'
      });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7322148325:AAHWjMEFuBVVoUhsPQ6SOsSTBE2fxFZfeXU';
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7322148325';

    // Create message text
    let message = `🎴 Нова заявка на консультацію!\n\n`;
    message += `👤 Ім'я: ${name}\n`;
    message += `📱 Телефон: ${phone}\n`;
    message += `📸 Instagram: ${instagram || 'Не вказано'}\n`;
    message += `💫 Послуга: ${service || 'Не вказано'}\n`;
    
    if (birthdate) {
      message += `🎂 Дата народження: ${birthdate}\n`;
    }
    
    if (question) {
      message += `❓ Питання: ${question}\n`;
    }

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
      message: 'Message sent successfully',
      response: responseData
    });

  } catch (error) {
    console.error('Error in send-telegram endpoint:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Telegram Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Using default'}`);
  console.log(`💬 Telegram Chat ID: ${process.env.TELEGRAM_CHAT_ID || '7322148325'}`);
});