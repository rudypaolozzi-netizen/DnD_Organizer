-- Migration: Ajout des colonnes pour les nouvelles fonctionnalités
-- Exécuter dans l'éditeur SQL de Supabase (Dashboard > SQL Editor)

-- === Table campaigns ===
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS lieu TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS items_to_bring JSONB DEFAULT '[]';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS confirmed_date TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS confirmed_players JSONB DEFAULT '[]';

-- === Table profiles ===
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- === Storage Buckets ===
-- Créer les buckets pour les images (avatars + campagnes)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-images', 'campaign-images', true)
ON CONFLICT (id) DO NOTHING;

-- === Politiques RLS pour Storage ===
-- Tout le monde peut lire les avatars
CREATE POLICY IF NOT EXISTS "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Les utilisateurs authentifiés peuvent uploader leur avatar
CREATE POLICY IF NOT EXISTS "Auth users upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Les utilisateurs peuvent mettre à jour leur propre avatar
CREATE POLICY IF NOT EXISTS "Auth users update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Tout le monde peut lire les images de campagne
CREATE POLICY IF NOT EXISTS "Public read campaign images"
ON storage.objects FOR SELECT
USING (bucket_id = 'campaign-images');

-- Les utilisateurs authentifiés peuvent uploader des images de campagne
CREATE POLICY IF NOT EXISTS "Auth users upload campaign images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'campaign-images');

-- Les utilisateurs peuvent mettre à jour les images de campagne
CREATE POLICY IF NOT EXISTS "Auth users update campaign images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'campaign-images');
