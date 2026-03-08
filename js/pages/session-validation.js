// ===== Validation de Session (MJ) =====
// This page is now simplified — main validation happens from the dashboard
// when quorum is reached. This page shows a summary view.

let isValLoading = false;
let valAvailabilities = [];
let valPlayers = [];

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

    if (activeCampaign) {
      // Fetch all availabilities for this campaign
      const { data: avails } = await supabaseClient
        .from('availabilities')
        .select('*')
        .eq('campaign_id', activeCampaign.id);
      
      valAvailabilities = avails || [];

      // Fetch all players
      const { data: players } = await supabaseClient
        .from('profiles')
        .select('user_id, pseudo');
      
      valPlayers = players || [];
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
        ${isValLoading ? 
          `<div class="animate-spin text-primary mb-4"><span class="material-symbols-outlined text-4xl">sync</span></div>
          <p class="text-text-secondary">Chargement des données...</p>` :
          `<div class="card p-8 flex flex-col items-center justify-center w-full max-w-sm mx-auto">
            <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-primary text-4xl">event_busy</span>
            </div>
            <h2 class="text-lg font-bold mb-2">Aucune campagne</h2>
            <p class="text-text-secondary text-sm">Créez d'abord une session depuis le dashboard.</p>
          </div>`
        }
      </div>
    `;
  }

  const isConfirmed = activeCampaign.status === 'confirmée';
  const targetPlayers = activeCampaign.max_players || 5;
  const campaignDates = activeCampaign.proposed_dates || [];

  // Build date availability summary
  let dateSummaryHtml = campaignDates.map(date => {
    const key = `${activeCampaign.year}-${activeCampaign.month}-${date}`;
    const dateObj = new Date(activeCampaign.year, activeCampaign.month, date);
    const dayName = DAYS[dateObj.getDay()];
    
    // Count available players per slot
    const dateAvails = valAvailabilities.filter(a => a.date_key === key);
    const apremCount = dateAvails.filter(a => a.slots && a.slots[0]).length;
    const soirCount = dateAvails.filter(a => a.slots && a.slots[1]).length;
    
    const apremReached = apremCount >= targetPlayers;
    const soirReached = soirCount >= targetPlayers;

    // Get player names for hover
    const apremPlayers = dateAvails.filter(a => a.slots && a.slots[0]).map(a => {
      const player = valPlayers.find(p => p.user_id === a.user_id);
      return player ? player.pseudo : 'Inconnu';
    });
    const soirPlayers = dateAvails.filter(a => a.slots && a.slots[1]).map(a => {
      const player = valPlayers.find(p => p.user_id === a.user_id);
      return player ? player.pseudo : 'Inconnu';
    });

    return `
      <div class="card p-4 ${apremReached || soirReached ? 'border-l-4 border-amber-400' : ''}">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold">${dayName} ${date} ${MONTH_NAMES[activeCampaign.month]}</h4>
          ${apremReached || soirReached ? '<span class="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-1 rounded-full">QUORUM ✓</span>' : ''}
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="p-2 rounded-lg ${apremReached ? 'bg-primary/10 border border-primary/30' : 'bg-surface-dark'}">
            <p class="text-xs font-bold ${apremReached ? 'text-primary' : 'text-text-secondary'}">14h-18h</p>
            <p class="text-lg font-black ${apremReached ? 'text-primary' : ''}">${apremCount}/${targetPlayers}</p>
            ${apremPlayers.length > 0 ? `<p class="text-[10px] text-text-secondary mt-1">${apremPlayers.join(', ')}</p>` : ''}
          </div>
          <div class="p-2 rounded-lg ${soirReached ? 'bg-primary/10 border border-primary/30' : 'bg-surface-dark'}">
            <p class="text-xs font-bold ${soirReached ? 'text-primary' : 'text-text-secondary'}">Soir</p>
            <p class="text-lg font-black ${soirReached ? 'text-primary' : ''}">${soirCount}/${targetPlayers}</p>
            ${soirPlayers.length > 0 ? `<p class="text-[10px] text-text-secondary mt-1">${soirPlayers.join(', ')}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <header class="flex items-center px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-primary/10 sticky top-0 z-10">
        <button onclick="navigateTo('dashboard')" class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold text-center flex-1 pr-10">Suivi des Disponibilités</h1>
      </header>

      <div class="flex-1 overflow-y-auto hide-scrollbar px-4 py-6 space-y-6">
        <!-- Campaign Info -->
        <div class="bg-surface-dark p-4 rounded-xl border border-primary/20 animate-fade-in">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold">${activeCampaign.name}</h3>
            <span class="text-[10px] font-bold uppercase px-2 py-1 rounded ${isConfirmed ? 'bg-primary/20 text-primary' : 'bg-amber-500/20 text-amber-400'}">${isConfirmed ? 'Confirmée' : activeCampaign.status || 'En cours'}</span>
          </div>
          ${activeCampaign.lieu ? `
          <div class="flex items-center gap-1 text-text-secondary text-sm mt-1">
            <span class="material-symbols-outlined text-sm">location_on</span>
            <span>${activeCampaign.lieu}</span>
          </div>
          ` : ''}
          <p class="text-xs text-text-secondary mt-2">Objectif : ${targetPlayers} joueur(s) disponibles sur un même créneau</p>
        </div>

        <!-- Date availability breakdown -->
        <div class="animate-fade-in stagger-1">
          <h3 class="font-bold mb-3 flex items-center gap-2">
            <span class="w-1 h-5 bg-primary rounded-full inline-block"></span>
            Résumé par date
          </h3>
          <div class="space-y-3">
            ${dateSummaryHtml || '<p class="text-text-secondary text-sm text-center py-4">Aucune date proposée</p>'}
          </div>
        </div>

        ${isConfirmed ? `
        <div class="card p-4 border-l-4 border-primary animate-fade-in stagger-2">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-primary">check_circle</span>
            <h3 class="font-bold text-primary">Session Validée</h3>
          </div>
          <p class="text-sm text-text-secondary">Date : ${activeCampaign.confirmed_date || 'N/A'}</p>
          <p class="text-sm text-text-secondary">${(activeCampaign.confirmed_players || []).length} joueur(s) confirmé(s)</p>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}
