// ===== App Router & Initialization =====

const ROUTES = {
    'login': renderLogin,
    'dashboard': renderDashboard,
    'disponibilites': renderDisponibilites,
    'campaign-config': renderCampaignConfig,
    'profile': renderProfile,
    'session-recap': renderSessionRecap,
    'session-validation': renderSessionValidation,
    'historique': renderHistorique,
};

// Pages that require auth
const PROTECTED_ROUTES = ['dashboard', 'disponibilites', 'campaign-config', 'profile', 'session-recap', 'session-validation', 'historique'];

// Nav mapping (which nav item to highlight)
const NAV_MAP = {
    'dashboard': 'nav-dashboard',
    'disponibilites': 'nav-disponibilites',
    'campaign-config': 'nav-dashboard',
    'profile': 'nav-profile',
    'session-recap': 'nav-disponibilites',
    'session-validation': 'nav-disponibilites',
    'historique': 'nav-historique',
};

function getRoute() {
    const hash = window.location.hash.replace('#', '') || 'login';
    return hash;
}

function navigateTo(route) {
    window.location.hash = '#' + route;
}

function render() {
    const route = getRoute();
    const app = document.getElementById('app');
    const nav = document.getElementById('bottom-nav');

    // Auth guard
    const user = getUser();
    if (PROTECTED_ROUTES.includes(route) && !user) {
        navigateTo('login');
        return;
    }

    // If logged in and trying to access login, redirect to dashboard
    if (route === 'login' && user) {
        navigateTo('dashboard');
        return;
    }

    // Render page
    const renderFn = ROUTES[route];
    if (renderFn) {
        app.innerHTML = renderFn();
    } else {
        app.innerHTML = ROUTES['dashboard']();
    }

    // Show/hide nav
    if (route === 'login') {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }

    // Update active nav
    updateActiveNav(route);

    // Scroll to top
    window.scrollTo(0, 0);
}

function updateActiveNav(route) {
    // Remove active from all
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
        el.classList.add('text-slate-400');
        el.classList.remove('text-primary');
    });

    // Set active
    const activeId = NAV_MAP[route];
    if (activeId) {
        const el = document.getElementById(activeId);
        if (el) {
            el.classList.add('active');
            el.classList.remove('text-slate-400');
            el.classList.add('text-primary');
        }
    }
}

// Listen for hash changes
window.addEventListener('hashchange', render);

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    render();
});

// Also render immediately in case DOMContentLoaded already fired
if (document.readyState !== 'loading') {
    render();
}
