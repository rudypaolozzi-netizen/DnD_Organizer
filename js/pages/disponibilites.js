// ===== Disponibilités du Groupe =====

function renderDisponibilites() {
  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <div class="flex items-center px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-primary/10 sticky top-0 z-10">
        <button onclick="navigateTo('dashboard')" class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-xl font-bold text-center flex-1 pr-10">Disponibilités du Groupe</h1>
      </div>

      <div class="flex-1 overflow-y-auto hide-scrollbar px-4 py-8 flex flex-col items-center justify-center">
        <!-- Empty State -->
        <div class="card p-8 flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto animate-fade-in stagger-1">
          <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span class="material-symbols-outlined text-primary text-4xl">event_busy</span>
          </div>
          <h2 class="text-lg font-bold mb-2">Aucune campagne trouvée</h2>
          <p class="text-text-secondary text-sm">Le Maître du Jeu n'a pas encore créé de campagne pour vous permettre de configurer vos disponibilités.</p>
        </div>
      </div>
    </div>
  `;
}
