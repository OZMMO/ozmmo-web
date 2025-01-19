-- Insertar usuario de prueba en auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c9c2d3c4-5e6f-4a5b-8c9d-1234567890ab',
  'authenticated',
  'authenticated',
  'aabreu@ozmmo.com',
  -- '$2a$10$PxKHx.eLjqbXTEKVL4CQWOYqFAlKNkxzGy3h8sCw3M5YQjVtKi6Vy', -- password: desarrollo123
  '$2a$10$Ye2ReXYnuF.mEzr5kt7PxuPTwikbFa0mW2zqjGs9dNy2uXmGc9kEy', -- password: 123123123
  current_timestamp,
  current_timestamp,
  current_timestamp,
  '{"provider": "email", "providers": ["email"]}',
  '{"sub": "c9c2d3c4-5e6f-4a5b-8c9d-1234567890ab", "email": "aabreu@ozmmo.com", "nombre": "ANEUDY", "apellido": "ABREU"}',
  current_timestamp,
  current_timestamp,
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'e4f5d6c7-8a9b-4c5d-9e0f-2345678901cd',
  'authenticated',
  'authenticated',
  'jroman@ozmmo.com',
  -- '$2a$10$PxKHx.eLjqbXTEKVL4CQWOYqFAlKNkxzGy3h8sCw3M5YQjVtKi6Vy', -- password: desarrollo123
  '$2a$10$Ye2ReXYnuF.mEzr5kt7PxuPTwikbFa0mW2zqjGs9dNy2uXmGc9kEy', -- password: 123123123
  current_timestamp,
  current_timestamp,
  current_timestamp,
  '{"provider": "email", "providers": ["email"]}',
  '{"sub": "c9c2d3c4-5e6f-4a5b-8c9d-1234567890ab", "email": "jroman@ozmmo.com", "nombre": "JOSE", "apellido": "ROMAN"}',
  current_timestamp,
  current_timestamp,
  '',
  '',
  '',
  ''
);
