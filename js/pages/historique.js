// ===== Historique des Parties =====
function renderHistorique() {
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
        <!-- Upcoming -->
        <div class="animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="w-1 h-6 bg-primary rounded-full inline-block"></span>
              Parties à Venir
            </h2>
            <span class="text-xs font-medium text-text-secondary bg-surface-dark px-3 py-1 rounded-full">Aucune prévue</span>
          </div>

          <div class="card p-6 flex flex-col items-center justify-center text-center text-text-secondary">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
            <p>Aucune partie prévue. Le MJ n'a pas encore créé de session.</p>
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

          <div class="card p-6 flex flex-col items-center justify-center text-center text-text-secondary">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-50">history</span>
            <p>Aucune partie passée pour l'instant.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
