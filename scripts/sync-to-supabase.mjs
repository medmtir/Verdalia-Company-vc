import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

async function sync() {
  console.log('🚀 Starting sync from local verdalia.db.json to Supabase...');
  
  const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'verdalia.db.json'), 'utf8');
  const db = JSON.parse(raw);

  // 1. Sync Products
  console.log(`📦 Syncing ${db.products.length} products...`);
  for (const p of db.products) {
    const acidityMatch = (p.specs?.acidity || '').match(/(\d+\.?\d*)/);
    const acidityVal = acidityMatch ? parseFloat(acidityMatch[1]) : 0.8;

    const payload = {
      slug: p.slug,
      active: p.is_active,
      acidity_max: acidityVal,
      hero_image: p.image_url,
      gallery_images: [],
      specs: p.specs || {},
      certifications: [],
      translations: p.translations || {}
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?on_conflict=slug`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ Error syncing product ${p.slug}:`, err);
    } else {
      console.log(`✅ Product synced: ${p.slug}`);
    }
  }

  // 2. Sync Certifications
  console.log(`🏆 Syncing ${db.certifications.length} certifications...`);
  for (const c of db.certifications) {
    const slug = (c.code || c.id).toLowerCase();
    const payload = {
      slug,
      logo: c.badge_url || '',
      active: c.is_active,
      translations: c.translations || {}
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/certifications?on_conflict=slug`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`❌ Error syncing cert ${slug}:`, err);
    } else {
      console.log(`✅ Cert synced: ${slug}`);
    }
  }

  // 3. Sync Content Blocks
  if (db.content_blocks) {
    console.log('🌐 Syncing localized content blocks...');
    for (const [locale, block] of Object.entries(db.content_blocks)) {
      const payload = {
        locale,
        ...block
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/content_blocks?on_conflict=locale`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Error syncing content block for ${locale}:`, err);
      } else {
        console.log(`✅ Content block synced: ${locale}`);
      }
    }
  }

  console.log('🎉 Sync to Supabase completed successfully!');
}

sync().catch(console.error);
