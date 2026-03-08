// ===== Dashboard / Grimoire de Session =====
let isDashLoading = false;
let dashCampaign = null;
let respondentsCount = 0;
let dateWithQuorum = null; // Date where enough players are available

async function loadDashboardData() {
  if (isDashLoading) return;
  isDashLoading = true;

  try {
    // 1. Fetch latest campaign that is not yet confirmed
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
        .select('user_id, date_key, slots')
        .eq('campaign_id', campaign.id);
        
      if (!aError && avails) {
        const uniqueUsers = new Set(avails.map(a => a.user_id));
        respondentsCount = uniqueUsers.size;

        // 3. Check if any date has enough available players (quorum)
        const targetPlayers = campaign.max_players || 5;
        dateWithQuorum = findDateWithQuorum(avails, campaign, targetPlayers);
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

// Find the first date where enough players marked available on the same slot
function findDateWithQuorum(avails, campaign, targetPlayers) {
  const campaignDates = campaign.proposed_dates || [];
  
  for (const date of campaignDates) {
    const key = `${campaign.year}-${campaign.month}-${date}`;
    const dateAvails = avails.filter(a => a.date_key === key);
    
    // Check afternoon slot (index 0) and evening slot (index 1)
    for (let slot = 0; slot < 2; slot++) {
      const availableCount = dateAvails.filter(a => a.slots && a.slots[slot]).length;
      if (availableCount >= targetPlayers) {
        const dateObj = new Date(campaign.year, campaign.month, date);
        const dayName = DAYS[dateObj.getDay()];
        const slotName = slot === 0 ? '14h-18h' : 'Soir';
        return {
          date: date,
          dateKey: key,
          label: `${dayName} ${date} ${MONTH_NAMES[campaign.month]} — ${slotName}`,
          slot: slot,
          availablePlayers: dateAvails.filter(a => a.slots && a.slots[slot]).map(a => a.user_id)
        };
      }
    }
  }
  return null;
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
      <p>Aucune partie pour l'instant.</p>
      <p class="text-xs mt-2">Le MJ n'a pas encore ouvert de session.</p>
    </div>
  `;

  let sessionCountBadge = 'Aucune prévue';

  if (dashCampaign) {
    const targetPlayers = dashCampaign.max_players || 5;
    const isQuorumReached = dateWithQuorum !== null;
    const isConfirmed = dashCampaign.status === 'confirmée';
    
    let badgeCls, badgeText;
    if (isConfirmed) {
      badgeCls = 'bg-primary/20 text-primary border border-primary/30';
      badgeText = 'Session confirmée';
    } else if (isQuorumReached) {
      badgeCls = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      badgeText = 'Quorum atteint !';
    } else {
      badgeCls = 'bg-primary/20 text-primary border border-primary/30';
      badgeText = 'Places disponibles';
    }
    
    sessionCountBadge = `${respondentsCount} joueur(s) ont répondu`;

    // Location display
    const lieuHtml = dashCampaign.lieu ? `
      <div class="flex items-center gap-1 text-text-secondary">
        <span class="material-symbols-outlined text-sm">location_on</span>
        <span>${dashCampaign.lieu}</span>
      </div>
    ` : '';

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
              <p class="text-xs text-text-secondary">${isConfirmed ? 'Session confirmée !' : 'En attente de vos disponibilités...'}</p>
            </div>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${badgeCls}">${badgeText}</span>
        </div>
        
        <div class="flex items-center gap-4 text-sm mb-4">
          <div class="flex items-center gap-1 text-text-secondary">
            <span class="material-symbols-outlined text-sm">groups</span>
            <span>${respondentsCount} / ${targetPlayers} joueurs</span>
          </div>
          <div class="flex items-center gap-1 text-text-secondary">
            <span class="material-symbols-outlined text-sm">calendar_month</span>
            <span>${dashCampaign.proposed_dates?.length || 0} dates</span>
          </div>
          ${lieuHtml}
        </div>

        <button onclick="navigateTo('disponibilites')" class="w-full bg-surface-dark hover:bg-card-dark py-3 rounded-xl text-primary font-bold text-sm transition-all flex items-center justify-center gap-2 border border-primary/10">
          <span class="material-symbols-outlined text-lg">edit_calendar</span>
          Donner mes disponibilités
        </button>

        ${userRole === 'mj' && !isConfirmed ? `
        <button onclick="deleteCampaign()" class="w-full mt-2 py-2 rounded-xl text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1 hover:bg-rose-500/10 border border-rose-500/10">
          <span class="material-symbols-outlined text-sm">delete</span>
          Supprimer cette campagne
        </button>
        ` : ''}
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

  // MJ: Quorum reached notification + validate button
  let mjQuorumHtml = '';
  if (userRole === 'mj' && dateWithQuorum && dashCampaign && dashCampaign.status !== 'confirmée') {
    mjQuorumHtml = `
      <div class="card p-5 border-l-4 border-amber-400 animate-slide-up stagger-2">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <span class="material-symbols-outlined text-amber-400">celebration</span>
          </div>
          <div>
            <h3 class="font-bold text-amber-400">Quorum atteint !</h3>
            <p class="text-xs text-text-secondary">Assez de joueurs disponibles pour jouer</p>
          </div>
        </div>
        <div class="bg-surface-dark rounded-lg p-3 mb-4">
          <p class="text-sm font-bold">${dateWithQuorum.label}</p>
          <p class="text-xs text-text-secondary mt-1">${dateWithQuorum.availablePlayers.length} joueur(s) disponible(s)</p>
        </div>
        <button onclick="validateCampaignFromDashboard()" class="btn-primary">
          <span class="material-symbols-outlined">check_circle</span>
          Valider cette date et envoyer les invitations
        </button>
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

        ${mjQuorumHtml}

        <!-- MJ Actions -->
        ${userRole === 'mj' ? `
        <div class="animate-fade-in stagger-3">
          <a href="#campaign-config" class="btn-primary text-sm py-3">
            <span class="material-symbols-outlined text-xl">add_circle</span>
            Nouvelle Session
          </a>
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

// MJ validates the campaign from dashboard when quorum is reached
async function validateCampaignFromDashboard() {
  if (!dateWithQuorum || !dashCampaign) return;

  const btn = document.querySelector('button[onclick="validateCampaignFromDashboard()"]');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Validation...';

  try {
    // 1. Update campaign status to confirmed
    const { error: updateError } = await supabaseClient
      .from('campaigns')
      .update({
        status: 'confirmée',
        confirmed_date: dateWithQuorum.label,
        confirmed_players: dateWithQuorum.availablePlayers
      })
      .eq('id', dashCampaign.id);

    if (updateError) throw updateError;

    // 2. Fetch emails of available players
    const { data: players } = await supabaseClient
      .from('profiles')
      .select('email, pseudo, user_id')
      .in('user_id', dateWithQuorum.availablePlayers);

    const recipientList = (players || []).map(p => p.email).filter(Boolean);

    if (recipientList.length > 0) {
      // 3. Send confirmation emails
      const { error: emailError } = await supabaseClient.functions.invoke('send-session-email', {
        body: {
          campaignName: `✅ Session Confirmée : ${dashCampaign.name}`,
          dates: [dateWithQuorum.label],
          recipients: recipientList,
          customNote: dashCampaign.lieu ? `Lieu : ${dashCampaign.lieu}` : ''
        }
      });

      if (emailError) console.warn('Email sending error:', emailError);
    }

    // 4. Also notify MJ
    const mjUser = getUser();
    if (mjUser && mjUser.email && !recipientList.includes(mjUser.email)) {
      await supabaseClient.functions.invoke('send-session-email', {
        body: {
          campaignName: `✅ Session Confirmée : ${dashCampaign.name}`,
          dates: [dateWithQuorum.label],
          recipients: [mjUser.email],
          customNote: 'Vous avez validé cette session. Les joueurs ont été notifiés.'
        }
      });
    }

    showToast(`✅ Session validée ! ${recipientList.length} joueur(s) notifié(s)`);
    
    // Refresh dashboard
    dashCampaign = null;
    dateWithQuorum = null;
    loadDashboardData();

  } catch (err) {
    console.error('Validation error:', err);
    showToast('❌ Erreur : ' + (err.message || 'Problème de validation'));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalContent;
    }
  }
}

// MJ deletes a campaign in progress
async function deleteCampaign() {
  if (!dashCampaign) return;
  
  const confirmed = confirm(`Supprimer la campagne "${dashCampaign.name}" ?\nCette action est irréversible.`);
  if (!confirmed) return;

  try {
    // Delete associated availabilities first
    await supabaseClient
      .from('availabilities')
      .delete()
      .eq('campaign_id', dashCampaign.id);

    // Delete the campaign
    const { error } = await supabaseClient
      .from('campaigns')
      .delete()
      .eq('id', dashCampaign.id);

    if (error) throw error;

    showToast('🗑️ Campagne supprimée');
    dashCampaign = null;
    activeCampaign = null;
    dateWithQuorum = null;
    respondentsCount = 0;
    loadDashboardData();
  } catch (err) {
    console.error('Delete error:', err);
    showToast('❌ Erreur : ' + (err.message || 'Impossible de supprimer'));
  }
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
