-- Ajout du statut et du quota à la table des campagnes
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'proposée';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS max_players INTEGER DEFAULT 5;
