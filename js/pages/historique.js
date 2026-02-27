// ===== Historique des Parties (redirect to dashboard for now) =====
function renderHistorique() {
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

      <div class="px-4 py-6 space-y-4 hide-scrollbar overflow-y-auto flex-1">
        <!-- Upcoming -->
        <div class="animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="w-1 h-6 bg-primary rounded-full inline-block"></span>
              Parties à Venir
            </h2>
            <span class="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">2 Prévues</span>
          </div>

          <a href="#session-recap" class="card mb-4 flex overflow-hidden cursor-pointer group">
            <div class="w-32 min-h-[140px] flex-shrink-0">
              <img src="assets/images/session_1.png" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div class="p-4 flex-1">
              <h3 class="font-bold text-base leading-tight">Le Fléau d'Ombreterre</h3>
              <div class="flex items-center gap-1 mt-2 text-primary text-xs font-medium">
                <span class="material-symbols-outlined text-sm">event</span>15 Octobre, 20h00
              </div>
              <div class="flex items-center gap-1 mt-1 text-primary text-xs">
                <span class="material-symbols-outlined text-sm">location_on</span>La Taverne du Corbeau
              </div>
              <p class="text-text-secondary text-xs mt-2 line-clamp-2 italic">"Infiltration de la forteresse ennemie sous la nouvelle lune...."</p>
            </div>
          </a>

          <a href="#session-recap" class="card flex overflow-hidden cursor-pointer group">
            <div class="w-32 min-h-[140px] flex-shrink-0">
              <img src="assets/images/session_2.png" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div class="p-4 flex-1">
              <h3 class="font-bold text-base leading-tight">Les Mines de Phandalin</h3>
              <div class="flex items-center gap-1 mt-2 text-primary text-xs font-medium">
                <span class="material-symbols-outlined text-sm">event</span>22 Octobre, 19h30
              </div>
              <div class="flex items-center gap-1 mt-1 text-primary text-xs">
                <span class="material-symbols-outlined text-sm">location_on</span>Chez Antoine
              </div>
              <p class="text-text-secondary text-xs mt-2 line-clamp-2 italic">"Nettoyage du premier niveau et rencontre avec le gobelin..."</p>
            </div>
          </a>
        </div>

        <!-- Full History -->
        <div class="animate-fade-in stagger-2 mt-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold flex items-center gap-2">
              <span class="w-1 h-6 bg-primary rounded-full inline-block"></span>
              Historique des Parties
            </h2>
          </div>

          <div class="space-y-3">
            ${renderHistoryItem('Le Serment de la Rose Sanglante', 'Victoire amère contre le nécromancien Malakor.', '01', 'OCT')}
            ${renderHistoryItem("Évasion de Port-Noir", "Fuite réussie par les égoûts après l'incendie du port.", '24', 'SEPT')}
            ${renderHistoryItem("Les Plaines d'Argent", "Exploration des monolithes anciens. Découverte de la carte.", '10', 'SEPT')}
            ${renderHistoryItem("Le Pacte du Crépuscule", "Alliance fragile avec le clan des ombres.", '03', 'SEPT')}
            ${renderHistoryItem("La Tour de Cristal", "Ascension vers le sommet et combat contre le gardien.", '27', 'AOÛT')}
            ${renderHistoryItem("Les Marais de Brume", "Traversée périlleuse, perte du compagnon Félix.", '20', 'AOÛT')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHistoryItem(title, desc, day, month) {
    return `
    <div class="card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all group">
      <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-primary">history</span>
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-sm truncate">${title}</h4>
        <p class="text-text-secondary text-xs mt-1 truncate">${desc}</p>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="text-xl font-black text-white leading-none">${day}</div>
        <div class="text-xs text-text-secondary uppercase">${month}</div>
      </div>
      <span class="material-symbols-outlined text-text-secondary text-xl group-hover:text-primary transition-colors">chevron_right</span>
    </div>
  `;
}
