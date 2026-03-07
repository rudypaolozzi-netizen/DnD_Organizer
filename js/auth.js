// ===== Authentication Module =====

let currentUser = null;

// Check if user is logged in
function isAuthenticated() {
    return supabaseClient.auth.getUser().then(({ data }) => !!data.user);
}

// Sign in
async function signIn(email, password, role) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    // Fetch profile to get role and pseudo
    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

    currentUser = { 
        ...data.user, 
        ...profile, 
        email: data.user.email || profile?.email, // Priorité à l'email d'auth
        role: role || profile?.role 
    };
    localStorage.setItem('dnd_user', JSON.stringify(currentUser));
    return { success: true, user: currentUser };
}

// Sign up
async function signUp(email, password, pseudo, role) {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };

    // Create profile
    await supabaseClient.from('profiles').insert({ user_id: data.user.id, pseudo, role, email });

    currentUser = { ...data.user, pseudo, role };
    localStorage.setItem('dnd_user', JSON.stringify(currentUser));
    return { success: true, user: currentUser };
}

// Sign out
async function signOut() {
    currentUser = null;
    localStorage.removeItem('dnd_user');
    await supabaseClient.auth.signOut();
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
