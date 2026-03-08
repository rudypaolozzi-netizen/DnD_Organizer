// ===== Historique des Parties =====
let histoLoading = false;
let confirmedCampaigns = [];
let pastCampaigns = [];

async function loadHistoriqueData() {
  if (histoLoading) return;
  histoLoading = true;

  try {
    const user = getUser();
    
    // Fetch confirmed campaigns (parties à venir)
    const { data: confirmed, error: cError } = await supabaseClient
      .from('campaigns')
      .select('*')
      .eq('status', 'confirmée')
      .order('created_at', { ascending: false });

    if (!cError && confirmed) {
      // Filter: only show to players who were confirmed
      if (user && user.role !== 'mj') {
        confirmedCampaigns = confirmed.filter(c => {
          const players = c.confirmed_players || [];
          return players.includes(user.id);
        });
      } else {
        confirmedCampaigns = confirmed;
      }
    }

    // Fetch past/archived campaigns
    const { data: past, error: pError } = await supabaseClient
      .from('campaigns')
      .select('*')
      .eq('status', 'terminée')
      .order('created_at', { ascending: false });

    if (!pError && past) {
      pastCampaigns = past || [];
    }

  } catch (err) {
    console.warn('Error loading historique:', err);
  } finally {
    histoLoading = false;
    if (window.location.hash === '#historique') {
      const app = document.getElementById('app');
      app.innerHTML = renderHistorique(true);
    }
  }
}

function renderHistorique(isUpdate = false) {
  if (!isUpdate) {
    loadHistoriqueData();
  }

  // Upcoming confirmed sessions
  let upcomingHtml = '';
  if (confirmedCampaigns.length > 0) {
    upcomingHtml = confirmedCampaigns.map(c => {
      const lieuHtml = c.lieu ? `
        <div class="flex items-center gap-1 text-text-secondary text-xs mt-1">
          <span class="material-symbols-outlined text-xs">location_on</span>
          <span>${c.lieu}</span>
        </div>
      ` : '';

      const itemsHtml = c.items_to_bring && c.items_to_bring.length > 0 ? `
        <div class="mt-3 pt-3 border-t border-primary/10">
          <p class="text-xs font-bold text-text-secondary mb-1">À apporter :</p>
          <div class="flex flex-wrap gap-1">
            ${c.items_to_bring.map(item => `<span class="text-[10px] bg-surface-dark text-text-secondary px-2 py-1 rounded-full">${item}</span>`).join('')}
          </div>
        </div>
      ` : '';

      return `
        <div class="card p-4 border-l-4 border-primary animate-slide-up">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-primary">event_available</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-sm">${c.name}</h4>
              <div class="flex items-center gap-1 text-primary text-xs font-bold mt-1">
                <span class="material-symbols-outlined text-xs">calendar_month</span>
                <span>${c.confirmed_date || 'Date à confirmer'}</span>
              </div>
              ${lieuHtml}
              <div class="flex items-center gap-1 text-text-secondary text-xs mt-1">
                <span class="material-symbols-outlined text-xs">groups</span>
                <span>${(c.confirmed_players || []).length} joueur(s) confirmé(s)</span>
              </div>
              ${itemsHtml}
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30 flex-shrink-0">Confirmée</span>
          </div>
        </div>
      `;
    }).join('');
  } else {
    upcomingHtml = `
      <div class="card p-6 flex flex-col items-center justify-center text-center text-text-secondary">
        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
        <p>${histoLoading ? 'Chargement...' : 'Aucune partie prévue pour l\'instant.'}</p>
      </div>
    `;
  }

  // Past sessions
  let pastHtml = '';
  if (pastCampaigns.length > 0) {
    pastHtml = pastCampaigns.map(c => `
      <div class="card p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-primary">history</span>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-sm truncate">${c.name}</h4>
          <p class="text-text-secondary text-xs mt-1">${c.confirmed_date || ''}</p>
        </div>
      </div>
    `).join('');
  } else {
    pastHtml = `
      <div class="card p-6 flex flex-col items-center justify-center text-center text-text-secondary">
        <span class="material-symbols-outlined text-4xl mb-2 opacity-50">history</span>
        <p>Aucune partie passée pour l'instant.</p>
      </div>
    `;
  }

  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-10 border-b border-primary/10">
        <div class="flex items-center gap-2">
          <button onclick="navigateTo('dashboard')" class="w-10 h-10 mr-2 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <span class="material-symbols-outlined text-primary text-2xl">auto_fix_high</span>
          <h1 class="text-xl font-black uppercase tracking-wide">Historique Complet</h1>
        </div>
      </div>

      <div class="px-4 py-6 space-y-8 hide-scrollbar overflow-y-auto flex-1">
        <!-- Upcoming confirmed -->
        <div class="animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="w-1 h-6 bg-primary rounded-full inline-block"></span>
              Parties à Venir
            </h2>
            <span class="text-xs font-medium text-text-secondary bg-surface-dark px-3 py-1 rounded-full">${confirmedCampaigns.length > 0 ? confirmedCampaigns.length + ' prévue(s)' : 'Aucune prévue'}</span>
          </div>
          <div class="space-y-3">
            ${upcomingHtml}
          </div>
        </div>

        <!-- Full History -->
        <div class="animate-fade-in stagger-2 mt-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="w-1 h-6 bg-primary rounded-full inline-block"></span>
              Historique des Parties
            </h2>
          </div>
          <div class="space-y-3">
            ${pastHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}
