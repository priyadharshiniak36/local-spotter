-- =====================================================================
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- if you are not able to run `npx prisma migrate dev` / `npx prisma db seed`
-- against the live database from your machine.
--
-- It does two things:
--   1. Adds the new columns the updated Prisma schema expects on `users`
--      (username, verification_code, verification_code_expires_at).
--   2. Creates (or updates) the Super Admin login:
--        username: Admin
--        password: Admin@123
--      The password below is already bcrypt-hashed (cost factor 10) —
--      never store the plaintext password in the database.
-- =====================================================================

-- 1. Schema additions (safe to re-run — IF NOT EXISTS guards each one)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code_expires_at TIMESTAMPTZ;

-- 2. Super Admin upsert
-- bcrypt hash of "Admin@123" (cost factor 10):
--   $2b$10$OcYg4sxbICJMBr.TN.GzRu8LRIzmM0hvMZfWD0Q9UmllbJo6mw/bq
INSERT INTO users (id, email, username, mobile, password_hash, role, status, email_verified_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@localspotter.nl',
  'Admin',
  '+31612345678',
  '$2b$10$OcYg4sxbICJMBr.TN.GzRu8LRIzmM0hvMZfWD0Q9UmllbJo6mw/bq',
  'SUPER_ADMIN',
  'ACTIVE',
  now(),
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE
SET username = EXCLUDED.username,
    password_hash = EXCLUDED.password_hash,
    status = 'ACTIVE',
    role = 'SUPER_ADMIN';

-- If a row with this username already exists under a different email,
-- run this instead of the INSERT above:
-- UPDATE users
-- SET username = 'Admin',
--     password_hash = '$2b$10$OcYg4sxbICJMBr.TN.GzRu8LRIzmM0hvMZfWD0Q9UmllbJo6mw/bq',
--     status = 'ACTIVE',
--     role = 'SUPER_ADMIN'
-- WHERE email = 'admin@localspotter.nl';

-- After running this, log in to the Super Admin portal with:
--   Username: Admin
--   Password: Admin@123
-- The frontend login form (item 2 / item 10 of PROMPT.md) accepts a
-- username, email, or mobile number in the same "identifier" field.
