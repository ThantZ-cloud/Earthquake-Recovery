-- Migration: Fix Critical Issues from DB Review
-- Run this in Supabase SQL Editor after admin.sql

-- ============================================================
-- C1: Sync admins table <-> profiles.role automatically
-- ============================================================
-- The admins table is needed to avoid RLS recursion on profiles.
-- This trigger keeps admins and profiles.role in sync so there's
-- one source of truth for the frontend (profiles.role) and one
-- for RLS (admins table).

-- Function: When a row is inserted into admins, set profiles.role = 'admin'
CREATE OR REPLACE FUNCTION sync_admin_from_admins()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET role = 'admin' WHERE id = NEW.user_id;
  -- If profile doesn't exist yet, create it
  INSERT INTO profiles (id, role) VALUES (NEW.user_id, 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: When a row is deleted from admins, set profiles.role = 'user'
CREATE OR REPLACE FUNCTION sync_admin_from_admins_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET role = 'user' WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: When profiles.role changes, sync admins table
CREATE OR REPLACE FUNCTION sync_admins_from_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    INSERT INTO admins (user_id) VALUES (NEW.id)
      ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.role = 'user' THEN
    DELETE FROM admins WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_sync_admin_insert ON admins;
DROP TRIGGER IF EXISTS trg_sync_admin_delete ON admins;
DROP TRIGGER IF EXISTS trg_sync_profile_role ON profiles;

-- Create triggers
CREATE TRIGGER trg_sync_admin_insert
  AFTER INSERT ON admins
  FOR EACH ROW EXECUTE FUNCTION sync_admin_from_admins();

CREATE TRIGGER trg_sync_admin_delete
  AFTER DELETE ON admins
  FOR EACH ROW EXECUTE FUNCTION sync_admin_from_admins_delete();

CREATE TRIGGER trg_sync_profile_role
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_admins_from_profile();

-- ============================================================
-- C2: Fix feedback — allow anonymous + unlimited submissions
-- ============================================================
-- Keep feedback open to everyone (logged in or anonymous).
-- Remove unique(user_id) so users can submit multiple feedbacks.

-- Drop the unique constraint that limited one feedback per user
ALTER TABLE feedback DROP CONSTRAINT IF EXISTS feedback_user_id_key;

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Authenticated insert own feedback" ON feedback;

-- Anyone can insert (logged in or anonymous) — user_id is optional
CREATE POLICY "Anyone can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- C3: Fix announcements.created_by FK
-- ============================================================
-- Add ON DELETE SET NULL so deleting a user doesn't block on
-- existing announcements

ALTER TABLE announcements
  DROP CONSTRAINT IF EXISTS announcements_created_by_fkey;

ALTER TABLE announcements
  ADD CONSTRAINT announcements_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id)
  ON DELETE SET NULL;
