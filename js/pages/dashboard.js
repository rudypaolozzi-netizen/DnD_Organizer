// ===== Dashboard / Grimoire de Session =====
let isDashLoading = false;
let dashCampaign = null;
let respondentsCount = 0;

async function loadDashboardData() {
  if (isDashLoading) return;
  isDashLoading = true;

  try {
    // 1. Fetch latest campaign
    const { data: campaign, error: cError } = await supabaseClient
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (!cError && campaign) {
      dashCampaign = campaign;
      activeCampaign = campaign; // Sync global
      
      // 2. Count unique respondents
      const { data: avails, error: aError } = await supabaseClient
        .from('availabilities')
        .select('user_id')
        .eq('campaign_id', campaign.id);
        
      if (!aError && avails) {
        const uniqueUsers = new Set(avails.map(a => a.user_id));
        respondentsCount = uniqueUsers.size;
      }
    }
  } catch (err) {
    console.warn('Dashboard load error:', err);
  } finally {
    isDashLoading = false;
    if (window.location.hash === '#dashboard' || !window.location.hash) {
      const app = document.getElementById('app');
      app.innerHTML = renderDashboard(true);
    }
  }
}

function renderDashboard(isUpdate = false) {
  if (!isUpdate) {
    loadDashboardData();
  }

  const user = getUser();
  const userRole = user ? user.role : 'joueur';

  let sessionHtml = `
    <div class="card p-6 flex flex-col items-center justify-center text-center text-text-secondary animate-slide-up stagger-1">
      <span class="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
      <p>Aucune partie prévue. Le MJ n'a pas encore créé de session.</p>
    </div>
  `;

  let sessionCountBadge = 'Aucune prévue';

  if (dashCampaign) {
    const isFull = respondentsCount >= (dashCampaign.max_players || 5);
    const badgeCls = isFull ? 'bg-surface-dark text-text-secondary' : 'bg-primary/20 text-primary border border-primary/30';
    const badgeText = isFull ? 'Session complète' : 'Places disponibles';
    
    sessionCountBadge = `${respondentsCount} joueur(s) ont répondu`;

    sessionHtml = `
      <div class="card p-5 animate-slide-up stagger-1 border-l-4 border-primary relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary">fort</span>
            </div>
            <div>
              <h3 class="font-bold text-lg">${dashCampaign.name}</h3>
              <p class="text-xs text-text-secondary">En attente de vos disponibilités...</p>
            </div>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${badgeCls}">${badgeText}</span>
        </div>
        
        <div class="flex items-center gap-4 text-sm mb-4">
          <div class="flex items-center gap-1 text-text-secondary">
            <span class="material-symbols-outlined text-sm">groups</span>
            <span>${respondentsCount} / ${dashCampaign.max_players || 5} joueurs</span>
          </div>
          <div class="flex items-center gap-1 text-text-secondary">
            <span class="material-symbols-outlined text-sm">calendar_month</span>
            <span>${dashCampaign.proposed_dates?.length || 0} dates</span>
          </div>
        </div>

        <button onclick="navigateTo('disponibilites')" class="w-full bg-surface-dark hover:bg-card-dark py-3 rounded-xl text-primary font-bold text-sm transition-all flex items-center justify-center gap-2 border border-primary/10">
          <span class="material-symbols-outlined text-lg">edit_calendar</span>
          Donner mes disponibilités
        </button>
      </div>
    `;
  }

  if (isDashLoading && !dashCampaign) {
    sessionHtml = `
      <div class="flex flex-col items-center justify-center py-12 text-text-secondary">
        <div class="animate-spin mb-4"><span class="material-symbols-outlined text-4xl">sync</span></div>
        <p>Récupération du grimoire...</p>
      </div>
    `;
  }

  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-10 border-b border-primary/10">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl">auto_fix_high</span>
          <h1 class="text-xl font-black uppercase tracking-wide">${user?.pseudo || 'Aventurier'}</h1>
        </div>
        <button class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
          <span class="material-symbols-outlined text-primary">notifications</span>
        </button>
      </div>

      <div class="px-4 py-4 space-y-6 hide-scrollbar overflow-y-auto flex-1">
        <!-- Upcoming Sessions -->
        <div class="animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="w-1 h-6 bg-primary rounded-full inline-block"></span>
              Prochaine Session
            </h2>
            <span class="text-[10px] font-medium text-text-secondary bg-surface-dark px-3 py-1 rounded-full uppercase tracking-wider">${sessionCountBadge}</span>
          </div>
          
          ${sessionHtml}
        </div>

        <!-- MJ Actions -->
        ${userRole === 'mj' ? `
        <div class="animate-fade-in stagger-3">
          <div class="flex gap-3">
            <a href="#campaign-config" class="btn-primary flex-1 text-sm py-3">
              <span class="material-symbols-outlined text-xl">add_circle</span>
              Nouvelle Session
            </a>
            <a href="#session-validation" class="btn-secondary flex-1 text-sm py-3">
              <span class="material-symbols-outlined text-xl">check_circle</span>
              Valider
            </a>
          </div>
        </div>
        ` : ''}

        <!-- Past Sessions -->
        <div class="animate-fade-in stagger-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="w-1 h-6 bg-primary rounded-full inline-block"></span>
              Historique des Parties
            </h2>
          </div>
          
          <div class="card p-6 flex flex-col items-center justify-center text-center text-text-secondary">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-50">history</span>
            <p>Aucune partie passée pour l'instant.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPastSession(title, description, day, month) {
  return `
    <div class="card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all group">
      <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-primary">history</span>
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-sm truncate">${title}</h4>
        <p class="text-text-secondary text-xs mt-1 truncate">${description}</p>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="text-xl font-black text-white leading-none">${day}</div>
        <div class="text-xs text-text-secondary uppercase">${month}</div>
      </div>
      <span class="material-symbols-outlined text-text-secondary text-xl group-hover:text-primary transition-colors">chevron_right</span>
    </div>
  `;
}
