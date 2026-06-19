import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/manage', '/admin', '/api/', '/login'],
    },
    sitemap: 'https://forever.co.th/sitemap.xml',
  };
}
