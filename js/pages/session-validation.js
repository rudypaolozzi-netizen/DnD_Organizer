// ===== Validation de Session (MJ) =====
function renderSessionValidation() {
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
          <p class="text-primary text-sm font-medium uppercase tracking-widest mb-1">Date sélectionnée</p>
          <h2 class="text-4xl font-black">Samedi 28 Octobre</h2>
          <div class="flex items-center gap-2 text-text-secondary text-sm font-medium mt-2 justify-center">
            <span class="material-symbols-outlined text-primary text-xl">schedule</span>
            <span>19:30 – 23:30</span>
          </div>
        </section>

        <div class="px-4 space-y-6">
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

function sendInvitations() {
    showToast('📨 Invitations envoyées à tous les joueurs !');
}

function scheduleReminder() {
    showToast('🔔 Rappel programmé pour la veille !');
}
