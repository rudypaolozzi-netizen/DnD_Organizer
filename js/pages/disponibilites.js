// ===== Disponibilités du Groupe =====
const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

let playersData = []; // To be filled with real profiles
let myAvailability = {}; // Object mapping date string to array of slot availability [0, 0]
let isLoadingData = false;

async function loadAvailabilityData() {
  if (isLoadingData) return;
  isLoadingData = true;

  try {
    // 1. Fetch real players
    const { data: players, error: pError } = await supabaseClient
      .from('profiles')
      .select('user_id, pseudo');
    
    if (pError) throw pError;
    playersData = players || [];

    // 2. Fetch latest campaign if none is active
    if (!activeCampaign) {
      const { data: campaign, error: cError } = await supabaseClient
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!cError) activeCampaign = campaign;
    }

    // 3. Fetch my personal availabilities
    const user = getUser();
    if (user && activeCampaign) {
      const { data: avails, error: aError } = await supabaseClient
        .from('availabilities')
        .select('*')
        .eq('campaign_id', activeCampaign.id)
        .eq('user_id', user.id);
      
      if (!aError && avails) {
        avails.forEach(av => {
          myAvailability[av.date_key] = av.slots.map(s => s ? 1 : 0);
        });
      }
    }

  } catch (err) {
    console.warn('Error loading availability data:', err);
  } finally {
    isLoadingData = false;
    const app = document.getElementById('app');
    if (window.location.hash === '#disponibilites') {
      app.innerHTML = renderDisponibilites(true);
    }
  }
}


