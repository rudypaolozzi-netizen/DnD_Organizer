// ===== Récapitulatif de Session =====
function renderSessionRecap() {
  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <header class="flex items-center justify-between px-4 py-3 bg-surface-dark/50 backdrop-blur-md sticky top-0 z-10 border-b border-primary/10">
        <button onclick="navigateTo('dashboard')" class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-base font-bold flex-1 text-center">Récapitulatif de la Session</h1>
        <div class="w-10 h-10"></div>
      </header>

      <div class="flex-1 overflow-y-auto hide-scrollbar px-4 py-8 flex flex-col items-center justify-center">
        <!-- Empty State -->
        <div class="card p-8 flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto animate-fade-in stagger-1">
          <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-primary text-4xl">search_off</span>
          </div>
          <h2 class="text-lg font-bold mb-2">Aucune session trouvée</h2>
          <p class="text-text-secondary text-sm">Cette session n'a pas encore été validée par le Maître du Jeu ou n'existe plus.</p>
        </div>
      </div>
    </div>
  `;
}
