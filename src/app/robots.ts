import type { MetadataRoute } from "next";

/* The 2025 site served no robots.txt and no sitemap. Cheap wins. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://segfault.compilertech.org/sitemap.xml",
  };
}
