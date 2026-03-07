import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { campaignName, dates, players } = await req.json();

    // Construction du contenu de l'email
    const dateList = dates.map((d: number) => `<li>Le ${d}</li>`).join("");
    
    // Pour cet exemple, on envoie un seul mail récapitulatif (ou on pourrait boucler sur les emails des joueurs)
    // Ici on simule l'envoi aux joueurs listés
    const recipientEmails = players.map((p: any) => p.email).filter(Boolean);

    if (recipientEmails.length === 0) {
      throw new Error("Aucun email de destinataire trouvé.");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "D&D Organizer <onboarding@resend.dev>", // Utilisez votre domaine si configuré
        to: recipientEmails,
        subject: `🎲 Nouvelle session : ${campaignName}`,
        html: `
          <h1>Nouvelle session de JdR annoncée !</h1>
          <p>Le MJ a proposé de nouvelles dates pour la campagne <strong>${campaignName}</strong>.</p>
          <p>Dates proposées :</p>
          <ul>${dateList}</ul>
          <p>Connectez-vous à l'application pour valider vos disponibilités.</p>
          <hr />
          <p><small>Envoyé via D&D Organizer</small></p>
        `,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
