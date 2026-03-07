// c:\Users\ribul\.gemini\antigravity\scratch\DnD_Organizer\supabase\functions\send-session-email\index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { campaignName, recipients, dates } = await req.json();
    const apiKey = Deno.env.get('BREVO_API_KEY');
    
    // L'adresse "from" doit être votre email vérifié sur Brevo
    const senderEmail = "rudy.paolozzi@gmail.com"; 

    if (!apiKey) throw new Error("BREVO_API_KEY missing");

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: "D&D Organizer", email: senderEmail },
        to: recipients.map((email: string) => ({ email })),
        subject: `🎲 Nouvelle session : ${campaignName}`,
        htmlContent: `
          <h1>🎲 Nouvelle session !</h1>
          <p>Le MJ a proposé des dates pour <strong>${campaignName}</strong>.</p>
          <p>Dates suggérées : ${dates.join(', ')}</p>
          <p><a href="https://votre-app.vercel.app">Connectez-vous pour répondre</a></p>
        `,
      }),
    });

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      status: res.ok ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
