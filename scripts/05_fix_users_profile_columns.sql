-- Add missing profile and auth helper columns to users for existing deployments
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS location TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE users
ADD COLUMN IF NOT EXISTS bio TEXT;