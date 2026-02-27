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
        <button class="text-primary text-sm font-bold hover:underline">Modifier</button>
      </header>

      <div class="flex-1 overflow-y-auto hide-scrollbar">
        <!-- Status Badge -->
        <div class="text-center py-6 bg-gradient-to-b from-primary/5 to-transparent animate-fade-in">
          <div class="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/30">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            CONFIRMÉ
          </div>
          <h2 class="text-4xl font-black mt-4">Samedi 28 oct.</h2>
          <div class="flex items-center gap-2 text-text-secondary text-sm font-medium mt-2 justify-center">
            <span class="material-symbols-outlined text-primary text-xl">schedule</span>
            <span>6:00 PM - 10:00 PM</span>
          </div>
          <p class="text-xs text-text-secondary mt-1">Meilleur choix pour 5 joueurs</p>
        </div>

        <!-- Map Section -->
        <div class="px-4 mt-2 animate-fade-in stagger-1">
          <div class="card overflow-hidden">
            <div class="h-40 bg-surface-dark relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <span class="material-symbols-outlined text-primary text-4xl">map</span>
                  <p class="text-text-secondary text-xs mt-1">Carte interactive</p>
                </div>
              </div>
            </div>
            <div class="p-4 flex items-center gap-3">
              <div class="bg-primary text-background-dark p-2 rounded-lg">
                <span class="material-symbols-outlined" style="font-size:20px;">location_on</span>
              </div>
              <div>
                <p class="font-bold text-sm">Sous-sol de Mike</p>
                <p class="text-text-secondary text-xs">124 Allée du Dragon, Seattle</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Logistics Grid -->
        <div class="grid grid-cols-2 gap-4 px-4 mt-4 animate-fade-in stagger-2">
          <div class="card p-4">
            <div class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3">
              <span class="material-symbols-outlined text-amber-400">restaurant</span>
            </div>
            <p class="text-xs text-text-secondary">Repas</p>
            <p class="font-bold text-sm mt-1">Le Tombeau de la Liche</p>
            <p class="text-xs text-text-secondary mt-1">Groupe de Niveau 5</p>
          </div>
          <div class="card p-4">
            <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <span class="material-symbols-outlined text-purple-400">auto_fix_high</span>
            </div>
            <p class="text-xs text-text-secondary">Campagne</p>
            <p class="font-bold text-sm mt-1">Le Tombeau de la Liche</p>
            <p class="text-xs text-text-secondary mt-1">Groupe de Niveau 5</p>
          </div>
        </div>

        <!-- Checklist -->
        <div class="px-4 mt-6 animate-fade-in stagger-3">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold">À apporter</h3>
            <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">3 articles</span>
          </div>
          <div class="card divide-y divide-primary/10">
            ${renderChecklist([
        { text: 'Fiche de personnage (Niv 5)', checked: true },
        { text: 'Set de dés', checked: false },
        { text: 'Snacks à partager', checked: false },
    ])}
          </div>
        </div>

        <!-- Group Status -->
        <div class="px-4 mt-6 mb-6 animate-fade-in stagger-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">Statut du Groupe</h3>
          <div class="flex items-center gap-1">
            ${[1, 2, 3, 4].map(i => `
              <div class="w-10 h-10 rounded-full bg-surface-dark border-2 border-background-dark overflow-hidden flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-lg">person</span>
              </div>
            `).join('')}
            <div class="w-10 h-10 rounded-full bg-surface-dark border-2 border-background-dark flex items-center justify-center ring-2 ring-background-dark text-xs font-medium text-white">+1</div>
          </div>
          <p class="mt-2 text-sm text-primary font-medium">Les 5 joueurs ont confirmé pour samedi !</p>
        </div>
      </div>
    </div>
  `;
}

function renderChecklist(items) {
    return items.map(item => `
    <label class="flex items-center gap-3 p-4 cursor-pointer group">
      <input type="checkbox" ${item.checked ? 'checked' : ''} class="peer sr-only" onchange="this.closest('label').querySelector('.check-icon').classList.toggle('opacity-0')"/>
      <div class="w-6 h-6 rounded-md border-2 ${item.checked ? 'bg-primary border-primary' : 'border-primary/30'} flex items-center justify-center flex-shrink-0 transition-all peer-checked:bg-primary peer-checked:border-primary">
        <span class="material-symbols-outlined text-background-dark text-base check-icon ${item.checked ? '' : 'opacity-0'}" style="font-size:16px;">check</span>
      </div>
      <span class="${item.checked ? 'text-text-secondary line-through' : 'text-slate-200'} peer-checked:text-text-secondary peer-checked:line-through transition-colors">${item.text}</span>
    </label>
  `).join('');
}
