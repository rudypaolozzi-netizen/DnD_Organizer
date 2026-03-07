// c:\Users\ribul\.gemini\antigravity\scratch\DnD_Organizer\supabase\functions\send-session-email\index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log("Edge Function 'send-session-email' is live.");

Deno.serve(async (req) => {
  const { method } = req;
  console.log(`[HTTP] ${method} request received`);

  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("[DATA] Payload:", JSON.stringify(body));

    const { campaignName, recipients, dates } = body;
    const apiKey = Deno.env.get('RESEND_API_KEY');

    if (!apiKey) {
      console.error("[ERROR] API Key missing");
      return new Response(JSON.stringify({ error: "API Key missing" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[ACTION] Sending email to ${recipients}`);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'D&D Organizer <onboarding@resend.dev>',
        to: recipients,
        subject: `🎲 Session : ${campaignName}`,
        html: `<strong>Nouvelle session !</strong><br>Campagne: ${campaignName}<br>Dates: ${dates.join(', ')}`,
      }),
    });

    const result = await res.json();
    console.log("[RESEND] Response:", JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      status: res.ok ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(`[CRASH] ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
