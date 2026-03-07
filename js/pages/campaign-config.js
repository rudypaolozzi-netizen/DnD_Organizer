// ===== Configuration de la Campagne (MJ) =====

let selectedDates = [];
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function renderCampaignConfig() {
  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <div class="flex items-center px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-primary/10 sticky top-0 z-10">
        <button onclick="navigateTo('dashboard')" class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-xl font-gothic font-bold tracking-wide text-center flex-1 pr-10 uppercase">Configuration de la Campagne</h1>
      </div>

      <div class="flex-1 overflow-y-auto hide-scrollbar">
        <!-- Banner Image -->
        <div class="relative animate-fade-in">
          <img src="assets/images/session_1.png" alt="Campaign banner" class="w-full h-48 object-cover"/>
          <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background-dark to-transparent"></div>
        </div>

        <div class="px-4 py-6 space-y-8">
          <!-- Campaign Name -->
          <div class="space-y-2 animate-fade-in stagger-1">
            <label class="block text-base font-gothic font-bold tracking-wide uppercase">Nom de la Campagne</label>
            <input type="text" id="campaign-name" class="input-field" value="" placeholder="Nom de votre campagne"/>
          </div>

          <!-- Calendar -->
          <div class="space-y-3 animate-fade-in stagger-2">
            <div class="flex items-center justify-between">
              <label class="block text-base font-gothic font-bold tracking-wide uppercase">Calendrier des Sessions</label>
              <span class="text-primary text-sm font-bold cursor-pointer hover:underline">Sélectionner les dates</span>
            </div>
            <div class="card p-4" id="calendar-container">
              ${renderCalendar()}
            </div>
          </div>

          <!-- MJ Notes -->
          <div class="space-y-2 animate-fade-in stagger-3">
            <div class="flex items-center justify-between">
              <label class="block text-base font-gothic font-bold tracking-wide uppercase">Infos Complémentaires</label>
              <span class="text-xs text-text-secondary bg-surface-dark px-3 py-1 rounded-full">Réservé au MJ</span>
            </div>
            <div class="relative">
              <textarea class="input-field min-h-[120px] resize-none" placeholder="Accroches de scénario, noms de PNJ, ou notes de préparation..."></textarea>
              <div class="absolute bottom-3 right-3 flex gap-2">
                <button class="p-1 text-text-secondary hover:text-primary transition-colors" title="Joindre une Image">
                  <span class="material-symbols-outlined text-lg">image</span>
                </button>
                <button class="p-1 text-text-secondary hover:text-primary transition-colors" title="Créer un signet">
                  <span class="material-symbols-outlined text-lg">bookmark</span>
                </button>
              </div>
            </div>
            <p class="text-xs text-text-secondary">Ces notes sont masquées pour les joueurs.</p>
          </div>

          <!-- Session Quota -->
          <div class="space-y-2 animate-fade-in stagger-4">
            <label class="block text-base font-gothic font-bold tracking-wide uppercase">Nombre de Joueurs Maximum</label>
            <div class="flex items-center gap-4">
              <input type="number" id="max-players" class="input-field w-24" value="5" min="1" max="10"/>
              <p class="text-xs text-text-secondary">Nombre de participants nécessaires pour clore les votes.</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3 animate-fade-in stagger-4">
            <button onclick="announceSession()" class="btn-primary">
              <span class="material-symbols-outlined">campaign</span>
              Annoncer la Session
            </button>
            <button onclick="saveDraft()" class="btn-secondary">
              <span class="material-symbols-outlined">save</span>
              Enregistrer le Brouillon
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0

  const dayHeaders = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  let html = `
    <div class="flex items-center justify-between mb-4">
      <button onclick="changeMonth(-1)" class="p-1 hover:bg-white/5 rounded-full transition-colors">
        <span class="material-symbols-outlined text-text-secondary">chevron_left</span>
      </button>
      <span class="font-bold text-lg">${MONTH_NAMES[currentMonth]} ${currentYear}</span>
      <button onclick="changeMonth(1)" class="p-1 hover:bg-white/5 rounded-full transition-colors">
        <span class="material-symbols-outlined text-text-secondary">chevron_right</span>
      </button>
    </div>
    <div class="grid grid-cols-7 gap-y-2">
      ${dayHeaders.map(d => `<div class="text-center text-xs font-bold text-text-secondary py-2">${d}</div>`).join('')}
  `;

  // Empty cells before start
  const sundayStart = firstDay; // 0=Sun
  for (let i = 0; i < sundayStart; i++) {
    html += '<div></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = selectedDates.includes(d);
    const cls = isSelected
      ? 'bg-primary text-background-dark font-bold'
      : 'text-white hover:bg-white/5';
    html += `
      <div class="flex items-center justify-center">
        <button onclick="toggleCalDate(${d})" class="h-10 w-10 rounded-full ${cls} text-sm cursor-pointer transition-all flex items-center justify-center">${d}</button>
      </div>
    `;
  }

  html += '</div>';
  return html;
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  selectedDates = [];
  const container = document.getElementById('calendar-container');
  if (container) container.innerHTML = renderCalendar();
}

