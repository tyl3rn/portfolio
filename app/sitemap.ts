import type { MetadataRoute } from "next";

// The two pages the site has.
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
