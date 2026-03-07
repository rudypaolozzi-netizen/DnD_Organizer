import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Payload reçu:", JSON.stringify(body));

    const { campaignName, dates, recipients } = body;

    if (!recipients || recipients.length === 0) {
      throw new Error("Liste des destinataires vide.");
    }

    const dateList = dates.map((d: number) => `<li>Le ${d}</li>`).join("");
    
    console.log(`Tentative d'envoi via Resend à: ${recipients.join(", ")}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "D&D Organizer <onboarding@resend.dev>",
        to: recipients,
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
    console.log("Réponse Resend:", JSON.stringify(data));

    if (!res.ok) {
      throw new Error(data.message || "Erreur Resend inconnue");
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200, // On renvoie 200 pour que le client voit l'objet JSON error
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
