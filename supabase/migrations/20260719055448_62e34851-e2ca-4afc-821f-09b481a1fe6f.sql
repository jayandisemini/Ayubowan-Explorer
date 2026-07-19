
-- 1) Partial unique index: only ONE row can ever hold role='admin' with is_bootstrap=true.
-- We add a nullable bootstrap marker so the very first admin insert is race-safe at the DB level.
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS is_bootstrap boolean;
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_single_bootstrap_admin
  ON public.user_roles ((is_bootstrap))
  WHERE role = 'admin' AND is_bootstrap = true;

-- 2) Race-safe first admin claim. Atomic: INSERT ... WHERE NOT EXISTS.
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Must be signed in';
  END IF;

  INSERT INTO public.user_roles (user_id, role, is_bootstrap)
  SELECT auth.uid(), 'admin'::app_role, true
  WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
  ON CONFLICT DO NOTHING
  RETURNING id INTO inserted_id;

  RETURN inserted_id IS NOT NULL;
END;
$$;

-- 3) Admin audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  target_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can view audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4) Grant admin to another user by email (existing admin only)
CREATE OR REPLACE FUNCTION public.grant_admin_role(_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id uuid;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can grant admin role';
  END IF;

  SELECT id INTO target_id FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF target_id IS NULL THEN
    RAISE EXCEPTION 'No user found with email %', _email;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.admin_audit_log (actor_id, action, target_user_id, target_email)
  VALUES (auth.uid(), 'grant_admin', target_id, _email);

  RETURN target_id;
END;
$$;

-- 5) Revoke admin from another user (cannot revoke self; cannot revoke last admin)
CREATE OR REPLACE FUNCTION public.revoke_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count int;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can revoke admin role';
  END IF;

  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot revoke your own admin role';
  END IF;

  SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count <= 1 THEN
    RAISE EXCEPTION 'Cannot remove the last admin';
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';

  INSERT INTO public.admin_audit_log (actor_id, action, target_user_id)
  VALUES (auth.uid(), 'revoke_admin', _user_id);

  RETURN true;
END;
$$;

-- 6) List admins (admins only)
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (user_id uuid, email text, full_name text, granted_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can list admins';
  END IF;

  RETURN QUERY
  SELECT ur.user_id, u.email::text, p.full_name, ur.created_at
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  LEFT JOIN public.profiles p ON p.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at ASC;
END;
$$;

-- 7) Server-side "am I admin" check (used by SSR loader)
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin');
$$;
