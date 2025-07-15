const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = '7322148325:AAHWjMEFuBVVoUhsPQ6SOsSTBE2fxFZfeXU';
    // Using numeric chat ID for direct messages to the bot
    const TELEGRAM_CHAT_ID = '7322148325';

    const { name, phone, instagram, service } = await req.json();

    // Validate required fields
    if (!name || !phone) {
      throw new Error('Name and phone are required fields');
    }

    const message = `
🎴 Нова заявка на консультацію!

👤 Ім'я: ${name}
📱 Телефон: ${phone}
📸 Instagram: ${instagram || 'Не вказано'}
💫 Послуга: ${service || 'Не вказано'}
    `.trim();

    // First check if the bot is active
    const botCheckResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const botStatus = await botCheckResponse.json();
    
    console.log('Bot status check:', botStatus);
    
    if (!botCheckResponse.ok) {
      throw new Error(`Bot check failed: ${JSON.stringify(botStatus)}`);
    }

    // If bot is active, send the message
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
    console.log('Telegram API Response:', responseData);

    if (!telegramResponse.ok) {
      throw new Error(`Telegram API Error: ${JSON.stringify(responseData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, response: responseData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error in send-telegram function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    );
  }
});