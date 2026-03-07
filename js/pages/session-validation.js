// ===== Validation de Session (MJ) =====
let isValLoading = false;

async function loadValidationData() {
  if (isValLoading) return;
  isValLoading = true;

  try {
    if (!activeCampaign) {
      const { data: campaign, error: cError } = await supabaseClient
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!cError) activeCampaign = campaign;
    }
  } catch (err) {
    console.warn('Error loading validation data:', err);
  } finally {
    isValLoading = false;
    if (window.location.hash === '#session-validation') {
      const app = document.getElementById('app');
      app.innerHTML = renderSessionValidation(true);
    }
  }
}

function renderSessionValidation(isUpdate = false) {
  if (!isUpdate) {
    loadValidationData();
  }

  if (!activeCampaign) {
    return `
      <div class="flex flex-col min-h-[100dvh] pb-24 items-center justify-center text-center px-4">
        <div class="animate-spin text-primary mb-4"><span class="material-symbols-outlined text-4xl">sync</span></div>
        <p class="text-text-secondary">Chargement de la session pour validation...</p>
      </div>
    `;
  }

  // Use the first proposed date for now as a default, or empty if none
  const mainDate = activeCampaign.proposed_dates && activeCampaign.proposed_dates[0] ? 
    `${activeCampaign.proposed_dates[0]} ${MONTH_NAMES[activeCampaign.month]} ${activeCampaign.year}` : 
    "Date à définir";

  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <header class="flex items-center px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-primary/10 sticky top-0 z-10">
        <button onclick="navigateTo('dashboard')" class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold text-center flex-1 pr-10">Validation de la Session</h1>
      </header>

      <div class="flex-1 overflow-y-auto hide-scrollbar">
        <!-- Hero Date -->
        <section class="px-4 py-8 text-center bg-gradient-to-b from-primary/5 to-transparent animate-fade-in">
          <div class="mb-2 flex justify-center">
            <span class="material-symbols-outlined text-primary text-4xl">calendar_month</span>
          </div>
          <p class="text-primary text-sm font-medium uppercase tracking-widest mb-1">Date sélectionnée (Pre-Validation)</p>
          <h2 class="text-4xl font-black">${mainDate}</h2>
          <div class="flex items-center gap-2 text-text-secondary text-sm font-medium mt-2 justify-center">
            <span class="material-symbols-outlined text-primary text-xl">schedule</span>
            <span>Horaire à confirmer dans l'invitation</span>
          </div>
        </section>

        <div class="px-4 space-y-6">
          <div class="bg-surface-dark p-4 rounded-xl border border-primary/20 animate-fade-in">
            <h3 class="font-bold mb-2">Campagne : ${activeCampaign.name}</h3>
            <p class="text-xs text-text-secondary">Validez les détails ci-dessous pour envoyer l'invitation finale à tout le groupe.</p>
          </div>
          <!-- Location -->
          <div class="space-y-2 animate-fade-in stagger-1">
            <label class="text-sm font-bold">Lieu de la session</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">location_city</span>
              <input type="text" class="input-field input-with-icon" placeholder="L'Antre du Dragon (Adresse...)" value="L'Antre du Dragon"/>
            </div>
            <!-- Map placeholder -->
            <div class="card h-32 flex items-center justify-center">
              <div class="text-center">
                <span class="material-symbols-outlined text-primary text-3xl">map</span>
                <p class="text-text-secondary text-xs mt-1">Carte interactive</p>
              </div>
            </div>
          </div>

          <!-- Logistics -->
          <div class="space-y-3 animate-fade-in stagger-2">
            <div class="flex items-center justify-between">
              <label class="text-base font-bold">Logistique & Préparations</label>
              <span class="material-symbols-outlined text-primary">inventory_2</span>
            </div>
            <div class="card p-4 space-y-3">
              <label class="text-sm font-medium text-text-secondary">Ce que chaque joueur doit apporter :</label>
              <textarea id="val-items" class="input-field min-h-[80px] resize-none" placeholder="Ex: Dés, fiches de perso, snacks salés, boissons..."></textarea>
              <div class="flex gap-2 flex-wrap">
                <button onclick="addQuickItem('Sets de dés')" class="flex items-center gap-2 bg-surface-dark hover:bg-card-dark px-3 py-2 rounded-lg text-sm transition-colors border border-primary/10">
                  <span class="material-symbols-outlined text-primary text-lg">casino</span>
                  Sets de dés
                </button>
                <button onclick="addQuickItem('Snacks & Boissons')" class="flex items-center gap-2 bg-surface-dark hover:bg-card-dark px-3 py-2 rounded-lg text-sm transition-colors border border-primary/10">
                  <span class="material-symbols-outlined text-primary text-lg">restaurant</span>
                  Snacks & Boissons
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3 pb-8 animate-fade-in stagger-3">
            <button onclick="sendInvitations()" class="btn-primary">
              <span class="material-symbols-outlined">send</span>
              Envoyer les Invitations
            </button>
            <button onclick="scheduleReminder()" class="btn-secondary">
              <span class="material-symbols-outlined">notifications_active</span>
              Programmer Rappels (Veille)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function addQuickItem(item) {
    const textarea = document.getElementById('val-items');
    if (textarea) {
        textarea.value = textarea.value ? textarea.value + '\n• ' + item : '• ' + item;
    }
}

async function sendInvitations() {
    const btn = document.querySelector('button[onclick="sendInvitations()"]');
    const originalContent = btn.innerHTML;
    const items = document.getElementById('val-items').value || 'Aucune note particulière';
    
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Envoi...';

    try {
        // 1. Récupérer les emails des joueurs
        const { data: players, error: pError } = await supabaseClient
            .from('profiles')
            .select('email, pseudo');
        
        if (pError) console.warn('Note: Erreur lors de la lecture des emails:', pError);

        console.log('Joueurs trouvés pour invitations :', (players || []).map(p => p.pseudo));

        const currentUser = getUser();
        let recipientList = (players || [])
            .map(p => p.email)
            .filter(Boolean);
        
        // Fallback si on est seul
        if (recipientList.length === 0 && currentUser && currentUser.email) {
            recipientList = [currentUser.email];
        }

        if (recipientList.length === 0) {
            throw new Error("Aucun destinataire trouvé.");
        }

        const mainDate = activeCampaign.proposed_dates && activeCampaign.proposed_dates[0] ? 
            `${activeCampaign.proposed_dates[0]} ${MONTH_NAMES[activeCampaign.month]} ${activeCampaign.year}` : 
            "Date à définir";

        // 2. Appeler l'Edge Function
        // On passe les infos de la session validée
        const { data, error } = await supabaseClient.functions.invoke('send-session-email', {
            body: { 
                campaignName: `Session Confirmée : ${activeCampaign.name}`, 
                dates: [mainDate],
                recipients: recipientList,
                customNote: items 
            }
        });

        if (error) {
            console.error('Erreur Supabase:', error);
            throw new Error(`Erreur serveur (${error.context?.status || '?'})`);
        }

        if (data && data.error) throw new Error(data.error);

        showToast(`📢 Invitations envoyées à ${recipientList.length} joueur(s) !`);
        setTimeout(() => navigateTo('dashboard'), 2000);
    } catch (err) {
        console.error('Erreur Invitations:', err);
        showToast('❌ Erreur : ' + (err.message || 'Problème de connexion'));
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

function scheduleReminder() {
    showToast('🔔 Rappel programmé pour la veille !');
}