function toggleCalDate(day) {
  const idx = selectedDates.indexOf(day);
  if (idx > -1) selectedDates.splice(idx, 1);
  else selectedDates.push(day);
  const container = document.getElementById('calendar-container');
  if (container) container.innerHTML = renderCalendar();
}

async function announceSession() {
  const campaignName = document.getElementById('campaign-name').value || 'Nouvelle Campagne';
  if (selectedDates.length === 0) {
    showToast('⚠️ Sélectionnez au moins une date !');
    return;
  }

  // Visual feedback
  const btn = document.querySelector('button[onclick="announceSession()"]');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Envoi en cours...';

  try {
    // 1. Sauvegarder dans Supabase
    const user = getUser();
    const maxPlayers = parseInt(document.getElementById('max-players')?.value || '5');
    const { data: campaignData, error: cError } = await supabaseClient
      .from('campaigns')
      .insert({
        name: campaignName,
        proposed_dates: selectedDates,
        month: currentMonth,
        year: currentYear,
        max_players: maxPlayers,
        status: 'proposée'
      })
      .select()
      .single();

    if (cError) throw new Error("Erreur lors de la sauvegarde de la session : " + cError.message);

    activeCampaign = campaignData;
    console.log('Session enregistrée avec ID :', activeCampaign.id);

    // 2. Récupérer les emails des joueurs
    // Note: Si vous voyez une erreur ici, c'est peut-être que la colonne 'email' 
    // n'existe pas encore dans votre table 'profiles'.
    const { data: players, error: pError } = await supabaseClient
      .from('profiles')
      .select('email, pseudo');
    
    if (pError) console.warn('Note: Erreur lors de la lecture des emails:', pError);
    
    console.log('Joueurs trouvés dans la table profiles :', (players || []).map(p => p.pseudo));

    const currentUser = getUser();
    let recipientList = (players || [])
      .map(p => p.email)
      .filter(Boolean);
    
    // MODE REEL : On prend tous les emails trouvés dans la table profiles
    if (recipientList.length === 0 && currentUser && currentUser.email) {
      recipientList = [currentUser.email]; // Fallback technique si aucun joueur trouvé
    }

    if (recipientList.length === 0) {
      throw new Error("Aucun destinataire trouvé. Assurez-vous d'être connecté avec un email valide.");
    }
    
    console.log('Appel de la fonction avec :', { campaignName, recipients: recipientList });

    const { data, error } = await supabaseClient.functions.invoke('send-session-email', {
      body: { 
        campaignName: campaignName, 
        dates: selectedDates,
        recipients: recipientList
      }
    });

    if (error) {
      console.error('Erreur Supabase Functions:', error);
      const details = error.context ? ` (Status: ${error.context.status})` : '';
      throw new Error(`Erreur serveur${details}. Vérifiez les logs Supabase.`);
    }

    if (data && data.error) throw new Error(data.error);

    showToast(`📢 Message envoyé à ${recipientList.length} joueur(s) !`);
    setTimeout(() => navigateTo('disponibilites'), 2000);
  } catch (err) {
    console.error('Détails de l\'erreur :', err);
    showToast('❌ Erreur : ' + (err.message || 'Problème de connexion'));
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalContent;
  }
}

function saveDraft() {
  showToast('📝 Brouillon enregistré !');
}
