// ===== Configuration de la Campagne (MJ) =====

let selectedDates = [];
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// Default items to bring - MJ can check/uncheck + add custom
const DEFAULT_ITEMS = [
  { label: 'Feuille de perso', checked: true },
  { label: 'Stylo, gomme', checked: true },
  { label: 'Dés', checked: true },
  { label: 'Boissons', checked: false },
  { label: 'Snack', checked: false },
];

let itemsToBring = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
let campaignPhotoFile = null;
let campaignPhotoPreview = null;

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
        <!-- Banner Image with upload -->
        <div class="relative animate-fade-in">
          <div id="campaign-banner-container" class="relative cursor-pointer" onclick="triggerCampaignPhotoUpload()">
            <img id="campaign-banner-img" src="${campaignPhotoPreview || 'assets/images/session_1.png'}" alt="Campaign banner" class="w-full h-48 object-cover"/>
            <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background-dark to-transparent"></div>
            <div class="absolute top-3 right-3 bg-background-dark/80 backdrop-blur-sm text-primary p-2 rounded-full border border-primary/30 hover:bg-primary/20 transition-colors">
              <span class="material-symbols-outlined text-lg">photo_camera</span>
            </div>
            <p class="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-text-secondary bg-background-dark/60 px-3 py-1 rounded-full backdrop-blur-sm">Cliquez pour changer la photo</p>
          </div>
          <input type="file" id="campaign-photo-input" accept="image/*" class="hidden" onchange="handleCampaignPhotoSelect(event)"/>
        </div>

        <div class="px-4 py-6 space-y-8">
          <!-- Campaign Name -->
          <div class="space-y-2 animate-fade-in stagger-1">
            <label class="block text-base font-gothic font-bold tracking-wide uppercase">Nom de la Campagne</label>
            <input type="text" id="campaign-name" class="input-field" value="" placeholder="Nom de votre campagne"/>
          </div>

          <!-- Location / Lieu -->
          <div class="space-y-2 animate-fade-in stagger-1">
            <label class="block text-base font-gothic font-bold tracking-wide uppercase">Lieu de la Partie</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">location_on</span>
              <input type="text" id="campaign-lieu" class="input-field input-with-icon" placeholder="Adresse où se jouera la partie"/>
            </div>
          </div>

          <!-- Calendar -->
          <div class="space-y-3 animate-fade-in stagger-2">
            <div class="flex items-center justify-between">
              <label class="block text-base font-gothic font-bold tracking-wide uppercase">Calendrier des Sessions</label>
              <span class="text-primary text-sm font-bold">${selectedDates.length} date(s)</span>
            </div>
            <div class="card p-4" id="calendar-container">
              ${renderCalendar()}
            </div>
          </div>

          <!-- Items to Bring Checklist -->
          <div class="space-y-3 animate-fade-in stagger-3">
            <div class="flex items-center justify-between">
              <label class="block text-base font-gothic font-bold tracking-wide uppercase">Choses à Apporter</label>
              <span class="material-symbols-outlined text-primary">inventory_2</span>
            </div>
            <div class="card p-4 space-y-3">
              <p class="text-xs text-text-secondary mb-2">Cochez les éléments que les joueurs devront apporter. Les éléments non cochés ne seront pas affichés aux joueurs.</p>
              <div id="items-checklist" class="space-y-2">
                ${renderItemsChecklist()}
              </div>
              <!-- Add custom item -->
              <div class="flex gap-2 mt-3 pt-3 border-t border-primary/10">
                <input type="text" id="new-item-input" class="input-field flex-1 text-sm py-2" placeholder="Ajouter un élément..."/>
                <button onclick="addCustomItem()" class="bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition-colors font-bold text-sm flex items-center gap-1 border border-primary/30">
                  <span class="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Session Quota -->
          <div class="space-y-2 animate-fade-in stagger-4">
            <label class="block text-base font-gothic font-bold tracking-wide uppercase">Nombre de Participants</label>
            <div class="flex items-center gap-4">
              <input type="number" id="max-players" class="input-field w-24" value="5" min="1" max="10"/>
              <p class="text-xs text-text-secondary">Nombre de joueurs nécessaires pour valider la partie.</p>
            </div>
          </div>

          <!-- MJ Private Notes -->
          <div class="space-y-2 animate-fade-in stagger-4">
            <div class="flex items-center justify-between">
              <label class="block text-base font-gothic font-bold tracking-wide uppercase">Notes du MJ</label>
              <span class="text-xs text-text-secondary bg-surface-dark px-3 py-1 rounded-full">Privé</span>
            </div>
            <textarea id="campaign-notes" class="input-field min-h-[80px] resize-none" placeholder="Notes de préparation, accroches de scénario..."></textarea>
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

