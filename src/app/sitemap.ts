import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://educatedgamerarena.com';

  const staticPages = [
    { url: `${baseUrl}/`, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/matches`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${baseUrl}/tournaments`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/leaderboard`, changeFrequency: 'hourly' as const, priority: 0.8 },
    { url: `${baseUrl}/teams`, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/how-it-works`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/rules`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/fair-play`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/wallet-policy`, changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  return staticPages;
}
