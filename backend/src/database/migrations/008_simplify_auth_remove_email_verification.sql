ALTER TABLE users
DROP COLUMN IF EXISTS email_verified_at;

DELETE FROM auth_email_tokens
WHERE type <> 'reset_password';

DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  SELECT c.conname
  INTO constraint_name
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  WHERE t.relname = 'auth_email_tokens'
    AND c.contype = 'c'
    AND pg_get_constraintdef(c.oid) ILIKE '%type%'
  LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE auth_email_tokens DROP CONSTRAINT %I', constraint_name);
  END IF;
END$$;

ALTER TABLE auth_email_tokens
ALTER COLUMN type SET DEFAULT 'reset_password';

ALTER TABLE auth_email_tokens
ADD CONSTRAINT auth_email_tokens_type_check
CHECK (type = 'reset_password');
