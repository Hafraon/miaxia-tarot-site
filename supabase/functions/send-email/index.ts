import { SmtpClient } from "npm:smtp-client@0.4.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, phone, instagram, service } = await req.json();

    // Validate required fields
    if (!name || !phone) {
      throw new Error('Name and phone are required fields');
    }

    const smtp = new SmtpClient();
    
    await smtp.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: "miaxialip@gmail.com",
      password: "ntej mvyb tggo vxsj"
    });

    const message = `
From: MiaxiaLip Tarot <miaxialip@gmail.com>
To: miaxialip@gmail.com
Subject: New Tarot Reading Request
Content-Type: text/plain; charset=utf-8

🎴 New consultation request:

👤 Name: ${name}
📱 Phone: ${phone}
📸 Instagram: ${instagram || 'Not provided'}
💫 Service: ${service || 'Not specified'}

Best regards,
MiaxiaLip Tarot System
`.trim();

    await smtp.send({
      from: "miaxialip@gmail.com",
      to: ["miaxialip@gmail.com"],
      subject: "New Tarot Reading Request",
      content: message,
    });
    
    await smtp.close();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error in send-email function:', error);
    
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