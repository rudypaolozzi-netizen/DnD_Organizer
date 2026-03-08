// ===== Profil Aventurier =====
function renderProfile() {
  const user = getUser() || {};
  const avatarUrl = user.avatar_url;

  const avatarContent = avatarUrl 
    ? `<img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover"/>`
    : `<span class="material-symbols-outlined text-primary text-5xl">shield_person</span>`;

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
            <div id="profile-avatar-container" class="w-32 h-32 rounded-full border-4 border-primary shadow-[0_0_20px_rgba(19,236,91,0.3)] bg-surface-dark flex items-center justify-center overflow-hidden">
              ${avatarContent}
            </div>
            <button onclick="triggerAvatarUpload()" class="absolute bottom-0 right-0 bg-primary text-background-dark p-2 rounded-full shadow-lg border-2 border-background-dark hover:bg-primary-dark transition-colors">
              <span class="material-symbols-outlined text-sm">edit</span>
            </button>
            <input type="file" id="avatar-file-input" accept="image/*" class="hidden" onchange="handleAvatarSelect(event)"/>
          </div>
          <h2 class="text-2xl font-black mt-4">${user.pseudo || "Aventurier Inconnu"}</h2>
          <p class="text-primary text-sm font-bold uppercase tracking-widest mt-1">${user.role === 'mj' ? 'Maître du Jeu' : 'Joueur'}</p>
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
              <input type="text" id="profile-pseudo" class="input-field" value="${user.pseudo || ''}" placeholder="Votre pseudo"/>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-bold flex items-center gap-2 text-slate-300">
                <span class="material-symbols-outlined text-primary text-lg">mail</span>
                Adresse de Messagerie (Email)
              </label>
              <input type="email" id="profile-email" class="input-field" value="${user.email || ''}" placeholder="votre@email.fr" readonly/>
            </div>
            
            <p class="text-xs text-text-secondary italic">L'adresse email ne peut pas être modifiée ici.</p>
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

// === Avatar Upload ===
function triggerAvatarUpload() {
  document.getElementById('avatar-file-input').click();
}

async function handleAvatarSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const container = document.getElementById('profile-avatar-container');
  if (container) {
    container.innerHTML = '<div class="animate-spin"><span class="material-symbols-outlined text-primary text-3xl">sync</span></div>';
  }

  try {
    // Optimize image client-side (200px max for avatar, quality 0.7)
    const optimized = await optimizeImage(file, 200, 0.7);

    // Upload to Supabase Storage
    const user = getUser();
    const fileName = `avatar_${user.id}_${Date.now()}.jpg`;
    const avatarUrl = await uploadImageToStorage(optimized.blob, 'avatars', fileName);

    // Update profile in database
    const { error } = await supabaseClient
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('user_id', user.id);

    if (error) throw error;

    // Update local state
    currentUser.avatar_url = avatarUrl;
    localStorage.setItem('dnd_user', JSON.stringify(currentUser));

    // Update UI
    if (container) {
      container.innerHTML = `<img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover"/>`;
    }

    showToast('✨ Avatar mis à jour !');
  } catch (err) {
    console.error('Avatar upload error:', err);
    showToast('❌ Erreur lors de l\'upload de l\'avatar');
    // Restore default icon
    if (container) {
      container.innerHTML = '<span class="material-symbols-outlined text-primary text-5xl">shield_person</span>';
    }
  }
}

// optimizeImage and uploadImageToStorage are defined in campaign-config.js
// They are global functions available across the app

async function saveProfile() {
  const pseudo = document.getElementById('profile-pseudo')?.value;

  if (currentUser && currentUser.id) {
    const { error } = await supabaseClient
      .from('profiles')
      .update({ pseudo })
      .eq('user_id', currentUser.id);

    if (error) {
      showToast('❌ Erreur lors de la mise à jour...');
      return;
    }

    currentUser.pseudo = pseudo;
    localStorage.setItem('dnd_user', JSON.stringify(currentUser));
    showToast('✨ Profil mis à jour !');
    render();
  } else {
    showToast('❌ Vous n\'êtes pas connecté !');
  }
}
