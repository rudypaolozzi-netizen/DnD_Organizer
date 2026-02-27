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
            <span class="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">2 Prévues</span>
          </div>
          
          <!-- Session Card 1 -->
          <a href="#session-recap" class="card mb-4 flex overflow-hidden animate-slide-up stagger-1 cursor-pointer group">
            <div class="w-32 h-full min-h-[140px] flex-shrink-0">
              <img src="assets/images/session_1.png" alt="Fortress" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div class="p-4 flex-1">
              <h3 class="font-bold text-base leading-tight">Le Fléau d'Ombreterre</h3>
              <div class="flex items-center gap-1 mt-2 text-primary text-xs font-medium">
                <span class="material-symbols-outlined text-sm">event</span>
                15 Octobre, 20h00
              </div>
              <div class="flex items-center gap-1 mt-1 text-primary text-xs">
                <span class="material-symbols-outlined text-sm">location_on</span>
                La Taverne du Corbeau
              </div>
              <p class="text-text-secondary text-xs mt-2 line-clamp-2 italic">"Infiltration de la forteresse ennemie sous la nouvelle lune...."</p>
            </div>
          </a>

          <!-- Session Card 2 -->
          <a href="#session-recap" class="card flex overflow-hidden animate-slide-up stagger-2 cursor-pointer group">
            <div class="w-32 h-full min-h-[140px] flex-shrink-0">
              <img src="assets/images/session_2.png" alt="Mines" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div class="p-4 flex-1">
              <h3 class="font-bold text-base leading-tight">Les Mines de Phandalin</h3>
              <div class="flex items-center gap-1 mt-2 text-primary text-xs font-medium">
                <span class="material-symbols-outlined text-sm">event</span>
                22 Octobre, 19h30
              </div>
              <div class="flex items-center gap-1 mt-1 text-primary text-xs">
                <span class="material-symbols-outlined text-sm">location_on</span>
                Chez Antoine
              </div>
              <p class="text-text-secondary text-xs mt-2 line-clamp-2 italic">"Nettoyage du premier niveau et rencontre avec le gobelin..."</p>
            </div>
          </a>
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
            <a href="#historique" class="text-text-secondary text-sm hover:text-primary transition-colors">Voir tout</a>
          </div>
          
          <!-- Past Session Items -->
          <div class="space-y-3">
            ${renderPastSession('Le Serment de la Rose Sanglante', 'Victoire amère contre le nécromancien Malakor.', '01', 'OCT')}
            ${renderPastSession("Évasion de Port-Noir", "Fuite réussie par les égoûts après l'incendie du port.", '24', 'SEPT')}
            ${renderPastSession("Les Plaines d'Argent", "Exploration des monolithes anciens. Découverte de la carte.", '10', 'SEPT')}
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
