// ===== Authentication Module =====

// Demo user data
const DEMO_USER = {
    id: 'demo-001',
    email: 'valerius@royaume.fr',
    pseudo: "Valerius l'Ombre",
    classe: 'Paladin',
    level: 15,
    role: 'joueur', // 'joueur' or 'mj'
    avatar: null,
};

let currentUser = null;

// Check if user is logged in
function isAuthenticated() {
    if (isDemoMode()) {
        return currentUser !== null;
    }
    // Supabase auth check
    return supabaseClient.auth.getUser().then(({ data }) => !!data.user);
}

// Sign in
async function signIn(email, password, role) {
    if (isDemoMode()) {
        // Demo mode: accept any credentials
        currentUser = { ...DEMO_USER, email, role };
        localStorage.setItem('dnd_user', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    currentUser = { ...data.user, role };
    return { success: true, user: currentUser };
}

// Sign up
async function signUp(email, password, pseudo, role) {
    if (isDemoMode()) {
        currentUser = { ...DEMO_USER, email, pseudo, role };
        localStorage.setItem('dnd_user', JSON.stringify(currentUser));
        return { success: true, user: currentUser };
    }

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    // Create profile
    await supabaseClient.from('profiles').insert({ user_id: data.user.id, pseudo, role });
    currentUser = { ...data.user, pseudo, role };
    return { success: true, user: currentUser };
}

// Sign out
async function signOut() {
    currentUser = null;
    localStorage.removeItem('dnd_user');
    if (!isDemoMode()) {
        await supabaseClient.auth.signOut();
    }
    navigateTo('login');
}

// Get current user
function getUser() {
    if (!currentUser) {
        const stored = localStorage.getItem('dnd_user');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    }
    return currentUser;
}

// Check role
function isMJ() {
    const user = getUser();
    return user && user.role === 'mj';
}