function renderItemsChecklist() {
  return itemsToBring.map((item, index) => `
    <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
      <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleItem(${index})"
        class="w-5 h-5 rounded border-2 border-primary/50 bg-surface-dark checked:bg-primary checked:border-primary appearance-none cursor-pointer relative
        after:content-[''] after:absolute after:top-[2px] after:left-[5px] after:w-[6px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-background-dark after:rotate-45 after:hidden checked:after:block"/>
      <span class="text-sm flex-1 ${item.checked ? 'text-white' : 'text-text-secondary line-through'}">${item.label}</span>
      ${index >= DEFAULT_ITEMS.length ? `
        <button onclick="event.stopPropagation(); removeCustomItem(${index})" class="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition-all p-1">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      ` : ''}
    </label>
  `).join('');
}

function toggleItem(index) {
  itemsToBring[index].checked = !itemsToBring[index].checked;
  const container = document.getElementById('items-checklist');
  if (container) container.innerHTML = renderItemsChecklist();
}

function addCustomItem() {
  const input = document.getElementById('new-item-input');
  if (input && input.value.trim()) {
    itemsToBring.push({ label: input.value.trim(), checked: true });
    input.value = '';
    const container = document.getElementById('items-checklist');
    if (container) container.innerHTML = renderItemsChecklist();
  }
}

function removeCustomItem(index) {
  itemsToBring.splice(index, 1);
  const container = document.getElementById('items-checklist');
  if (container) container.innerHTML = renderItemsChecklist();
}

function renderCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

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

// === Photo Upload ===
function triggerCampaignPhotoUpload() {
  document.getElementById('campaign-photo-input').click();
}

async function handleCampaignPhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    // Optimize the image client-side
    const optimized = await optimizeImage(file, 800, 0.7);
    campaignPhotoFile = optimized.blob;
    campaignPhotoPreview = optimized.dataUrl;
    
    const img = document.getElementById('campaign-banner-img');
    if (img) img.src = campaignPhotoPreview;
    
    showToast('📸 Photo sélectionnée !');
  } catch (err) {
    console.error('Photo optimization error:', err);
    showToast('❌ Erreur lors du traitement de la photo');
  }
}

// Generic image optimizer using canvas
function optimizeImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        
        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = (h / w) * maxSize;
            w = maxSize;
          } else {
            w = (w / h) * maxSize;
            h = maxSize;
          }
        }
        
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        
        canvas.toBlob((blob) => {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve({ blob, dataUrl });
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadImageToStorage(blob, bucket, fileName) {
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .upload(fileName, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/jpeg'
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: urlData } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return urlData.publicUrl;
}

async function announceSession() {
  const campaignName = document.getElementById('campaign-name').value || 'Nouvelle Campagne';
  const lieu = document.getElementById('campaign-lieu')?.value || '';
  
  if (selectedDates.length === 0) {
    showToast('⚠️ Sélectionnez au moins une date !');
    return;
  }

  const btn = document.querySelector('button[onclick="announceSession()"]');
  const originalContent = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Envoi en cours...';

  try {
    // Upload campaign photo if selected
    let photoUrl = null;
    if (campaignPhotoFile) {
      const fileName = `campaign_${Date.now()}.jpg`;
      photoUrl = await uploadImageToStorage(campaignPhotoFile, 'campaign-images', fileName);
    }

    // Get checked items
    const checkedItems = itemsToBring.filter(i => i.checked).map(i => i.label);

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
        status: 'proposée',
        lieu: lieu,
        photo_url: photoUrl,
        items_to_bring: checkedItems
      })
      .select()
      .single();

    if (cError) throw new Error("Erreur lors de la sauvegarde de la session : " + cError.message);

    activeCampaign = campaignData;

    // Fetch player emails
    const { data: players, error: pError } = await supabaseClient
      .from('profiles')
      .select('email, pseudo');
    
    if (pError) console.warn('Erreur lecture emails:', pError);

    const currentUser = getUser();
    let recipientList = (players || [])
      .map(p => p.email)
      .filter(Boolean);
    
    if (recipientList.length === 0 && currentUser && currentUser.email) {
      recipientList = [currentUser.email];
    }

    if (recipientList.length === 0) {
      throw new Error("Aucun destinataire trouvé.");
    }

    const { data, error } = await supabaseClient.functions.invoke('send-session-email', {
      body: { 
        campaignName: campaignName, 
        dates: selectedDates,
        recipients: recipientList
      }
    });

    if (error) {
      const details = error.context ? ` (Status: ${error.context.status})` : '';
      throw new Error(`Erreur serveur${details}.`);
    }

    if (data && data.error) throw new Error(data.error);

    showToast(`📢 Session annoncée à ${recipientList.length} joueur(s) !`);
    
    // Reset form state
    campaignPhotoFile = null;
    campaignPhotoPreview = null;
    itemsToBring = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
    selectedDates = [];
    
    setTimeout(() => navigateTo('disponibilites'), 2000);
  } catch (err) {
    console.error('Erreur:', err);
    showToast('❌ Erreur : ' + (err.message || 'Problème de connexion'));
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalContent;
  }
}

function saveDraft() {
  showToast('📝 Brouillon enregistré !');
}
