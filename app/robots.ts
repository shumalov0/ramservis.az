import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const host = 'https://www.ramservis.az';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}


