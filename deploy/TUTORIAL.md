# 🐉 Tutoriel de Déploiement — La Porte du Dragon

## Déploiement sur Vercel (Recommandé)

### Prérequis
- Un compte [GitHub](https://github.com) 
- Un compte [Vercel](https://vercel.com) (gratuit)
- (Optionnel) Un compte [Supabase](https://supabase.com) pour l'authentification

---

### Étape 1 : Pousser le code sur GitHub

1. **Créer un nouveau repository** sur GitHub :
   - Aller sur https://github.com/new
   - Nom : `dnd-organizer` (ou ce que vous voulez)
   - Cocher **Public** ou **Private**
   - Cliquer **Create repository**

2. **Pousser le code** depuis votre terminal :
```bash
cd c:\Users\ribul\.gemini\antigravity\scratch\DnD_Organizer
git add .
git commit -m "Initial commit - La Porte du Dragon"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/dnd-organizer.git
git push -u origin main
```

> **⚠️ Note** : Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub.

---

### Étape 2 : Déployer sur Vercel

1. **Se connecter à Vercel** :
   - Aller sur https://vercel.com
   - Se connecter avec votre compte GitHub

2. **Importer le projet** :
   - Cliquer sur **"Add New..."** → **"Project"**
   - Sélectionner votre repository `dnd-organizer`
   - Cliquer **"Import"**

3. **Configurer le projet** :
   - **Framework Preset** : Sélectionner **"Other"** (c'est un site statique)
   - **Root Directory** : Laisser `./` (la racine)
   - **Build Command** : Laisser **vide** (pas de build nécessaire)
   - **Output Directory** : Mettre `./` (la racine)

4. **Déployer** :
   - Cliquer **"Deploy"**
   - Attendre que le déploiement se termine (~ 30 secondes)
   - 🎉 Votre site est en ligne !

5. **URL du site** :
   - Vercel vous donnera une URL comme : `https://dnd-organizer-xxxx.vercel.app`
   - Vous pouvez aussi ajouter un domaine personnalisé dans les paramètres

---

### Étape 3 : (Optionnel) Configurer Supabase

> Le site fonctionne déjà en **mode démo** sans Supabase. Suivez ces étapes uniquement si vous voulez de vrais comptes utilisateurs et la persistance des données.

1. **Créer un projet Supabase** :
   - Aller sur https://supabase.com 
   - Créer un nouveau projet
   - Noter l'**URL du projet** et la **clé anon (publique)**

2. **Créer les tables** :
   - Aller dans **SQL Editor** dans Supabase Dashboard
   - Exécuter ce SQL :

```sql
-- Table des profils
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudo TEXT NOT NULL,
  classe TEXT DEFAULT 'Aventurier',
  level INTEGER DEFAULT 1,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('joueur', 'mj')) DEFAULT 'joueur',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des campagnes
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  banner_url TEXT,
  mj_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des sessions
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_start TIME,
  time_end TIME,
  location TEXT,
  address TEXT,
  status TEXT CHECK (status IN ('draft', 'announced', 'confirmed', 'completed')) DEFAULT 'draft',
  notes_mj TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des disponibilités
CREATE TABLE availabilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  slot TEXT NOT NULL,
  available BOOLEAN DEFAULT false,
  UNIQUE(user_id, campaign_id, day, slot)
);

-- Table des items de session
CREATE TABLE session_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL
);

-- Table des confirmations
CREATE TABLE session_confirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  confirmed BOOLEAN DEFAULT false,
  UNIQUE(session_id, user_id)
);

-- Activer Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_confirmations ENABLE ROW LEVEL SECURITY;

-- Policies basiques (accès authentifié)
CREATE POLICY "Users can read all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "MJ can manage campaigns" ON campaigns FOR ALL USING (auth.uid() = mj_id);
CREATE POLICY "Users can read sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Users can read availabilities" ON availabilities FOR SELECT USING (true);
CREATE POLICY "Users can manage own availability" ON availabilities FOR ALL USING (auth.uid() = user_id);
```

3. **Mettre à jour le code** :
   - Ouvrir `js/supabase.js`
   - Remplacer les valeurs :
```javascript
const SUPABASE_URL = 'https://VOTRE_PROJET.supabase.co';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANON';
```

4. **Configurer l'authentification** :
   - Dans Supabase Dashboard → **Authentication** → **URL Configuration**
   - Ajouter votre URL Vercel dans **Site URL** : `https://dnd-organizer-xxxx.vercel.app`
   - Ajouter dans **Redirect URLs** : `https://dnd-organizer-xxxx.vercel.app/**`

5. **Redéployer** :
   - Faire un commit + push sur GitHub
   - Vercel redéploiera automatiquement

---

### Étape 4 : Mises à jour futures

Chaque `git push` sur la branche `main` déclenchera un **redéploiement automatique** sur Vercel.

```bash
git add .
git commit -m "Mise à jour"
git push
```

---

## 🎉 C'est terminé !

Votre site "La Porte du Dragon" est maintenant en ligne et accessible depuis n'importe quel téléphone ou ordinateur !
