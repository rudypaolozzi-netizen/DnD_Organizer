// ===== Dashboard / Grimoire de Session =====
function renderDashboard() {
  const user = getUser();
  const userRole = user ? user.role : 'joueur';

  return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-10 border-b border-primary/10">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-2xl">auto_fix_high</span>
          <h1 class="text-xl font-black uppercase tracking-wide">Grimoire de Session</h1>
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
              Parties à Venir
            </h2>
            <span class="text-xs font-medium text-text-secondary bg-surface-dark px-3 py-1 rounded-full">Aucune prévue</span>
          </div>
          
          <div class="card p-6 flex flex-col items-center justify-center text-center text-text-secondary animate-slide-up stagger-1">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
            <p>Aucune partie prévue. Le MJ n'a pas encore créé de session.</p>
          </div>
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
