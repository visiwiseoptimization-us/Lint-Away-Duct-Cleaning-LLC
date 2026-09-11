import type { MetadataRoute } from 'next';
import { business } from '@/data/business';
import { cities } from '@/data/cities';
import { services } from '@/data/services';
import { articles, cityServicePairs } from '@/data/content';

const u = (p: string) => `${business.url}${p}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: u('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: u('/services'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: u('/service-areas'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: u('/blog'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: u('/about-us'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: u('/contact-us'), lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: u('/reviews'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  return [
    ...statics,
    ...services.map((s) => ({
      url: u(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...cities.map((c) => ({
      url: u(`/service-areas/${c.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...cityServicePairs.map((p) => ({
      url: u(`/service-areas/${p.city}/${p.service}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: u(`/blog/${a.slug}`),
      lastModified: new Date(a.date + 'T12:00:00Z'),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
