# 🌿 Guide de Connexion Supabase & Déploiement — Verdalia Company VC

Ce guide vous explique étape par étape comment configurer **Supabase** et déployer votre projet sur **Vercel** / **GitHub**.

---

## 1. Créer le Projet sur Supabase

1. Rendez-vous sur [supabase.com](https://supabase.com) et connectez-vous ou créez un compte gratuit.
2. Cliquez sur **"New Project"**.
3. Choisissez :
   - **Name** : `verdalia-vc`
   - **Database Password** : *Générez un mot de passe fort et conservez-le précieusement*
   - **Region** : Choisissez la région la plus proche de vos utilisateurs (ex: `Frankfurt (eu-central-1)` ou `London`).
4. Cliquez sur **"Create new project"** et patientez 1 à 2 minutes pendant l'initialisation.

---

## 2. Exécuter le Schéma SQL & les Données Initiales

1. Dans le tableau de bord de votre projet Supabase, ouvrez le menu **SQL Editor** (l'icône `>_` dans la barre latérale gauche).
2. Cliquez sur **"New query"**.
3. Ouvrez le fichier local [`supabase/schema.sql`](supabase/schema.sql), copiez l'intégralité du contenu et collez-le dans l'éditeur SQL de Supabase.
4. Cliquez sur **"Run"** (ou `Ctrl + Enter`). Toutes les tables, index et sécurités (RLS) seront créées instantanément.
5. Ouvrez une nouvelle requête SQL, copiez le contenu de [`supabase/seed.sql`](supabase/seed.sql) et cliquez sur **"Run"** pour insérer les administrateurs et paramètres par défaut.

---

## 3. Configurer le Storage pour les Médias & Documents

1. Dans Supabase, allez dans **Storage** (l'icône de dossier dans le menu gauche).
2. Cliquez sur **"New Bucket"**.
3. Nommez le bucket : `verdalia-uploads`
4. Activez l'option **"Public bucket"** (pour que les images et fiches techniques soient accessibles publiquement).
5. Cliquez sur **"Save"**.

---

## 4. Récupérer vos Clés d'API Supabase

1. Allez dans **Project Settings** (icône d'engrenage en bas à gauche) > **API**.
2. Notez les 3 valeurs suivantes :
   - **Project URL** : `https://xxxxxxxxxxxxxxxx.supabase.co`
   - **Project API Keys (anon / public)** : `eyJhbGciOi...`
   - **Project API Keys (service_role / secret)** : `eyJhbGciOi...` *(À garder confidentiel !)*

---

## 5. Variables d'Environnement (.env.local & Vercel)

Dans votre fichier `.env.local` (et dans les variables d'environnement de votre hébergeur comme Vercel) :

```env
JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire

ADMIN_INITIAL_EMAIL=admin@verdalia.com
ADMIN_INITIAL_PASSWORD=Verdalia2024!

NEXT_PUBLIC_SITE_URL=https://votre-domaine.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

---

## 6. Commandes Git pour Pousser sur GitHub

Ouvrez votre terminal dans le dossier du projet :

```bash
# 1. Vérifier le statut
git status

# 2. Ajouter tous les fichiers modifiés et nouveaux
git add .

# 3. Créer le commit
git commit -m "feat: complete Verdalia B2B platform with quotes, dynamic contact, and supabase schema"

# 4. Définir la branche principale
git branch -M main

# 5. Lier votre dépôt distant GitHub (remplacez avec l'URL de votre dépôt GitHub)
git remote add origin https://github.com/VOTRE_COMPTE/verdalia.git

# 6. Pousser vers GitHub
git push -u origin main
```
