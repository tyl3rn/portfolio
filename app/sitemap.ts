import type { MetadataRoute } from "next";

// Only the pages that are actually part of the live site. The other
// routes are unfinished scaffolds and carry a noindex tag instead.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tylervannguyen.com",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://tylervannguyen.com/personal",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
