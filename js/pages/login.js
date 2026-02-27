// ===== Login Page =====
function renderLogin() {
    return `
    <div class="flex flex-col min-h-[100dvh] px-6 py-8">
      <!-- Title -->
      <h1 class="text-2xl font-black text-center text-primary neon-text mb-6 animate-fade-in">La Porte du Dragon</h1>
      
      <!-- Hero Image -->
      <div class="relative rounded-2xl overflow-hidden mb-6 animate-fade-in stagger-1 magic-glow">
        <img src="assets/images/hero_banner.png" alt="D&D dice scene" class="w-full h-48 object-cover"/>
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background-dark to-transparent"></div>
        <!-- Dice icon -->
        <div class="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-14 h-14 rounded-xl bg-primary/90 flex items-center justify-center shadow-lg border-2 border-background-dark">
          <span class="material-symbols-outlined text-background-dark text-2xl">casino</span>
        </div>
      </div>

      <!-- Welcome Text -->
      <div class="text-center mt-6 mb-8 animate-fade-in stagger-2">
        <h2 class="text-3xl font-black leading-tight">Entrez dans le<br/>Royaume</h2>
        <p class="text-text-secondary text-sm mt-2">Choisissez votre voie et continuez votre aventure</p>
      </div>

      <!-- Login Form -->
      <div id="login-form" class="space-y-5 animate-fade-in stagger-3">
        <!-- Identity -->
        <div>
          <label class="text-sm font-bold mb-2 block">Identité</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">person</span>
            <input type="email" id="login-email" class="input-field input-with-icon" placeholder="Nom d'utilisateur ou Email"/>
          </div>
        </div>
        
        <!-- Password -->
        <div>
          <label class="text-sm font-bold mb-2 block">Mot Secret</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">key</span>
            <input type="password" id="login-password" class="input-field input-with-icon pr-12" placeholder="Mot de passe"/>
            <button onclick="togglePasswordVisibility('login-password', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-xl">visibility_off</span>
            </button>
          </div>
          <div class="text-right mt-2">
            <a href="#" class="text-primary text-sm font-medium hover:underline">Mot secret oublié ?</a>
          </div>
        </div>

        <!-- Error message -->
        <div id="login-error" class="hidden text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg"></div>

        <!-- Login Buttons -->
        <div class="space-y-3 pt-2">
          <button onclick="handleLogin('joueur')" class="btn-primary">
            <span class="material-symbols-outlined">sports_esports</span>
            Se connecter comme Joueur
          </button>
          <button onclick="handleLogin('mj')" class="btn-secondary">
            <span class="material-symbols-outlined">auto_stories</span>
            Se connecter comme Maître du Jeu
          </button>
        </div>

        <!-- Register link -->
        <p class="text-center text-sm text-text-secondary mt-4">
          Nouveau dans le royaume ?
          <a href="#" onclick="showRegisterForm(); return false;" class="text-primary font-bold hover:underline">Créer un compte</a>
        </p>
      </div>

      <!-- Register Form (hidden) -->
      <div id="register-form" class="space-y-5 hidden">
        <div>
          <label class="text-sm font-bold mb-2 block">Nom de Héros</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">badge</span>
            <input type="text" id="reg-pseudo" class="input-field input-with-icon" placeholder="Votre pseudo d'aventurier"/>
          </div>
        </div>
        <div>
          <label class="text-sm font-bold mb-2 block">Email</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">mail</span>
            <input type="email" id="reg-email" class="input-field input-with-icon" placeholder="votre@email.fr"/>
          </div>
        </div>
        <div>
          <label class="text-sm font-bold mb-2 block">Mot Secret</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl">key</span>
            <input type="password" id="reg-password" class="input-field input-with-icon" placeholder="Minimum 6 caractères"/>
          </div>
        </div>
        <div id="register-error" class="hidden text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg"></div>
        <div class="space-y-3 pt-2">
          <button onclick="handleRegister('joueur')" class="btn-primary">
            <span class="material-symbols-outlined">sports_esports</span>
            Créer un compte Joueur
          </button>
          <button onclick="handleRegister('mj')" class="btn-secondary">
            <span class="material-symbols-outlined">auto_stories</span>
            Créer un compte MJ
          </button>
        </div>
        <p class="text-center text-sm text-text-secondary mt-4">
          Déjà un compte ?
          <a href="#" onclick="showLoginForm(); return false;" class="text-primary font-bold hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  `;
}

function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('.material-symbols-outlined');
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility_off';
    }
}

async function handleLogin(role) {
    const email = document.getElementById('login-email').value || 'demo@dragon.fr';
    const password = document.getElementById('login-password').value || 'demo123';
    const errorEl = document.getElementById('login-error');

    const result = await signIn(email, password, role);
    if (result.success) {
        navigateTo('dashboard');
    } else {
        errorEl.textContent = result.error || 'Échec de connexion';
        errorEl.classList.remove('hidden');
    }
}

async function handleRegister(role) {
    const pseudo = document.getElementById('reg-pseudo').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorEl = document.getElementById('register-error');

    if (!pseudo || !email || !password) {
        errorEl.textContent = 'Veuillez remplir tous les champs';
        errorEl.classList.remove('hidden');
        return;
    }

    const result = await signUp(email, password, pseudo, role);
    if (result.success) {
        navigateTo('dashboard');
    } else {
        errorEl.textContent = result.error || "Échec de l'inscription";
        errorEl.classList.remove('hidden');
    }
}
