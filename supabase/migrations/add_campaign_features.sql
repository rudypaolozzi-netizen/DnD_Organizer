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
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-images', 'campaign-images', true)
ON CONFLICT (id) DO NOTHING;

-- === Politiques RLS pour Storage ===
-- Supprimer les anciennes policies si elles existent, puis les recréer
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Auth users upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Auth users update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read campaign images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users upload campaign images" ON storage.objects;
DROP POLICY IF EXISTS "Auth users update campaign images" ON storage.objects;

-- Lecture publique des avatars
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Upload d'avatars pour les utilisateurs authentifiés
CREATE POLICY "Auth users upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Mise à jour d'avatars
CREATE POLICY "Auth users update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Lecture publique des images de campagne
CREATE POLICY "Public read campaign images"
ON storage.objects FOR SELECT
USING (bucket_id = 'campaign-images');

-- Upload d'images de campagne
CREATE POLICY "Auth users upload campaign images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'campaign-images');

-- Mise à jour d'images de campagne
CREATE POLICY "Auth users update campaign images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'campaign-images');
