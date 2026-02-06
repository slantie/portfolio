import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
}

const defaultMeta = {
  siteName: "Slantie",
  title: "Slantie",
  description: "",
  keywords:
    "Slantie, Kandarp Gajjar, portfolio, developer, designer, software engineer, web development, projects, machine learning, data science, achievements",
  image: "/og-image.png",
  type: "website" as const,
};

export function useSEO({
  title,
  description,
  keywords,
  image,
  url,
  type,
}: SEOProps = {}) {
  useEffect(() => {
    // Update title
    const fullTitle = title
      ? `${title} | ${defaultMeta.siteName}`
      : defaultMeta.title;
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Standard meta tags
    setMetaTag("description", description || defaultMeta.description);
    setMetaTag("keywords", keywords || defaultMeta.keywords);

    // Open Graph tags
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description || defaultMeta.description, true);
    setMetaTag("og:image", image || defaultMeta.image, true);
    setMetaTag("og:type", type || defaultMeta.type, true);
    if (url) setMetaTag("og:url", url, true);

    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description || defaultMeta.description);
    setMetaTag("twitter:image", image || defaultMeta.image);

    // Cleanup - reset to defaults on unmount
    return () => {
      document.title = defaultMeta.title;
    };
  }, [title, description, keywords, image, url, type]);
}

export function SEO(props: SEOProps) {
  useSEO(props);
  return null;
}

export default SEO;
