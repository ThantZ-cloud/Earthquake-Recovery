-- Super Admin migration
-- Run this in Supabase SQL Editor after admin.sql and fix_critical_issues.sql

-- ============================================================
-- 1. Extend role constraint to include 'super_admin'
-- ============================================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('user', 'admin', 'super_admin'));

-- ============================================================
-- 2. Super admin RLS policies
-- ============================================================

-- Super admins can read all profiles (supersedes admin read)
CREATE POLICY "Super admins read all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Super admins can update all profiles (for role changes)
CREATE POLICY "Super admins update all profiles"
  ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- Super admins can manage the admins table (promote/demote)
CREATE POLICY "Super admins insert admins"
  ON admins FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Super admins delete admins"
  ON admins FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

-- ============================================================
-- 3. Helper: Get admin emails (for super admin page)
-- ============================================================
CREATE OR REPLACE FUNCTION get_admin_emails()
RETURNS TABLE (user_id uuid, email text) AS $$
BEGIN
  -- Only allow super admins to call this
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: super_admin role required';
  END IF;

  RETURN QUERY
  SELECT au.id AS user_id, au.email::text
  FROM auth.users au
  INNER JOIN profiles p ON p.id = au.id
  WHERE p.role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only super admins can call this function
REVOKE ALL ON FUNCTION get_admin_emails() FROM authenticated;
GRANT EXECUTE ON FUNCTION get_admin_emails() TO authenticated;

-- ============================================================
-- 4. Update sync triggers to handle super_admin
-- ============================================================

-- When profiles.role is set to super_admin, ensure they're in admins table too
CREATE OR REPLACE FUNCTION sync_admins_from_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IN ('admin', 'super_admin') THEN
    INSERT INTO admins (user_id) VALUES (NEW.id)
      ON CONFLICT (user_id) DO NOTHING;
  ELSIF NEW.role = 'user' THEN
    DELETE FROM admins WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 5. Promote first super admin (REPLACE the email below)
-- ============================================================
-- After running this migration, promote yourself via SQL:
--
--   UPDATE profiles SET role = 'super_admin' WHERE id = (
--     SELECT id FROM auth.users WHERE email = 'your-email@gmail.com'
--   );
--
-- The trigger will auto-add you to the admins table.
