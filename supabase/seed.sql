-- ==============================================================================
-- VERDALIA COMPANY VC - INITIAL DATA SEED FOR SUPABASE
-- ==============================================================================
-- Exécutez ce script après avoir exécuté schema.sql

-- 1. Initial Admin User (email: admin@verdalia.com / pass: Verdalia2024!)
INSERT INTO public.admin_users (email, password_hash, name, role)
VALUES (
    'admin@verdalia.com',
    '$2a$10$1TjQxt2O5g/7iNaPLZ118OuwRlKIlx029H4C1xb.8OTFCVM5c9f.e',
    'Verdalia Executive',
    'superadmin'
) ON CONFLICT (email) DO NOTHING;

-- 2. Initial Site Settings
INSERT INTO public.site_settings (
    id,
    company_name,
    tagline,
    country,
    address,
    general_email,
    general_phone,
    whatsapp,
    partners,
    social_links
) VALUES (
    1,
    'VERDALIA COMPANY VC',
    'Exportateur d''Huile d''Olive Tunisienne en Vrac',
    'Tunisia',
    'Tunisie',
    'contact@verdalia.com',
    '+216 53 228 867',
    '+216 53 228 867',
    '[
        {"name": "Iheb Boussalem", "role": "Managing Director & Partner", "phone": "+216 53 228 867", "email": "Bousalemiheb8@gmail.com"},
        {"name": "Aymen Braham", "role": "Sales Manager & Partner", "phone": "+216 98 462 421", "email": "aymen_braham@outlook.fr"},
        {"name": "Badie Amarie", "role": "Purchasing Manager & Partner • Amari Mill", "phone": "+216 26 540 868", "email": "amari.badi31989@gmail.com"}
    ]'::jsonb,
    '{
        "linkedin": "https://linkedin.com",
        "linkedin_enabled": true,
        "instagram": "https://instagram.com",
        "instagram_enabled": true,
        "facebook": "https://facebook.com",
        "facebook_enabled": true,
        "youtube": "https://youtube.com",
        "youtube_enabled": true,
        "email_enabled": true
    }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    general_email = EXCLUDED.general_email,
    general_phone = EXCLUDED.general_phone,
    partners = EXCLUDED.partners,
    social_links = EXCLUDED.social_links;
