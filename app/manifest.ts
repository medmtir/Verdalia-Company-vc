import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Verdalia Admin — Portail de Gestion',
    short_name: 'Verdalia Admin',
    description: 'Espace d\'administration et de gestion commerciale Verdalia Company VC',
    start_url: '/admin/dashboard',
    scope: '/admin',
    display: 'standalone',
    background_color: '#0D1B0F',
    theme_color: '#203A1A',
    orientation: 'portrait',
    icons: [
      {
        src: '/images/verdalia-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/verdalia-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/verdalia-logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
