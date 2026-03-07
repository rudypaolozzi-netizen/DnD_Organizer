// c:\Users\ribul\.gemini\antigravity\scratch\DnD_Organizer\supabase\functions\send-session-email\index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Function 'send-session-email' initialized and waiting for requests...");

Deno.serve(async (req) => {
  console.log(">>> NOUVELLE REQUETE RECUE. Methode:", req.method);

  // Gérer CORS
  if (req.method === 'OPTIONS') {
    console.log(">>> Réponse OPTIONS (CORS)");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log(">>> Lecture du corps de la requête...");
    const body = await req.json();
    console.log(">>> Corps reçu:", JSON.stringify(body));

    const { campaignName, recipients, dates } = body;

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      console.error("!!! ERREUR : Clé RESEND_API_KEY non trouvée dans les secrets !");
      return new Response(JSON.stringify({ error: "Clé API Resend manquante sur Supabase." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log(`>>> Tentative d'envoi à Resend pour ${campaignName} (${recipients.length} destinataires)...`);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'D&D Organizer <onboarding@resend.dev>',
        to: recipients,
        subject: `🎲 Nouvelle session : ${campaignName}`,
        html: `
          <h1>Nouvelle session de JdR !</h1>
          <p>Le MJ a proposé de nouvelles dates pour <strong>${campaignName}</strong>.</p>
          <p>Dates : ${dates ? dates.join(', ') : 'Non spécifiées'}</p>
          <hr />
          <p>Connectez-vous pour répondre.</p>
        `,
      }),
    });

    const data = await res.json();
    console.log(">>> Réponse de Resend reçue:", JSON.stringify(data));

    if (res.ok) {
      console.log(">>> Succès !");
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      console.error(">>> Resend a renvoyé une erreur:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

  } catch (error) {
    console.error(">>> ERREUR CRITIQUE DANS LA FONCTION:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
