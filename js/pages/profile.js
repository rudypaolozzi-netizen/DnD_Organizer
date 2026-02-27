// ===== Profil Aventurier =====
function renderProfile() {
    const user = getUser() || DEMO_USER;

    return `
    <div class="flex flex-col min-h-[100dvh] pb-24">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 bg-background-dark/95 backdrop-blur-md border-b border-primary/10 sticky top-0 z-10">
        <button onclick="navigateTo('dashboard')" class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold text-center flex-1">Mon Profil Aventurier</h1>
        <button class="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto hide-scrollbar">
        <!-- Avatar Section -->
        <div class="flex flex-col items-center py-8 animate-fade-in">
          <div class="relative">
            <div class="w-32 h-32 rounded-full border-4 border-primary shadow-[0_0_20px_rgba(19,236,91,0.3)] bg-surface-dark flex items-center justify-center overflow-hidden">
              <span class="material-symbols-outlined text-primary text-5xl">shield_person</span>
            </div>
            <button class="absolute bottom-0 right-0 bg-primary text-background-dark p-2 rounded-full shadow-lg border-2 border-background-dark hover:bg-primary-dark transition-colors">
              <span class="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <h2 class="text-2xl font-black mt-4">${user.pseudo || "Valerius l'Ombre"}</h2>
          <p class="text-primary text-sm font-bold uppercase tracking-widest mt-1">${user.classe || 'Paladin'} de Niveau ${user.level || 15}</p>
        </div>

        <!-- Profile Form -->
        <div class="px-6 space-y-6 max-w-md mx-auto animate-fade-in stagger-1">
          <h3 class="text-lg font-bold border-l-4 border-primary pl-3">Paramètres du Grimoire</h3>
          
          <div class="space-y-4">
            <!-- Pseudo -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold flex items-center gap-2 text-slate-300">
                <span class="material-symbols-outlined text-primary text-lg">badge</span>
                Nom de Héros (Pseudo)
              </label>
              <input type="text" id="profile-pseudo" class="input-field" value="${user.pseudo || "Valerius l'Ombre"}" placeholder="Votre pseudo"/>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold flex items-center gap-2 text-slate-300">
                <span class="material-symbols-outlined text-primary text-lg">mail</span>
                Adresse de Messagerie (Email)
              </label>
              <input type="email" id="profile-email" class="input-field" value="${user.email || 'valerius@royaume.fr'}" placeholder="votre@email.fr"/>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold flex items-center gap-2 text-slate-300">
                <span class="material-symbols-outlined text-primary text-lg">lock</span>
                Mot de Passe Arcane
              </label>
              <div class="relative">
                <input type="password" id="profile-password" class="input-field pr-12" value="motdepassesecret" placeholder="••••••••••••"/>
                <button onclick="togglePasswordVisibility('profile-password', this)" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                  <span class="material-symbols-outlined">visibility_off</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="pt-4 animate-fade-in stagger-2">
            <button onclick="saveProfile()" class="btn-primary">
              <span class="material-symbols-outlined">auto_fix_high</span>
              ENREGISTRER LES MODIFICATIONS
            </button>
            <p class="text-center text-xs text-text-secondary mt-4 italic">
              "Que vos choix soient gravés dans la pierre éternelle."
            </p>
          </div>

          <!-- Logout -->
          <div class="pt-2 pb-8">
            <button onclick="signOut()" class="w-full py-3 text-center text-rose-400 text-sm font-bold hover:text-rose-300 transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-lg">logout</span>
              Quitter le Royaume
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function saveProfile() {
    const pseudo = document.getElementById('profile-pseudo')?.value;
    const email = document.getElementById('profile-email')?.value;
    if (currentUser) {
        currentUser.pseudo = pseudo;
        currentUser.email = email;
        localStorage.setItem('dnd_user', JSON.stringify(currentUser));
    }
    showToast('✨ Profil mis à jour !');
}
