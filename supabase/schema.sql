-- ==============================================================================
-- VERDALIA COMPANY VC - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase (SQL Editor)

-- 1. Table des Administrateurs
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table des Produits (Huile d'olive)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    acidity_max NUMERIC(3,2) NOT NULL,
    hero_image TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
    translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table des Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    logo TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table des Publications & Analyses de Laboratoire
CREATE TABLE IF NOT EXISTS public.publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'analysis', 'guide', 'report'
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    download_url TEXT,
    file_size TEXT,
    translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Table des Messages de Contact / Demandes de Devis (RFQ)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    country TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    product_interest TEXT NOT NULL,
    quantity TEXT,
    destination_country TEXT,
    message TEXT NOT NULL,
    privacy_consent BOOLEAN NOT NULL DEFAULT true,
    file_attachment TEXT,
    status TEXT NOT NULL DEFAULT 'unread', -- 'unread', 'read', 'archived', 'trash'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Table des Paramètres Généraux du Site (Site Settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    company_name TEXT NOT NULL DEFAULT 'VERDALIA COMPANY VC',
    tagline TEXT NOT NULL DEFAULT 'Exportateur d''Huile d''Olive Tunisienne en Vrac',
    country TEXT NOT NULL DEFAULT 'Tunisia',
    address TEXT NOT NULL DEFAULT 'Tunisie',
    general_email TEXT NOT NULL DEFAULT 'contact@verdalia.com',
    general_phone TEXT NOT NULL DEFAULT '+216 53 228 867',
    whatsapp TEXT NOT NULL DEFAULT '+216 53 228 867',
    developer_credit JSONB NOT NULL DEFAULT '{"name": "Mohamed", "whatsapp": "+216 53 228 867", "email": "contact@verdalia.com"}'::jsonb,
    partners JSONB NOT NULL DEFAULT '[]'::jsonb,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 7. Table des Textes Dynamiques par Langue (Content Blocks)
CREATE TABLE IF NOT EXISTS public.content_blocks (
    locale TEXT PRIMARY KEY, -- 'fr', 'en', 'ar', 'es', 'it'
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_badge TEXT,
    hero_cta_primary TEXT,
    hero_cta_secondary TEXT,
    about_title TEXT,
    about_subtitle TEXT,
    about_text TEXT,
    why_choose_title TEXT,
    why_choose_subtitle TEXT,
    export_title TEXT,
    export_subtitle TEXT,
    export_text TEXT,
    about_who_we_are TEXT,
    about_mission TEXT,
    about_vision TEXT,
    about_mill_heritage TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Table des Médias
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    size TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Storage Bucket pour les uploads (images, fiches techniques, devis)
-- À créer également dans l'onglet "Storage" de Supabase sous le nom 'verdalia-uploads' (Public)

-- Politiques de Sécurité (Row Level Security - RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les données du site vitrine
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Certs" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public Read Publications" ON public.publications FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Content Blocks" ON public.content_blocks FOR SELECT USING (true);
CREATE POLICY "Public Read Media" ON public.media_files FOR SELECT USING (true);

-- Insertion publique pour les messages de devis / contact
CREATE POLICY "Public Insert Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
