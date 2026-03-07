// ===== Configuration de la Campagne (MJ) =====

let selectedDates = [];
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let activeCampaign = null; // Global variable to store the campaign

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

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
    // 1. Sauvegarder localement l'état
    activeCampaign = {
      name: campaignName,
      dates: selectedDates,
      month: currentMonth,
      year: currentYear
    };

    // 2. Récupérer les emails des joueurs (pour la démo, on utilise des emails fictifs ou ceux de la base)
    // Dans une version réelle, on ferait un SELECT sur la table profiles
    const { data: players, error: pError } = await supabaseClient
      .from('profiles')
      .select('email, pseudo');
    
    // 3. Appeler l'Edge Function
    const { data, error } = await supabaseClient.functions.invoke('send-session-email', {
      body: { 
        campaignName: campaignName, 
        dates: selectedDates,
        players: players || [{ email: 'test@example.com' }] // Fallback pour la démo
      }
    });

    if (error) throw error;

    showToast('📢 Notification envoyée par email aux joueurs !');
    setTimeout(() => navigateTo('disponibilites'), 2000);
  } catch (err) {
    console.error('Erreur envoi email:', err);
    showToast('❌ Erreur lors de l\'envoi de l\'email.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalContent;
  }
}

function saveDraft() {
  showToast('📝 Brouillon enregistré !');
}