function renderDisponibilites(isUpdate = false) {
  if (!isUpdate) {
    // Trigger async load on first entry
    loadAvailabilityData();
  }

  if (!activeCampaign) {
    return `
      <div class="flex flex-col min-h-[100dvh] pb-24">
        <!-- Header -->
        <div class="flex items-center px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-primary/10 sticky top-0 z-10">
          <button onclick="navigateTo('dashboard')" class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 class="text-xl font-bold text-center flex-1 pr-10">Disponibilités du Groupe</h1>
        </div>

        <div class="flex-1 overflow-y-auto hide-scrollbar px-4 py-8 flex flex-col items-center justify-center text-center">
          ${isLoadingData ? 
            `<div class="animate-spin text-primary"><span class="material-symbols-outlined text-4xl">sync</span></div><p class="mt-4 text-text-secondary">Chargement de la session...</p>` : 
            `<div class="card p-8 flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto animate-fade-in stagger-1">
              <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span class="material-symbols-outlined text-primary text-4xl">event_busy</span>
              </div>
              <h2 class="text-lg font-bold mb-2">Aucune campagne trouvée</h2>
              <p class="text-text-secondary text-sm">Le MJ n'a pas encore proposé de dates pour une nouvelle session.</p>
            </div>`
          }
        </div>
      </div>
    `;
  }

  const campaignDates = activeCampaign.proposed_dates || activeCampaign.dates || [];
  const dates = [...campaignDates].sort((a, b) => a - b);

  // Ensure myAvailability is initialized for the proposed dates
  dates.forEach(d => {
    const key = `${activeCampaign.year}-${activeCampaign.month}-${d}`;
    if (!myAvailability[key]) myAvailability[key] = [0, 0];
  });

  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <div class="flex items-center px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-primary/10 sticky top-0 z-10">
        <button onclick="navigateTo('dashboard')" class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-xl font-bold text-center flex-1 pr-10">Disponibilités</h1>
      </div>

      <div class="flex-1 overflow-y-auto hide-scrollbar px-4 py-6">
        <!-- Campaign Info -->
        <div class="flex items-center gap-3 mb-6 animate-fade-in">
          <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <span class="material-symbols-outlined text-primary">fort</span>
          </div>
          <div>
            <h2 class="text-xl font-bold">${activeCampaign.name}</h2>
            <p class="text-sm text-text-secondary">Dates proposées en ${MONTH_NAMES[activeCampaign.month]} ${activeCampaign.year}</p>
          </div>
        </div>

        <!-- Scroll hint -->
        <div class="flex items-center justify-center gap-2 mb-2 text-text-secondary text-xs animate-fade-in stagger-1">
          <span class="material-symbols-outlined text-sm">swipe</span>
          <span>Glissez ou utilisez les flèches pour naviguer</span>
        </div>

        <!-- Availability Table with Scroll Arrows -->
        <div class="relative animate-fade-in stagger-1">
          
          <!-- Table container -->
          <div class="overflow-x-auto hide-scrollbar rounded-xl border border-primary/10" id="avail-scroll-container">
            <table class="w-full border-collapse min-w-[700px]" id="avail-table">
              <thead>
                <!-- Day headers row WITH arrows embedded -->
                <tr class="bg-surface-dark">
                  <th class="p-2 text-left text-xs font-bold uppercase tracking-wider border-b border-primary/20 sticky left-0 bg-surface-dark z-20 min-w-[120px]">
                    <div class="flex items-center justify-between">
                      <span>Joueurs</span>
                      <!-- Left Arrow inside the header -->
                      <button onclick="scrollAvailTable(-200)" class="w-7 h-7 rounded-full bg-primary/90 text-background-dark flex items-center justify-center shadow-lg hover:bg-primary transition-all active:scale-90 ml-1 flex-shrink-0">
                        <span class="material-symbols-outlined" style="font-size:18px;">chevron_left</span>
                      </button>
                    </div>
                  </th>
                  ${dates.map(date => {
    const dateObj = new Date(activeCampaign.year, activeCampaign.month, date);
    const dayName = DAYS[dateObj.getDay()];
    return `
                    <th class="p-3 text-center text-xs font-bold uppercase tracking-wider border-b border-l border-primary/20" colspan="2">
                      ${dayName}<br/><span class="text-[10px] font-medium text-text-secondary">${date} ${MONTH_NAMES[activeCampaign.month].substring(0, 3)}</span>
                    </th>
                    `;
  }).join('')}
                  <!-- Right Arrow as last column header -->
                  <th class="p-2 border-b border-l border-primary/20 bg-surface-dark sticky right-0 z-20 w-[40px]">
                    <button onclick="scrollAvailTable(200)" class="w-7 h-7 rounded-full bg-primary/90 text-background-dark flex items-center justify-center shadow-lg hover:bg-primary transition-all active:scale-90">
                      <span class="material-symbols-outlined" style="font-size:18px;">chevron_right</span>
                    </button>
                  </th>
                </tr>
                <!-- Slot sub-headers -->
                <tr class="bg-surface-dark/80">
                  <th class="p-1 border-b border-primary/10 sticky left-0 bg-surface-dark/80 z-20"></th>
                  ${dates.map(() => `
                    <th class="p-1 text-center border-b border-primary/10 text-[8px] text-text-secondary">14-18h</th>
                    <th class="p-1 text-center border-b border-l border-primary/10 text-[8px] text-text-secondary">Soir</th>
                  `).join('')}
                  <th class="p-1 border-b border-primary/10 sticky right-0 bg-surface-dark/80 z-20"></th>
                </tr>
              </thead>
              <tbody>
                ${renderAvailRows(dates)}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Legend -->
        <div class="card p-4 mt-6 animate-fade-in stagger-2">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-primary text-lg">info</span>
            <h3 class="font-bold">Légende</h3>
          </div>
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded bg-primary"></div>
              <span class="text-xs">Disponible</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded bg-rose-500/80"></div>
              <span class="text-xs">Indisponible</span>
            </div>
          </div>
          <p class="text-[10px] mt-3 text-text-secondary">Cliquez sur vos propres cases pour basculer entre Disponible (Vert) et Indisponible (Rouge).</p>
        </div>
      </div>

      <!-- Save Button -->
      <div class="px-4 pb-4">
        <button onclick="saveAvailability()" class="btn-primary animate-fade-in stagger-3">
          <span class="material-symbols-outlined">save</span>
          Enregistrer mes disponibilités
        </button>
      </div>
    </div>
  `;
}

function renderAvailRows(dates) {
  const user = getUser();
  const userId = user ? user.id : null;

  // Combine real players
  return playersData.map((player, pi) => {
    const isSelf = player.user_id === userId;
    const displayName = isSelf ? player.pseudo + ' (Moi)' : player.pseudo;
    const cells = [];
    
    dates.forEach((date, dateIndex) => {
      const key = `${activeCampaign.year}-${activeCampaign.month}-${date}`;
      for (let s = 0; s < 2; s++) { // 0=Aprem, 1=Soir
        // If it's the current user, use myAvailability. Otherwise, show 0 (unavailable) as it's just a mockup for other players
        const isAvail = isSelf ? (myAvailability[key] ? myAvailability[key][s] : 0) : 0;
        const cls = isAvail ? 'available' : 'unavailable';
        const clickable = isSelf ? `onclick="toggleMyAvail('${key}', ${s})"` : '';
        const borderL = s === 1 ? 'border-l border-primary/10' : '';
        cells.push(`<td class="p-2 ${borderL}"><div class="avail-cell ${cls} mx-auto" ${clickable}></div></td>`);
      }
    });

    const nameClass = isSelf ? 'text-primary font-bold' : '';
    const bgClass = isSelf ? 'bg-[#142e1f]' : 'bg-background-dark';

    return `
      <tr class="${isSelf ? 'bg-primary/5' : ''}">
        <td class="p-3 text-sm sticky left-0 ${bgClass} z-20 border-r border-primary/20 ${nameClass}" style="background-color: ${isSelf ? '#142e1f' : '#102216'};">${displayName}</td>
        ${cells.join('')}
        <td class="sticky right-0 z-20 w-[40px]" style="background-color: ${isSelf ? '#142e1f' : '#102216'};"></td>
      </tr>
    `;
  }).join('');
}

function toggleMyAvail(dateKey, slotIndex) {
  if (!myAvailability[dateKey]) myAvailability[dateKey] = [0, 0];
  myAvailability[dateKey][slotIndex] = myAvailability[dateKey][slotIndex] ? 0 : 1;
  
  const tbody = document.querySelector('#avail-table tbody');
  if (tbody) {
    const campaignDates = activeCampaign.proposed_dates || activeCampaign.dates || [];
    const dates = [...campaignDates].sort((a, b) => a - b);
    tbody.innerHTML = renderAvailRows(dates);
  }
}

function scrollAvailTable(amount) {
  const container = document.getElementById('avail-scroll-container');
  if (container) {
    container.scrollBy({ left: amount, behavior: 'smooth' });
  }
}

async function saveAvailability() {
  const user = getUser();
  if (!user || !activeCampaign) {
    showToast('❌ Erreur : session ou utilisateur non trouvé.');
    return;
  }

  const btn = document.querySelector('button[onclick="saveAvailability()"]');
  const origin = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Enregistrement...';

  try {
    const promises = Object.entries(myAvailability).map(([dateKey, slots]) => {
      return supabaseClient
        .from('availabilities')
        .upsert({
          campaign_id: activeCampaign.id,
          user_id: user.id,
          date_key: dateKey,
          slots: slots.map(s => !!s)
        }, { onConflict: 'campaign_id,user_id,date_key' });
    });

    await Promise.all(promises);
    showToast('Disponibilités enregistrées ! ✨');
  } catch (err) {
    console.error(err);
    showToast('❌ Erreur lors de la sauvegarde.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = origin;
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-primary text-background-dark font-bold px-6 py-3 rounded-xl shadow-lg z-[100] animate-slide-up text-center w-[90%] max-w-sm';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500); // 3.5 seconds reading time
}
